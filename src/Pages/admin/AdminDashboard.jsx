import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice.js";
import { getSkinConditions } from "@/redux/slices/skinTypeSlice.js";
import {
  getConditionCounts,
  getConditionCountsByProduct,
  getAllProductImages,
  fetchProducts,
} from "../../redux/slices/skinProductSlice.js";
import Api from "../../services/Api.js";

// -------------------- BASIC COMPONENTS --------------------
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }) {
  return <div className={`px-4 pt-4 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function Avatar({ label }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
      {label}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <Card>
      <CardContent className="text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-lg font-semibold">{value}</h3>
      </CardContent>
    </Card>
  );
}

function KeyValueItem({ left, right }) {
  return (
    <li className="flex justify-between text-sm">
      <span>{left}</span>
      <span>{right}</span>
    </li>
  );
}

function UserItem({ name }) {
  return (
    <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
      <Avatar label={name[0]} />
      <span>{name}</span>
    </div>
  );
}

function List({ items, renderItem }) {
  return <ul className="space-y-2">{items.map(renderItem)}</ul>;
}

function ProductColumn({ title, products }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <h4 className="bg-emerald-500 text-white text-center py-1 rounded-lg mb-2 text-sm">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2 justify-start">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((p) => (
            <div key={p.productId} className="flex flex-col items-center w-20">
              <img
                src={p.image}
                alt={p.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <p className="text-xs text-center mt-1">{p.name}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No products</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// -------------------- MAIN DASHBOARD --------------------
export default function AdminDashboard() {
  const dispatch = useDispatch();

  const Users = useSelector((state) => state.user?.users || []);
  const userCount = Users.length;
  const status = useSelector((state) => state.user?.status);
  const skinConditions = useSelector(
    (state) => state.skinType?.skinConditions || []
  );
  const conditionCounts = useSelector(
    (state) => state.products?.getConditionCounts || []
  );
  const conditionProduct = useSelector(
    (state) => state.products.getConditionCountsByProduct || []
  );
  const productImages = useSelector(
    (state) => state.products.getAllProductImages || []
  );

  const [scanData, setScanData] = useState(0);
  const [noRecommendationData, setNoRecommendationData] = useState(0);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(getSkinConditions());
    dispatch(getConditionCounts());
    dispatch(fetchProducts());
    dispatch(getConditionCountsByProduct());
    dispatch(getAllProductImages());
  }, [dispatch]);

  useEffect(() => {
    const fetchScanPerDay = async () => {
      try {
        const res = await Api.fetchScansPerDay();
        const total = res.data.reduce(
          (sum, item) => sum + Number(item.count),
          0
        );
        setScanData(total);
      } catch (error) {
        console.error("Error fetching scans per day:", error);
      }
    };
    fetchScanPerDay();
  }, []);

  useEffect(() => {
    const fetchNoRecommendation = async () => {
      try {
        const res = await Api.getRecommendationNoData();
        const count = res.data.data?.[0]?.count || 0;
        setNoRecommendationData(count);
      } catch (error) {
        console.error("Error fetching no recommendation data:", error);
      }
    };
    fetchNoRecommendation();
  }, []);

  const uniqueProducts = useMemo(
    () =>
      Array.from(
        new Map(productImages.map((item) => [item.productId, item])).values()
      ),
    [productImages]
  );

  const popularProducts = useMemo(() => {
    if (!conditionCounts.length || !conditionProduct.length) return [];

    const productMap = {};

    conditionProduct.forEach((cp) => {
      const count =
        conditionCounts.find((c) => c.conditionId === cp.conditionId)?.count ||
        0;

      if (!productMap[cp.productId]) {
        productMap[cp.productId] = {
          productId: cp.productId,
          name: cp.productName,
          score: 0,
        };
      }

      productMap[cp.productId].score += count;
    });

    return Object.values(productMap)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [conditionCounts, conditionProduct]);

  const selectedProductIds = useMemo(
    () => popularProducts.map((p) => p.productId),
    [popularProducts]
  );

  const selectedProducts = useMemo(
    () => uniqueProducts.filter((p) => selectedProductIds.includes(p.productId)),
    [uniqueProducts, selectedProductIds]
  );

  const nonSelectedProducts = useMemo(
    () =>
      uniqueProducts.filter((p) => !selectedProductIds.includes(p.productId)),
    [uniqueProducts, selectedProductIds]
  );

  const stats = [
    { title: "Users", value: userCount },
    { title: "Scans per day", value: scanData },
    { title: "Out of Scope", value: noRecommendationData },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Welcome back, Admin</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} />
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recommended Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-semibold">Selected Recommended Products</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <ProductColumn title="Selected" products={selectedProducts} />
              <ProductColumn title="Non-Selected" products={nonSelectedProducts} />
            </div>
          </CardContent>
        </Card>

        {/* Skin Conditions — scrollable */}
        <Card>
          <CardHeader>
            <h3 className="text-emerald-600 font-semibold text-sm">
              COMMON SKIN CONDITION DETECTED
            </h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-y-auto max-h-60 pr-1">
              <List
                items={skinConditions}
                renderItem={(item, i) => (
                  <KeyValueItem key={i} left={item.conditon} right="-" />
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Users */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-semibold">Users</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {status === "loading" ? (
              <p>Loading users...</p>
            ) : Users.length === 0 ? (
              <p>No users found</p>
            ) : (
              Users.map((user) => (
                <UserItem
                  key={user.id}
                  name={`${user.firstName} ${user.lastName}`}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Popular Recommendations */}
        <Card>
          <CardHeader>
            <h3 className="text-emerald-600 font-semibold text-sm">
              POPULAR RECOMMENDATION
            </h3>
          </CardHeader>
          <CardContent>
            <List
              items={popularProducts}
              renderItem={(item, i) => (
                <KeyValueItem key={i} left={item.name} right={item.score} />
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
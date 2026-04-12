import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Table";
import SearchBar from "@/components/SearchBar";
import DeleteModal from "@/components/DeleteModal";
import { fetchProducts, deleteProduct } from "@/redux/slices/skinProductSlice";
import { fetchConditions } from "@/redux/slices/conditionSlice";
import { Trash2, Plus, Pencil } from "lucide-react";
import AddProduct from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import Api from "@/services/Api";

const Product = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);

  const { products, loading, error, deleteLoading, deleteError } = useSelector(
    (state) => state.products,
  );
  const { data: conditions } = useSelector((state) => state.conditions);
  useEffect(() => {
    const abortController = new AbortController();
    dispatch(fetchProducts());
    dispatch(fetchConditions());
    return () => {
      abortController.abort();
    };
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((product) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.productName?.toLowerCase().includes(searchLower) ||
        product.productType?.toLowerCase().includes(searchLower) ||
        product.skinType?.toLowerCase().includes(searchLower) ||
        product.locality?.toLowerCase().includes(searchLower)
      );
    });
  }, [products, searchQuery]);

  const handleData = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct?.id) {
      await dispatch(deleteProduct(selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product) => {
    setSelectedEditProduct(product);
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      key: "productImage",
      label: "Image",
      width: "80px",
      render: (value) =>
        value && value !== "NULL" ? (
          <img
            src={Api.getProductImage(value)}
            alt="product"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          "-"
        ),
    },
    {
      key: "productName",
      label: "Product Name",
      width: "160px",
      render: (value) => (
        <span className="block truncate max-w-[140px]" title={value}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "productType",
      label: "Type",
      width: "100px",
    },
    {
      key: "timeRoutine",
      label: "Routine",
      width: "100px",
    },
    {
      key: "conditionIds",
      label: "Conditions",
      width: "200px",
      render: (value) => {
        if (!value || value.length === 0)
          return <span className="text-gray-400 text-xs">None</span>;
        const visible = value.slice(0, 2);
        const remaining = value.length - 2;
        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((id) => {
              const condition = conditions.find((c) => c.id === id);
              return (
                <span
                  key={id}
                  className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {condition ? condition.condition : id}
                </span>
              );
            })}
            {remaining > 0 && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{remaining} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      width: "110px",
      render: (value, row) => {
        if (!row.createdAt || row.createdAt === "0001-01-01 00:00:00.000")
          return "-";
        const date = new Date(row.createdAt);
        return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
      },
    },
    {
      key: "updatedAt",
      label: "Last Updated",
      width: "110px",
      render: (value, row) => {
        if (!row.updatedAt || row.updatedAt === "0001-01-01 00:00:00.000")
          return "-";
        const date = new Date(row.updatedAt);
        return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
      },
    },
    {
      key: "actions",
      label: "Actions",
      width: "80px",
      sortable: false,
      render: (value, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit product"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleData(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleGenerateReport = async () => {
  const res = await Api.generateProductReport({ responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "product-report.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

 return (
  <div>
    {/* Header */}
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Products</h1>

      <div className="flex items-center gap-3">
        {/* Add Product */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-emerald-600 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>

        {/* Generate Report */}
        <button 
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
        >
          📄 Generate Report
        </button>
      </div>
    </div>

    {/* Search */}
    <div className="mb-6">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search..."
        className="max-w-md"
      />
    </div>

    {/* Loading Spinner */}
    {loading && (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CC99]"></div>
      </div>
    )}

    {/* Errors */}
    {error && (
      <div className="bg-red-50 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        {error}
      </div>
    )}
    {deleteError && (
      <div className="bg-red-50 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        {deleteError}
      </div>
    )}

    {/* Table */}
    {!loading && !error && (
      <div className="overflow-x-auto">
        <Table data={filteredData} columns={columns} itemsPerPage={10} />
      </div>
    )}

    {/* Add / Edit / Delete Modals */}
    <AddProduct
      isOpen={isAddModalOpen}
      onClose={() => setIsAddModalOpen(false)}
    />

    <EditProductModal
      isOpen={isEditModalOpen}
      onClose={() => {
        setIsEditModalOpen(false);
        setSelectedEditProduct(null);
      }}
      product={selectedEditProduct}
    />

    <DeleteModal
      isOpen={isDeleteModalOpen}
      onClose={handleCloseModal}
      onConfirm={handleConfirmDelete}
      isLoading={deleteLoading}
      title="Product"
    />
  </div>
);
};

export default Product;

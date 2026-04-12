import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Table"; 
import { fetchOutOfScope } from "../../../redux/slices/outOfScopeSlice.js"; 

const outOfScope = () => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.outOfScope);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchOutOfScope());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const searchLower = searchQuery.toLowerCase();
    return data.filter((item) =>
      [
        item.email,
        item.conditionName,
        item.status,
        item.confidenceScores,
      ]
        .filter(Boolean)
        .some((field) =>
          field.toString().toLowerCase().includes(searchLower)
        )
    );
  }, [data, searchQuery]);

  const tableData = useMemo(() => {
  return filteredData.map((item) => ({
    ...item,
    canRecommend: false,
  }));
}, [filteredData]);

  const columns = [
    {
      key: "skinAnalysisTransactionsId",
      label: "ID",
      width: "80px",
    },
    {
      key: "email",
      label: "Email",
      width: "200px",
      render: (value) => (
        <span className="block truncate max-w-[180px]" title={value}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "conditionName",
      label: "Condition Name",
      width: "160px",
      render: (value) => (
        <span className="block truncate max-w-[140px]" title={value}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "120px",
      render: (value) => (
        <span className="block truncate max-w-[100px]" title={value}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "confidenceScores",
      label: "Confidence Scores",
      width: "140px",
      render: (value) => (
        <span className="block truncate max-w-[120px]" title={value}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "canRecommend",
      label: "Can Recommend",
      width: "120px",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      width: "120px",
      render: (value) => value || "-",
    },
    {
      key: "updatedAt",
      label: "Updated At",
      width: "120px",
      render: (value) => value || "-",
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Out of Scope Analysis</h1>

      {/* search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-md"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CC99]"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <Table data={tableData} columns={columns} itemsPerPage={10} />
      )}
    </div>
  );
};

export default outOfScope;
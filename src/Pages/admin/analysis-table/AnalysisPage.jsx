import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Table";
import { fetchAnalysis } from "@/redux/slices/analysisSlice.js";
import Api from "@/services/Api.js";

const AnalysisPage = () => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.analysis);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAnalysis());
  }, [dispatch]);

  useEffect(() => {
    if (data.length > 0) {
      console.log("canRecommend sample:", data[0]?.canRecommend);
    }
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const searchLower = searchQuery.toLowerCase();
    return data.filter((item) =>
      [item.email, item.conditionName, item.status, item.confidenceScores]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(searchLower)),
    );
  }, [data, searchQuery]);

  const columns = [
    {
      key: "id",
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
      key: "photoUrl",
      label: "Photo",
      width: "80px",
      render: (value) =>
        value ? (
          <img
            src={Api.getSkinImage(value)}
            alt="skin"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <span className="text-xs text-gray-400">was not saved :)</span>
        ),
    },
    {
      key: "conditionName",
      label: "Condition",
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
      label: "Confidence",
      width: "140px",
      render: (value) => (
        <span className="block truncate max-w-[120px]" title={value}>
          {value ? `${(value * 100).toFixed(2)}%` : "N/A"}
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
            value === "Yes"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {value === "Yes" ? "Yes" : "No"}
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

  const handleGenerateAnalysisReport = async () => {
    const res = await Api.generateAnalysisReport({ responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "analysis-report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  return (
  <div className="min-h-screen p-6 bg-gray-50">
    {/* Page Title */}
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold">Analysis</h1>

      {/* Generate Report Button */}
      <button
        onClick={handleGenerateAnalysisReport}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
      >
        📊 Generate Report
      </button>
    </div>

    {/* Search Input */}
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border px-3 py-2 rounded w-full max-w-md"
      />
    </div>

    {/* Loading Spinner */}
    {loading && (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CC99]"></div>
      </div>
    )}

    {/* Error Message */}
    {error && (
      <div className="bg-red-50 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        {error}
      </div>
    )}

    {/* Table */}
    {!loading && !error && (
      <Table data={filteredData} columns={columns} itemsPerPage={10} />
    )}
  </div>
);
};

export default AnalysisPage;

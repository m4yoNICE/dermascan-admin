import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
} from "lucide-react";
import React, { useMemo, useState } from "react";

const Table = ({
  data = [],
  columns = [],
  itemsPerPage = 10,
  showPagination = true,
  className = "",
  showPageSizeSelector = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [pageSize, setPageSize] = useState(itemsPerPage);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      //handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      //compare values
      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  //pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = sortedData.slice(startIndex, endIndex);

  //handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  //handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  //get sort icon for column
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-gray-700" />
    ) : (
      <ChevronDown className="w-4 h-4 text-gray-700" />
    );
  };

  //navigate to specific page
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  //generate page numbers for pagination
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    //add first page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className="px-3 py-1 text-sm border border-gray-300 bg-white rounded hover:bg-gray-50 transition-colors"
        >
          1
        </button>,
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2 text-gray-500">
            ...
          </span>,
        );
      }
    }

    //add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 text-sm border rounded transition-colors bg-white`}
        >
          {i}
        </button>,
      );
    }

    //add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-2 text-gray-500">
            ...
          </span>,
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="px-3 py-1 text-sm border border-gray-300 bg-white rounded hover:bg-gray-50 transition-colors"
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* table container */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.key)
                  }
                  className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200 ${
                    column.sortable !== false
                      ? "cursor-pointer select-none hover:bg-gray-100 transition-colors"
                      : ""
                  }`}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 0 && (
        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          {/* Left side - showing info and page size selector */}
          <div className="flex items-center gap-3">
            {showPageSizeSelector && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Row Per Page: </label>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
            )}
            {/* <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)}{" "}
              of {sortedData.length} entries
            </div> */}
          </div>

          {/* Right side - pagination controls */}
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 border border-gray-300 bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            {/* page numbers */}
            <div className="flex items-center gap-1">{renderPageNumbers()}</div>

            {/* next button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-gray-300 bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;

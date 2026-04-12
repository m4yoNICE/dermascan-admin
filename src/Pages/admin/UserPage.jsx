import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Table";
import SearchBar from "@/components/SearchBar";
import DeleteModal from "@/components/DeleteModal";
import EditUserPageModal from "@/components/editUserPageModal";
import { deleteUser, fetchUsers } from "@/redux/slices/userSlice";
import { Trash2,Pencil } from "lucide-react";
import Api from "@/services/Api";

const UserPage = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Get users data from Redux store
  const { users, loading, error, deleteError, deleteLoading } = useSelector(
    (state) => state.user,
  );

  // Fetch users on component mount
  useEffect(() => {
    const abortController = new AbortController();
    dispatch(fetchUsers());

    return () => {
      abortController.abort();
    };
  }, [dispatch]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return users;

    return users.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const roleName = user.role?.roleName?.toLowerCase() || "";

      return (
        fullName.includes(searchLower) ||
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        roleName.includes(searchLower)
      );
    });
  }, [searchQuery, users]);

  //handle delete button click
  const handleData = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  //handle confirm delete
  const handleConfirmDelete = async () => {
    if (selectedUser?.id) {
      await dispatch(deleteUser(selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Table columns configuration
  const columns = [
    {
      key: "firstName",
      label: "First Name",
      width: "150px",
    },
    {
      key: "lastName",
      label: "Last Name",
      width: "150px",
    },
    {
      key: "email",
      label: "Email",
      width: "150px",
    },
    {
      key: "role",
      label: "Role",
      width: "120px",
      render: (value) => (
        <span className="capitalize">{value?.roleName || "N/A"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      width: "180px",
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
      width: "180px",
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
      width: "120px",
      sortable: false,
      render: (value, row) => (
        <div className="flex gap-2">
          {/* Edit Button */}
          <button
            onClick={() => setSelectedUser(row) || setIsEditModalOpen(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit user"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleData(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleGenerateUserReport = async () => {
  const res = await Api.generateUserReport({ responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "user-report.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Users Management</h1>
        <button
          onClick={handleGenerateUserReport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-blue-600 active:scale-95 transition-all"
        >
          📄 Generate Users Report
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search..."
          className="max-w-md"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CC99]"></div>
        </div>
      )}

      {/* Errors */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {deleteError}
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && <Table data={filteredData} columns={columns} itemsPerPage={10} />}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ""}
        userEmail={selectedUser?.email || ""}
        title="User"
        isLoading={deleteLoading}
      />

      {/* Edit Modal */}
      <EditUserPageModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserPage;

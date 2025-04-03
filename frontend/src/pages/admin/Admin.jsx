import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  UserPlus,
  Key,
  Lock,
  Edit,
  Trash2,
  Mail,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

// Import from new data service
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../services/dataService";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "cashier",
    isActive: true,
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      enqueueSnackbar("Failed to load users", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      role: "cashier",
      isActive: true,
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: "",
      confirmPassword: "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      enqueueSnackbar("Full name is required", { variant: "error" });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      enqueueSnackbar("Valid email is required", { variant: "error" });
      return false;
    }

    // For adding new user, password is required
    if (!isEditModalOpen && !formData.password) {
      enqueueSnackbar("Password is required", { variant: "error" });
      return false;
    }

    // If password field is filled (for new user or changing password), validate matching
    if (formData.password && formData.password !== formData.confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: "error" });
      return false;
    }

    return true;
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;

    try {
      const newUser = await addUser({
        ...formData,
        lastLogin: null,
        createdAt: new Date().toISOString(),
      });

      setUsers((prev) => [...prev, newUser]);
      setIsAddModalOpen(false);
      resetForm();
      enqueueSnackbar("User added successfully", { variant: "success" });
    } catch (error) {
      console.error("Error adding user:", error);
      enqueueSnackbar("Failed to add user", { variant: "error" });
    }
  };

  const handleUpdateUser = async () => {
    if (!validateForm()) return;

    if (!currentUser) return;

    // Only include password if it was changed
    const updatedData = {
      ...formData,
    };

    if (!formData.password) {
      delete updatedData.password;
      delete updatedData.confirmPassword;
    }

    try {
      const updatedUser = await updateUser(currentUser.id, updatedData);

      setUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      setIsEditModalOpen(false);
      enqueueSnackbar("User updated successfully", { variant: "success" });
    } catch (error) {
      console.error("Error updating user:", error);
      enqueueSnackbar("Failed to update user", { variant: "error" });
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;

    try {
      await deleteUser(currentUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== currentUser.id));
      setIsDeleteModalOpen(false);
      enqueueSnackbar("User deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting user:", error);
      enqueueSnackbar("Failed to delete user", { variant: "error" });
      throw error; // Rethrow to be caught by the DeleteConfirmationModal
    }
  };

  // Table configuration
  const tableFields = [
    {
      name: "fullName",
      title: "User",
      render: (value, row) => (
        <div className="flex items-center">
          <div
            className={`bg-primary-100 p-1 rounded-full mr-2 ${
              row.isActive ? "text-primary-700" : "text-gray-400"
            }`}
          >
            <Users size={16} />
          </div>
          <div>
            <div
              className={`font-medium ${
                row.isActive ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {value}
            </div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
          {!row.isActive && (
            <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              Inactive
            </span>
          )}
        </div>
      ),
    },
    {
      name: "role",
      title: "Role",
      render: (value) => {
        const roleBadges = {
          admin: "bg-purple-100 text-purple-800",
          manager: "bg-blue-100 text-blue-800",
          cashier: "bg-green-100 text-green-800",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs capitalize ${
              roleBadges[value] || "bg-gray-100"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      name: "lastLogin",
      title: "Last Login",
      render: (value) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(value).toLocaleString() : "Never"}
        </div>
      ),
    },
    {
      name: "createdAt",
      title: "Created",
      render: (value) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      name: "isActive",
      title: "Status",
      render: (value) => (
        <div className="flex items-center">
          {value ? (
            <CheckCircle size={16} className="text-green-500 mr-1.5" />
          ) : (
            <XCircle size={16} className="text-red-500 mr-1.5" />
          )}
          <span className="text-sm">{value ? "Active" : "Inactive"}</span>
        </div>
      ),
    },
    {
      name: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(row);
            }}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(row);
            }}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            disabled={row.role === "admin"}
          >
            <Trash2
              size={16}
              className={row.role === "admin" ? "text-gray-300" : ""}
            />
          </button>
        </div>
      ),
    },
  ];

  // Custom header component for the JTable
  const TableHeader = () => (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <button
        onClick={openAddModal}
        className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded flex items-center text-sm"
      >
        <UserPlus size={16} className="mr-1" />
        Add User
      </button>

      <div className="flex-grow"></div>

      <div className="flex items-center space-x-2">
        <button
          onClick={loadUsers}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
          title="Refresh users"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-gray-600">Manage users and access permissions</p>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">{users.length}</h3>
            </div>
            <div className="p-2.5 rounded-full bg-primary-50 text-primary-500">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Accounts
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {users.filter((user) => user.isActive).length}
              </h3>
              <p className="text-xs text-green-500 mt-1">
                {users.length > 0
                  ? `${Math.round(
                      (users.filter((user) => user.isActive).length /
                        users.length) *
                        100
                    )}% of accounts`
                  : "0% of accounts"}
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-green-50 text-green-500">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Admin Users</p>
              <h3 className="text-2xl font-bold mt-1">
                {users.filter((user) => user.role === "admin").length}
              </h3>
              <p className="text-xs text-purple-500 mt-1">
                With full system access
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-purple-50 text-purple-500">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <JTable
          title="User Accounts"
          data={users}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No users found. Add your first user to get started."
        />
      </div>

      {/* Add User Modal */}
      <ModalReusable
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        icon={UserPlus}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <div className="relative">
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full pl-8"
                required
              />
              <Mail
                size={16}
                className="absolute left-2.5 top-2.5 text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Role*
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrator</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {formData.role === "admin"
                ? "Full access to all system functions and settings"
                : formData.role === "manager"
                ? "Can manage products, view reports, and perform overrides"
                : "Can process sales and manage basic customer information"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password*
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter secure password"
                className="w-full pl-8"
                required
              />
              <Lock
                size={16}
                className="absolute left-2.5 top-2.5 text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password*
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
              className="w-full"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-700"
            >
              Active Account
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Add User
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Edit User Modal */}
      <ModalReusable
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        icon={Edit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <div className="relative">
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full pl-8"
                required
              />
              <Mail
                size={16}
                className="absolute left-2.5 top-2.5 text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Role*
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={
                currentUser?.role === "admin" &&
                users.filter((u) => u.role === "admin").length === 1
              }
            >
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrator</option>
            </select>
            {currentUser?.role === "admin" &&
              users.filter((u) => u.role === "admin").length === 1 && (
                <p className="mt-1 text-xs text-amber-500">
                  Cannot change role - system must have at least one admin
                </p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change Password (leave blank to keep current)
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="w-full pl-8"
              />
              <Key
                size={16}
                className="absolute left-2.5 top-2.5 text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {formData.password && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={
                currentUser?.role === "admin" &&
                users.filter((u) => u.role === "admin" && u.isActive).length ===
                  1 &&
                currentUser?.isActive
              }
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-700"
            >
              Active Account
            </label>
            {currentUser?.role === "admin" &&
              users.filter((u) => u.role === "admin" && u.isActive).length ===
                1 &&
              currentUser?.isActive && (
                <span className="ml-2 text-xs text-amber-500">
                  Cannot deactivate - system must have at least one active admin
                </span>
              )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateUser}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Update User
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        entityType="User"
        entityName={currentUser?.fullName}
        onConfirm={handleDeleteUser}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Admin;

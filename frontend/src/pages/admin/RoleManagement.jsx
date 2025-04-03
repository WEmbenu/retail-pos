import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  UserPlus,
  Lock,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Check,
  X,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

// Import from new data service
import {
  getRoles,
  getPermissions,
  addRole,
  updateRole,
  deleteRole,
} from "../../services/dataService";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [expandedPermissionCategories, setExpandedPermissionCategories] =
    useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error loading roles:", error);
      enqueueSnackbar("Failed to load roles", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const data = await getPermissions();
      setPermissions(data);

      // Initialize expanded categories state
      const expandedState = {};
      data.forEach((category) => {
        expandedState[category.id] = false;
      });
      setExpandedPermissionCategories(expandedState);
    } catch (error) {
      console.error("Error loading permissions:", error);
      enqueueSnackbar("Failed to load permissions", { variant: "error" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (permissionId) => {
    setFormData((prev) => {
      const permissions = [...prev.permissions];

      if (permissions.includes(permissionId)) {
        return {
          ...prev,
          permissions: permissions.filter((id) => id !== permissionId),
        };
      } else {
        return {
          ...prev,
          permissions: [...permissions, permissionId],
        };
      }
    });
  };

  const handleCategoryChange = (categoryId, isChecked) => {
    setFormData((prev) => {
      // Find the category
      const category = permissions.find((cat) => cat.id === categoryId);
      if (!category) return prev;

      const permissionIds = category.permissions.map((p) => p.id);
      let newPermissions = [...prev.permissions];

      if (isChecked) {
        // Add all permissions from this category that aren't already in the list
        permissionIds.forEach((id) => {
          if (!newPermissions.includes(id)) {
            newPermissions.push(id);
          }
        });
      } else {
        // Remove all permissions from this category
        newPermissions = newPermissions.filter(
          (id) => !permissionIds.includes(id)
        );
      }

      return {
        ...prev,
        permissions: newPermissions,
      };
    });
  };

  const toggleCategoryExpanded = (categoryId) => {
    setExpandedPermissionCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: [],
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (role) => {
    setCurrentRole(role);
    setFormData({
      name: role.name,
      description: role.description || "",
      permissions: role.permissions || [],
    });

    // Expand all categories for editing
    const expandedState = {};
    permissions.forEach((category) => {
      expandedState[category.id] = true;
    });
    setExpandedPermissionCategories(expandedState);

    setIsEditModalOpen(true);
  };

  const openDeleteModal = (role) => {
    setCurrentRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleAddRole = async () => {
    if (!formData.name) {
      enqueueSnackbar("Role name is required", { variant: "error" });
      return;
    }

    try {
      const newRole = await addRole({
        ...formData,
        createdAt: new Date().toISOString(),
        userCount: 0,
      });

      setRoles((prev) => [...prev, newRole]);
      setIsAddModalOpen(false);
      resetForm();
      enqueueSnackbar("Role added successfully", { variant: "success" });
    } catch (error) {
      console.error("Error adding role:", error);
      enqueueSnackbar("Failed to add role", { variant: "error" });
    }
  };

  const handleUpdateRole = async () => {
    if (!currentRole || !formData.name) {
      enqueueSnackbar("Role name is required", { variant: "error" });
      return;
    }

    try {
      const updatedRole = await updateRole(currentRole.id, {
        ...currentRole,
        ...formData,
      });

      setRoles((prev) =>
        prev.map((role) => (role.id === updatedRole.id ? updatedRole : role))
      );

      setIsEditModalOpen(false);
      enqueueSnackbar("Role updated successfully", { variant: "success" });
    } catch (error) {
      console.error("Error updating role:", error);
      enqueueSnackbar("Failed to update role", { variant: "error" });
    }
  };

  const handleDeleteRole = async () => {
    if (!currentRole) return;

    try {
      await deleteRole(currentRole.id);
      setRoles((prev) => prev.filter((role) => role.id !== currentRole.id));
      setIsDeleteModalOpen(false);
      enqueueSnackbar("Role deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting role:", error);
      enqueueSnackbar("Failed to delete role", { variant: "error" });
      throw error; // Rethrow to be caught by the DeleteConfirmationModal
    }
  };

  // Function to get permission names from IDs
  const getPermissionNames = (permissionIds) => {
    if (!permissions.length || !permissionIds?.length) return [];

    const permissionNames = [];
    permissions.forEach((category) => {
      category.permissions.forEach((permission) => {
        if (permissionIds.includes(permission.id)) {
          permissionNames.push(permission.name);
        }
      });
    });

    return permissionNames;
  };

  // Check if all permissions in a category are selected
  const isCategoryFullySelected = (categoryId) => {
    const category = permissions.find((cat) => cat.id === categoryId);
    if (!category) return false;

    const permissionIds = category.permissions.map((p) => p.id);
    return permissionIds.every((id) => formData.permissions.includes(id));
  };

  // Check if any permissions in a category are selected
  const isCategoryPartiallySelected = (categoryId) => {
    const category = permissions.find((cat) => cat.id === categoryId);
    if (!category) return false;

    const permissionIds = category.permissions.map((p) => p.id);
    return (
      permissionIds.some((id) => formData.permissions.includes(id)) &&
      !permissionIds.every((id) => formData.permissions.includes(id))
    );
  };

  // Table configuration
  const tableFields = [
    {
      name: "name",
      title: "Role Name",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-1.5 rounded-full mr-2">
            <ShieldCheck
              size={16}
              className="text-primary-700 dark:text-primary-400"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.description || "No description"}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "permissions",
      title: "Permissions",
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value && value.length > 0 ? (
            <>
              {getPermissionNames(value)
                .slice(0, 3)
                .map((permission, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs"
                  >
                    {permission}
                  </span>
                ))}
              {value.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                  +{value.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No permissions
            </span>
          )}
        </div>
      ),
    },
    {
      name: "userCount",
      title: "Users",
      render: (value) => (
        <div className="flex items-center">
          <Users size={16} className="mr-1 text-gray-400 dark:text-gray-500" />
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      name: "createdAt",
      title: "Created",
      render: (value) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {value ? new Date(value).toLocaleDateString() : "—"}
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
            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
            disabled={row.name === "admin"}
          >
            <Edit
              size={16}
              className={
                row.name === "admin" ? "text-gray-400 dark:text-gray-600" : ""
              }
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(row);
            }}
            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
            disabled={row.name === "admin"}
          >
            <Trash2
              size={16}
              className={
                row.name === "admin" ? "text-gray-400 dark:text-gray-600" : ""
              }
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
        className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white px-3 py-1.5 rounded flex items-center text-sm"
      >
        <Plus size={16} className="mr-1" />
        Add Role
      </button>

      <div className="flex-grow"></div>

      <div className="flex items-center space-x-2">
        <button
          onClick={loadRoles}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <ShieldCheck className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
          Role Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage user roles and permissions
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Roles
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {roles.length}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Users
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {roles.reduce(
                  (total, role) => total + (role.userCount || 0),
                  0
                )}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Available Permissions
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {permissions.reduce(
                  (total, category) => total + category.permissions.length,
                  0
                )}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Lock size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <JTable
          title="User Roles"
          data={roles}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No roles found. Add your first role to get started."
        />
      </div>

      {/* Add Role Modal */}
      <ModalReusable
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Role"
        icon={Plus}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role Name*
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Manager, Cashier, etc."
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of this role and its responsibilities..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Permissions
            </label>

            <div className="border dark:border-gray-700 rounded-md max-h-80 overflow-y-auto">
              {permissions.map((category) => (
                <div
                  key={category.id}
                  className="border-b dark:border-gray-700 last:border-0"
                >
                  <div
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer"
                    onClick={() => toggleCategoryExpanded(category.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isCategoryFullySelected(category.id)}
                        onChange={(e) =>
                          handleCategoryChange(category.id, e.target.checked)
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isCategoryPartiallySelected(category.id)
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>
                    {expandedPermissionCategories[category.id] ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </div>

                  {expandedPermissionCategories[category.id] && (
                    <div className="p-3 pl-10 space-y-2 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                      {category.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(
                              permission.id
                            )}
                            onChange={() =>
                              handlePermissionChange(permission.id)
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3"
                          />
                          <div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {permission.name}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {permissions.length === 0 && (
              <div className="text-center py-4 border dark:border-gray-700 rounded-md">
                <Lock
                  size={24}
                  className="mx-auto text-gray-400 dark:text-gray-600 mb-2"
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No permissions available
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRole}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={!formData.name}
            >
              Add Role
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Edit Role Modal */}
      <ModalReusable
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Role: ${currentRole?.name}`}
        icon={Edit}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role Name*
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Manager, Cashier, etc."
              className="w-full"
              required
              disabled={currentRole?.name === "admin"}
            />
            {currentRole?.name === "admin" && (
              <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">
                The admin role name cannot be changed
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of this role and its responsibilities..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Permissions
            </label>

            <div className="border dark:border-gray-700 rounded-md max-h-80 overflow-y-auto">
              {permissions.map((category) => (
                <div
                  key={category.id}
                  className="border-b dark:border-gray-700 last:border-0"
                >
                  <div
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer"
                    onClick={() => toggleCategoryExpanded(category.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isCategoryFullySelected(category.id)}
                        onChange={(e) =>
                          handleCategoryChange(category.id, e.target.checked)
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3"
                        onClick={(e) => e.stopPropagation()}
                        disabled={currentRole?.name === "admin"}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isCategoryPartiallySelected(category.id)
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>
                    {expandedPermissionCategories[category.id] ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </div>

                  {expandedPermissionCategories[category.id] && (
                    <div className="p-3 pl-10 space-y-2 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                      {category.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(
                              permission.id
                            )}
                            onChange={() =>
                              handlePermissionChange(permission.id)
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3"
                            disabled={currentRole?.name === "admin"}
                          />
                          <div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {permission.name}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {permissions.length === 0 && (
              <div className="text-center py-4 border dark:border-gray-700 rounded-md">
                <Lock
                  size={24}
                  className="mx-auto text-gray-400 dark:text-gray-600 mb-2"
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No permissions available
                </p>
              </div>
            )}

            {currentRole?.name === "admin" && (
              <p className="text-xs text-amber-500 dark:text-amber-400 mt-2">
                The admin role always has all permissions
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateRole}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={!formData.name || currentRole?.name === "admin"}
            >
              {currentRole?.name === "admin" ? (
                <span className="flex items-center">
                  <Lock size={16} className="mr-1" />
                  Admin Role
                </span>
              ) : (
                <span className="flex items-center">
                  <Save size={16} className="mr-1" />
                  Update Role
                </span>
              )}
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        entityType="Role"
        entityName={currentRole?.name}
        onConfirm={handleDeleteRole}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default RoleManagement;

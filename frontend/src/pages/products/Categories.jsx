import React, { useState, useEffect } from "react";
import {
  Tag,
  Folder,
  Search,
  Edit,
  Trash2,
  Plus,
  Package,
  BarChart,
  RefreshCw,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

// Dummy data service - replace with actual API calls later
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/dummyData";

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6", // Default blue color
    isActive: true,
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      enqueueSnackbar("Failed to load categories", { variant: "error" });
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
      name: "",
      description: "",
      color: "#3B82F6",
      isActive: true,
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || "#3B82F6",
      isActive: category.isActive !== false, // Default to true if not specified
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleAddCategory = async () => {
    try {
      const newCategory = await addCategory({
        ...formData,
        productsCount: 0,
        createdAt: new Date().toISOString(),
      });

      setCategories((prev) => [...prev, newCategory]);
      setIsAddModalOpen(false);
      resetForm();
      enqueueSnackbar("Category added successfully", { variant: "success" });
    } catch (error) {
      console.error("Error adding category:", error);
      enqueueSnackbar("Failed to add category", { variant: "error" });
    }
  };

  const handleUpdateCategory = async () => {
    if (!currentCategory) return;

    try {
      const updatedCategory = await updateCategory(currentCategory.id, {
        ...currentCategory,
        ...formData,
      });

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );

      setIsEditModalOpen(false);
      enqueueSnackbar("Category updated successfully", { variant: "success" });
    } catch (error) {
      console.error("Error updating category:", error);
      enqueueSnackbar("Failed to update category", { variant: "error" });
    }
  };

  const handleDeleteCategory = async () => {
    if (!currentCategory) return;

    try {
      await deleteCategory(currentCategory.id);
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== currentCategory.id)
      );
      setIsDeleteModalOpen(false);
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting category:", error);
      enqueueSnackbar("Failed to delete category", { variant: "error" });
      throw error; // Rethrow to be caught by the DeleteConfirmationModal
    }
  };

  // Table configuration
  const tableFields = [
    {
      name: "name",
      title: "Category Name",
      render: (value, row) => (
        <div className="flex items-center">
          <div
            className="w-6 h-6 rounded-full mr-2 flex-shrink-0"
            style={{ backgroundColor: row.color || "#3B82F6" }}
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.description
                ? row.description.length > 40
                  ? `${row.description.substring(0, 40)}...`
                  : row.description
                : "No description"}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "productsCount",
      title: "Products",
      render: (value) => (
        <div className="flex items-center">
          <Package
            size={16}
            className="mr-1 text-gray-400 dark:text-gray-500"
          />
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      name: "isActive",
      title: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value !== false
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400"
          }`}
        >
          {value !== false ? "Active" : "Inactive"}
        </span>
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
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(row);
            }}
            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
          >
            <Trash2 size={16} />
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
        Add Category
      </button>

      <div className="flex-grow"></div>

      <div className="flex items-center space-x-2">
        <button
          onClick={loadCategories}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  );

  // Count category statistics
  const activeCategories = categories.filter(
    (category) => category.isActive !== false
  ).length;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Folder className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
          Product Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage categories to organize your products
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Categories
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {categories.length}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <Folder size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Categories
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {activeCategories}
              </h3>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                {categories.length > 0
                  ? `${Math.round(
                      (activeCategories / categories.length) * 100
                    )}% of categories`
                  : "0% of categories"}
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <Tag size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Products
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {categories.reduce(
                  (sum, category) => sum + (category.productsCount || 0),
                  0
                )}
              </h3>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                Across all categories
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Package size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <JTable
          title="Product Categories"
          data={categories}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No categories found. Add your first category to get started."
        />
      </div>

      {/* Add Category Modal */}
      <ModalReusable
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
        icon={Plus}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name*
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Electronics, Clothing, etc."
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
              placeholder="Brief description of this category..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Color
            </label>
            <div className="flex items-center space-x-3">
              <Input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-12 h-8 p-0 rounded cursor-pointer"
              />
              <Input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="#HEX color"
                className="w-full"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Used for visual identification of the category
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive-edit"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive-edit"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Active Category
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateCategory}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={!formData.name}
            >
              Update Category
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        entityType="Category"
        entityName={currentCategory?.name}
        onConfirm={handleDeleteCategory}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ProductCategories;

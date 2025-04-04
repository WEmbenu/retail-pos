import React, { useState, useEffect } from "react";
import {
  Tag,
  Folder,
  Search,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  RefreshCw,
  BarChart2,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

// Dummy data service - replace with actual API calls later
import {
  getExpenseCategories,
  addExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "../../services/dataService";

const ExpenseCategories = () => {
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
    budgetLimit: "",
    isActive: true,
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getExpenseCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading expense categories:", error);
      enqueueSnackbar("Failed to load expense categories", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number" && name === "budgetLimit"
          ? value
            ? parseFloat(value)
            : ""
          : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
      budgetLimit: "",
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
      budgetLimit: category.budgetLimit || "",
      isActive: category.isActive !== false, // Default to true if not specified
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleAddCategory = async () => {
    if (!formData.name) {
      enqueueSnackbar("Category name is required", { variant: "error" });
      return;
    }

    try {
      const newCategory = await addExpenseCategory({
        ...formData,
        expensesCount: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
        budgetLimit: formData.budgetLimit
          ? parseFloat(formData.budgetLimit)
          : null,
      });

      setCategories((prev) => [...prev, newCategory]);
      setIsAddModalOpen(false);
      resetForm();
      enqueueSnackbar("Expense category added successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding expense category:", error);
      enqueueSnackbar("Failed to add expense category", { variant: "error" });
    }
  };

  const handleUpdateCategory = async () => {
    if (!currentCategory) return;

    if (!formData.name) {
      enqueueSnackbar("Category name is required", { variant: "error" });
      return;
    }

    try {
      const updatedCategory = await updateExpenseCategory(currentCategory.id, {
        ...currentCategory,
        ...formData,
        budgetLimit: formData.budgetLimit
          ? parseFloat(formData.budgetLimit)
          : null,
      });

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );

      setIsEditModalOpen(false);
      enqueueSnackbar("Expense category updated successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating expense category:", error);
      enqueueSnackbar("Failed to update expense category", {
        variant: "error",
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!currentCategory) return;

    try {
      await deleteExpenseCategory(currentCategory.id);
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== currentCategory.id)
      );
      setIsDeleteModalOpen(false);
      enqueueSnackbar("Expense category deleted successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting expense category:", error);
      enqueueSnackbar("Failed to delete expense category", {
        variant: "error",
      });
      throw error; // Rethrow to be caught by the DeleteConfirmationModal
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Calculate budget usage percentage
  const getBudgetUsage = (totalSpent, budgetLimit) => {
    if (!budgetLimit) return null;
    return Math.min(Math.round((totalSpent / budgetLimit) * 100), 100);
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
      name: "expensesCount",
      title: "Entries",
      render: (value) => (
        <div className="flex items-center">
          <DollarSign
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
      name: "totalSpent",
      title: "Total Spent",
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(value)}
        </div>
      ),
    },
    {
      name: "budgetLimit",
      title: "Budget",
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {value ? formatCurrency(value) : "No budget set"}
          </div>
          {value && row.totalSpent !== undefined && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full ${
                  getBudgetUsage(row.totalSpent, value) > 90
                    ? "bg-red-500"
                    : getBudgetUsage(row.totalSpent, value) > 70
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${getBudgetUsage(row.totalSpent, value)}%` }}
              ></div>
            </div>
          )}
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

  // Total spent across all categories
  const totalExpenses = categories.reduce(
    (sum, category) => sum + (category.totalSpent || 0),
    0
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Tag className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
          Expense Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage categories to organize and track your expenses
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
                Total Expenses
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {formatCurrency(totalExpenses)}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Across all categories
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <BarChart2 size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <JTable
          title="Expense Categories"
          data={categories}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No expense categories found. Add your first category to get started."
        />
      </div>

      {/* Add Category Modal */}
      <ModalReusable
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Expense Category"
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
              placeholder="Rent, Utilities, Office Supplies, etc."
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
              placeholder="Brief description of this expense category..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Budget Limit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <Input
                  type="number"
                  name="budgetLimit"
                  value={formData.budgetLimit}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  className="w-full pl-7"
                  step="0.01"
                  min="0"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty for no budget limit
              </p>
            </div>
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
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Active Category
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={!formData.name}
            >
              Add Category
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Edit Category Modal */}
      <ModalReusable
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Expense Category"
        icon={Edit}
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
              placeholder="Rent, Utilities, Office Supplies, etc."
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
              placeholder="Brief description of this expense category..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Budget Limit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <Input
                  type="number"
                  name="budgetLimit"
                  value={formData.budgetLimit}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  className="w-full pl-7"
                  step="0.01"
                  min="0"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty for no budget limit
              </p>
            </div>
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
        entityType="Expense Category"
        entityName={currentCategory?.name}
        onConfirm={handleDeleteCategory}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ExpenseCategories;

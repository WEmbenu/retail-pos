import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Filter,
  RefreshCw,
  CreditCard,
  FileText,
  PieChart,
  Users,
  BarChart2,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

// Dummy data service - replace with API calls later
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseCategories,
} from "../../services/dataService";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    paymentMethod: "cash",
    reference: "",
    notes: "",
    attachmentUrl: "",
  });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadExpenses();
    loadExpenseCategories();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
      enqueueSnackbar("Failed to load expenses", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadExpenseCategories = async () => {
    try {
      const data = await getExpenseCategories();
      setExpenseCategories(data);
    } catch (error) {
      console.error("Error loading expense categories:", error);
      enqueueSnackbar("Failed to load expense categories", {
        variant: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
      paymentMethod: "cash",
      reference: "",
      notes: "",
      attachmentUrl: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (expense) => {
    setCurrentExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount,
      date: expense.date
        ? new Date(expense.date).toISOString().split("T")[0]
        : "",
      categoryId: expense.categoryId?.toString() || "",
      paymentMethod: expense.paymentMethod || "cash",
      reference: expense.reference || "",
      notes: expense.notes || "",
      attachmentUrl: expense.attachmentUrl || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (expense) => {
    setCurrentExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const handleAddExpense = async () => {
    if (!formData.description || !formData.amount || !formData.date) {
      enqueueSnackbar("Please fill in all required fields", {
        variant: "error",
      });
      return;
    }

    try {
      const newExpense = await addExpense({
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString(),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      });

      setExpenses((prev) => [...prev, newExpense]);
      setIsAddModalOpen(false);
      resetForm();
      enqueueSnackbar("Expense added successfully", { variant: "success" });
    } catch (error) {
      console.error("Error adding expense:", error);
      enqueueSnackbar("Failed to add expense", { variant: "error" });
    }
  };

  const handleUpdateExpense = async () => {
    if (!currentExpense) return;

    if (!formData.description || !formData.amount || !formData.date) {
      enqueueSnackbar("Please fill in all required fields", {
        variant: "error",
      });
      return;
    }

    try {
      const updatedExpense = await updateExpense(currentExpense.id, {
        ...currentExpense,
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      });

      setExpenses((prev) =>
        prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
      );

      setIsEditModalOpen(false);
      enqueueSnackbar("Expense updated successfully", { variant: "success" });
    } catch (error) {
      console.error("Error updating expense:", error);
      enqueueSnackbar("Failed to update expense", { variant: "error" });
    }
  };

  const handleDeleteExpense = async () => {
    if (!currentExpense) return;

    try {
      await deleteExpense(currentExpense.id);
      setExpenses((prev) => prev.filter((exp) => exp.id !== currentExpense.id));
      setIsDeleteModalOpen(false);
      enqueueSnackbar("Expense deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting expense:", error);
      enqueueSnackbar("Failed to delete expense", { variant: "error" });
      throw error; // Rethrow to be caught by the DeleteConfirmationModal
    }
  };

  // Get category name
  const getCategoryName = (categoryId) => {
    const category = expenseCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Table configuration
  const tableFields = [
    {
      name: "date",
      title: "Date",
      render: (value) => (
        <div className="flex items-center">
          <Calendar
            size={14}
            className="mr-1 text-gray-400 dark:text-gray-500"
          />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {value ? new Date(value).toLocaleDateString() : "—"}
          </div>
        </div>
      ),
    },
    {
      name: "description",
      title: "Description",
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {value || "—"}
        </div>
      ),
    },
    {
      name: "categoryId",
      title: "Category",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
          {getCategoryName(value) || "Uncategorized"}
        </span>
      ),
    },
    {
      name: "amount",
      title: "Amount",
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(value)}
        </div>
      ),
    },
    {
      name: "paymentMethod",
      title: "Payment Method",
      render: (value) => (
        <div className="flex items-center">
          <CreditCard
            size={14}
            className="mr-1 text-gray-400 dark:text-gray-500"
          />
          <div className="text-sm text-gray-700 dark:text-gray-300 capitalize">
            {value || "cash"}
          </div>
        </div>
      ),
    },
    {
      name: "reference",
      title: "Reference",
      render: (value) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {value || "—"}
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

  // Filter expenses based on selected category and date range
  const filteredExpenses = expenses.filter((expense) => {
    // Filter by category
    if (
      categoryFilter !== "all" &&
      expense.categoryId?.toString() !== categoryFilter
    ) {
      return false;
    }

    // Filter by date range
    if (dateRange.start && new Date(expense.date) < new Date(dateRange.start)) {
      return false;
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59); // Set to end of day
      if (new Date(expense.date) > endDate) {
        return false;
      }
    }

    return true;
  });

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );

  // Calculate expenses by category for the summary
  const expensesByCategory = {};
  filteredExpenses.forEach((expense) => {
    const categoryId = expense.categoryId;
    const categoryName = getCategoryName(categoryId);

    if (!expensesByCategory[categoryName]) {
      expensesByCategory[categoryName] = 0;
    }

    expensesByCategory[categoryName] += expense.amount || 0;
  });

  // Convert to array and sort by amount
  const expensesByCategoryArray = Object.entries(expensesByCategory)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Custom header component for the JTable
  const TableHeader = () => (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <button
        onClick={openAddModal}
        className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white px-3 py-1.5 rounded flex items-center text-sm"
      >
        <Plus size={16} className="mr-1" />
        Add Expense
      </button>

      <div className="flex-grow"></div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-8 pr-2 py-1.5 border dark:border-gray-600 rounded text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="all">All Categories</option>
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
          <Filter
            size={14}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
        </div>

        <div className="flex items-center space-x-1">
          <div className="relative">
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="pl-8 py-1.5 text-sm w-36 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
            <Calendar
              size={14}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
          </div>
          <span className="text-gray-500 dark:text-gray-400">to</span>
          <div className="relative">
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="pl-8 py-1.5 text-sm w-36 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
            <Calendar
              size={14}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
          </div>
        </div>

        <button
          onClick={loadExpenses}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>

        <button
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Export expenses"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <DollarSign className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
          Expenses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage your business expenses
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                {filteredExpenses.length} expense records
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {expensesByCategoryArray.slice(0, 3).map((category, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {category.name}
                </p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  {formatCurrency(category.amount)}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((category.amount / totalExpenses) * 100)}% of
                  expenses
                </p>
              </div>
              <div className="p-2.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                {index === 0 ? (
                  <PieChart size={20} />
                ) : index === 1 ? (
                  <BarChart2 size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <JTable
          title="Expense Records"
          data={filteredExpenses}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No expenses found. Add your first expense to get started."
        />
      </div>

      {/* Add Expense Modal */}
      <ModalReusable
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Expense"
        icon={Plus}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description*
            </label>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Rent, Utilities, Supplies, etc."
              className="w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount*
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full pl-7"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date*
              </label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              >
                <option value="">Uncategorized</option>
                {expenseCategories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              >
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="mobile_payment">Mobile Payment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reference (Invoice, Receipt #)
            </label>
            <Input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleInputChange}
              placeholder="INV-001, RCPT-123, etc."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional details about this expense..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateExpense}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={
                !formData.description || !formData.amount || !formData.date
              }
            >
              Update Expense
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        entityType="Expense"
        entityName={currentExpense?.description}
        onConfirm={handleDeleteExpense}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Expenses;

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Edit,
  Trash2,
  User,
  DollarSign,
  Clock,
  CreditCard,
  AlertTriangle,
  Plus,
  RefreshCw,
  FileText,
  Download,
  ReceiptIcon,
  CheckCircle2,
  Filter,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

// Import from new data service instead of dummyData
import {
  getCustomersWithDebts,
  addCustomerDebt,
  updateCustomerDebt,
  deleteCustomerDebt,
  addDebtPayment,
} from "../../services/dataService";

const ClientDebts = () => {
  const [clientDebts, setClientDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentDebt, setCurrentDebt] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    originalAmount: "",
    description: "",
    dueDate: "",
    paymentStatus: "unpaid",
    notes: "",
  });
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    reference: "",
    notes: "",
  });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadClientDebts();
  }, []);

  const loadClientDebts = async () => {
    setLoading(true);
    try {
      const data = await getCustomersWithDebts();
      setClientDebts(data);
    } catch (error) {
      console.error("Error loading client debts:", error);
      enqueueSnackbar("Failed to load customer debts", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value, type } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      email: "",
      phone: "",
      originalAmount: "",
      description: "",
      dueDate: "",
      paymentStatus: "unpaid",
      notes: "",
    });
  };

  const resetPaymentForm = () => {
    setPaymentData({
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      reference: "",
      notes: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openViewModal = (debt) => {
    setCurrentDebt(debt);
    setIsViewModalOpen(true);
  };

  const openEditModal = (debt) => {
    setCurrentDebt(debt);
    setFormData({
      customerName: debt.customerName || "",
      email: debt.email || "",
      phone: debt.phone || "",
      originalAmount: debt.originalAmount || "",
      description: debt.description || "",
      dueDate: debt.dueDate
        ? new Date(debt.dueDate).toISOString().split("T")[0]
        : "",
      paymentStatus: debt.paymentStatus || "unpaid",
      notes: debt.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (debt) => {
    setCurrentDebt(debt);
    setIsDeleteModalOpen(true);
  };

  const openPaymentModal = (debt) => {
    setCurrentDebt(debt);
    // Set default payment amount to remaining amount
    setPaymentData({
      ...paymentData,
      amount: (debt.originalAmount - (debt.paidAmount || 0)).toFixed(2),
    });
    setIsPaymentModalOpen(true);
  };

  const handleAddDebt = async () => {
    if (!formData.customerName || !formData.originalAmount) {
      enqueueSnackbar("Please fill in all required fields", {
        variant: "error",
      });
      return;
    }

    try {
      const newDebt = await addCustomerDebt({
        ...formData,
        originalAmount: parseFloat(formData.originalAmount),
        paidAmount: 0,
        remainingAmount: parseFloat(formData.originalAmount),
        createdAt: new Date().toISOString(),
        payments: [],
      });

      setClientDebts((prev) => [...prev, newDebt]);
      setIsAddModalOpen(false);
      resetForm();
      enqueueSnackbar("Customer debt added successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding customer debt:", error);
      enqueueSnackbar("Failed to add customer debt", { variant: "error" });
    }
  };

  const handleUpdateDebt = async () => {
    if (!currentDebt || !formData.customerName || !formData.originalAmount) {
      enqueueSnackbar("Please fill in all required fields", {
        variant: "error",
      });
      return;
    }

    try {
      // Calculate new remaining amount based on the updated original amount
      const updatedOriginalAmount = parseFloat(formData.originalAmount);
      const paidAmount = currentDebt.paidAmount || 0;
      const remainingAmount = updatedOriginalAmount - paidAmount;

      const updatedDebt = await updateCustomerDebt(currentDebt.id, {
        ...currentDebt,
        ...formData,
        originalAmount: updatedOriginalAmount,
        remainingAmount: remainingAmount,
      });

      setClientDebts((prev) =>
        prev.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt))
      );

      setIsEditModalOpen(false);
      enqueueSnackbar("Customer debt updated successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating customer debt:", error);
      enqueueSnackbar("Failed to update customer debt", { variant: "error" });
    }
  };

  const handleDeleteDebt = async () => {
    if (!currentDebt) return;

    try {
      await deleteCustomerDebt(currentDebt.id);
      setClientDebts((prev) =>
        prev.filter((debt) => debt.id !== currentDebt.id)
      );
      setIsDeleteModalOpen(false);
      enqueueSnackbar("Customer debt deleted successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting customer debt:", error);
      enqueueSnackbar("Failed to delete customer debt", { variant: "error" });
      throw error; // Rethrow to be caught by the DeleteConfirmationModal
    }
  };

  const handleAddPayment = async () => {
    if (!currentDebt) return;

    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      enqueueSnackbar("Please enter a valid payment amount", {
        variant: "error",
      });
      return;
    }

    // Validate payment amount doesn't exceed remaining debt
    const remainingAmount = currentDebt.remainingAmount || 0;
    if (parseFloat(paymentData.amount) > remainingAmount) {
      enqueueSnackbar(
        `Payment cannot exceed remaining debt of ${formatCurrency(
          remainingAmount
        )}`,
        { variant: "error" }
      );
      return;
    }

    try {
      // Create payment record
      const paymentAmount = parseFloat(paymentData.amount);
      const payment = {
        amount: paymentAmount,
        paymentDate: paymentData.paymentDate,
        paymentMethod: paymentData.paymentMethod,
        reference: paymentData.reference,
        notes: paymentData.notes,
      };

      // Calculate new paid and remaining amounts
      const newPaidAmount = (currentDebt.paidAmount || 0) + paymentAmount;
      const newRemainingAmount = currentDebt.originalAmount - newPaidAmount;

      // Determine new payment status
      let newPaymentStatus = currentDebt.paymentStatus;
      if (newRemainingAmount <= 0) {
        newPaymentStatus = "paid";
      } else if (newPaidAmount > 0) {
        newPaymentStatus = "partial";
      }

      // Update the debt record with the new payment
      const updatedDebt = await addDebtPayment(currentDebt.id, {
        payment,
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
        paymentStatus: newPaymentStatus,
      });

      // Update state
      setClientDebts((prev) =>
        prev.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt))
      );

      setIsPaymentModalOpen(false);
      resetPaymentForm();
      enqueueSnackbar("Payment recorded successfully", { variant: "success" });
    } catch (error) {
      console.error("Error recording payment:", error);
      enqueueSnackbar("Failed to record payment", { variant: "error" });
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

  // Calculate days overdue
  const getDaysOverdue = (dueDate) => {
    if (!dueDate) return null;

    const today = new Date();
    const dueDateObj = new Date(dueDate);

    // Reset time portion for accurate day calculation
    today.setHours(0, 0, 0, 0);
    dueDateObj.setHours(0, 0, 0, 0);

    const diffTime = today - dueDateObj;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : null; // Return null if not overdue
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const styles = {
      unpaid: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
      partial:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
      paid: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
      forgiven:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs flex items-center w-fit ${
          styles[status] ||
          "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Table configuration
  const tableFields = [
    {
      name: "customerName",
      title: "Customer",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-1.5 rounded-full mr-2">
            <User
              size={16}
              className="text-primary-700 dark:text-primary-400"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.email || "No email"}
            </div>
            {row.phone && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {row.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "originalAmount",
      title: "Original Amount",
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(value)}
        </div>
      ),
    },
    {
      name: "remainingAmount",
      title: "Remaining",
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(value)}
          </div>
          {row.paidAmount > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Paid: {formatCurrency(row.paidAmount)}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "description",
      title: "Description",
      render: (value) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {value || "No description"}
        </div>
      ),
    },
    {
      name: "dueDate",
      title: "Due Date",
      render: (value, row) => {
        const daysOverdue = getDaysOverdue(value);

        return (
          <div>
            <div className="flex items-center">
              <Calendar
                size={14}
                className="mr-1 text-gray-400 dark:text-gray-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {value ? new Date(value).toLocaleDateString() : "No due date"}
              </span>
            </div>
            {daysOverdue && (
              <div className="text-xs text-red-500 font-medium flex items-center mt-1">
                <AlertTriangle size={12} className="mr-1" />
                {daysOverdue} {daysOverdue === 1 ? "day" : "days"} overdue
              </div>
            )}
          </div>
        );
      },
    },
    {
      name: "paymentStatus",
      title: "Status",
      render: (value) => <StatusBadge status={value || "unpaid"} />,
    },
    {
      name: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openViewModal(row);
            }}
            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="View details"
          >
            <FileText size={16} />
          </button>
          {row.paymentStatus !== "paid" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openPaymentModal(row);
              }}
              className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
              title="Record payment"
            >
              <CreditCard size={16} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(row);
            }}
            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(row);
            }}
            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Filter client debts based on selected status and date range
  const filteredDebts = clientDebts.filter((debt) => {
    // Filter by payment status
    if (statusFilter !== "all" && debt.paymentStatus !== statusFilter) {
      return false;
    }

    // Filter by due date range
    if (
      dateRange.start &&
      debt.dueDate &&
      new Date(debt.dueDate) < new Date(dateRange.start)
    ) {
      return false;
    }

    if (dateRange.end && debt.dueDate) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59); // Set to end of day
      if (new Date(debt.dueDate) > endDate) {
        return false;
      }
    }

    return true;
  });

  // Calculate totals
  const totalOriginalAmount = filteredDebts.reduce(
    (sum, debt) => sum + (debt.originalAmount || 0),
    0
  );

  const totalRemainingAmount = filteredDebts.reduce(
    (sum, debt) => sum + (debt.remainingAmount || 0),
    0
  );

  const overdueDebts = filteredDebts.filter(
    (debt) => getDaysOverdue(debt.dueDate) && debt.paymentStatus !== "paid"
  );

  // Custom header component for the JTable
  const TableHeader = () => (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <button
        onClick={openAddModal}
        className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white px-3 py-1.5 rounded flex items-center text-sm"
      >
        <Plus size={16} className="mr-1" />
        Add Debt
      </button>

      <div className="flex-grow"></div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-8 pr-2 py-1.5 border dark:border-gray-600 rounded text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="all">All Statuses</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="forgiven">Forgiven</option>
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
              placeholder="Start date"
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
              placeholder="End date"
            />
            <Calendar
              size={14}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
          </div>
        </div>

        <button
          onClick={loadClientDebts}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>

        <button
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Export debts"
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
          <Users className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
          Customer Debts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track customer credit and payment history
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Original
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {formatCurrency(totalOriginalAmount)}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filteredDebts.length} customer debts
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Remaining
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {formatCurrency(totalRemainingAmount)}
              </h3>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                {Math.round(
                  (totalRemainingAmount / totalOriginalAmount) * 100
                ) || 0}
                % of original amount
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <CreditCard size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Overdue Debts
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {overdueDebts.length}
              </h3>
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                Customers with overdue payments
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Paid Debts
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {
                  filteredDebts.filter((debt) => debt.paymentStatus === "paid")
                    .length
                }
              </h3>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                Fully settled accounts
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <JTable
          title="Customer Debts"
          data={filteredDebts}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No customer debts found. Add your first debt record to get started."
        />
      </div>

      {/* Add Debt Modal */}
      <ModalReusable
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Debt"
        icon={Plus}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer Name*
            </label>
            <Input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="John Doe"
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
                  name="originalAmount"
                  value={formData.originalAmount}
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
                Due Date
              </label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Invoice #123, Purchase, etc."
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
              placeholder="Additional details about this debt..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDebt}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={!formData.customerName || !formData.originalAmount}
            >
              Add Debt
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Edit Debt Modal */}
      <ModalReusable
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Debt"
        icon={Edit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer Name*
            </label>
            <Input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="customer@example.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Original Amount*
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <Input
                  type="number"
                  name="originalAmount"
                  value={formData.originalAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full pl-7"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              {currentDebt && currentDebt.paidAmount > 0 && (
                <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">
                  Note: Changing this amount will recalculate the remaining
                  balance.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Invoice #123, Purchase, etc."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            >
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="forgiven">Forgiven</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional details about this debt..."
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
              onClick={handleUpdateDebt}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={!formData.customerName || !formData.originalAmount}
            >
              Update Debt
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* View Debt Modal */}
      <ModalReusable
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Debt Details"
        icon={FileText}
        size="lg"
      >
        {currentDebt && (
          <div className="space-y-6">
            {/* Debt header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-3 border-b dark:border-gray-700">
              <div>
                <div className="flex items-center">
                  <div className="text-lg font-semibold mr-2 text-gray-900 dark:text-white">
                    {currentDebt.customerName}
                  </div>
                  <StatusBadge status={currentDebt.paymentStatus || "unpaid"} />
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  {currentDebt.description || "No description provided"}
                </div>
              </div>
              <div className="font-medium text-xl text-gray-900 dark:text-white">
                {formatCurrency(currentDebt.originalAmount || 0)}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Customer Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User
                        size={16}
                        className="mr-2 text-gray-400 dark:text-gray-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentDebt.customerName}
                      </span>
                    </div>
                    {currentDebt.email && (
                      <div className="flex items-center">
                        <Mail
                          size={16}
                          className="mr-2 text-gray-400 dark:text-gray-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {currentDebt.email}
                        </span>
                      </div>
                    )}
                    {currentDebt.phone && (
                      <div className="flex items-center">
                        <Phone
                          size={16}
                          className="mr-2 text-gray-400 dark:text-gray-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {currentDebt.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Payment Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Status
                      </span>
                      <StatusBadge
                        status={currentDebt.paymentStatus || "unpaid"}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Original Amount
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(currentDebt.originalAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Paid Amount
                      </span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(currentDebt.paidAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Remaining
                      </span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        {formatCurrency(currentDebt.remainingAmount || 0)}
                      </span>
                    </div>
                    {currentDebt.dueDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Due Date
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(currentDebt.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment history */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Payment History
              </h3>
              {currentDebt.payments && currentDebt.payments.length > 0 ? (
                <div className="border dark:border-gray-700 rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Method
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentDebt.payments.map((payment, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                            {payment.paymentDate
                              ? new Date(
                                  payment.paymentDate
                                ).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-2 text-sm capitalize text-gray-700 dark:text-gray-300">
                            {payment.paymentMethod?.replace("_", " ") || "—"}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                            {payment.reference || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-center">
                  <ReceiptIcon
                    size={24}
                    className="mx-auto text-gray-400 dark:text-gray-500 mb-2"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No payment history
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            {currentDebt.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Notes
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm text-gray-700 dark:text-gray-300">
                  {currentDebt.notes}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2">
              {currentDebt.paymentStatus !== "paid" && (
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openPaymentModal(currentDebt);
                  }}
                  className="px-3 py-1.5 border border-green-300 dark:border-green-800 rounded-md text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center"
                >
                  <CreditCard size={16} className="mr-1" /> Record Payment
                </button>
              )}
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(currentDebt);
                }}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <Edit size={16} className="mr-1" /> Edit
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </ModalReusable>

      {/* Payment Modal */}
      <ModalReusable
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Payment"
        icon={CreditCard}
      >
        {currentDebt && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Customer:
                </span>
                <span className="text-sm text-blue-800 dark:text-blue-300">
                  {currentDebt.customerName}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Original Amount:
                </span>
                <span className="text-sm text-blue-800 dark:text-blue-300">
                  {formatCurrency(currentDebt.originalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Remaining Balance:
                </span>
                <span className="text-sm text-blue-800 dark:text-blue-300">
                  {formatCurrency(currentDebt.remainingAmount)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Amount*
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <Input
                  type="number"
                  name="amount"
                  value={paymentData.amount}
                  onChange={handlePaymentInputChange}
                  placeholder="0.00"
                  className="w-full pl-7"
                  step="0.01"
                  min="0"
                  max={currentDebt.remainingAmount}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum payment: {formatCurrency(currentDebt.remainingAmount)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Date*
                </label>
                <Input
                  type="date"
                  name="paymentDate"
                  value={paymentData.paymentDate}
                  onChange={handlePaymentInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handlePaymentInputChange}
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
                Reference (Receipt #, Transaction ID)
              </label>
              <Input
                type="text"
                name="reference"
                value={paymentData.reference}
                onChange={handlePaymentInputChange}
                placeholder="RCPT-123, TRANS-456, etc."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={paymentData.notes}
                onChange={handlePaymentInputChange}
                placeholder="Additional details about this payment..."
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
                disabled={
                  !paymentData.amount || parseFloat(paymentData.amount) <= 0
                }
              >
                Record Payment
              </button>
            </div>
          </div>
        )}
      </ModalReusable>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        entityType="Debt Record"
        entityName={currentDebt?.customerName}
        onConfirm={handleDeleteDebt}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ClientDebts;

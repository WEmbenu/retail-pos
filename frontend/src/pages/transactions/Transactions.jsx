// src/pages/transactions/Transactions.jsx
import React, { useState, useEffect } from "react";
import {
  Receipt,
  Search,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  CreditCard,
  User,
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import { useSnackbar } from "notistack";

// Dummy data service
import { getTransactions } from "../../services/dataService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
      enqueueSnackbar("Failed to load transactions", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (transaction) => {
    setCurrentTransaction(transaction);
    setViewModalOpen(true);
  };

  // Format currency amount
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-purple-100 text-purple-800",
    };

    const icons = {
      completed: <CheckCircle size={14} className="mr-1" />,
      pending: <Clock size={14} className="mr-1" />,
      failed: <XCircle size={14} className="mr-1" />,
      refunded: <AlertCircle size={14} className="mr-1" />,
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs flex items-center w-fit ${
          styles[status] || "bg-gray-100"
        }`}
      >
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Table configuration
  const tableFields = [
    {
      name: "transactionId",
      title: "Transaction ID",
      render: (value) => <div className="font-mono text-xs">{value}</div>,
    },
    {
      name: "date",
      title: "Date & Time",
      render: (value) => (
        <div className="flex items-center">
          <Clock size={14} className="mr-1 text-gray-400" />
          <div className="text-sm">{formatDate(value)}</div>
        </div>
      ),
    },
    {
      name: "customer",
      title: "Customer",
      render: (value) => (
        <div className="flex items-center">
          <User size={14} className="mr-1 text-gray-400" />
          <div className="text-sm font-medium">
            {value || "Walk-in Customer"}
          </div>
        </div>
      ),
    },
    {
      name: "paymentMethod",
      title: "Payment Method",
      render: (value) => (
        <div className="flex items-center">
          <CreditCard size={14} className="mr-1 text-gray-400" />
          <div className="text-sm">{value}</div>
        </div>
      ),
    },
    {
      name: "total",
      title: "Amount",
      render: (value) => (
        <div className="flex items-center font-medium">
          <DollarSign size={14} className="mr-1 text-gray-400" />
          <div className="text-sm">{formatCurrency(value)}</div>
        </div>
      ),
    },
    {
      name: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      name: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openViewModal(row);
            }}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded text-sm"
          >
            View Details
          </button>
        </div>
      ),
    },
  ];

  // Custom header component for the JTable
  const TableHeader = () => (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-8 pr-2 py-1.5 border rounded text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Transactions</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <Filter
            size={14}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
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
              className="pl-8 py-1.5 text-sm w-36"
            />
            <Calendar
              size={14}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative">
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="pl-8 py-1.5 text-sm w-36"
            />
            <Calendar
              size={14}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="flex-grow"></div>

      <div className="flex items-center space-x-2">
        <button
          onClick={loadTransactions}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>

        <button
          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
          title="Export transactions"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  );

  // Filter transactions based on selected type and date range
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by status
    if (filterType !== "all" && transaction.status !== filterType) {
      return false;
    }

    // Filter by date range
    if (
      dateRange.start &&
      new Date(transaction.date) < new Date(dateRange.start)
    ) {
      return false;
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59); // Set to end of day
      if (new Date(transaction.date) > endDate) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <p className="text-gray-600">View and manage all transactions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <JTable
          title="Transaction History"
          data={filteredTransactions}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No transactions found for the selected filters."
        />
      </div>

      {/* Transaction Details Modal */}
      <ModalReusable
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Transaction Details"
        icon={Receipt}
        size="md"
      >
        {currentTransaction && (
          <div className="space-y-6">
            {/* Transaction header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-3 border-b">
              <div>
                <div className="flex items-center">
                  <div className="text-lg font-semibold mr-2">
                    {formatCurrency(currentTransaction.total)}
                  </div>
                  <StatusBadge status={currentTransaction.status} />
                </div>
                <div className="text-gray-500 text-sm">
                  {formatDate(currentTransaction.date)}
                </div>
              </div>
              <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {currentTransaction.transactionId}
              </div>
            </div>

            {/* Customer info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Customer
                </h3>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium">
                    {currentTransaction.customer || "Walk-in Customer"}
                  </div>
                  {currentTransaction.customerDetails && (
                    <>
                      <div className="text-sm">
                        {currentTransaction.customerDetails.email}
                      </div>
                      <div className="text-sm">
                        {currentTransaction.customerDetails.phone}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Payment Method
                </h3>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex items-center">
                    <CreditCard size={16} className="mr-1.5 text-gray-500" />
                    <span className="text-sm">
                      {currentTransaction.paymentMethod}
                    </span>
                  </div>
                  {currentTransaction.paymentDetails && (
                    <div className="text-xs text-gray-500 mt-1">
                      {currentTransaction.paymentDetails.cardNumber &&
                        `Card ending in ${currentTransaction.paymentDetails.cardNumber.slice(
                          -4
                        )}`}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products list */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Purchased Items
              </h3>
              <div className="border rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Qty
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentTransaction.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          {item.sku && (
                            <div className="text-xs text-gray-500">
                              SKU: {item.sku}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>
                  {formatCurrency(
                    currentTransaction.subtotal || currentTransaction.total
                  )}
                </span>
              </div>

              {currentTransaction.tax > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatCurrency(currentTransaction.tax)}</span>
                </div>
              )}

              {currentTransaction.discount > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Discount</span>
                  <span>-{formatCurrency(currentTransaction.discount)}</span>
                </div>
              )}

              <div className="flex justify-between font-medium text-base mt-2 pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(currentTransaction.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <FileText size={16} className="mr-1" /> Print Receipt
              </button>
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </ModalReusable>
    </div>
  );
};

export default Transactions;

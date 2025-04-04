import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
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
  TruckIcon,
  Package,
  Clipboard,
  Eye,
  DollarSign,
  Clock,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

// Dummy data service - replace with API calls later
import {
  getPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase,
  getSuppliers,
  getProducts,
} from "../../services/dataService";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    supplierId: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    expectedDeliveryDate: "",
    paymentStatus: "pending",
    paymentMethod: "bank_transfer",
    items: [{ productId: "", quantity: 1, unitPrice: 0 }],
    totalAmount: 0,
    notes: "",
  });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadPurchases();
    loadSuppliers();
    loadProducts();
  }, []);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const data = await getPurchases();
      setPurchases(data);
    } catch (error) {
      console.error("Error loading purchases:", error);
      enqueueSnackbar("Failed to load purchases", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Error loading suppliers:", error);
      enqueueSnackbar("Failed to load suppliers", { variant: "error" });
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      enqueueSnackbar("Failed to load products", { variant: "error" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Calculate item total
    if (field === "quantity" || field === "unitPrice") {
      const quantity =
        field === "quantity"
          ? parseFloat(value) || 0
          : parseFloat(newItems[index].quantity) || 0;
      const unitPrice =
        field === "unitPrice"
          ? parseFloat(value) || 0
          : parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].total = quantity * unitPrice;
    }

    // Update total amount
    const totalAmount = newItems.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      totalAmount,
    }));
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, unitPrice: 0 }],
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length === 1) {
      return; // Keep at least one item
    }

    const newItems = [...formData.items];
    newItems.splice(index, 1);

    // Recalculate total
    const totalAmount = newItems.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      totalAmount,
    }));
  };

  const resetForm = () => {
    setFormData({
      invoiceNumber: "",
      supplierId: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      expectedDeliveryDate: "",
      paymentStatus: "pending",
      paymentMethod: "bank_transfer",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      totalAmount: 0,
      notes: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openViewModal = (purchase) => {
    setCurrentPurchase(purchase);
    setIsViewModalOpen(true);
  };

  const openEditModal = (purchase) => {
    setCurrentPurchase(purchase);

    // Format purchase data for the form
    setFormData({
      invoiceNumber: purchase.invoiceNumber || "",
      supplierId: purchase.supplierId?.toString() || "",
      purchaseDate: purchase.purchaseDate
        ? new Date(purchase.purchaseDate).toISOString().split("T")[0]
        : "",
      expectedDeliveryDate: purchase.expectedDeliveryDate
        ? new Date(purchase.expectedDeliveryDate).toISOString().split("T")[0]
        : "",
      deliveryStatus: purchase.deliveryStatus || "pending",
      paymentStatus: purchase.paymentStatus || "pending",
      paymentMethod: purchase.paymentMethod || "bank_transfer",
      items: purchase.items || [{ productId: "", quantity: 1, unitPrice: 0 }],
      totalAmount: purchase.totalAmount || 0,
      notes: purchase.notes || "",
    });

    setIsEditModalOpen(true);
  };

  const openDeleteModal = (purchase) => {
    setCurrentPurchase(purchase);
    setIsDeleteModalOpen(true);
  };

  const handleAddPurchase = async () => {
    if (
      !formData.invoiceNumber ||
      !formData.supplierId ||
      !formData.purchaseDate
    ) {
      enqueueSnackbar("Please fill in all required fields", {
        variant: "error",
      });
      return;
    }

    // Validate items
    if (
      !formData.items.every(
        (item) => item.productId && item.quantity > 0 && item.unitPrice > 0
      )
    ) {
      enqueueSnackbar("Please fill in all product details correctly", {
        variant: "error",
      });
      return;
    }

    try {
      const newPurchase = await addPurchase({
        ...formData,
        createdAt: new Date().toISOString(),
        supplierId: parseInt(formData.supplierId),
        deliveryStatus: "pending",
        items: formData.items.map((item) => ({
          ...item,
          productId: parseInt(item.productId),
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          total: parseFloat(item.quantity) * parseFloat(item.unitPrice),
        })),
        totalAmount: formData.totalAmount,
      });

      setPurchases((prev) => [...prev, newPurchase]);
      setIsAddModalOpen(false);
      resetForm();
      enqueueSnackbar("Purchase added successfully", { variant: "success" });
    } catch (error) {
      console.error("Error adding purchase:", error);
      enqueueSnackbar("Failed to add purchase", { variant: "error" });
    }
  };

  const handleUpdatePurchase = async () => {
    if (!currentPurchase) return;

    if (
      !formData.invoiceNumber ||
      !formData.supplierId ||
      !formData.purchaseDate
    ) {
      enqueueSnackbar("Please fill in all required fields", {
        variant: "error",
      });
      return;
    }

    // Validate items
    if (
      !formData.items.every(
        (item) => item.productId && item.quantity > 0 && item.unitPrice > 0
      )
    ) {
      enqueueSnackbar("Please fill in all product details correctly", {
        variant: "error",
      });
      return;
    }

    try {
      const updatedPurchase = await updatePurchase(currentPurchase.id, {
        ...currentPurchase,
        ...formData,
        supplierId: parseInt(formData.supplierId),
        items: formData.items.map((item) => ({
          ...item,
          productId: parseInt(item.productId),
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          total: parseFloat(item.quantity) * parseFloat(item.unitPrice),
        })),
        totalAmount: formData.totalAmount,
      });

      setPurchases((prev) =>
        prev.map((pur) =>
          pur.id === updatedPurchase.id ? updatedPurchase : pur
        )
      );

      setIsEditModalOpen(false);
      enqueueSnackbar("Purchase updated successfully", { variant: "success" });
    } catch (error) {
      console.error("Error updating purchase:", error);
      enqueueSnackbar("Failed to update purchase", { variant: "error" });
    }
  };

  const handleDeletePurchase = async () => {
    if (!currentPurchase) return;

    try {
      await deletePurchase(currentPurchase.id);
      setPurchases((prev) =>
        prev.filter((pur) => pur.id !== currentPurchase.id)
      );
      setIsDeleteModalOpen(false);
      enqueueSnackbar("Purchase deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting purchase:", error);
      enqueueSnackbar("Failed to delete purchase", { variant: "error" });
      throw error; // Rethrow to be caught by the DeleteConfirmationModal
    }
  };

  // Get supplier name
  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((sup) => sup.id === supplierId);
    return supplier ? supplier.name : "Unknown Supplier";
  };

  // Get product name
  const getProductName = (productId) => {
    const product = products.find((prod) => prod.id === productId);
    return product ? product.name : "Unknown Product";
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Status badge component
  const StatusBadge = ({ status, type = "payment" }) => {
    const styles = {
      payment: {
        paid: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
        pending:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
        partial:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
        cancelled:
          "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
      },
      delivery: {
        delivered:
          "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
        pending:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
        partial:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
        cancelled:
          "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
        in_transit:
          "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400",
      },
    };

    const typeStyles = type === "payment" ? styles.payment : styles.delivery;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs flex items-center w-fit ${
          typeStyles[status] ||
          "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </span>
    );
  };

  // Table configuration
  const tableFields = [
    {
      name: "invoiceNumber",
      title: "Invoice #",
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {value || "—"}
        </div>
      ),
    },
    {
      name: "purchaseDate",
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
      name: "supplierId",
      title: "Supplier",
      render: (value) => (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {getSupplierName(value)}
        </div>
      ),
    },
    {
      name: "totalAmount",
      title: "Amount",
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(value)}
        </div>
      ),
    },
    {
      name: "deliveryStatus",
      title: "Delivery",
      render: (value) => (
        <StatusBadge status={value || "pending"} type="delivery" />
      ),
    },
    {
      name: "paymentStatus",
      title: "Payment",
      render: (value) => (
        <StatusBadge status={value || "pending"} type="payment" />
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
              openViewModal(row);
            }}
            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Eye size={16} />
          </button>
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

  // Filter purchases based on selected status, supplier, and date range
  const filteredPurchases = purchases.filter((purchase) => {
    // Filter by payment status
    if (statusFilter !== "all" && purchase.paymentStatus !== statusFilter) {
      return false;
    }

    // Filter by supplier
    if (
      supplierFilter !== "all" &&
      purchase.supplierId?.toString() !== supplierFilter
    ) {
      return false;
    }

    // Filter by date range
    if (
      dateRange.start &&
      new Date(purchase.purchaseDate) < new Date(dateRange.start)
    ) {
      return false;
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59); // Set to end of day
      if (new Date(purchase.purchaseDate) > endDate) {
        return false;
      }
    }

    return true;
  });

  // Calculate totals
  const totalPurchases = filteredPurchases.reduce(
    (sum, purchase) => sum + (purchase.totalAmount || 0),
    0
  );

  // Count by status
  const paidPurchases = filteredPurchases.filter(
    (purchase) => purchase.paymentStatus === "paid"
  ).length;

  const pendingPurchases = filteredPurchases.filter(
    (purchase) => purchase.paymentStatus === "pending"
  ).length;

  // Custom header component for the JTable
  const TableHeader = () => (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <button
        onClick={openAddModal}
        className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white px-3 py-1.5 rounded flex items-center text-sm"
      >
        <Plus size={16} className="mr-1" />
        Add Purchase
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Filter
            size={14}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
        </div>

        <div className="relative">
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="pl-8 pr-2 py-1.5 border dark:border-gray-600 rounded text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="all">All Suppliers</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id.toString()}>
                {supplier.name}
              </option>
            ))}
          </select>
          <TruckIcon
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
          onClick={loadPurchases}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>

        <button
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Export purchases"
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
          <ShoppingBag className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
          Purchase Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your inventory purchases and track orders
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Purchases
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {formatCurrency(totalPurchases)}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filteredPurchases.length} purchase orders
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Paid Orders
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {paidPurchases}
              </h3>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                {filteredPurchases.length > 0
                  ? `${Math.round(
                      (paidPurchases / filteredPurchases.length) * 100
                    )}% of orders`
                  : "0% of orders"}
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending Orders
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {pendingPurchases}
              </h3>
              <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">
                Awaiting payment or delivery
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Suppliers
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {suppliers.length}
              </h3>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                Active suppliers
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <TruckIcon size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <JTable
          title="Purchase Orders"
          data={filteredPurchases}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No purchase orders found. Add your first purchase to get started."
        />
      </div>

      {/* Add Purchase Modal */}
      <ModalReusable
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Purchase Order"
        icon={Plus}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice Number*
              </label>
              <Input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                placeholder="INV-001"
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Supplier*
              </label>
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id.toString()}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Purchase Date*
              </label>
              <Input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Delivery Date
              </label>
              <Input
                type="date"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Status
              </label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="cancelled">Cancelled</option>
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
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Purchase Items*
            </label>
            <div className="border dark:border-gray-700 rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Unit Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-10">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <select
                          value={item.productId}
                          onChange={(e) =>
                            handleItemChange(index, "productId", e.target.value)
                          }
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                          required
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          className="w-full"
                          min="1"
                          step="1"
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                            $
                          </span>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "unitPrice",
                                e.target.value
                              )
                            }
                            className="w-full pl-6"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {formatCurrency(
                          (item.quantity || 0) * (item.unitPrice || 0)
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={addItemRow}
              className="mt-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
            >
              <Plus size={14} className="mr-1" /> Add Item
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Amount:
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(formData.totalAmount)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional information about this purchase..."
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
              onClick={handleAddPurchase}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={
                !formData.invoiceNumber ||
                !formData.supplierId ||
                !formData.purchaseDate
              }
            >
              Add Purchase
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* View Purchase Modal */}
      <ModalReusable
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Purchase Order Details"
        icon={FileText}
        size="lg"
      >
        {currentPurchase && (
          <div className="space-y-6">
            {/* Purchase header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-3 border-b dark:border-gray-700">
              <div>
                <div className="flex items-center">
                  <div className="text-lg font-semibold mr-2 text-gray-900 dark:text-white">
                    {currentPurchase.invoiceNumber || "No Invoice #"}
                  </div>
                  <StatusBadge
                    status={currentPurchase.paymentStatus || "pending"}
                    type="payment"
                  />
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  {currentPurchase.purchaseDate
                    ? new Date(
                        currentPurchase.purchaseDate
                      ).toLocaleDateString()
                    : "No date"}
                </div>
              </div>
              <div className="font-medium text-xl text-gray-900 dark:text-white">
                {formatCurrency(currentPurchase.totalAmount || 0)}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supplier info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Supplier
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {getSupplierName(currentPurchase.supplierId)}
                  </div>
                  {/* Add supplier contact details if available */}
                </div>
              </div>

              {/* Delivery info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Delivery Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Status
                      </span>
                      <StatusBadge
                        status={currentPurchase.deliveryStatus || "pending"}
                        type="delivery"
                      />
                    </div>
                    {currentPurchase.expectedDeliveryDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Expected On
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(
                            currentPurchase.expectedDeliveryDate
                          ).toLocaleDateString()}
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
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Status
                      </span>
                      <StatusBadge
                        status={currentPurchase.paymentStatus || "pending"}
                        type="payment"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Method
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {currentPurchase.paymentMethod?.replace("_", " ") ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Additional Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Created On
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {currentPurchase.createdAt
                          ? new Date(
                              currentPurchase.createdAt
                            ).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items list */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Purchased Items
              </h3>
              <div className="border dark:border-gray-700 rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentPurchase.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {getProductName(item.productId)}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300"
                      >
                        Total:
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-gray-900 dark:text-white">
                        {formatCurrency(currentPurchase.totalAmount || 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes */}
            {currentPurchase.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Notes
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm text-gray-700 dark:text-gray-300">
                  {currentPurchase.notes}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(currentPurchase);
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

      {/* Edit Purchase Modal - Similar to Add but with prefilled data */}
      <ModalReusable
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Purchase Order"
        icon={Edit}
        size="lg"
      >
        <div className="space-y-4">
          {/* Same form fields as Add Modal but prefilled with currentPurchase data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice Number*
              </label>
              <Input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                placeholder="INV-001"
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Supplier*
              </label>
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id.toString()}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Purchase Date*
              </label>
              <Input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Delivery Date
              </label>
              <Input
                type="date"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Status
              </label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="cancelled">Cancelled</option>
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
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Purchase Items*
            </label>
            <div className="border dark:border-gray-700 rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Unit Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-10">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <select
                          value={item.productId}
                          onChange={(e) =>
                            handleItemChange(index, "productId", e.target.value)
                          }
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                          required
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          className="w-full"
                          min="1"
                          step="1"
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                            $
                          </span>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "unitPrice",
                                e.target.value
                              )
                            }
                            className="w-full pl-6"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {formatCurrency(
                          (item.quantity || 0) * (item.unitPrice || 0)
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={addItemRow}
              className="mt-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
            >
              <Plus size={14} className="mr-1" /> Add Item
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Amount:
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(formData.totalAmount)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional information about this purchase..."
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
              onClick={handleUpdatePurchase}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={
                !formData.invoiceNumber ||
                !formData.supplierId ||
                !formData.purchaseDate
              }
            >
              Update Purchase
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        entityType="Purchase Order"
        entityName={currentPurchase?.invoiceNumber}
        onConfirm={handleDeletePurchase}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Purchases;

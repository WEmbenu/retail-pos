// src/pages/customers/Customers.jsx
import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  DollarSign,
  Filter,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import { motion } from "framer-motion";

// Dummy data service - replace with API calls later
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/dataService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [filterStatus, setFilterStatus] = useState("all");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
      enqueueSnackbar("Failed to load customers", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (customer) => {
    setCurrentCustomer(customer);
    setFormData({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      notes: customer.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (customer) => {
    setCurrentCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleAddCustomer = async () => {
    try {
      const newCustomer = await addCustomer({
        ...formData,
        createdAt: new Date().toISOString(),
        totalSpent: 0,
        lastPurchase: null,
        purchaseCount: 0,
        status: "active",
      });

      setCustomers((prev) => [...prev, newCustomer]);
      setIsAddModalOpen(false);
      resetForm();
      enqueueSnackbar("Customer added successfully", { variant: "success" });
    } catch (error) {
      console.error("Error adding customer:", error);
      enqueueSnackbar("Failed to add customer", { variant: "error" });
    }
  };

  const handleUpdateCustomer = async () => {
    if (!currentCustomer) return;

    try {
      const updatedCustomer = await updateCustomer(currentCustomer.id, {
        ...currentCustomer,
        ...formData,
      });

      setCustomers((prev) =>
        prev.map((cust) =>
          cust.id === updatedCustomer.id ? updatedCustomer : cust
        )
      );

      setIsEditModalOpen(false);
      enqueueSnackbar("Customer updated successfully", { variant: "success" });
    } catch (error) {
      console.error("Error updating customer:", error);
      enqueueSnackbar("Failed to update customer", { variant: "error" });
    }
  };

  const handleDeleteCustomer = async () => {
    if (!currentCustomer) return;

    try {
      await deleteCustomer(currentCustomer.id);
      setCustomers((prev) =>
        prev.filter((cust) => cust.id !== currentCustomer.id)
      );
      setIsDeleteModalOpen(false);
      enqueueSnackbar("Customer deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      enqueueSnackbar("Failed to delete customer", { variant: "error" });
      throw error; // Rethrow to be caught by the DeleteConfirmationModal
    }
  };

  // Table configuration
  const tableFields = [
    {
      name: "fullName",
      title: "Customer Name",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="bg-primary-100 p-1 rounded-full mr-2">
            <User size={16} className="text-primary-700" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      name: "phone",
      title: "Phone",
      render: (value) => (
        <div className="flex items-center">
          <Phone size={14} className="mr-1 text-gray-400" />
          {value || "—"}
        </div>
      ),
    },
    {
      name: "address",
      title: "Address",
      render: (value) => (
        <div className="flex items-center">
          <MapPin size={14} className="mr-1 text-gray-400 flex-shrink-0" />
          {value || "—"}
        </div>
      ),
    },
    {
      name: "totalSpent",
      title: "Total Spent",
      render: (value) => (
        <div className="flex items-center font-medium">
          <DollarSign size={14} className="mr-1 text-gray-400" />
          {typeof value === "number" ? value.toFixed(2) : "0.00"}
        </div>
      ),
    },
    {
      name: "lastPurchase",
      title: "Last Purchase",
      render: (value) => (
        <div className="flex items-center">
          <Clock size={14} className="mr-1 text-gray-400" />
          {value ? new Date(value).toLocaleDateString() : "Never"}
        </div>
      ),
    },
    {
      name: "purchaseCount",
      title: "Orders",
      render: (value) => (
        <div className="flex items-center">
          <FileText size={14} className="mr-1 text-gray-400" />
          {value || 0}
        </div>
      ),
    },
    {
      name: "status",
      title: "Status",
      render: (value) => {
        const statusStyles = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          vip: "bg-purple-100 text-purple-800",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              statusStyles[value] || "bg-gray-100"
            }`}
          >
            {value || "unknown"}
          </span>
        );
      },
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
        className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded flex items-center text-sm"
      >
        <UserPlus size={16} className="mr-1" />
        Add Customer
      </button>

      <div className="flex-grow"></div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-8 pr-2 py-1.5 border rounded text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="vip">VIP</option>
          </select>
          <Filter
            size={14}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>

        <button
          onClick={loadCustomers}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>

        <button
          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
          title="Export customers"
        >
          <Download size={14} />
        </button>

        <button
          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
          title="Import customers"
        >
          <Upload size={14} />
        </button>
      </div>
    </div>
  );

  // Filter customers based on selected status
  const filteredCustomers =
    filterStatus === "all"
      ? customers
      : customers.filter((customer) => customer.status === filterStatus);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-600">Manage your customer database</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <JTable
          title="Customer Directory"
          data={filteredCustomers}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No customers found. Add your first customer to get started."
        />
      </div>

      {/* Add Customer Modal */}
      <ModalReusable
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main St, City, Country"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional information about this customer..."
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCustomer}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              disabled={!formData.fullName}
            >
              Add Customer
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Edit Customer Modal */}
      <ModalReusable
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main St, City, Country"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional information about this customer..."
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateCustomer}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              disabled={!formData.fullName}
            >
              Update Customer
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        entityType="Customer"
        entityName={currentCustomer?.fullName}
        onConfirm={handleDeleteCustomer}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Customers;

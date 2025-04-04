import React, { useState, useEffect } from "react";
import {
  TruckIcon,
  Search,
  Edit,
  Trash2,
  Building,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  FileText,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Plus,
  ShieldCheck,
  AlertTriangle,
  X,
  Package,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

// Dummy data service - replace with actual API calls later
import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../services/dataService";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSupplierDetailModalOpen, setIsSupplierDetailModalOpen] =
    useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    category: "general",
    website: "",
    taxId: "",
    notes: "",
  });
  const [filterCategory, setFilterCategory] = useState("all");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Error loading suppliers:", error);
      enqueueSnackbar("Failed to load suppliers", { variant: "error" });
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
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      category: "general",
      website: "",
      taxId: "",
      notes: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setCurrentSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      category: supplier.category || "general",
      website: supplier.website || "",
      taxId: supplier.taxId || "",
      notes: supplier.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (supplier) => {
    setCurrentSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const openDetailModal = (supplier) => {
    setCurrentSupplier(supplier);
    setIsSupplierDetailModalOpen(true);
  };

  const handleAddSupplier = async () => {
    try {
      const newSupplier = await addSupplier({
        ...formData,
        createdAt: new Date().toISOString(),
        qualityRating: 5, // Default rating
        lastOrderDate: null,
        productsCount: 0,
        status: "active",
      });

      setSuppliers((prev) => [...prev, newSupplier]);
      setIsAddModalOpen(false);
      resetForm();
      enqueueSnackbar("Supplier added successfully", { variant: "success" });
    } catch (error) {
      console.error("Error adding supplier:", error);
      enqueueSnackbar("Failed to add supplier", { variant: "error" });
    }
  };

  const handleUpdateSupplier = async () => {
    if (!currentSupplier) return;

    try {
      const updatedSupplier = await updateSupplier(currentSupplier.id, {
        ...currentSupplier,
        ...formData,
      });

      setSuppliers((prev) =>
        prev.map((sup) =>
          sup.id === updatedSupplier.id ? updatedSupplier : sup
        )
      );

      setIsEditModalOpen(false);
      enqueueSnackbar("Supplier updated successfully", { variant: "success" });
    } catch (error) {
      console.error("Error updating supplier:", error);
      enqueueSnackbar("Failed to update supplier", { variant: "error" });
    }
  };

  const handleDeleteSupplier = async () => {
    if (!currentSupplier) return;

    try {
      await deleteSupplier(currentSupplier.id);
      setSuppliers((prev) =>
        prev.filter((sup) => sup.id !== currentSupplier.id)
      );
      setIsDeleteModalOpen(false);
      enqueueSnackbar("Supplier deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting supplier:", error);
      enqueueSnackbar("Failed to delete supplier", { variant: "error" });
      throw error; // Rethrow to be caught by the DeleteConfirmationModal
    }
  };

  // Render star rating
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
          {rating}/5
        </span>
      </div>
    );
  };

  // Table configuration
  const tableFields = [
    {
      name: "name",
      title: "Supplier",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-full mr-2">
            <Building
              size={16}
              className="text-primary-700 dark:text-primary-400"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.category || "General"}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "contactPerson",
      title: "Contact Person",
      render: (value) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {value || "—"}
        </div>
      ),
    },
    {
      name: "phone",
      title: "Phone",
      render: (value) => (
        <div className="flex items-center">
          <Phone size={14} className="mr-1 text-gray-400 dark:text-gray-500" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {value || "—"}
          </div>
        </div>
      ),
    },
    {
      name: "email",
      title: "Email",
      render: (value) => (
        <div className="flex items-center">
          <Mail size={14} className="mr-1 text-gray-400 dark:text-gray-500" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {value || "—"}
          </div>
        </div>
      ),
    },
    {
      name: "qualityRating",
      title: "Rating",
      render: (value) => <StarRating rating={value || 0} />,
    },
    {
      name: "productsCount",
      title: "Products",
      render: (value) => (
        <div className="flex items-center">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      name: "lastOrderDate",
      title: "Last Order",
      render: (value) => (
        <div className="flex items-center">
          <Clock size={14} className="mr-1 text-gray-400 dark:text-gray-500" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {value ? new Date(value).toLocaleDateString() : "Never"}
          </div>
        </div>
      ),
    },
    {
      name: "status",
      title: "Status",
      render: (value) => {
        const statusStyles = {
          active:
            "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
          inactive:
            "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400",
          pending:
            "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
          blacklisted:
            "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              statusStyles[value] || "bg-gray-100 dark:bg-gray-700"
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
              openDetailModal(row);
            }}
            className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <FileText size={16} />
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

  // Custom header component for the JTable
  const TableHeader = () => (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <button
        onClick={openAddModal}
        className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white px-3 py-1.5 rounded flex items-center text-sm"
      >
        <Plus size={16} className="mr-1" />
        Add Supplier
      </button>

      <div className="flex-grow"></div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-8 pr-2 py-1.5 border dark:border-gray-600 rounded text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="electronics">Electronics</option>
            <option value="food">Food & Beverages</option>
            <option value="clothing">Clothing</option>
            <option value="furniture">Furniture</option>
          </select>
          <Filter
            size={14}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
        </div>

        <button
          onClick={loadSuppliers}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>

        <button
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Export suppliers"
        >
          <Download size={14} />
        </button>

        <button
          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
          title="Import suppliers"
        >
          <Upload size={14} />
        </button>
      </div>
    </div>
  );

  // Filter suppliers based on selected category
  const filteredSuppliers =
    filterCategory === "all"
      ? suppliers
      : suppliers.filter((supplier) => supplier.category === filterCategory);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <TruckIcon className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
          Suppliers
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your suppliers and track their performance
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Suppliers
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {suppliers.length}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <Building size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Suppliers
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {
                  suppliers.filter((supplier) => supplier.status === "active")
                    .length
                }
              </h3>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                {suppliers.length > 0
                  ? `${Math.round(
                      (suppliers.filter(
                        (supplier) => supplier.status === "active"
                      ).length /
                        suppliers.length) *
                        100
                    )}% of suppliers`
                  : "0% of suppliers"}
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Quality Issues
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                {
                  suppliers.filter((supplier) => supplier.qualityRating < 3)
                    .length
                }
              </h3>
              <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">
                Suppliers with low quality ratings
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <JTable
          title="Supplier Directory"
          data={filteredSuppliers}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No suppliers found. Add your first supplier to get started."
        />
      </div>

      {/* Add Supplier Modal */}
      <ModalReusable
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Supplier"
        icon={Plus}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Supplier Name*
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="ABC Supplies Inc."
              className="w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Person
              </label>
              <Input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              >
                <option value="general">General</option>
                <option value="electronics">Electronics</option>
                <option value="food">Food & Beverages</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contact@example.com"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Business St, City, Country"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <Input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="www.example.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tax ID / VAT
              </label>
              <Input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                placeholder="Tax ID Number"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional information about this supplier..."
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
              onClick={handleAddSupplier}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={!formData.name}
            >
              Add Supplier
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Edit Supplier Modal */}
      <ModalReusable
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Supplier"
        icon={Edit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Supplier Name*
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="ABC Supplies Inc."
              className="w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Person
              </label>
              <Input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              >
                <option value="general">General</option>
                <option value="electronics">Electronics</option>
                <option value="food">Food & Beverages</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contact@example.com"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Business St, City, Country"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <Input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="www.example.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tax ID / VAT
              </label>
              <Input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                placeholder="Tax ID Number"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional information about this supplier..."
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
              onClick={handleUpdateSupplier}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
              disabled={!formData.name}
            >
              Update Supplier
            </button>
          </div>
        </div>
      </ModalReusable>

      {/* Supplier Detail Modal */}
      <ModalReusable
        isOpen={isSupplierDetailModalOpen}
        onClose={() => setIsSupplierDetailModalOpen(false)}
        title="Supplier Details"
        icon={Building}
        size="lg"
      >
        {currentSupplier && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Supplier Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {currentSupplier.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Contact Person
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {currentSupplier.contactPerson || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Category
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {currentSupplier.category || "General"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {currentSupplier.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {currentSupplier.email || "—"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Address
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {currentSupplier.address || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Website
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {currentSupplier.website ? (
                        <a
                          href={
                            currentSupplier.website.startsWith("http")
                              ? currentSupplier.website
                              : `https://${currentSupplier.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {currentSupplier.website}
                        </a>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tax ID / VAT
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {currentSupplier.taxId || "—"}
                    </p>
                  </div>
                </div>
                {currentSupplier.notes && (
                  <div className="mt-4 border-t dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Notes
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                      {currentSupplier.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Recent Products */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Latest Products
                  </h3>
                  <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    View All
                  </button>
                </div>
                {currentSupplier.productsCount > 0 ? (
                  <div className="space-y-3">
                    {currentSupplier.products ? (
                      currentSupplier.products
                        .slice(0, 5)
                        .map((product, index) => (
                          <div
                            key={index}
                            className="border dark:border-gray-700 rounded p-2 flex items-center"
                          >
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                              <Package
                                size={16}
                                className="text-gray-500 dark:text-gray-400"
                              />
                            </div>
                            <div className="ml-3 flex-grow">
                              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SKU: {product.sku || "N/A"}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              ${product.price?.toFixed(2) || "—"}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-4">
                        <Package
                          size={24}
                          className="mx-auto text-gray-400 dark:text-gray-600 mb-2"
                        />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Product details not available
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Package
                      size={24}
                      className="mx-auto text-gray-400 dark:text-gray-600 mb-2"
                    />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No products associated with this supplier
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Supplier Stats */}
            <div className="space-y-6">
              {/* Quality Rating */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Quality Rating
                </h3>
                <div className="flex items-center mb-3">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {currentSupplier.qualityRating || 0}
                  </div>
                  <div className="text-xl text-gray-500 dark:text-gray-400 ml-1">
                    /5
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className={
                        i < currentSupplier.qualityRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Based on product quality, reliability, and overall
                  satisfaction
                </div>
              </div>

              {/* Supplier Status */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Status Information
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${
                      {
                        active:
                          "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
                        inactive:
                          "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400",
                        pending:
                          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
                        blacklisted:
                          "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
                      }[currentSupplier.status] ||
                      "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {currentSupplier.status || "unknown"}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Created On
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {currentSupplier.createdAt
                        ? new Date(
                            currentSupplier.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Last Order
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {currentSupplier.lastOrderDate
                        ? new Date(
                            currentSupplier.lastOrderDate
                          ).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total Products
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {currentSupplier.productsCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsSupplierDetailModalOpen(false);
                      openEditModal(currentSupplier);
                    }}
                    className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-md flex items-center justify-center"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Supplier
                  </button>
                  <button className="w-full py-2 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md flex items-center justify-center">
                    <Plus size={16} className="mr-2" />
                    Add Product
                  </button>
                  <button className="w-full py-2 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md flex items-center justify-center">
                    <FileText size={16} className="mr-2" />
                    Purchase History
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setIsSupplierDetailModalOpen(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </ModalReusable>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        entityType="Supplier"
        entityName={currentSupplier?.name}
        onConfirm={handleDeleteSupplier}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Suppliers;

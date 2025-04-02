// src/pages/reports/InventoryReport.jsx
import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  RefreshCw,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  PieChart,
  ArrowDown,
  ArrowUp,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import JTable from "../../components/tables/JTable";
import { Input } from "../../components/ui/input";
import { useSnackbar } from "notistack";

// Dummy data service
import { getInventoryReport } from "../../services/dummyData";

const InventoryReport = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("stock_level");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    setLoading(true);
    try {
      const data = await getInventoryReport();
      setInventory(data.products);
    } catch (error) {
      console.error("Error loading inventory data:", error);
      enqueueSnackbar("Failed to load inventory report", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Status indicator component
  const StockStatus = ({ status, level }) => {
    const styles = {
      outOfStock: "bg-red-100 text-red-800",
      low: "bg-orange-100 text-orange-800",
      optimal: "bg-green-100 text-green-800",
      overstock: "bg-blue-100 text-blue-800",
    };

    const icons = {
      outOfStock: <AlertTriangle size={14} className="mr-1" />,
      low: <AlertTriangle size={14} className="mr-1" />,
      optimal: <CheckCircle size={14} className="mr-1" />,
      overstock: <AlertTriangle size={14} className="mr-1" />,
    };

    const labels = {
      outOfStock: "Out of Stock",
      low: "Low Stock",
      optimal: "Optimal",
      overstock: "Overstock",
    };

    return (
      <div className="flex flex-col">
        <span
          className={`px-2 py-1 rounded-full text-xs flex items-center w-fit ${styles[status]}`}
        >
          {icons[status]}
          {labels[status]}
        </span>
        <span className="text-xs text-gray-500 mt-1">
          {level} {level === 1 ? "unit" : "units"} in stock
        </span>
      </div>
    );
  };

  // Trend indicator component
  const TrendIndicator = ({ value, isPercentage = false }) => {
    if (value === 0) {
      return <span className="text-gray-500 text-xs">No change</span>;
    }

    const isPositive = value > 0;
    const formattedValue = isPercentage
      ? `${isPositive ? "+" : ""}${value.toFixed(1)}%`
      : `${isPositive ? "+" : ""}${value}`;

    return (
      <div
        className={`flex items-center ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? (
          <TrendingUp size={14} className="mr-1" />
        ) : (
          <TrendingDown size={14} className="mr-1" />
        )}
        <span className="text-xs font-medium">{formattedValue}</span>
      </div>
    );
  };

  // Table configuration
  const tableFields = [
    {
      name: "name",
      title: "Product",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="bg-primary-100 p-1 rounded-full mr-2">
            <Package size={16} className="text-primary-700" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">SKU: {row.sku}</div>
          </div>
        </div>
      ),
    },
    {
      name: "category",
      title: "Category",
      render: (value) => <div className="text-sm">{value}</div>,
    },
    {
      name: "stockLevel",
      title: "Stock Level",
      render: (value, row) => (
        <StockStatus status={row.stockStatus} level={value} />
      ),
    },
    {
      name: "reorderPoint",
      title: "Reorder Point",
      render: (value) => <div className="text-sm">{value}</div>,
    },
    {
      name: "costPrice",
      title: "Cost Price",
      render: (value) => (
        <div className="text-sm font-medium">{formatCurrency(value)}</div>
      ),
    },
    {
      name: "sellingPrice",
      title: "Selling Price",
      render: (value) => (
        <div className="text-sm font-medium">{formatCurrency(value)}</div>
      ),
    },
    {
      name: "stockValue",
      title: "Stock Value",
      render: (value) => (
        <div className="text-sm font-medium">{formatCurrency(value)}</div>
      ),
    },
    {
      name: "monthlySales",
      title: "Monthly Sales",
      render: (value, row) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium">{value} units</div>
          <TrendIndicator value={row.salesTrend} isPercentage={true} />
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-8 pr-2 py-1.5 border rounded text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Products</option>
            <option value="outOfStock">Out of Stock</option>
            <option value="low">Low Stock</option>
            <option value="optimal">Optimal</option>
            <option value="overstock">Overstock</option>
          </select>
          <Filter
            size={14}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="pl-8 pr-2 py-1.5 border rounded text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="stock_level">Sort by Stock Level</option>
            <option value="value">Sort by Stock Value</option>
            <option value="sales">Sort by Monthly Sales</option>
          </select>
          <ArrowDown
            size={14}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <div className="flex-grow"></div>

      <div className="flex items-center space-x-2">
        <button
          onClick={loadInventoryData}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
          title="Refresh data"
        >
          <RefreshCw size={14} />
        </button>

        <button
          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
          title="Export inventory"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  );

  // Filter and sort inventory data
  const processedInventory = inventory
    .filter(
      (item) => filterStatus === "all" || item.stockStatus === filterStatus
    )
    .sort((a, b) => {
      if (sortOption === "stock_level") {
        return a.stockLevel - b.stockLevel;
      } else if (sortOption === "value") {
        return b.stockValue - a.stockValue;
      } else if (sortOption === "sales") {
        return b.monthlySales - a.monthlySales;
      }
      return 0;
    });

  // Calculate inventory summary
  const calculateSummary = () => {
    const totalProducts = inventory.length;
    const outOfStock = inventory.filter(
      (item) => item.stockStatus === "outOfStock"
    ).length;
    const lowStock = inventory.filter(
      (item) => item.stockStatus === "low"
    ).length;
    const totalValue = inventory.reduce(
      (sum, item) => sum + item.stockValue,
      0
    );

    return { totalProducts, outOfStock, lowStock, totalValue };
  };

  const summary = calculateSummary();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Report</h1>
        <p className="text-gray-600">
          Monitor stock levels and inventory valuation
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {summary.totalProducts}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-blue-50 text-blue-500">
              <Package size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Out of Stock</p>
              <h3 className="text-2xl font-bold mt-1">{summary.outOfStock}</h3>
              <p className="text-xs text-red-500 mt-1">
                {((summary.outOfStock / summary.totalProducts) * 100).toFixed(
                  1
                )}
                % of products
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <h3 className="text-2xl font-bold mt-1">{summary.lowStock}</h3>
              <p className="text-xs text-orange-500 mt-1">
                Need attention soon
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-orange-50 text-orange-500">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Stock Value
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {formatCurrency(summary.totalValue)}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-green-50 text-green-500">
              <PieChart size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <JTable
          title="Inventory Status"
          data={processedInventory}
          fields={tableFields}
          loading={loading}
          headerComponent={TableHeader}
          emptyStateMessage="No inventory data found."
        />
      </div>
    </div>
  );
};

export default InventoryReport;

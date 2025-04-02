// src/pages/reports/SalesReport.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  BarChart2,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { useSnackbar } from "notistack";

// Dummy data service - replace with API calls later
import { getSalesReport } from "../../services/dummyData";

const SalesReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split("T")[0], // First day of current month
    end: new Date().toISOString().split("T")[0], // Today
  });
  const [reportPeriod, setReportPeriod] = useState("daily");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadReportData();
  }, [dateRange, reportPeriod]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const data = await getSalesReport({
        startDate: dateRange.start,
        endDate: dateRange.end,
        period: reportPeriod,
      });
      setReportData(data);
    } catch (error) {
      console.error("Error loading sales report:", error);
      enqueueSnackbar("Failed to load sales report", { variant: "error" });
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

  // Format percentage
  const formatPercent = (value) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  // Calculate percentage change
  const percentChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Render summary card
  const SummaryCard = ({
    title,
    value,
    previousValue,
    icon: Icon,
    prefix = "",
    suffix = "",
  }) => {
    const change =
      previousValue !== null ? percentChange(value, previousValue) : null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : value}
              {suffix}
            </h3>

            {change !== null && (
              <div className="flex items-center mt-2">
                {change > 0 ? (
                  <TrendingUp size={16} className="text-green-500 mr-1" />
                ) : change < 0 ? (
                  <TrendingDown size={16} className="text-red-500 mr-1" />
                ) : (
                  <div className="w-4 mr-1" />
                )}
                <span
                  className={`text-xs font-medium ${
                    change > 0
                      ? "text-green-500"
                      : change < 0
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {formatPercent(change)} vs previous
                </span>
              </div>
            )}
          </div>
          <div className="p-2.5 rounded-full bg-primary-50 text-primary-500">
            <Icon size={20} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
        <p className="text-gray-600">View and analyze your sales performance</p>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Date Range:
            </label>
            <div className="flex items-center space-x-2">
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Group By:
            </label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="border rounded py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadReportData}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded flex items-center"
              title="Refresh report"
            >
              <RefreshCw size={14} className="mr-1" />
              <span className="text-sm">Refresh</span>
            </button>

            <button
              className="p-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded flex items-center"
              title="Export report"
            >
              <Download size={14} className="mr-1" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : reportData ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              title="Total Revenue"
              value={reportData.totalRevenue}
              previousValue={reportData.previousRevenue}
              icon={DollarSign}
              prefix={formatCurrency(0).charAt(0)}
            />
            <SummaryCard
              title="Total Orders"
              value={reportData.totalOrders}
              previousValue={reportData.previousOrders}
              icon={ShoppingBag}
            />
            <SummaryCard
              title="Average Order Value"
              value={reportData.avgOrderValue}
              previousValue={reportData.previousAvgOrderValue}
              icon={CreditCard}
              prefix={formatCurrency(0).charAt(0)}
            />
            <SummaryCard
              title="New Customers"
              value={reportData.newCustomers}
              previousValue={reportData.previousNewCustomers}
              icon={Users}
            />
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sales Trend</h2>
              <div className="flex items-center text-xs text-gray-500">
                <div className="flex items-center mr-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-full mr-1"></div>
                  <span>Revenue</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-300 rounded-full mr-1"></div>
                  <span>Orders</span>
                </div>
              </div>
            </div>

            {/* This is where we would render a chart using a library like recharts */}
            <div className="h-80 w-full flex items-center justify-center bg-gray-50 rounded">
              <BarChart2 size={48} className="text-gray-300" />
              <span className="ml-2 text-gray-400">
                Chart visualization would go here
              </span>
            </div>
          </div>

          {/* Sales by Product Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
              <div className="space-y-3">
                {reportData.salesByCategory.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(category.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold mb-4">
                Top Selling Products
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units Sold
                      </th>
                      <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topProducts.map((product, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 text-sm">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-gray-500">
                            {product.sku}
                          </div>
                        </td>
                        <td className="py-3 text-sm text-center">
                          {product.unitsSold}
                        </td>
                        <td className="py-3 text-sm font-medium text-right">
                          {formatCurrency(product.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Methods & Sales by Time */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reportData.paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mr-3">
                      <CreditCard size={20} className="text-primary-500" />
                    </div>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-500">
                        {method.percentage}% of sales
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold mb-4">
                Sales by Time of Day
              </h2>
              {/* This would be another chart visualization */}
              <div className="h-48 w-full flex items-center justify-center bg-gray-50 rounded">
                <BarChart2 size={32} className="text-gray-300" />
                <span className="ml-2 text-gray-400">
                  Time distribution chart would go here
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500">
            No data available for the selected period.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try selecting a different date range or refreshing the report.
          </p>
        </div>
      )}
    </div>
  );
};

export default SalesReport;

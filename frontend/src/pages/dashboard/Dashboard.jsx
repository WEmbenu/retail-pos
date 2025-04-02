import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  BarChart2,
  Calendar,
  Settings,
} from "lucide-react";
import { dashboardSummary } from "../../services/dummyData";
import DashboardSettings from "./DashboardSettings";
import { useSnackbar } from "notistack";

// Status Card Component
const StatusCard = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </h3>
          {trend && (
            <p
              className={`text-xs ${
                trend > 0 ? "text-green-500" : "text-red-500"
              } mt-1 flex items-center`}
            >
              {trend > 0 ? "+" : ""}
              {trend}%
              <TrendingUp size={12} className="ml-1" />
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${color} bg-opacity-10 dark:bg-opacity-20`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

// Bar Chart Component
const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.percentage));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Sales by Category
        </h3>
        <BarChart2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {item.category}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                ${item.sales.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-primary-600 dark:bg-primary-400 h-2.5 rounded-full"
                style={{ width: `${(item.percentage / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent Transactions Component
const RecentTransactions = ({ transactions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <ShoppingCart className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  #{transaction.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                  {transaction.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Popular Products Component
const PopularProducts = ({ products }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Popular Products
        </h3>
        <Package className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Sales
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                  {product.sales} units
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                  ${product.revenue.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Date Time Display Component
const DateTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Date & Time
        </h3>
        <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatTime(currentTime)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {formatDate(currentTime)}
        </p>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Default dashboard configuration - all widgets visible initially
  const [dashboardConfig, setDashboardConfig] = useState(() => {
    // Check if we have saved settings in localStorage
    const savedConfig = localStorage.getItem("dashboardConfig");
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (e) {
        console.error("Error parsing saved dashboard config:", e);
      }
    }

    // Default configuration if nothing is saved
    return {
      general: {
        statusCards: true,
        weeklyChart: true,
        recentTransactions: true,
        popularProducts: true,
        dateTimeDisplay: true,
        salesByCategory: true,
      },
      widgetOrder: {
        general: [
          "statusCards",
          "weeklyChart",
          "recentTransactions",
          "popularProducts",
          "dateTimeDisplay",
          "salesByCategory",
        ],
      },
    };
  });

  // Function to check if a widget should be visible
  const isWidgetVisible = (widgetId) => {
    return dashboardConfig.general[widgetId] !== false; // Default to true if not specified
  };

  // Function to handle saving dashboard settings
  const handleSaveSettings = (newSettings) => {
    setDashboardConfig(newSettings);
    // Save to localStorage for persistence
    localStorage.setItem("dashboardConfig", JSON.stringify(newSettings));
    enqueueSnackbar("Dashboard customization saved successfully", {
      variant: "success",
    });
  };

  // Function to render widgets in the correct order
  const renderWidgets = () => {
    const widgetOrder = dashboardConfig?.widgetOrder?.general || [];

    // Map of widget IDs to their components
    const widgetComponents = {
      statusCards: isWidgetVisible("statusCards") && (
        <div
          key="statusCards"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <StatusCard
            title="Today Sales"
            value={`$${dashboardSummary.todaySales.toLocaleString()}`}
            icon={DollarSign}
            trend={5.2}
            color="text-green-500"
          />
          <StatusCard
            title="Weekly Sales"
            value={`$${dashboardSummary.weekSales.toLocaleString()}`}
            icon={TrendingUp}
            trend={3.1}
            color="text-blue-500"
          />
          <StatusCard
            title="Total Transactions"
            value={dashboardSummary.todayTransactions}
            icon={ShoppingCart}
            trend={1.8}
            color="text-purple-500"
          />
          <StatusCard
            title="Inventory Value"
            value={`$${dashboardSummary.inventoryValue.toLocaleString()}`}
            icon={Package}
            trend={-0.5}
            color="text-orange-500"
          />
        </div>
      ),
      weeklyChart: isWidgetVisible("weeklyChart") && (
        <div key="weeklyChart" className="mb-6">
          <BarChart data={dashboardSummary.salesByCategory} />
        </div>
      ),
      recentTransactions: isWidgetVisible("recentTransactions") && (
        <div key="recentTransactions" className="mb-6">
          <RecentTransactions
            transactions={dashboardSummary.recentTransactions}
          />
        </div>
      ),
      popularProducts: isWidgetVisible("popularProducts") && (
        <div key="popularProducts" className="mb-6">
          <PopularProducts products={dashboardSummary.popularProducts} />
        </div>
      ),
      dateTimeDisplay: isWidgetVisible("dateTimeDisplay") && (
        <div key="dateTimeDisplay" className="mb-6">
          <DateTimeDisplay />
        </div>
      ),
      salesByCategory: isWidgetVisible("salesByCategory") && (
        <div key="salesByCategory" className="mb-6">
          <BarChart data={dashboardSummary.salesByCategory} />
        </div>
      ),
    };

    // Return widgets in order, filtering out any that aren't visible
    return widgetOrder
      .map((widgetId) => widgetComponents[widgetId])
      .filter(Boolean);
  };

  return (
    <div>
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back to your retail POS system
          </p>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800/50 flex items-center gap-2"
        >
          <Settings size={16} />
          <span className="hidden sm:inline">Customize</span>
        </button>
      </div>

      {/* Dashboard Content */}
      <div>{renderWidgets()}</div>

      {/* Dashboard Settings Modal */}
      <DashboardSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={dashboardConfig}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default Dashboard;

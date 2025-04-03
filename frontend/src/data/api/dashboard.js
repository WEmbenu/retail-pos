import { asyncResponse } from "../utils";
import { dashboardSummary } from "../mock/dashboard";
import { transactions } from "../mock/transactions";
import { products } from "../mock/products";
import { categories } from "../mock/products";
import { expenses } from "../mock/expenses";

/**
 * Get dashboard summary data
 * @returns {Promise<Object>} - Dashboard summary data
 */
export const getDashboardSummary = async () => {
  return asyncResponse({ ...dashboardSummary });
};

/**
 * Get sales overview data
 * @param {string} period - Period type (day, week, month, year)
 * @returns {Promise<Object>} - Sales overview data
 */
export const getSalesOverview = async (period = "week") => {
  // In a real implementation, this would calculate sales data based on transactions
  // For mock purposes, we'll return some predefined data

  let salesData;
  switch (period) {
    case "day":
      salesData = {
        labels: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
        data: [350, 750, 1200, 850, 950, 1500, 750],
        total: 6350,
        average: 907.14,
        comparison: { value: 12.5, label: "vs. yesterday" },
      };
      break;
    case "week":
      salesData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [4200, 3800, 5100, 4700, 5900, 7500, 5300],
        total: 36500,
        average: 5214.29,
        comparison: { value: 8.2, label: "vs. last week" },
      };
      break;
    case "month":
      salesData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [36500, 42300, 38700, 45250],
        total: 162750,
        average: 40687.5,
        comparison: { value: 15.3, label: "vs. last month" },
      };
      break;
    case "year":
      salesData = {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        data: [
          120000, 135000, 128000, 142000, 150000, 162750, 0, 0, 0, 0, 0, 0,
        ],
        total: 837750,
        average: 139625,
        comparison: { value: 22.8, label: "vs. last year" },
      };
      break;
    default:
      salesData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [4200, 3800, 5100, 4700, 5900, 7500, 5300],
        total: 36500,
        average: 5214.29,
        comparison: { value: 8.2, label: "vs. last week" },
      };
  }

  return asyncResponse(salesData);
};

/**
 * Get inventory status data
 * @returns {Promise<Object>} - Inventory status data
 */
export const getInventoryStatus = async () => {
  // Calculate inventory statistics from products data
  const totalProducts = products.length;
  const lowStockThreshold = 10;
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity <= lowStockThreshold
  );
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0);

  const inventoryValue = products.reduce((sum, product) => {
    return sum + product.cost * product.stockQuantity;
  }, 0);

  const inventoryByCategoryData = categories.map((category) => {
    const categoryProducts = products.filter(
      (p) => p.categoryId === category.id
    );
    const categoryValue = categoryProducts.reduce((sum, product) => {
      return sum + product.cost * product.stockQuantity;
    }, 0);
    const itemCount = categoryProducts.length;

    return {
      category: category.name,
      value: categoryValue,
      count: itemCount,
      color: category.color,
    };
  });

  return asyncResponse({
    totalProducts,
    lowStockCount: lowStockProducts.length,
    outOfStockCount: outOfStockProducts.length,
    inventoryValue,
    inventoryByCategory: inventoryByCategoryData,
    lowStockItems: lowStockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stockQuantity,
      category:
        categories.find((c) => c.id === p.categoryId)?.name || "Uncategorized",
    })),
  });
};

/**
 * Get financial overview
 * @param {string} period - Period type (month, quarter, year)
 * @returns {Promise<Object>} - Financial overview data
 */
export const getFinancialOverview = async (period = "month") => {
  // In a real implementation, this would calculate from transactions and expenses
  // For mock purposes, we'll return some predefined data

  // Calculate revenue from transactions
  const allTransactionsTotal = transactions.reduce((sum, t) => {
    return t.status === "completed" ? sum + t.total : sum;
  }, 0);

  // Calculate expenses total
  const allExpensesTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate profit
  const profit = allTransactionsTotal - allExpensesTotal;
  const profitMargin = (profit / allTransactionsTotal) * 100;

  // Get expense breakdown by category
  const expenseBreakdown = {};
  expenses.forEach((expense) => {
    const categoryId = expense.categoryId;
    if (!expenseBreakdown[categoryId]) {
      expenseBreakdown[categoryId] = 0;
    }
    expenseBreakdown[categoryId] += expense.amount;
  });

  return asyncResponse({
    revenue: allTransactionsTotal,
    expenses: allExpensesTotal,
    profit,
    profitMargin,
    expenseBreakdown,
    period,
  });
};

/**
 * Get customer insights
 * @returns {Promise<Object>} - Customer insights data
 */
export const getCustomerInsights = async () => {
  // Calculate from transactions
  // For mock purposes, we'll return predefined data

  return asyncResponse({
    newCustomers: {
      count: 42,
      change: 12.5,
      period: "month",
    },
    repeatRate: {
      value: 68.3,
      change: 5.2,
      period: "month",
    },
    averageOrderValue: {
      value: 157.35,
      change: 3.8,
      period: "month",
    },
    customerRetention: {
      value: 73.2,
      change: 1.5,
      period: "month",
    },
    topCustomers: [
      { id: "cust-002", name: "Jane Smith", spent: 3567.25, orders: 15 },
      { id: "cust-005", name: "Michael Wilson", spent: 5678.9, orders: 20 },
      { id: "cust-004", name: "Emily Davis", spent: 2145.3, orders: 9 },
      { id: "cust-001", name: "John Doe", spent: 1245.75, orders: 8 },
      { id: "cust-003", name: "Robert Johnson", spent: 678.5, orders: 3 },
    ],
  });
};

/**
 * Get product performance metrics
 * @returns {Promise<Object>} - Product performance data
 */
export const getProductPerformance = async () => {
  // This would normally be calculated from transactions
  // For mock purposes, we'll return the popularProducts from dashboard summary

  return asyncResponse({
    topProducts: dashboardSummary.popularProducts,
    metrics: {
      totalSold: 420,
      averageRating: 4.2,
      returnRate: 3.5,
    },
  });
};

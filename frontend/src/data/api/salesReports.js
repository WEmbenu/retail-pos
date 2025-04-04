import { asyncResponse } from "../utils";
import { transactions } from "../mock/transactions";
import { salesReportData } from "../mock/sales-report";

/**
 * Get sales report data for specified date range and period
 * @param {Object} params - Query parameters
 * @param {string} params.startDate - Start date (ISO string)
 * @param {string} params.endDate - End date (ISO string)
 * @param {string} params.period - Report period (daily, weekly, monthly)
 * @returns {Promise<Object>} - Sales report data
 */
export const getSalesReport = async ({ startDate, endDate, period }) => {
  // In a real implementation, this would fetch data from an API
  // For mock purposes, we'll use the transactions data to generate some report metrics
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Filter transactions by date range
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate <= end;
  });

  // Get previous period for comparison
  const periodDuration = end.getTime() - start.getTime();
  const previousStart = new Date(start.getTime() - periodDuration);
  const previousEnd = new Date(start.getTime() - 1);

  // Filter transactions from previous period
  const previousTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= previousStart && transactionDate <= previousEnd;
  });

  // For simplicity in this mock implementation, we'll use the pre-generated mock data
  // and just adjust the totals based on the filtered transactions

  const reportData = { ...salesReportData };

  // Calculate actual totals based on filtered transactions
  reportData.totalRevenue = filteredTransactions.reduce(
    (sum, t) => sum + (t.status !== "refunded" ? t.total : 0),
    0
  );

  reportData.totalOrders = filteredTransactions.length;

  reportData.avgOrderValue =
    reportData.totalOrders > 0
      ? reportData.totalRevenue / reportData.totalOrders
      : 0;

  reportData.newCustomers = filteredTransactions.reduce((count, t) => {
    // Count unique customer IDs in the transactions
    if (t.customerDetails && t.customerDetails.id) {
      return count + 1;
    }
    return count;
  }, 0);

  // Previous period metrics for comparison
  reportData.previousRevenue = previousTransactions.reduce(
    (sum, t) => sum + (t.status !== "refunded" ? t.total : 0),
    0
  );

  reportData.previousOrders = previousTransactions.length;

  reportData.previousAvgOrderValue =
    reportData.previousOrders > 0
      ? reportData.previousRevenue / reportData.previousOrders
      : 0;

  reportData.previousNewCustomers = previousTransactions.reduce((count, t) => {
    if (t.customerDetails && t.customerDetails.id) {
      return count + 1;
    }
    return count;
  }, 0);

  // In a real implementation, the data would be aggregated according to the selected period
  // (daily, weekly, monthly) but for mock purposes we'll just use the same data

  return asyncResponse(reportData);
};

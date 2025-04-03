import { asyncResponse, generateId } from "../utils";
import { transactions } from "../mock/transactions";
import { customers } from "../mock/customers";
import { products } from "../mock/products";

/**
 * Get all transactions
 * @returns {Promise<Array>} - List of transactions
 */
export const getTransactions = async () => {
  return asyncResponse([...transactions]);
};

/**
 * Get transaction by ID
 * @param {number} id - Transaction ID
 * @returns {Promise<Object>} - Transaction data
 */
export const getTransactionById = async (id) => {
  const transaction = transactions.find((transaction) => transaction.id === id);
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  return asyncResponse({ ...transaction });
};

/**
 * Create new transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} - Created transaction
 */
export const createTransaction = async (transactionData) => {
  // Generate transaction ID with date in format TRX-YYYYMMDD-XXX
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");
  const transactionCount = transactions.length + 1;
  const transactionId = `TRX-${dateString}-${String(transactionCount).padStart(
    3,
    "0"
  )}`;

  const newTransaction = {
    id: generateId(),
    transactionId,
    date: date.toISOString(),
    status: "completed",
    ...transactionData,
  };

  transactions.push(newTransaction);

  // Update customer data if customer is registered
  if (transactionData.customerDetails && transactionData.customerDetails.id) {
    const customerIndex = customers.findIndex(
      (c) => c.id === transactionData.customerDetails.id
    );

    if (customerIndex !== -1) {
      customers[customerIndex].totalSpent += transactionData.total;
      customers[customerIndex].purchaseCount += 1;
      customers[customerIndex].lastPurchase = date.toISOString();
    }
  }

  // Update product stock
  if (transactionData.items && transactionData.items.length > 0) {
    transactionData.items.forEach((item) => {
      const productIndex = products.findIndex((p) => p.name === item.name);
      if (productIndex !== -1) {
        products[productIndex].stockQuantity -= item.quantity;
      }
    });
  }

  return asyncResponse(newTransaction);
};

/**
 * Update transaction status
 * @param {number} id - Transaction ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated transaction
 */
export const updateTransactionStatus = async (id, status) => {
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error("Transaction not found");
  }

  // If refunding a completed transaction, update product stock and customer data
  if (status === "refunded" && transactions[index].status === "completed") {
    // Update product stock
    if (transactions[index].items && transactions[index].items.length > 0) {
      transactions[index].items.forEach((item) => {
        const productIndex = products.findIndex((p) => p.name === item.name);
        if (productIndex !== -1) {
          products[productIndex].stockQuantity += item.quantity;
        }
      });
    }

    // Update customer data
    if (
      transactions[index].customerDetails &&
      transactions[index].customerDetails.id
    ) {
      const customerIndex = customers.findIndex(
        (c) => c.id === transactions[index].customerDetails.id
      );

      if (customerIndex !== -1) {
        customers[customerIndex].totalSpent -= transactions[index].total;

        // Don't decrement purchase count below 0
        if (customers[customerIndex].purchaseCount > 0) {
          customers[customerIndex].purchaseCount -= 1;
        }
      }
    }
  }

  transactions[index].status = status;
  return asyncResponse(transactions[index]);
};

/**
 * Get transactions by date range
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @returns {Promise<Array>} - List of transactions in date range
 */
export const getTransactionsByDateRange = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate <= end;
  });

  return asyncResponse(filteredTransactions);
};

/**
 * Get transactions by customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} - List of transactions for the customer
 */
export const getTransactionsByCustomer = async (customerId) => {
  const customerTransactions = transactions.filter(
    (t) => t.customerDetails && t.customerDetails.id === customerId
  );

  return asyncResponse(customerTransactions);
};

import { asyncResponse, generateId } from "../utils";
import { customers } from "../mock/customers";
import { customerDebts } from "../mock/expenses";

/**
 * Get all customers
 * @returns {Promise<Array>} - List of customers
 */
export const getCustomers = async () => {
  return asyncResponse([...customers]);
};

/**
 * Get customer by ID
 * @param {string} id - Customer ID
 * @returns {Promise<Object>} - Customer data
 */
export const getCustomerById = async (id) => {
  const customer = customers.find((customer) => customer.id === id);
  if (!customer) {
    throw new Error("Customer not found");
  }
  return asyncResponse({ ...customer });
};

/**
 * Add new customer
 * @param {Object} customerData - Customer data
 * @returns {Promise<Object>} - Created customer
 */
export const addCustomer = async (customerData) => {
  const customerCount = customers.length + 1;
  const newCustomer = {
    id: `cust-${String(customerCount).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
    totalSpent: 0,
    purchaseCount: 0,
    status: "active",
    ...customerData,
  };
  customers.push(newCustomer);
  return asyncResponse(newCustomer);
};

/**
 * Update customer
 * @param {string} id - Customer ID
 * @param {Object} customerData - Customer data to update
 * @returns {Promise<Object>} - Updated customer
 */
export const updateCustomer = async (id, customerData) => {
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Customer not found");
  }

  customers[index] = { ...customers[index], ...customerData };
  return asyncResponse(customers[index]);
};

/**
 * Delete customer
 * @param {string} id - Customer ID
 * @returns {Promise<Object>} - Success status
 */
export const deleteCustomer = async (id) => {
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Customer not found");
  }

  customers.splice(index, 1);
  return asyncResponse({ success: true });
};

/**
 * Search customers by name or email
 * @param {string} query - Search query
 * @returns {Promise<Array>} - List of matching customers
 */
export const searchCustomers = async (query) => {
  if (!query) return asyncResponse([]);

  const searchResults = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );
  return asyncResponse(searchResults);
};

/**
 * Get all customers with debts
 * @returns {Promise<Array>} - List of customers with debts
 */
export const getCustomersWithDebts = async () => {
  return asyncResponse([...customerDebts]);
};

/**
 * Add customer debt
 * @param {Object} debtData - Debt data
 * @returns {Promise<Object>} - Created debt
 */
export const addCustomerDebt = async (debtData) => {
  const newDebt = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    paidAmount: 0,
    remainingAmount: debtData.originalAmount,
    paymentStatus: "unpaid",
    payments: [],
    ...debtData,
  };
  customerDebts.push(newDebt);
  return asyncResponse(newDebt);
};

/**
 * Update customer debt
 * @param {number} id - Debt ID
 * @param {Object} debtData - Debt data to update
 * @returns {Promise<Object>} - Updated debt
 */
export const updateCustomerDebt = async (id, debtData) => {
  const index = customerDebts.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error("Customer debt not found");
  }

  customerDebts[index] = { ...customerDebts[index], ...debtData };
  return asyncResponse(customerDebts[index]);
};

/**
 * Delete customer debt
 * @param {number} id - Debt ID
 * @returns {Promise<Object>} - Success status
 */
export const deleteCustomerDebt = async (id) => {
  const index = customerDebts.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error("Customer debt not found");
  }

  customerDebts.splice(index, 1);
  return asyncResponse({ success: true });
};

/**
 * Add payment to customer debt
 * @param {number} id - Debt ID
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} - Updated debt
 */
export const addDebtPayment = async (id, paymentData) => {
  const index = customerDebts.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error("Customer debt not found");
  }

  // Add the payment to the payments array
  const payments = [...customerDebts[index].payments, paymentData.payment];

  // Update the debt record
  customerDebts[index] = {
    ...customerDebts[index],
    payments,
    paidAmount: paymentData.paidAmount,
    remainingAmount: paymentData.remainingAmount,
    paymentStatus: paymentData.paymentStatus,
  };

  return asyncResponse(customerDebts[index]);
};

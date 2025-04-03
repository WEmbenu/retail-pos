/**
 * Data Service
 *
 * This service acts as a bridge between React components and the data layer.
 * It imports API methods from the data module and exposes them to the application.
 *
 * When moving to production, this file can keep the same interface
 * but the implementations would connect to actual API endpoints
 * instead of mock data.
 */

// Import all API methods from the centralized data module
import {
  // Authentication
  login,
  logout,
  isAuthenticated,

  // Users and Roles
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getRoles,
  getPermissions,
  addRole,
  updateRole,
  deleteRole,

  // Products and Categories
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  searchProducts,
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,

  // Suppliers and Purchases
  getSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getPurchases,
  getPurchaseById,
  addPurchase,
  updatePurchase,
  deletePurchase,
  getPurchasesBySupplier,
  updateDeliveryStatus,
  updatePaymentStatus,

  // Expenses
  getExpenses,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseCategories,
  getExpenseCategoryById,
  addExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,

  // Customers
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  getCustomersWithDebts,
  addCustomerDebt,
  updateCustomerDebt,
  deleteCustomerDebt,
  addDebtPayment,

  // Transactions
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
  getTransactionsByDateRange,
  getTransactionsByCustomer,

  // Dashboard and Analytics
  getDashboardSummary,
  getSalesOverview,
  getInventoryStatus,
  getFinancialOverview,
  getCustomerInsights,
  getProductPerformance,
} from "../data";

// Re-export all methods to maintain the same interface
export {
  // Authentication
  login,
  logout,
  isAuthenticated,

  // Users and Roles
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getRoles,
  getPermissions,
  addRole,
  updateRole,
  deleteRole,

  // Products and Categories
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  searchProducts,
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,

  // Suppliers and Purchases
  getSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getPurchases,
  getPurchaseById,
  addPurchase,
  updatePurchase,
  deletePurchase,
  getPurchasesBySupplier,
  updateDeliveryStatus,
  updatePaymentStatus,

  // Expenses
  getExpenses,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseCategories,
  getExpenseCategoryById,
  addExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,

  // Customers
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  getCustomersWithDebts,
  addCustomerDebt,
  updateCustomerDebt,
  deleteCustomerDebt,
  addDebtPayment,

  // Transactions
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
  getTransactionsByDateRange,
  getTransactionsByCustomer,

  // Dashboard and Analytics
  getDashboardSummary,
  getSalesOverview,
  getInventoryStatus,
  getFinancialOverview,
  getCustomerInsights,
  getProductPerformance,
};

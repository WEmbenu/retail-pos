// /**
//  * Data Module
//  * Main entry point for data services
//  */

// // Export utility functions
// export * from "./utils";

// // Export API methods for application use
// export * from "./api";

// // In development mode, also export mock data directly
// // In production, these would be removed or hidden
// export * as mockData from "./mock";

/**
 * API Module
 * Exports all API functions
 */

// Export authentication-related API functions
export * from "./api/auth";

// Export user-related API functions
export * from "./api/users";

// Export product-related API functions
export * from "./api/products";

// Export category-related API functions
export * from "./api/categories";

// Export supplier-related API functions
export * from "./api/suppliers";

// Export purchase-related API functions
export * from "./api/purchases";

// Export expense-related API functions
export * from "./api/expenses";

// Export customer-related API functions
export * from "./api/customers";

// Export transaction-related API functions
export * from "./api/transactions";

// Export sales report API functions
export * from "./api/salesReports";

// Export dashboard and analytics API functions
export * from "./api/dashboard";

// Export Role API functions
export * from "./api/roles";

// Export inventory report API functions
export * from "./api/inventoryReports";

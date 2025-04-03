/**
 * Data Module
 * Main entry point for data services
 */

// Export utility functions
export * from "./utils";

// Export API methods for application use
export * from "./api";

// In development mode, also export mock data directly
// In production, these would be removed or hidden
export * as mockData from "./mock";

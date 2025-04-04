import { asyncResponse } from "../utils";
import { products } from "../mock/products";
import { inventoryReportData } from "../mock/inventoryReports";

/**
 * Get inventory report data
 * @returns {Promise<Object>} - Inventory report data
 */
export const getInventoryReport = async () => {
  // In a real implementation, this would fetch data from an API
  // For mock purposes, we'll use the products data to generate a report

  // Process products to determine stock status
  const processedProducts = products.map((product) => {
    let stockStatus;
    if (product.stockQuantity <= 0) {
      stockStatus = "outOfStock";
    } else if (product.stockQuantity < product.reorderPoint) {
      stockStatus = "low";
    } else if (product.stockQuantity <= product.reorderPoint * 2) {
      stockStatus = "optimal";
    } else {
      stockStatus = "overstock";
    }

    // Calculate stock value
    const stockValue = product.stockQuantity * product.costPrice;

    // Generate random monthly sales and trend for demo purposes
    // In a real app, these would come from actual transaction data
    const monthlySales = Math.floor(Math.random() * 100);
    const salesTrend = Math.floor(Math.random() * 40) - 20; // Random value between -20 and +20

    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      stockLevel: product.stockQuantity,
      reorderPoint: product.reorderPoint,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      stockStatus,
      stockValue,
      monthlySales,
      salesTrend,
    };
  });

  // For the mock implementation, we'll combine our processed products with any
  // static mock data from inventoryReportData
  const reportData = {
    ...inventoryReportData,
    products: processedProducts,
  };

  return asyncResponse(reportData);
};

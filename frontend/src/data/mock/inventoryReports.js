// Mock data for inventory reports
export const inventoryReportData = {
  // Overall inventory statistics
  summary: {
    totalProductCount: 0, // Will be calculated from products
    outOfStockCount: 0, // Will be calculated from products
    lowStockCount: 0, // Will be calculated from products
    totalStockValue: 0, // Will be calculated from products
    averageTurnoverDays: 45,
    inventoryTurnoverRate: 3.2,
    stockAccuracy: 97.8,
  },

  // Stock distribution by category
  categoryDistribution: [
    { category: "Electronics", count: 28, percentage: 35.0, value: 15420.5 },
    { category: "Clothing", count: 22, percentage: 27.5, value: 8750.75 },
    { category: "Home & Kitchen", count: 14, percentage: 17.5, value: 6320.25 },
    { category: "Office Supplies", count: 10, percentage: 12.5, value: 3250.4 },
    { category: "Other", count: 6, percentage: 7.5, value: 1875.3 },
  ],

  // Stock status breakdown
  statusBreakdown: [
    { status: "outOfStock", count: 8, percentage: 10.0 },
    { status: "low", count: 12, percentage: 15.0 },
    { status: "optimal", count: 45, percentage: 56.25 },
    { status: "overstock", count: 15, percentage: 18.75 },
  ],

  // Top overstock products (excessive inventory)
  topOverstockProducts: [
    {
      name: "Premium Headphones",
      sku: "AUDIO-HP-BLK",
      excessUnits: 75,
      excessValue: 3750.0,
    },
    {
      name: "Ergonomic Keyboard",
      sku: "KB-ERG-BLK",
      excessUnits: 45,
      excessValue: 1800.0,
    },
    {
      name: "Wireless Mouse",
      sku: "MOUSE-WL-BLK",
      excessUnits: 38,
      excessValue: 950.0,
    },
    {
      name: "Office Chair",
      sku: "CHAIR-ERG-BLK",
      excessUnits: 23,
      excessValue: 3450.0,
    },
    {
      name: "Desk Lamp",
      sku: "LAMP-DSK-SLV",
      excessUnits: 18,
      excessValue: 540.0,
    },
  ],

  // Products needing reorder
  needsReorderProducts: [
    {
      name: "USB-C Cable",
      sku: "CABLE-USC-BLK",
      currentStock: 5,
      reorderPoint: 20,
      suggestedOrder: 30,
    },
    {
      name: "T-Shirt (Medium)",
      sku: "TSHIRT-M-BLU",
      currentStock: 3,
      reorderPoint: 15,
      suggestedOrder: 25,
    },
    {
      name: "Wireless Earbuds",
      sku: "AUDIO-EB-BLK",
      currentStock: 2,
      reorderPoint: 10,
      suggestedOrder: 15,
    },
    {
      name: "Notebook",
      sku: "NOTE-A5-BLU",
      currentStock: 8,
      reorderPoint: 25,
      suggestedOrder: 40,
    },
    {
      name: "Pen Set",
      sku: "PEN-SET-BLK",
      currentStock: 7,
      reorderPoint: 20,
      suggestedOrder: 30,
    },
  ],

  // Monthly inventory value trend
  inventoryValueTrend: [
    { month: "Jan", value: 32500.0 },
    { month: "Feb", value: 34200.0 },
    { month: "Mar", value: 33800.0 },
    { month: "Apr", value: 35100.0 },
    { month: "May", value: 34800.0 },
    { month: "Jun", value: 35620.0 },
  ],

  // Products array will be populated dynamically from the product data
  // using the getInventoryReport function
  products: [],
};

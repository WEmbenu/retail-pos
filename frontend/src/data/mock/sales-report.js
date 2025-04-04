// Mock data for sales reports
export const salesReportData = {
  // Summary metrics
  totalRevenue: 2547.25,
  previousRevenue: 2125.45,
  totalOrders: 35,
  previousOrders: 30,
  avgOrderValue: 72.78,
  previousAvgOrderValue: 70.85,
  newCustomers: 12,
  previousNewCustomers: 9,

  // Sales by category
  salesByCategory: [
    { name: "Electronics", amount: 985.3, percentage: 38.7 },
    { name: "Clothing", amount: 625.45, percentage: 24.6 },
    { name: "Home & Kitchen", amount: 498.2, percentage: 19.5 },
    { name: "Office Supplies", amount: 298.75, percentage: 11.7 },
    { name: "Other", amount: 139.55, percentage: 5.5 },
  ],

  // Top selling products
  topProducts: [
    {
      name: "Wireless Earbuds",
      sku: "AUDIO-EB-BLK",
      unitsSold: 14,
      revenue: 489.3,
    },
    {
      name: "Smart Watch",
      sku: "WATCH-SMT-SLV",
      unitsSold: 8,
      revenue: 399.6,
    },
    {
      name: "T-Shirt (Large)",
      sku: "TSHIRT-L-BLU",
      unitsSold: 24,
      revenue: 239.52,
    },
    {
      name: "Office Chair",
      sku: "CHAIR-ERG-BLK",
      unitsSold: 3,
      revenue: 209.85,
    },
    {
      name: "Laptop Bag",
      sku: "BAG-LPT-BLK",
      unitsSold: 7,
      revenue: 167.65,
    },
  ],

  // Payment methods
  paymentMethods: [
    { name: "Credit Card", percentage: 68.5 },
    { name: "PayPal", percentage: 18.2 },
    { name: "Cash", percentage: 8.4 },
    { name: "Bank Transfer", percentage: 4.9 },
  ],

  // Time-series data for chart visualization
  // (this would be used to generate the sales trend chart)
  chartData: [
    { date: "2023-06-01", revenue: 185.25, orders: 3 },
    { date: "2023-06-02", revenue: 143.5, orders: 2 },
    { date: "2023-06-03", revenue: 97.8, orders: 1 },
    { date: "2023-06-04", revenue: 210.45, orders: 3 },
    { date: "2023-06-05", revenue: 286.7, orders: 4 },
    { date: "2023-06-06", revenue: 178.55, orders: 2 },
    { date: "2023-06-07", revenue: 325.1, orders: 5 },
    { date: "2023-06-08", revenue: 298.9, orders: 4 },
    { date: "2023-06-09", revenue: 421.2, orders: 6 },
    { date: "2023-06-10", revenue: 399.8, orders: 5 },
  ],

  // Sales by time of day
  salesByTimeOfDay: [
    { time: "Morning (6AM-12PM)", percentage: 22.5 },
    { time: "Afternoon (12PM-5PM)", percentage: 35.8 },
    { time: "Evening (5PM-9PM)", percentage: 31.2 },
    { time: "Night (9PM-6AM)", percentage: 10.5 },
  ],
};

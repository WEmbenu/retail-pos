// Dashboard summary data for widgets
export const dashboardSummary = {
  todaySales: 4350.75,
  weekSales: 28500.25,
  monthSales: 125750.8,
  todayTransactions: 42,
  inventoryValue: 89250.5,
  salesByCategory: [
    { category: "Electronics", sales: 65000, percentage: 52 },
    { category: "Home Appliances", sales: 32500, percentage: 26 },
    { category: "Furniture", sales: 15000, percentage: 12 },
    { category: "Clothing", sales: 12500, percentage: 10 },
  ],
  recentTransactions: [
    { id: "TR-001", customer: "John Doe", amount: 1299.99, time: "10:25 AM" },
    { id: "TR-002", customer: "Jane Smith", amount: 89.99, time: "11:42 AM" },
    {
      id: "TR-003",
      customer: "Robert Johnson",
      amount: 599.99,
      time: "12:15 PM",
    },
    { id: "TR-004", customer: "Emily Davis", amount: 149.99, time: "1:30 PM" },
    {
      id: "TR-005",
      customer: "Michael Brown",
      amount: 399.99,
      time: "2:45 PM",
    },
  ],
  popularProducts: [
    { id: 1, name: "Laptop", sales: 28, revenue: 36399.72 },
    { id: 2, name: "Smartphone", sales: 42, revenue: 33599.58 },
    { id: 3, name: "Wireless Headphones", sales: 35, revenue: 5249.65 },
    { id: 4, name: "Coffee Maker", sales: 20, revenue: 1799.8 },
    { id: 5, name: "Desk Chair", sales: 15, revenue: 2999.85 },
  ],
};

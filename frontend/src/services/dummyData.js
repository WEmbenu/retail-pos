// Product Categories
export const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
  },
  { id: 2, name: "Clothing", description: "Apparel and fashion items" },
  { id: 3, name: "Groceries", description: "Food and household essentials" },
  { id: 4, name: "Furniture", description: "Home and office furniture" },
  { id: 5, name: "Beauty", description: "Cosmetics and personal care" },
];

// Products
export const products = [
  {
    id: 1,
    name: "Smartphone XS",
    description: "Latest model with advanced features",
    price: 799.99,
    cost: 550.0,
    sku: "ELEC-SP-001",
    barcode: "8901234567890",
    categoryId: 1,
    stockQuantity: 25,
    image: "https://via.placeholder.com/150",
    isActive: true,
    createdAt: "2023-01-15T08:30:00Z",
  },
  {
    id: 2,
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    cost: 950.0,
    sku: "ELEC-LP-002",
    barcode: "8901234567891",
    categoryId: 1,
    stockQuantity: 15,
    image: "https://via.placeholder.com/150",
    isActive: true,
    createdAt: "2023-01-20T10:15:00Z",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    description: "Noise-cancelling bluetooth headphones",
    price: 149.99,
    cost: 85.0,
    sku: "ELEC-WH-003",
    barcode: "8901234567892",
    categoryId: 1,
    stockQuantity: 40,
    image: "https://via.placeholder.com/150",
    isActive: true,
    createdAt: "2023-02-05T14:20:00Z",
  },
  {
    id: 4,
    name: "Men's Casual Shirt",
    description: "Cotton casual shirt for men",
    price: 39.99,
    cost: 18.5,
    sku: "CLTH-MS-001",
    barcode: "8901234567893",
    categoryId: 2,
    stockQuantity: 50,
    image: "https://via.placeholder.com/150",
    isActive: true,
    createdAt: "2023-02-10T09:45:00Z",
  },
  {
    id: 5,
    name: "Women's Summer Dress",
    description: "Lightweight summer dress",
    price: 59.99,
    cost: 28.0,
    sku: "CLTH-WD-002",
    barcode: "8901234567894",
    categoryId: 2,
    stockQuantity: 30,
    image: "https://via.placeholder.com/150",
    isActive: true,
    createdAt: "2023-02-15T11:30:00Z",
  },
  {
    id: 6,
    name: "Organic Bread",
    description: "Freshly baked organic bread",
    price: 4.99,
    cost: 2.25,
    sku: "GROC-BR-001",
    barcode: "8901234567895",
    categoryId: 3,
    stockQuantity: 20,
    image: "https://via.placeholder.com/150",
    isActive: true,
    createdAt: "2023-03-01T08:00:00Z",
  },
  {
    id: 7,
    name: "Coffee Beans Premium",
    description: "Premium arabica coffee beans",
    price: 12.99,
    cost: 7.5,
    sku: "GROC-CB-002",
    barcode: "8901234567896",
    categoryId: 3,
    stockQuantity: 35,
    image: "https://via.placeholder.com/150",
    isActive: true,
    createdAt: "2023-03-05T09:15:00Z",
  },
  {
    id: 8,
    name: "Office Desk",
    description: "Modern office desk with drawers",
    price: 249.99,
    cost: 180.0,
    sku: "FURN-OD-001",
    barcode: "8901234567897",
    categoryId: 4,
    stockQuantity: 10,
    image: "https://via.placeholder.com/150",
    isActive: true,
    createdAt: "2023-03-10T13:45:00Z",
  },
  {
    id: 9,
    name: "Bookshelf",
    description: "Wooden bookshelf with 5 shelves",
    price: 179.99,
    cost: 120.0,
    sku: "FURN-BS-002",
    barcode: "8901234567898",
    categoryId: 4,
    stockQuantity: 12,
    image: "https://via.placeholder.com/150",
    isActive: true,
    createdAt: "2023-03-15T15:30:00Z",
  },
  {
    id: 10,
    name: "Facial Cleanser",
    description: "Gentle facial cleanser for all skin types",
    price: 14.99,
    cost: 6.75,
    sku: "BEAU-FC-001",
    barcode: "8901234567899",
    categoryId: 5,
    stockQuantity: 45,
    image: "https://via.placeholder.com/150",
    isActive: true,
    createdAt: "2023-04-01T10:00:00Z",
  },
];

// Customers

// Customer data
export const customers = [
  {
    id: "cust-001",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    notes: "Regular customer, prefers notifications by text",
    createdAt: "2023-01-15T09:30:00.000Z",
    totalSpent: 1245.75,
    lastPurchase: "2023-05-22T14:20:00.000Z",
    purchaseCount: 8,
    status: "active",
  },
  {
    id: "cust-002",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Elm St, Boston, MA 02108",
    notes: "",
    createdAt: "2023-02-20T11:45:00.000Z",
    totalSpent: 3567.25,
    lastPurchase: "2023-06-01T16:10:00.000Z",
    purchaseCount: 15,
    status: "vip",
  },
  {
    id: "cust-003",
    fullName: "Robert Johnson",
    email: "robert@example.com",
    phone: "+1 (555) 456-7890",
    address: "789 Oak St, Chicago, IL 60007",
    notes: "Prefers store pickup",
    createdAt: "2023-03-10T13:15:00.000Z",
    totalSpent: 678.5,
    lastPurchase: "2023-04-15T10:30:00.000Z",
    purchaseCount: 3,
    status: "inactive",
  },
  {
    id: "cust-004",
    fullName: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 (555) 234-5678",
    address: "321 Pine St, Seattle, WA 98101",
    notes: "",
    createdAt: "2023-04-05T16:20:00.000Z",
    totalSpent: 2145.3,
    lastPurchase: "2023-06-10T09:45:00.000Z",
    purchaseCount: 9,
    status: "active",
  },
  {
    id: "cust-005",
    fullName: "Michael Wilson",
    email: "michael@example.com",
    phone: "+1 (555) 876-5432",
    address: "654 Maple St, Los Angeles, CA 90001",
    notes: "Business account",
    createdAt: "2023-05-12T10:10:00.000Z",
    totalSpent: 5678.9,
    lastPurchase: "2023-06-15T13:25:00.000Z",
    purchaseCount: 20,
    status: "vip",
  },
];

// Get all customers
export const getCustomers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...customers]);
    }, 500);
  });
};

// Add a new customer
export const addCustomer = (customer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCustomer = {
        ...customer,
        id: `cust-${String(customers.length + 1).padStart(3, "0")}`,
      };
      customers.push(newCustomer);
      resolve(newCustomer);
    }, 500);
  });
};

// Update an existing customer
export const updateCustomer = (id, updatedCustomer) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = customers.findIndex((cust) => cust.id === id);
      if (index !== -1) {
        customers[index] = { ...customers[index], ...updatedCustomer };
        resolve(customers[index]);
      } else {
        reject(new Error("Customer not found"));
      }
    }, 500);
  });
};

// Delete a customer
export const deleteCustomer = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = customers.findIndex((cust) => cust.id === id);
      if (index !== -1) {
        customers.splice(index, 1);
        resolve({ success: true });
      } else {
        reject(new Error("Customer not found"));
      }
    }, 500);
  });
};

const transactionsData = [
  {
    id: 1,
    transactionId: "TRX-20230610-001",
    date: "2023-06-10T14:23:45.000Z",
    customer: "John Doe",
    customerDetails: {
      id: "cust-001",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Credit Card",
    paymentDetails: {
      cardNumber: "************4242",
      cardType: "Visa",
    },
    subtotal: 145.9,
    tax: 11.67,
    discount: 0,
    total: 157.57,
    status: "completed",
    items: [
      { name: "T-Shirt", sku: "TSHIRT-L-BLU", quantity: 2, price: 24.95 },
      { name: "Jeans", sku: "JEANS-32-BLK", quantity: 1, price: 89.95 },
      { name: "Socks", sku: "SOCK-M-WHT", quantity: 3, price: 2.35 },
    ],
    notes: "",
  },
  {
    id: 2,
    transactionId: "TRX-20230609-002",
    date: "2023-06-09T11:15:22.000Z",
    customer: "Jane Smith",
    customerDetails: {
      id: "cust-002",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
    },
    paymentMethod: "PayPal",
    paymentDetails: {
      email: "jane.smith@example.com",
    },
    subtotal: 329.85,
    tax: 26.39,
    discount: 32.99,
    total: 323.25,
    status: "completed",
    items: [
      { name: "Laptop Bag", sku: "BAG-LPT-BLK", quantity: 1, price: 129.95 },
      {
        name: "Wireless Mouse",
        sku: "MOUSE-WL-BLK",
        quantity: 1,
        price: 49.95,
      },
      {
        name: "Monitor Stand",
        sku: "STAND-MON-SLV",
        quantity: 1,
        price: 149.95,
      },
    ],
    notes: "Customer requested gift wrapping",
  },
  {
    id: 3,
    transactionId: "TRX-20230609-001",
    date: "2023-06-09T09:45:10.000Z",
    customer: "Walk-in Customer",
    customerDetails: null,
    paymentMethod: "Cash",
    paymentDetails: null,
    subtotal: 35.8,
    tax: 2.86,
    discount: 0,
    total: 38.66,
    status: "completed",
    items: [
      { name: "Coffee Mug", sku: "MUG-CER-WHT", quantity: 2, price: 8.95 },
      { name: "Notebook", sku: "NOTE-A5-BLU", quantity: 1, price: 4.95 },
      { name: "Pen Set", sku: "PEN-SET-BLK", quantity: 1, price: 12.95 },
    ],
    notes: "",
  },
  {
    id: 4,
    transactionId: "TRX-20230608-002",
    date: "2023-06-08T16:37:05.000Z",
    customer: "Robert Johnson",
    customerDetails: {
      id: "cust-003",
      email: "robert@example.com",
      phone: "+1 (555) 456-7890",
    },
    paymentMethod: "Credit Card",
    paymentDetails: {
      cardNumber: "************1234",
      cardType: "MasterCard",
    },
    subtotal: 199.95,
    tax: 16.0,
    discount: 0,
    total: 215.95,
    status: "refunded",
    items: [
      {
        name: "Bluetooth Speaker",
        sku: "SPKR-BT-BLK",
        quantity: 1,
        price: 199.95,
      },
    ],
    notes: "Customer reported defective product, full refund processed",
  },
  {
    id: 5,
    transactionId: "TRX-20230608-001",
    date: "2023-06-08T10:12:33.000Z",
    customer: "Emily Davis",
    customerDetails: {
      id: "cust-004",
      email: "emily@example.com",
      phone: "+1 (555) 234-5678",
    },
    paymentMethod: "Credit Card",
    paymentDetails: {
      cardNumber: "************5678",
      cardType: "Amex",
    },
    subtotal: 415.8,
    tax: 33.26,
    discount: 41.58,
    total: 407.48,
    status: "completed",
    items: [
      { name: "Smart Watch", sku: "WATCH-SMT-SLV", quantity: 1, price: 249.95 },
      { name: "Charging Dock", sku: "DOCK-WTC-BLK", quantity: 1, price: 49.95 },
      {
        name: "Screen Protector",
        sku: "PROT-WTC-CLR",
        quantity: 2,
        price: 14.95,
      },
      { name: "Watch Band", sku: "BAND-WTC-BLK", quantity: 1, price: 29.95 },
      { name: "Extended Warranty", sku: "WARR-1YR", quantity: 1, price: 59.95 },
    ],
    notes: "10% discount applied for loyalty program",
  },
  {
    id: 6,
    transactionId: "TRX-20230607-001",
    date: "2023-06-07T13:45:18.000Z",
    customer: "Michael Wilson",
    customerDetails: {
      id: "cust-005",
      email: "michael@example.com",
      phone: "+1 (555) 876-5432",
    },
    paymentMethod: "Bank Transfer",
    paymentDetails: {
      accountName: "Wilson Enterprises",
    },
    subtotal: 1299.95,
    tax: 104.0,
    discount: 0,
    total: 1403.95,
    status: "pending",
    items: [
      { name: "Office Desk", sku: "DESK-OAK-LRG", quantity: 1, price: 599.95 },
      {
        name: "Office Chair",
        sku: "CHAIR-ERG-BLK",
        quantity: 1,
        price: 399.95,
      },
      { name: "Desk Lamp", sku: "LAMP-DSK-SLV", quantity: 1, price: 89.95 },
      {
        name: "Filing Cabinet",
        sku: "CAB-FILE-GRY",
        quantity: 1,
        price: 210.1,
      },
    ],
    notes: "Business purchase - awaiting bank clearance",
  },
];

// Get all transactions
export const getTransactions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...transactionsData]);
    }, 500);
  });
};

// Get sales report data
export const getSalesReport = ({ startDate, endDate, period }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // This is mock data - in a real application, this would be filtered based on date parameters
      resolve({
        totalRevenue: 24563.75,
        previousRevenue: 21897.45,
        totalOrders: 367,
        previousOrders: 342,
        avgOrderValue: 66.93,
        previousAvgOrderValue: 64.03,
        newCustomers: 128,
        previousNewCustomers: 115,
        salesByCategory: [
          { name: "Electronics", amount: 8754.32, percentage: 35.6 },
          { name: "Clothing", amount: 6241.87, percentage: 25.4 },
          { name: "Home & Kitchen", amount: 4521.65, percentage: 18.4 },
          { name: "Books & Media", amount: 2845.3, percentage: 11.6 },
          { name: "Other", amount: 2200.61, percentage: 9.0 },
        ],
        topProducts: [
          {
            name: "Wireless Headphones",
            sku: "ELEC-HDPH-001",
            unitsSold: 87,
            revenue: 3045.15,
          },
          {
            name: "Men's T-Shirt",
            sku: "CLTH-MTEE-L",
            unitsSold: 132,
            revenue: 2640.0,
          },
          {
            name: "Coffee Maker",
            sku: "HOME-COFF-001",
            unitsSold: 42,
            revenue: 2394.9,
          },
          {
            name: "Smart Watch",
            sku: "ELEC-WTCH-001",
            unitsSold: 28,
            revenue: 1982.6,
          },
          {
            name: "Desk Lamp",
            sku: "HOME-LAMP-001",
            unitsSold: 53,
            revenue: 1537.0,
          },
        ],
        paymentMethods: [
          {
            name: "Credit Card",
            count: 242,
            amount: 16874.32,
            percentage: 68.7,
          },
          { name: "Cash", count: 84, amount: 4235.67, percentage: 17.2 },
          {
            name: "Mobile Payment",
            count: 32,
            amount: 2354.89,
            percentage: 9.6,
          },
          { name: "Other", count: 9, amount: 1098.87, percentage: 4.5 },
        ],
        // Time-based data would be generated according to the period
        timeData:
          period === "daily"
            ? generateDailyData()
            : period === "weekly"
            ? generateWeeklyData()
            : generateMonthlyData(),
      });
    }, 1000);
  });
};

// Helper functions to generate mock time-series data
function generateDailyData() {
  const days = 14;
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    revenue: 1000 + Math.random() * 2000,
    orders: 10 + Math.floor(Math.random() * 30),
  }));
}

function generateWeeklyData() {
  const weeks = 8;
  return Array.from({ length: weeks }, (_, i) => ({
    week: `Week ${i + 1}`,
    revenue: 5000 + Math.random() * 10000,
    orders: 50 + Math.floor(Math.random() * 100),
  }));
}

function generateMonthlyData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month) => ({
    month,
    revenue: 10000 + Math.random() * 20000,
    orders: 150 + Math.floor(Math.random() * 200),
  }));
}

// Get inventory report data
export const getInventoryReport = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        products: [
          {
            id: 1,
            name: "Wireless Headphones",
            sku: "ELEC-HDPH-001",
            category: "Electronics",
            stockLevel: 23,
            reorderPoint: 15,
            stockStatus: "optimal",
            costPrice: 25.5,
            sellingPrice: 39.99,
            stockValue: 586.5,
            monthlySales: 42,
            salesTrend: 12.5,
          },
          {
            id: 2,
            name: "Smart Watch",
            sku: "ELEC-WTCH-001",
            category: "Electronics",
            stockLevel: 8,
            reorderPoint: 10,
            stockStatus: "low",
            costPrice: 45.75,
            sellingPrice: 79.99,
            stockValue: 366.0,
            monthlySales: 15,
            salesTrend: 8.2,
          },
          {
            id: 3,
            name: "Men's T-Shirt (L)",
            sku: "CLTH-MTEE-L",
            category: "Clothing",
            stockLevel: 45,
            reorderPoint: 20,
            stockStatus: "overstock",
            costPrice: 8.25,
            sellingPrice: 19.99,
            stockValue: 371.25,
            monthlySales: 32,
            salesTrend: -5.3,
          },
          {
            id: 4,
            name: "Coffee Maker",
            sku: "HOME-COFF-001",
            category: "Home & Kitchen",
            stockLevel: 12,
            reorderPoint: 10,
            stockStatus: "optimal",
            costPrice: 35.5,
            sellingPrice: 59.99,
            stockValue: 426.0,
            monthlySales: 8,
            salesTrend: 0,
          },
          {
            id: 5,
            name: "Desk Lamp",
            sku: "HOME-LAMP-001",
            category: "Home & Kitchen",
            stockLevel: 0,
            reorderPoint: 15,
            stockStatus: "outOfStock",
            costPrice: 18.75,
            sellingPrice: 29.99,
            stockValue: 0,
            monthlySales: 22,
            salesTrend: 15.8,
          },
          {
            id: 6,
            name: "Wireless Mouse",
            sku: "ELEC-MOUS-001",
            category: "Electronics",
            stockLevel: 32,
            reorderPoint: 15,
            stockStatus: "optimal",
            costPrice: 12.25,
            sellingPrice: 24.99,
            stockValue: 392.0,
            monthlySales: 35,
            salesTrend: 20.1,
          },
          {
            id: 7,
            name: "Women's Jeans (M)",
            sku: "CLTH-WJNS-M",
            category: "Clothing",
            stockLevel: 17,
            reorderPoint: 15,
            stockStatus: "optimal",
            costPrice: 22.5,
            sellingPrice: 49.99,
            stockValue: 382.5,
            monthlySales: 18,
            salesTrend: -2.7,
          },
          {
            id: 8,
            name: "Toaster",
            sku: "HOME-TSTR-001",
            category: "Home & Kitchen",
            stockLevel: 3,
            reorderPoint: 8,
            stockStatus: "low",
            costPrice: 28.0,
            sellingPrice: 39.99,
            stockValue: 84.0,
            monthlySales: 5,
            salesTrend: -8.5,
          },
          {
            id: 9,
            name: "Bluetooth Speaker",
            sku: "ELEC-SPKR-001",
            category: "Electronics",
            stockLevel: 0,
            reorderPoint: 12,
            stockStatus: "outOfStock",
            costPrice: 35.0,
            sellingPrice: 69.99,
            stockValue: 0,
            monthlySales: 28,
            salesTrend: 32.4,
          },
          {
            id: 10,
            name: "Water Bottle",
            sku: "HOME-WBOT-001",
            category: "Home & Kitchen",
            stockLevel: 68,
            reorderPoint: 25,
            stockStatus: "overstock",
            costPrice: 6.5,
            sellingPrice: 14.99,
            stockValue: 442.0,
            monthlySales: 20,
            salesTrend: 5.8,
          },
        ],
      });
    }, 800);
  });
};

// User data
const usersData = [
  {
    id: 1,
    fullName: "Admin User",
    email: "admin@retailpos.com",
    role: "admin",
    isActive: true,
    lastLogin: "2023-06-15T09:30:00.000Z",
    createdAt: "2023-01-10T12:00:00.000Z",
  },
  {
    id: 2,
    fullName: "Store Manager",
    email: "manager@retailpos.com",
    role: "manager",
    isActive: true,
    lastLogin: "2023-06-14T16:45:00.000Z",
    createdAt: "2023-01-15T14:30:00.000Z",
  },
  {
    id: 3,
    fullName: "Sales Cashier",
    email: "cashier@retailpos.com",
    role: "cashier",
    isActive: true,
    lastLogin: "2023-06-15T12:10:00.000Z",
    createdAt: "2023-02-01T09:15:00.000Z",
  },
  {
    id: 4,
    fullName: "Part-time Cashier",
    email: "parttimer@retailpos.com",
    role: "cashier",
    isActive: false,
    lastLogin: "2023-05-20T15:22:00.000Z",
    createdAt: "2023-03-10T10:00:00.000Z",
  },
];

// Get all users
export const getUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...usersData]);
    }, 500);
  });
};

// Add a new user
export const addUser = (user) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        ...user,
        id: usersData.length + 1,
      };
      usersData.push(newUser);
      resolve(newUser);
    }, 500);
  });
};

// Update an existing user
export const updateUser = (id, updatedUser) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = usersData.findIndex((user) => user.id === id);
      if (index !== -1) {
        usersData[index] = { ...usersData[index], ...updatedUser };
        resolve(usersData[index]);
      } else {
        reject(new Error("User not found"));
      }
    }, 500);
  });
};

// Delete a user
export const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = usersData.findIndex((user) => user.id === id);
      if (index !== -1) {
        usersData.splice(index, 1);
        resolve({ success: true });
      } else {
        reject(new Error("User not found"));
      }
    }, 500);
  });
};

// Dashboard data
export const dashboardSummary = {
  todaySales: 2548.75,
  todayTransactions: 15,
  weekSales: 12450.9,
  monthSales: 45680.25,
  inventoryValue: 85420.5,
  lowStockItems: 3,
  popularProducts: [
    { id: 1, name: "Smartphone XS", sales: 23, revenue: 18399.77 },
    { id: 3, name: "Wireless Headphones", sales: 18, revenue: 2699.82 },
    { id: 6, name: "Organic Bread", sales: 45, revenue: 224.55 },
  ],
  salesByCategory: [
    { category: "Electronics", sales: 25678.9, percentage: 56.2 },
    { category: "Clothing", sales: 8945.6, percentage: 19.6 },
    { category: "Groceries", sales: 5432.8, percentage: 11.9 },
    { category: "Furniture", sales: 3210.4, percentage: 7.0 },
    { category: "Beauty", sales: 2412.55, percentage: 5.3 },
  ],
  recentTransactions: [
    { id: 15, customer: "Alice Cooper", amount: 349.97, time: "2 hours ago" },
    { id: 14, customer: "Bob Miller", amount: 129.99, time: "4 hours ago" },
    { id: 13, customer: "Carol White", amount: 899.95, time: "Yesterday" },
    { id: 12, customer: "David Clark", amount: 74.85, time: "Yesterday" },
    { id: 11, customer: "Eva Green", amount: 1249.99, time: "2 days ago" },
  ],
};

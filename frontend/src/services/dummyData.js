// This file simulates API responses for development purposes
// It will be replaced with real API calls in production

// Helper function to simulate async behavior
const asyncResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Generate a random ID
const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

// ==============================================
// USERS & AUTHENTICATION
// ==============================================

// User data store
let users = [
  {
    id: 1,
    fullName: "Admin User",
    email: "admin@example.com",
    role: "admin",
    lastLogin: new Date().toISOString(),
    createdAt: "2023-01-01T00:00:00.000Z",
    isActive: true,
  },
  {
    id: 2,
    fullName: "Manager User",
    email: "manager@example.com",
    role: "manager",
    lastLogin: new Date().toISOString(),
    createdAt: "2023-01-02T00:00:00.000Z",
    isActive: true,
  },
  {
    id: 3,
    fullName: "Cashier User",
    email: "cashier@example.com",
    role: "cashier",
    lastLogin: new Date().toISOString(),
    createdAt: "2023-01-03T00:00:00.000Z",
    isActive: true,
  },
];

// Mock login function
export const login = async (email, password) => {
  // Simulated authentication
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new Error("User not found");
  }

  // In a real app, you would check password hash here
  if (password !== "password") {
    throw new Error("Invalid password");
  }

  // Update last login
  user.lastLogin = new Date().toISOString();

  return asyncResponse({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    token: "mock-jwt-token",
  });
};

// Get users
export const getUsers = async () => {
  return asyncResponse([...users]);
};

// Add user
export const addUser = async (userData) => {
  const newUser = {
    id: generateId(),
    ...userData,
  };
  users.push(newUser);
  return asyncResponse(newUser);
};

// Update user
export const updateUser = async (id, userData) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error("User not found");
  }

  users[index] = { ...users[index], ...userData };
  return asyncResponse(users[index]);
};

// Delete user
export const deleteUser = async (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error("User not found");
  }

  users.splice(index, 1);
  return asyncResponse({ success: true });
};

// ==============================================
// ROLES & PERMISSIONS
// ==============================================

// Roles data store
let roles = [
  {
    id: 1,
    name: "admin",
    description: "Full administrative access",
    permissions: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ],
    userCount: 1,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "manager",
    description: "Store management access",
    permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16],
    userCount: 1,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    name: "cashier",
    description: "Point of sale access",
    permissions: [1, 2, 4, 7],
    userCount: 1,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
];

// Permission categories data
const permissionCategories = [
  {
    id: 1,
    name: "Sales & POS",
    permissions: [
      {
        id: 1,
        name: "View POS",
        description: "Access the point of sale screen",
      },
      {
        id: 2,
        name: "Process Sales",
        description: "Create and complete transactions",
      },
      {
        id: 3,
        name: "Apply Discounts",
        description: "Apply discounts to sales",
      },
      {
        id: 4,
        name: "View Transactions",
        description: "View transaction history",
      },
    ],
  },
  {
    id: 2,
    name: "Products & Inventory",
    permissions: [
      { id: 5, name: "View Products", description: "View product catalog" },
      {
        id: 6,
        name: "Manage Products",
        description: "Add, edit, and delete products",
      },
      { id: 7, name: "View Inventory", description: "Check inventory levels" },
      {
        id: 8,
        name: "Manage Inventory",
        description: "Adjust inventory quantities",
      },
    ],
  },
  {
    id: 3,
    name: "Customers",
    permissions: [
      { id: 9, name: "View Customers", description: "View customer list" },
      {
        id: 10,
        name: "Manage Customers",
        description: "Add, edit, and delete customers",
      },
      {
        id: 11,
        name: "Manage Debts",
        description: "Manage customer credit and payment",
      },
    ],
  },
  {
    id: 4,
    name: "Reports & Analytics",
    permissions: [
      {
        id: 12,
        name: "View Reports",
        description: "Access reporting features",
      },
      { id: 13, name: "Export Data", description: "Export system data" },
    ],
  },
  {
    id: 5,
    name: "Admin & Settings",
    permissions: [
      {
        id: 14,
        name: "Manage Users",
        description: "Add, edit, and remove users",
      },
      {
        id: 15,
        name: "Manage Roles",
        description: "Configure user roles and permissions",
      },
      {
        id: 16,
        name: "System Settings",
        description: "Configure system settings",
      },
    ],
  },
  {
    id: 6,
    name: "Suppliers & Purchases",
    permissions: [
      { id: 17, name: "View Suppliers", description: "View supplier list" },
      {
        id: 18,
        name: "Manage Suppliers",
        description: "Add, edit, and delete suppliers",
      },
      { id: 19, name: "View Purchases", description: "View purchase orders" },
      {
        id: 20,
        name: "Manage Purchases",
        description: "Create and edit purchase orders",
      },
    ],
  },
];

// Get roles
export const getRoles = async () => {
  return asyncResponse([...roles]);
};

// Get permissions
export const getPermissions = async () => {
  return asyncResponse([...permissionCategories]);
};

// Add role
export const addRole = async (roleData) => {
  const newRole = {
    id: generateId(),
    ...roleData,
  };
  roles.push(newRole);
  return asyncResponse(newRole);
};

// Update role
export const updateRole = async (id, roleData) => {
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error("Role not found");
  }

  roles[index] = { ...roles[index], ...roleData };
  return asyncResponse(roles[index]);
};

// Delete role
export const deleteRole = async (id) => {
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error("Role not found");
  }

  roles.splice(index, 1);
  return asyncResponse({ success: true });
};

// ==============================================
// PRODUCTS
// ==============================================

// Product data store
export let products = [
  {
    id: 1,
    name: "Laptop",
    description: "High-performance laptop for professionals",
    sku: "TECH-001",
    price: 1299.99,
    cost: 950.0,
    categoryId: 1,
    stockQuantity: 25,
    isActive: true,
    image: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "Smartphone",
    description: "Latest model smartphone with advanced features",
    sku: "TECH-002",
    price: 799.99,
    cost: 600.0,
    categoryId: 1,
    stockQuantity: 40,
    isActive: true,
    image: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    name: "Coffee Maker",
    description: "Automatic drip coffee maker with timer",
    sku: "HOME-001",
    price: 89.99,
    cost: 45.0,
    categoryId: 2,
    stockQuantity: 15,
    isActive: true,
    image: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    name: "Desk Chair",
    description: "Ergonomic office chair with lumbar support",
    sku: "FURN-001",
    price: 199.99,
    cost: 120.0,
    categoryId: 3,
    stockQuantity: 8,
    isActive: true,
    image: "https://via.placeholder.com/100",
  },
  {
    id: 5,
    name: "Wireless Headphones",
    description: "Noise-cancelling Bluetooth headphones",
    sku: "TECH-003",
    price: 149.99,
    cost: 85.0,
    categoryId: 1,
    stockQuantity: 30,
    isActive: true,
    image: "https://via.placeholder.com/100",
  },
];

// Product categories data
export let categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    color: "#3B82F6",
    productsCount: 3,
  },
  {
    id: 2,
    name: "Home Appliances",
    description: "Household appliances and tools",
    color: "#EF4444",
    productsCount: 1,
  },
  {
    id: 3,
    name: "Furniture",
    description: "Office and home furniture",
    color: "#10B981",
    productsCount: 1,
  },
  {
    id: 4,
    name: "Clothing",
    description: "Apparel and fashion items",
    color: "#F59E0B",
    productsCount: 0,
  },
];

// Get product categories
export const getCategories = async () => {
  return asyncResponse([...categories]);
};

// Add category
export const addCategory = async (categoryData) => {
  const newCategory = {
    id: generateId(),
    ...categoryData,
    productsCount: 0,
  };
  categories.push(newCategory);
  return asyncResponse(newCategory);
};

// Update category
export const updateCategory = async (id, categoryData) => {
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Category not found");
  }

  categories[index] = { ...categories[index], ...categoryData };
  return asyncResponse(categories[index]);
};

// Delete category
export const deleteCategory = async (id) => {
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Category not found");
  }

  categories.splice(index, 1);
  return asyncResponse({ success: true });
};

// Add product
export const addProduct = async (productData) => {
  const newProduct = {
    id: generateId(),
    ...productData,
  };
  products.push(newProduct);

  // Update category product count
  const categoryIndex = categories.findIndex(
    (c) => c.id === productData.categoryId
  );
  if (categoryIndex !== -1) {
    categories[categoryIndex].productsCount += 1;
  }

  return asyncResponse(newProduct);
};

// Update product
export const updateProduct = async (id, productData) => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }

  // Check if category changed
  if (productData.categoryId !== products[index].categoryId) {
    // Decrement old category count
    const oldCategoryIndex = categories.findIndex(
      (c) => c.id === products[index].categoryId
    );
    if (oldCategoryIndex !== -1) {
      categories[oldCategoryIndex].productsCount -= 1;
    }

    // Increment new category count
    const newCategoryIndex = categories.findIndex(
      (c) => c.id === productData.categoryId
    );
    if (newCategoryIndex !== -1) {
      categories[newCategoryIndex].productsCount += 1;
    }
  }

  products[index] = { ...products[index], ...productData };
  return asyncResponse(products[index]);
};

// Delete product
export const deleteProduct = async (id) => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }

  // Decrement category count
  const categoryIndex = categories.findIndex(
    (c) => c.id === products[index].categoryId
  );
  if (categoryIndex !== -1) {
    categories[categoryIndex].productsCount -= 1;
  }

  products.splice(index, 1);
  return asyncResponse({ success: true });
};

// ==============================================
// SUPPLIERS
// ==============================================

// Suppliers data store
let suppliers = [
  {
    id: 1,
    name: "Tech Distributors Inc.",
    contactPerson: "John Smith",
    email: "john@techdist.com",
    phone: "555-123-4567",
    address: "123 Tech Drive, San Jose, CA 95123",
    category: "electronics",
    website: "www.techdistributors.com",
    taxId: "123456789",
    qualityRating: 4,
    lastOrderDate: "2023-05-15T00:00:00.000Z",
    productsCount: 10,
    status: "active",
    createdAt: "2023-01-10T00:00:00.000Z",
    notes: "Reliable supplier for electronic components and devices.",
  },
  {
    id: 2,
    name: "Office Supply Co.",
    contactPerson: "Sarah Johnson",
    email: "sarah@officesupply.com",
    phone: "555-987-6543",
    address: "456 Office Park, Chicago, IL 60601",
    category: "general",
    website: "www.officesupplyco.com",
    taxId: "987654321",
    qualityRating: 5,
    lastOrderDate: "2023-06-22T00:00:00.000Z",
    productsCount: 25,
    status: "active",
    createdAt: "2023-02-15T00:00:00.000Z",
    notes: "Premium office supplies and furniture.",
  },
  {
    id: 3,
    name: "Global Imports Ltd.",
    contactPerson: "David Lee",
    email: "david@globalimports.com",
    phone: "555-456-7890",
    address: "789 Harbor Blvd, Seattle, WA 98101",
    category: "general",
    website: "www.globalimports.com",
    taxId: "456789123",
    qualityRating: 3,
    lastOrderDate: "2023-04-10T00:00:00.000Z",
    productsCount: 15,
    status: "inactive",
    createdAt: "2023-03-20T00:00:00.000Z",
    notes: "International supplier with wide product range.",
  },
];

// Get suppliers
export const getSuppliers = async () => {
  return asyncResponse([...suppliers]);
};

// Add supplier
export const addSupplier = async (supplierData) => {
  const newSupplier = {
    id: generateId(),
    ...supplierData,
  };
  suppliers.push(newSupplier);
  return asyncResponse(newSupplier);
};

// Update supplier
export const updateSupplier = async (id, supplierData) => {
  const index = suppliers.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error("Supplier not found");
  }

  suppliers[index] = { ...suppliers[index], ...supplierData };
  return asyncResponse(suppliers[index]);
};

// Delete supplier
export const deleteSupplier = async (id) => {
  const index = suppliers.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error("Supplier not found");
  }

  suppliers.splice(index, 1);
  return asyncResponse({ success: true });
};

// ==============================================
// PURCHASES
// ==============================================

// Purchases data store
let purchases = [
  {
    id: 1,
    invoiceNumber: "PO-001-2023",
    supplierId: 1,
    purchaseDate: "2023-05-15T00:00:00.000Z",
    expectedDeliveryDate: "2023-05-25T00:00:00.000Z",
    deliveryStatus: "delivered",
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    totalAmount: 5250.0,
    notes: "Monthly electronic inventory restock",
    createdAt: "2023-05-15T00:00:00.000Z",
    items: [
      {
        productId: 1,
        quantity: 5,
        unitPrice: 950.0,
        total: 4750.0,
      },
      {
        productId: 2,
        quantity: 1,
        unitPrice: 500.0,
        total: 500.0,
      },
    ],
  },
  {
    id: 2,
    invoiceNumber: "PO-002-2023",
    supplierId: 2,
    purchaseDate: "2023-06-22T00:00:00.000Z",
    expectedDeliveryDate: "2023-06-30T00:00:00.000Z",
    deliveryStatus: "partial",
    paymentStatus: "partial",
    paymentMethod: "check",
    totalAmount: 2400.0,
    notes: "Office furniture quarterly order",
    createdAt: "2023-06-22T00:00:00.000Z",
    items: [
      {
        productId: 4,
        quantity: 20,
        unitPrice: 120.0,
        total: 2400.0,
      },
    ],
  },
  {
    id: 3,
    invoiceNumber: "PO-003-2023",
    supplierId: 1,
    purchaseDate: "2023-07-10T00:00:00.000Z",
    expectedDeliveryDate: "2023-07-20T00:00:00.000Z",
    deliveryStatus: "pending",
    paymentStatus: "pending",
    paymentMethod: "bank_transfer",
    totalAmount: 8500.0,
    notes: "Smartphone inventory restock",
    createdAt: "2023-07-10T00:00:00.000Z",
    items: [
      {
        productId: 2,
        quantity: 10,
        unitPrice: 600.0,
        total: 6000.0,
      },
      {
        productId: 5,
        quantity: 25,
        unitPrice: 85.0,
        total: 2125.0,
      },
    ],
  },
];

// Get purchases
export const getPurchases = async () => {
  return asyncResponse([...purchases]);
};

// Add purchase
export const addPurchase = async (purchaseData) => {
  const newPurchase = {
    id: generateId(),
    ...purchaseData,
  };
  purchases.push(newPurchase);

  // Update supplier's last order date
  const supplierIndex = suppliers.findIndex(
    (s) => s.id === parseInt(purchaseData.supplierId)
  );
  if (supplierIndex !== -1) {
    suppliers[supplierIndex].lastOrderDate = new Date().toISOString();
  }

  return asyncResponse(newPurchase);
};

// Update purchase
export const updatePurchase = async (id, purchaseData) => {
  const index = purchases.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Purchase not found");
  }

  purchases[index] = { ...purchases[index], ...purchaseData };
  return asyncResponse(purchases[index]);
};

// Delete purchase
export const deletePurchase = async (id) => {
  const index = purchases.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Purchase not found");
  }

  purchases.splice(index, 1);
  return asyncResponse({ success: true });
};

// ==============================================
// EXPENSES
// ==============================================

// Expense categories data
let expenseCategories = [
  {
    id: 1,
    name: "Rent",
    description: "Office and retail space rent",
    color: "#3B82F6",
    budgetLimit: 3000.0,
    expensesCount: 2,
    totalSpent: 6000.0,
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Utilities",
    description: "Electricity, water, internet, etc.",
    color: "#10B981",
    budgetLimit: 1000.0,
    expensesCount: 3,
    totalSpent: 750.0,
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 3,
    name: "Salaries",
    description: "Employee salaries and wages",
    color: "#EF4444",
    budgetLimit: 10000.0,
    expensesCount: 1,
    totalSpent: 9500.0,
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 4,
    name: "Marketing",
    description: "Advertising and promotional expenses",
    color: "#F59E0B",
    budgetLimit: 2000.0,
    expensesCount: 1,
    totalSpent: 1500.0,
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 5,
    name: "Miscellaneous",
    description: "Other business expenses",
    color: "#6366F1",
    budgetLimit: null,
    expensesCount: 1,
    totalSpent: 350.0,
    isActive: true,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
];

// Expenses data
let expenses = [
  {
    id: 1,
    description: "Monthly Office Rent",
    amount: 3000.0,
    date: "2023-07-01T00:00:00.000Z",
    categoryId: 1,
    paymentMethod: "bank_transfer",
    reference: "RENT-JUL2023",
    notes: "Monthly rent payment for main office",
    createdAt: "2023-07-01T00:00:00.000Z",
  },
  {
    id: 2,
    description: "Monthly Store Rent",
    amount: 3000.0,
    date: "2023-07-01T00:00:00.000Z",
    categoryId: 1,
    paymentMethod: "check",
    reference: "CHECK-1002",
    notes: "Monthly rent payment for retail store",
    createdAt: "2023-07-01T00:00:00.000Z",
  },
  {
    id: 3,
    description: "Electricity Bill",
    amount: 350.0,
    date: "2023-07-05T00:00:00.000Z",
    categoryId: 2,
    paymentMethod: "card",
    reference: "ELEC-JUL2023",
    notes: "Monthly electricity bill",
    createdAt: "2023-07-05T00:00:00.000Z",
  },
  {
    id: 4,
    description: "Water Bill",
    amount: 120.0,
    date: "2023-07-06T00:00:00.000Z",
    categoryId: 2,
    paymentMethod: "card",
    reference: "WATER-JUL2023",
    notes: "Monthly water bill",
    createdAt: "2023-07-06T00:00:00.000Z",
  },
  {
    id: 5,
    description: "Internet Service",
    amount: 280.0,
    date: "2023-07-08T00:00:00.000Z",
    categoryId: 2,
    paymentMethod: "card",
    reference: "NET-JUL2023",
    notes: "Monthly internet service fee",
    createdAt: "2023-07-08T00:00:00.000Z",
  },
  {
    id: 6,
    description: "Staff Payroll",
    amount: 9500.0,
    date: "2023-07-15T00:00:00.000Z",
    categoryId: 3,
    paymentMethod: "bank_transfer",
    reference: "PAYROLL-JUL2023",
    notes: "Monthly staff salaries",
    createdAt: "2023-07-15T00:00:00.000Z",
  },
  {
    id: 7,
    description: "Facebook Ads",
    amount: 1500.0,
    date: "2023-07-10T00:00:00.000Z",
    categoryId: 4,
    paymentMethod: "card",
    reference: "FB-JUL2023",
    notes: "Monthly social media advertising",
    createdAt: "2023-07-10T00:00:00.000Z",
  },
  {
    id: 8,
    description: "Office Supplies",
    amount: 350.0,
    date: "2023-07-12T00:00:00.000Z",
    categoryId: 5,
    paymentMethod: "cash",
    reference: "PETTY-001",
    notes: "Paper, pens, and other office supplies",
    createdAt: "2023-07-12T00:00:00.000Z",
  },
];

// Get expense categories
export const getExpenseCategories = async () => {
  return asyncResponse([...expenseCategories]);
};

// Add expense category
export const addExpenseCategory = async (categoryData) => {
  const newCategory = {
    id: generateId(),
    ...categoryData,
    expensesCount: 0,
    totalSpent: 0.0,
  };
  expenseCategories.push(newCategory);
  return asyncResponse(newCategory);
};

// Update expense category
export const updateExpenseCategory = async (id, categoryData) => {
  const index = expenseCategories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Expense category not found");
  }

  expenseCategories[index] = { ...expenseCategories[index], ...categoryData };
  return asyncResponse(expenseCategories[index]);
};

// Delete expense category
export const deleteExpenseCategory = async (id) => {
  const index = expenseCategories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Expense category not found");
  }

  expenseCategories.splice(index, 1);
  return asyncResponse({ success: true });
};

// Get expenses
export const getExpenses = async () => {
  return asyncResponse([...expenses]);
};

// Add expense
export const addExpense = async (expenseData) => {
  const newExpense = {
    id: generateId(),
    ...expenseData,
  };
  expenses.push(newExpense);

  // Update category stats
  if (expenseData.categoryId) {
    const categoryIndex = expenseCategories.findIndex(
      (c) => c.id === expenseData.categoryId
    );
    if (categoryIndex !== -1) {
      expenseCategories[categoryIndex].expensesCount += 1;
      expenseCategories[categoryIndex].totalSpent += parseFloat(
        expenseData.amount
      );
    }
  }

  return asyncResponse(newExpense);
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error("Expense not found");
  }

  const oldAmount = expenses[index].amount;
  const oldCategoryId = expenses[index].categoryId;
  const newAmount =
    expenseData.amount !== undefined
      ? parseFloat(expenseData.amount)
      : oldAmount;
  const newCategoryId =
    expenseData.categoryId !== undefined
      ? expenseData.categoryId
      : oldCategoryId;

  // Update category stats if amount or category changed
  if (oldAmount !== newAmount || oldCategoryId !== newCategoryId) {
    // Update old category stats
    if (oldCategoryId) {
      const oldCategoryIndex = expenseCategories.findIndex(
        (c) => c.id === oldCategoryId
      );
      if (oldCategoryIndex !== -1) {
        expenseCategories[oldCategoryIndex].totalSpent -= oldAmount;
        expenseCategories[oldCategoryIndex].expensesCount -= 1;
      }
    }

    // Update new category stats
    if (newCategoryId) {
      const newCategoryIndex = expenseCategories.findIndex(
        (c) => c.id === newCategoryId
      );
      if (newCategoryIndex !== -1) {
        expenseCategories[newCategoryIndex].totalSpent += newAmount;
        expenseCategories[newCategoryIndex].expensesCount += 1;
      }
    }
  }

  expenses[index] = { ...expenses[index], ...expenseData };
  return asyncResponse(expenses[index]);
};

// Delete expense
export const deleteExpense = async (id) => {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error("Expense not found");
  }

  // Update category stats
  const categoryId = expenses[index].categoryId;
  if (categoryId) {
    const categoryIndex = expenseCategories.findIndex(
      (c) => c.id === categoryId
    );
    if (categoryIndex !== -1) {
      expenseCategories[categoryIndex].expensesCount -= 1;
      expenseCategories[categoryIndex].totalSpent -= expenses[index].amount;
    }
  }

  expenses.splice(index, 1);
  return asyncResponse({ success: true });
};

// ==============================================
// CUSTOMER DEBTS
// ==============================================

// Customer debts data
let customerDebts = [
  {
    id: 1,
    customerName: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    originalAmount: 1500.0,
    paidAmount: 500.0,
    remainingAmount: 1000.0,
    description: "Store credit for bulk purchase",
    dueDate: "2023-08-15T00:00:00.000Z",
    paymentStatus: "partial",
    notes: "Customer promised to pay in installments",
    createdAt: "2023-07-01T00:00:00.000Z",
    payments: [
      {
        amount: 500.0,
        paymentDate: "2023-07-15T00:00:00.000Z",
        paymentMethod: "cash",
        reference: "RCPT-1001",
        notes: "First installment payment",
      },
    ],
  },
  {
    id: 2,
    customerName: "Jane Smith",
    email: "jane@example.com",
    phone: "555-987-6543",
    originalAmount: 750.0,
    paidAmount: 750.0,
    remainingAmount: 0.0,
    description: "Invoice #INV-2023-0042",
    dueDate: "2023-07-20T00:00:00.000Z",
    paymentStatus: "paid",
    notes: "Payment completed before due date",
    createdAt: "2023-07-05T00:00:00.000Z",
    payments: [
      {
        amount: 750.0,
        paymentDate: "2023-07-15T00:00:00.000Z",
        paymentMethod: "card",
        reference: "CARD-TRANS-4532",
        notes: "Full payment via credit card",
      },
    ],
  },
  {
    id: 3,
    customerName: "Robert Johnson",
    email: "robert@example.com",
    phone: "555-456-7890",
    originalAmount: 2500.0,
    paidAmount: 0.0,
    remainingAmount: 2500.0,
    description: "Store credit for equipment purchase",
    dueDate: "2023-09-01T00:00:00.000Z",
    paymentStatus: "unpaid",
    notes: "Customer will pay full amount by due date",
    createdAt: "2023-07-10T00:00:00.000Z",
    payments: [],
  },
];

// Get customers with debts
export const getCustomersWithDebts = async () => {
  return asyncResponse([...customerDebts]);
};

// Add customer debt
export const addCustomerDebt = async (debtData) => {
  const newDebt = {
    id: generateId(),
    ...debtData,
  };
  customerDebts.push(newDebt);
  return asyncResponse(newDebt);
};

// Update customer debt
export const updateCustomerDebt = async (id, debtData) => {
  const index = customerDebts.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error("Customer debt not found");
  }

  customerDebts[index] = { ...customerDebts[index], ...debtData };
  return asyncResponse(customerDebts[index]);
};

// Delete customer debt
export const deleteCustomerDebt = async (id) => {
  const index = customerDebts.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error("Customer debt not found");
  }

  customerDebts.splice(index, 1);
  return asyncResponse({ success: true });
};

// Add payment to customer debt
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

// ==============================================
// DASHBOARD SUMMARY
// ==============================================

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

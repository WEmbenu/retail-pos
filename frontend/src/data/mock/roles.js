// Mock roles and permissions data
export const roles = [
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

export const permissionCategories = [
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

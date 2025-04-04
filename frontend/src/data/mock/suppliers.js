// Mock suppliers data
export const suppliers = [
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

// Mock purchases data
export const purchases = [
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

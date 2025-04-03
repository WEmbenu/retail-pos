import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  DollarSign,
  Receipt,
  X,
  CheckCircle,
  Users,
} from "lucide-react";
import { useSnackbar } from "notistack";
import { Input } from "../../components/ui/input";
import ModalReusable from "../../components/modals/ModalReusable";
import { products, customers } from "../../services/dummyData";

// POS Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md cursor-pointer transition-shadow"
      onClick={() => onAddToCart(product)}
    >
      <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-md mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
        {product.name}
      </h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
          ${product.price.toFixed(2)}
        </span>
        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
          Stock: {product.stockQuantity}
        </span>
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  return (
    <div className="flex items-center py-3 border-b dark:border-gray-700">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-white">
          {item.name}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ${item.price.toFixed(2)} x {item.quantity}
        </p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => onDecrement(item.id)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onIncrement(item.id)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="p-1 ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, cart, total, tax, onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [amountPaid, setAmountPaid] = useState("");
  const [change, setChange] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isOpen) {
      setPaymentMethod("credit_card");
      setAmountPaid("");
      setChange(0);
      setIsProcessing(false);
      setIsComplete(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentMethod === "cash" && amountPaid) {
      const paid = parseFloat(amountPaid);
      if (paid >= total) {
        setChange(paid - total);
      } else {
        setChange(0);
      }
    }
  }, [amountPaid, total, paymentMethod]);

  const handleProcessPayment = () => {
    // Validate payment
    if (
      paymentMethod === "cash" &&
      (!amountPaid || parseFloat(amountPaid) < total)
    ) {
      enqueueSnackbar("Please enter a valid amount", { variant: "error" });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);

      // Simulate receipt printing
      setTimeout(() => {
        onComplete(paymentMethod);
      }, 1500);
    }, 2000);
  };

  if (isComplete) {
    return (
      <ModalReusable
        isOpen={isOpen}
        onClose={onClose}
        title="Payment Successful"
        icon={CheckCircle}
      >
        <div className="text-center py-8">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Payment Complete
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Your transaction has been processed successfully.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Printing receipt...
          </p>
        </div>
      </ModalReusable>
    );
  }

  return (
    <ModalReusable
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Payment"
      icon={CreditCard}
    >
      <div className="space-y-6">
        {/* Payment summary */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="font-medium">${(total - tax).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-800 dark:text-white">Total:</span>
            <span className="text-primary-600 dark:text-primary-400">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment method selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`py-3 px-4 border rounded-lg flex items-center justify-center ${
                paymentMethod === "credit_card"
                  ? "bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setPaymentMethod("credit_card")}
            >
              <CreditCard
                size={20}
                className={`mr-2 ${
                  paymentMethod === "credit_card"
                    ? "text-primary-500 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
              Credit Card
            </button>
            <button
              type="button"
              className={`py-3 px-4 border rounded-lg flex items-center justify-center ${
                paymentMethod === "cash"
                  ? "bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setPaymentMethod("cash")}
            >
              <DollarSign
                size={20}
                className={`mr-2 ${
                  paymentMethod === "cash"
                    ? "text-primary-500 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
              Cash
            </button>
          </div>
        </div>

        {/* Cash payment fields */}
        {paymentMethod === "cash" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount Received
              </label>
              <Input
                type="number"
                min={total}
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder={`Minimum: $${total.toFixed(2)}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Change
              </label>
              <div className="bg-gray-50 dark:bg-gray-800 py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 text-lg font-medium">
                ${change.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Process payment button */}
        <div className="flex justify-end">
          <button
            onClick={handleProcessPayment}
            disabled={
              isProcessing ||
              (paymentMethod === "cash" &&
                (!amountPaid || parseFloat(amountPaid) < total))
            }
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Receipt size={18} className="mr-2" />
                Complete Payment
              </>
            )}
          </button>
        </div>
      </div>
    </ModalReusable>
  );
};

// Main Point of Sale Component
const PointOfSale = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cart, setCart] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      product.categoryId.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName
        .toLowerCase()
        .includes(customerSearchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.phone.includes(customerSearchTerm)
  );

  // Calculate cart totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.07; // 7% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Add product to cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    enqueueSnackbar(`${product.name} added to cart`, { variant: "success" });
  };

  // Increment item quantity in cart
  const handleIncrement = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrement item quantity in cart
  const handleDecrement = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
      return updatedCart;
    });
  };

  // Remove item from cart
  const handleRemove = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Select customer
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(false);
    enqueueSnackbar(`Selected customer: ${customer.fullName}`, {
      variant: "success",
    });
  };

  // Complete transaction
  const handleCompleteTransaction = (paymentMethod) => {
    // In a real app, this would send the transaction to the server
    const transaction = {
      customerId: selectedCustomer?.id || null,
      customerName: selectedCustomer?.fullName || "Walk-in Customer",
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        discount: 0,
      })),
      subtotal,
      tax,
      total,
      paymentMethod,
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    console.log("Transaction completed:", transaction);

    // Reset state
    setCart([]);
    setSelectedCustomer(null);
    setIsPaymentModalOpen(false);
    enqueueSnackbar("Transaction completed successfully", {
      variant: "success",
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Point of Sale
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Process sales transactions
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Products Section - Left Side */}
        <div className="lg:w-2/3 space-y-4">
          {/* Search & Filter */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search products..."
                  variant="icon"
                  icon={Search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="1">Electronics</option>
                  <option value="2">Clothing</option>
                  <option value="3">Groceries</option>
                  <option value="4">Furniture</option>
                  <option value="5">Beauty</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No products found.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section - Right Side */}
        <div className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Shopping Cart
            </h2>
            <button
              onClick={handleClearCart}
              disabled={cart.length === 0}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </div>

          {/* Customer Selection */}
          <div className="p-4 border-b dark:border-gray-700">
            {selectedCustomer ? (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customer
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedCustomer.fullName}
                  </p>
                </div>
                <button
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCustomerModalOpen(true)}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                + Select Customer
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length > 0 ? (
              <div className="space-y-1">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Your cart is empty
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Add products to begin
                </p>
              </div>
            )}
          </div>

          {/* Cart Totals */}
          <div className="p-4 border-t dark:border-gray-700 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (7%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={cart.length === 0}
              className="w-full py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      {/* Customer Selection Modal */}
      <ModalReusable
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Select Customer"
        icon={Users}
      >
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search customers..."
            variant="icon"
            icon={Search}
            value={customerSearchTerm}
            onChange={(e) => setCustomerSearchTerm(e.target.value)}
          />
          <div className="max-h-80 overflow-y-auto">
            {filteredCustomers.length > 0 ? (
              <div className="divide-y dark:divide-gray-700">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {customer.fullName}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ${customer.totalSpent.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="mr-3">{customer.email}</span>
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No customers found.
                </p>
              </div>
            )}
          </div>
        </div>
      </ModalReusable>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        cart={cart}
        total={total}
        tax={tax}
        onComplete={handleCompleteTransaction}
      />
    </div>
  );
};

export default PointOfSale;

import { asyncResponse, generateId } from "../utils";
import { purchases } from "../mock/suppliers";
import { suppliers } from "../mock/suppliers";

/**
 * Get all purchases
 * @returns {Promise<Array>} - List of purchases
 */
export const getPurchases = async () => {
  return asyncResponse([...purchases]);
};

/**
 * Get purchase by ID
 * @param {number} id - Purchase ID
 * @returns {Promise<Object>} - Purchase data
 */
export const getPurchaseById = async (id) => {
  const purchase = purchases.find((purchase) => purchase.id === id);
  if (!purchase) {
    throw new Error("Purchase not found");
  }
  return asyncResponse({ ...purchase });
};

/**
 * Add new purchase
 * @param {Object} purchaseData - Purchase data
 * @returns {Promise<Object>} - Created purchase
 */
export const addPurchase = async (purchaseData) => {
  const newPurchase = {
    id: generateId(),
    createdAt: new Date().toISOString(),
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

/**
 * Update purchase
 * @param {number} id - Purchase ID
 * @param {Object} purchaseData - Purchase data to update
 * @returns {Promise<Object>} - Updated purchase
 */
export const updatePurchase = async (id, purchaseData) => {
  const index = purchases.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Purchase not found");
  }

  purchases[index] = { ...purchases[index], ...purchaseData };
  return asyncResponse(purchases[index]);
};

/**
 * Delete purchase
 * @param {number} id - Purchase ID
 * @returns {Promise<Object>} - Success status
 */
export const deletePurchase = async (id) => {
  const index = purchases.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Purchase not found");
  }

  purchases.splice(index, 1);
  return asyncResponse({ success: true });
};

/**
 * Get purchases by supplier ID
 * @param {number} supplierId - Supplier ID
 * @returns {Promise<Array>} - List of purchases for the supplier
 */
export const getPurchasesBySupplier = async (supplierId) => {
  const supplierPurchases = purchases.filter(
    (p) => p.supplierId === parseInt(supplierId)
  );
  return asyncResponse(supplierPurchases);
};

/**
 * Update purchase delivery status
 * @param {number} id - Purchase ID
 * @param {string} status - Delivery status
 * @returns {Promise<Object>} - Updated purchase
 */
export const updateDeliveryStatus = async (id, status) => {
  const index = purchases.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Purchase not found");
  }

  purchases[index].deliveryStatus = status;
  return asyncResponse(purchases[index]);
};

/**
 * Update purchase payment status
 * @param {number} id - Purchase ID
 * @param {string} status - Payment status
 * @returns {Promise<Object>} - Updated purchase
 */
export const updatePaymentStatus = async (id, status) => {
  const index = purchases.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Purchase not found");
  }

  purchases[index].paymentStatus = status;
  return asyncResponse(purchases[index]);
};

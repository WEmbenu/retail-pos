import { asyncResponse, generateId } from "../utils";
import { suppliers } from "../mock/suppliers";

/**
 * Get all suppliers
 * @returns {Promise<Array>} - List of suppliers
 */
export const getSuppliers = async () => {
  return asyncResponse([...suppliers]);
};

/**
 * Get supplier by ID
 * @param {number} id - Supplier ID
 * @returns {Promise<Object>} - Supplier data
 */
export const getSupplierById = async (id) => {
  const supplier = suppliers.find((supplier) => supplier.id === id);
  if (!supplier) {
    throw new Error("Supplier not found");
  }
  return asyncResponse({ ...supplier });
};

/**
 * Add new supplier
 * @param {Object} supplierData - Supplier data
 * @returns {Promise<Object>} - Created supplier
 */
export const addSupplier = async (supplierData) => {
  const newSupplier = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: "active",
    productsCount: 0,
    ...supplierData,
  };
  suppliers.push(newSupplier);
  return asyncResponse(newSupplier);
};

/**
 * Update supplier
 * @param {number} id - Supplier ID
 * @param {Object} supplierData - Supplier data to update
 * @returns {Promise<Object>} - Updated supplier
 */
export const updateSupplier = async (id, supplierData) => {
  const index = suppliers.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error("Supplier not found");
  }

  suppliers[index] = { ...suppliers[index], ...supplierData };
  return asyncResponse(suppliers[index]);
};

/**
 * Delete supplier
 * @param {number} id - Supplier ID
 * @returns {Promise<Object>} - Success status
 */
export const deleteSupplier = async (id) => {
  const index = suppliers.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error("Supplier not found");
  }

  suppliers.splice(index, 1);
  return asyncResponse({ success: true });
};

import { asyncResponse, generateId } from "../utils";
import { categories } from "../mock/products";

/**
 * Get all product categories
 * @returns {Promise<Array>} - List of categories
 */
export const getCategories = async () => {
  return asyncResponse([...categories]);
};

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object>} - Category data
 */
export const getCategoryById = async (id) => {
  const category = categories.find((category) => category.id === id);
  if (!category) {
    throw new Error("Category not found");
  }
  return asyncResponse({ ...category });
};

/**
 * Add new category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} - Created category
 */
export const addCategory = async (categoryData) => {
  const newCategory = {
    id: generateId(),
    productsCount: 0,
    ...categoryData,
  };
  categories.push(newCategory);
  return asyncResponse(newCategory);
};

/**
 * Update category
 * @param {number} id - Category ID
 * @param {Object} categoryData - Category data to update
 * @returns {Promise<Object>} - Updated category
 */
export const updateCategory = async (id, categoryData) => {
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Category not found");
  }

  categories[index] = { ...categories[index], ...categoryData };
  return asyncResponse(categories[index]);
};

/**
 * Delete category
 * @param {number} id - Category ID
 * @returns {Promise<Object>} - Success status
 */
export const deleteCategory = async (id) => {
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Category not found");
  }

  // Check if category has products
  if (categories[index].productsCount > 0) {
    throw new Error("Cannot delete category with associated products");
  }

  categories.splice(index, 1);
  return asyncResponse({ success: true });
};

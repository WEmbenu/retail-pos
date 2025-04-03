import { asyncResponse, generateId } from "../utils";
import { products, categories } from "../mock/products";

/**
 * Get all products
 * @returns {Promise<Array>} - List of products
 */
export const getProducts = async () => {
  return asyncResponse([...products]);
};

/**
 * Get product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Object>} - Product data
 */
export const getProductById = async (id) => {
  const product = products.find((product) => product.id === id);
  if (!product) {
    throw new Error("Product not found");
  }
  return asyncResponse({ ...product });
};

/**
 * Add new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} - Created product
 */
export const addProduct = async (productData) => {
  const newProduct = {
    id: generateId(),
    isActive: true,
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

/**
 * Update product
 * @param {number} id - Product ID
 * @param {Object} productData - Product data to update
 * @returns {Promise<Object>} - Updated product
 */
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

/**
 * Delete product
 * @param {number} id - Product ID
 * @returns {Promise<Object>} - Success status
 */
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

/**
 * Update product stock
 * @param {number} id - Product ID
 * @param {number} quantity - Quantity to add or subtract
 * @returns {Promise<Object>} - Updated product
 */
export const updateProductStock = async (id, quantity) => {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }

  products[index].stockQuantity += quantity;
  return asyncResponse(products[index]);
};

/**
 * Search products by name
 * @param {string} query - Search query
 * @returns {Promise<Array>} - List of matching products
 */
export const searchProducts = async (query) => {
  const searchResults = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  return asyncResponse(searchResults);
};

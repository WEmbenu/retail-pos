import { asyncResponse, generateId } from "../utils";
import { users } from "../mock/users";

/**
 * Get all users
 * @returns {Promise<Array>} - List of users
 */
export const getUsers = async () => {
  return asyncResponse([...users]);
};

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} - User data
 */
export const getUserById = async (id) => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    throw new Error("User not found");
  }
  return asyncResponse({ ...user });
};

/**
 * Add new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user
 */
export const addUser = async (userData) => {
  const newUser = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    lastLogin: null,
    isActive: true,
    ...userData,
  };
  users.push(newUser);
  return asyncResponse(newUser);
};

/**
 * Update user
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} - Updated user
 */
export const updateUser = async (id, userData) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error("User not found");
  }

  users[index] = { ...users[index], ...userData };
  return asyncResponse(users[index]);
};

/**
 * Delete user
 * @param {number} id - User ID
 * @returns {Promise<Object>} - Success status
 */
export const deleteUser = async (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error("User not found");
  }

  users.splice(index, 1);
  return asyncResponse({ success: true });
};

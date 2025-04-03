import { asyncResponse, generateId } from "../utils";
import { roles, permissionCategories } from "../mock/roles";

/**
 * Get all roles
 * @returns {Promise<Array>} - List of roles
 */
export const getRoles = async () => {
  return asyncResponse([...roles]);
};

/**
 * Get permissions categorized by groups
 * @returns {Promise<Array>} - List of permission categories
 */
export const getPermissions = async () => {
  return asyncResponse([...permissionCategories]);
};

/**
 * Get role by ID
 * @param {number} id - Role ID
 * @returns {Promise<Object>} - Role data
 */
export const getRoleById = async (id) => {
  const role = roles.find((role) => role.id === id);
  if (!role) {
    throw new Error("Role not found");
  }
  return asyncResponse({ ...role });
};

/**
 * Add new role
 * @param {Object} roleData - Role data
 * @returns {Promise<Object>} - Created role
 */
export const addRole = async (roleData) => {
  const newRole = {
    id: generateId(),
    userCount: 0,
    createdAt: new Date().toISOString(),
    ...roleData,
  };
  roles.push(newRole);
  return asyncResponse(newRole);
};

/**
 * Update role
 * @param {number} id - Role ID
 * @param {Object} roleData - Role data to update
 * @returns {Promise<Object>} - Updated role
 */
export const updateRole = async (id, roleData) => {
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error("Role not found");
  }

  roles[index] = { ...roles[index], ...roleData };
  return asyncResponse(roles[index]);
};

/**
 * Delete role
 * @param {number} id - Role ID
 * @returns {Promise<Object>} - Success status
 */
export const deleteRole = async (id) => {
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error("Role not found");
  }

  roles.splice(index, 1);
  return asyncResponse({ success: true });
};

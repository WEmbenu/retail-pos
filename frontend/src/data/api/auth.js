import { asyncResponse } from "../utils";
import { users } from "../mock/users";

/**
 * Mock login function that simulates authentication
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User data with token
 */
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

/**
 * Simulates logout functionality
 * @returns {Promise<Object>} - Success status
 */
export const logout = async () => {
  return asyncResponse({ success: true });
};

/**
 * Mock function to check if user is authenticated
 * @param {string} token - JWT token
 * @returns {Promise<boolean>} - Authentication status
 */
export const isAuthenticated = async (token) => {
  return asyncResponse(token === "mock-jwt-token");
};

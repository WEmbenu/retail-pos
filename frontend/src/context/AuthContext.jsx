import React, { createContext, useContext, useState, useEffect } from "react";

// Define user roles
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  CASHIER: "cashier",
  INVENTORY: "inventory",
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if there's a saved user in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    // In a real app, this would validate credentials with the server
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        hasRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

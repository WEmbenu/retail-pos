import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Layout Components
import MainLayout from "./components/layout/MainLayout";

// Auth Pages
import Login from "./pages/auth/Login";

// Main Pages
import Dashboard from "./pages/dashboard/Dashboard";
import PointOfSale from "./pages/pos/PointOfSale";
import Products from "./pages/products/Products";
import ProductCategories from "./pages/products/Categories";
import Customers from "./pages/customers/Customers";
import ClientDebts from "./pages/customers/ClientDebts";
import Transactions from "./pages/transactions/Transactions";

// Inventory Pages
import Suppliers from "./pages/suppliers/Suppliers";
import Purchases from "./pages/purchases/Purchases";

// Finance Pages
import Expenses from "./pages/expenses/Expenses";
import ExpenseCategories from "./pages/expenses/ExpenseCategories";

// Report Pages
import SalesReport from "./pages/reports/SalesReport";
import InventoryReport from "./pages/reports/InventoryReport";

// Admin Pages
import Admin from "./pages/admin/Admin";
import RoleManagement from "./pages/admin/RoleManagement";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";
import Notifications from "./pages/notifications/Notifications";

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          autoHideDuration={3000}
        >
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <MainLayout />
                  </PrivateRoute>
                }
              >
                {/* Main Pages */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pos" element={<PointOfSale />} />
                <Route path="/products" element={<Products />} />
                <Route
                  path="/products/categories"
                  element={<ProductCategories />}
                />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/debts" element={<ClientDebts />} />
                <Route path="/transactions" element={<Transactions />} />

                {/* Inventory Pages */}
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/purchases" element={<Purchases />} />

                {/* Finance Pages */}
                <Route path="/expenses" element={<Expenses />} />
                <Route
                  path="/expenses/categories"
                  element={<ExpenseCategories />}
                />

                {/* Report Pages */}
                <Route path="/reports/sales" element={<SalesReport />} />
                <Route
                  path="/reports/inventory"
                  element={<InventoryReport />}
                />

                {/* Admin Pages - Only accessible to admin and manager roles */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute requiredRoles={["admin", "manager"]}>
                      <Admin />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/roles"
                  element={
                    <PrivateRoute requiredRoles={["admin"]}>
                      <RoleManagement />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute requiredRoles={["admin", "manager"]}>
                      <Settings />
                    </PrivateRoute>
                  }
                />

                {/* User Profile - Accessible to all authenticated users */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>

              {/* 404 Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

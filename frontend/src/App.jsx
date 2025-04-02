import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Auth Pages
import Login from "./pages/auth/Login";

// Main Pages
import Dashboard from "./pages/dashboard/Dashboard";
import PointOfSale from "./pages/pos/PointOfSale";
import Products from "./pages/products/Products";
import Customers from "./pages/customers/Customers";
import Transactions from "./pages/transactions/Transactions";
import Settings from "./pages/settings/Settings";

// Report Pages
import SalesReport from "./pages/reports/SalesReport";
import InventoryReport from "./pages/reports/InventoryReport";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pos" element={<PointOfSale />} />
                <Route path="products" element={<Products />} />
                <Route path="customers" element={<Customers />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="settings" element={<Settings />} />

                {/* Report Routes */}
                <Route path="reports/sales" element={<SalesReport />} />
                <Route path="reports/inventory" element={<InventoryReport />} />
              </Route>

              {/* Catch All Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

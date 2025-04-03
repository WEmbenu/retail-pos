import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, ROLES } from "../../context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  Settings,
  FileText,
  BarChart3,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const MenuItem = ({ to, icon: Icon, text, onClick, isCollapsed, isActive }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
      isActive
        ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    } ${isCollapsed ? "justify-center" : ""}`}
  >
    <Icon size={20} className={isCollapsed ? "mx-auto" : "mr-3"} />
    {!isCollapsed && <span>{text}</span>}
  </Link>
);

const MenuSection = ({ title, children, isCollapsed }) => (
  <div className="mb-6">
    {!isCollapsed && (
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
    )}
    <div className="mt-2 space-y-1">{children}</div>
  </div>
);

const Sidebar = ({ isMobile = false, onCloseMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { logout, hasRole } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle mobile menu click
  const handleMenuClick = () => {
    if (isMobile) {
      onCloseMobile();
    }
  };

  return (
    <div
      className={`flex flex-col h-full transition-all duration-300 border-r dark:border-gray-700 bg-white dark:bg-gray-900 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo and Collapse Button */}
      <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
        {!isCollapsed && (
          <Link
            to="/"
            className="text-xl font-bold text-primary-600 dark:text-primary-400"
          >
            RetailPOS
          </Link>
        )}
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isCollapsed ? (
              <ChevronRight size={20} className="text-gray-500" />
            ) : (
              <ChevronLeft size={20} className="text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <MenuSection title="Main" isCollapsed={isCollapsed}>
          <MenuItem
            to="/dashboard"
            icon={LayoutDashboard}
            text="Dashboard"
            isCollapsed={isCollapsed}
            isActive={pathname === "/dashboard"}
            onClick={handleMenuClick}
          />
          <MenuItem
            to="/pos"
            icon={ShoppingCart}
            text="Point of Sale"
            isCollapsed={isCollapsed}
            isActive={pathname === "/pos"}
            onClick={handleMenuClick}
          />
          <MenuItem
            to="/products"
            icon={Package}
            text="Products"
            isCollapsed={isCollapsed}
            isActive={pathname.startsWith("/products")}
            onClick={handleMenuClick}
          />
          <MenuItem
            to="/customers"
            icon={Users}
            text="Customers"
            isCollapsed={isCollapsed}
            isActive={pathname.startsWith("/customers")}
            onClick={handleMenuClick}
          />
          <MenuItem
            to="/transactions"
            icon={Receipt}
            text="Transactions"
            isCollapsed={isCollapsed}
            isActive={pathname.startsWith("/transactions")}
            onClick={handleMenuClick}
          />
        </MenuSection>

        <MenuSection title="Reports" isCollapsed={isCollapsed}>
          <MenuItem
            to="/reports/sales"
            icon={BarChart3}
            text="Sales Report"
            isCollapsed={isCollapsed}
            isActive={pathname === "/reports/sales"}
            onClick={handleMenuClick}
          />
          <MenuItem
            to="/reports/inventory"
            icon={FileText}
            text="Inventory Report"
            isCollapsed={isCollapsed}
            isActive={pathname === "/reports/inventory"}
            onClick={handleMenuClick}
          />
        </MenuSection>

        {hasRole([ROLES.ADMIN, ROLES.MANAGER]) && (
          <MenuSection title="Admin" isCollapsed={isCollapsed}>
            <MenuItem
              to="/admin"
              icon={Users}
              text="Admin Panel"
              isCollapsed={isCollapsed}
              isActive={pathname === "/admin"}
              onClick={handleMenuClick}
            />
            <MenuItem
              to="/settings"
              icon={Settings}
              text="Settings"
              isCollapsed={isCollapsed}
              isActive={pathname === "/settings"}
              onClick={handleMenuClick}
            />
          </MenuSection>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t dark:border-gray-700">
        <div className="flex flex-col gap-2">
          <button
            onClick={toggleTheme}
            className={`flex items-center px-3 py-2 text-sm rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun size={20} className={isCollapsed ? "mx-auto" : "mr-3"} />
                {!isCollapsed && <span>Light Mode</span>}
              </>
            ) : (
              <>
                <Moon size={20} className={isCollapsed ? "mx-auto" : "mr-3"} />
                {!isCollapsed && <span>Dark Mode</span>}
              </>
            )}
          </button>
          <button
            onClick={logout}
            className={`flex items-center px-3 py-2 text-sm rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} className={isCollapsed ? "mx-auto" : "mr-3"} />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

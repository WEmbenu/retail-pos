import React, { useState } from "react";
import { Menu, Bell, Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { useAuth } from "../../context/AuthContext";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-16 px-4 border-b dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between">
      {/* Left side - menu button and title */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white hidden sm:block">
          Retail POS System
        </h1>
      </div>

      {/* Right side - search, notifications, user profile */}
      <div className="flex items-center space-x-3">
        {/* Responsive search - show button on mobile, input on desktop */}
        <div className="relative hidden md:block">
          <Input
            type="text"
            placeholder="Search..."
            variant="icon"
            icon={Search}
            className="w-64"
          />
        </div>

        {/* Mobile search button & slide-in search */}
        <div className="md:hidden">
          {isSearchOpen ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white dark:bg-gray-900 px-4">
              <Input
                type="text"
                placeholder="Search..."
                variant="icon"
                icon={Search}
                className="w-full"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 p-2 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="ml-2 hidden sm:block">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {user?.role || "Guest"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

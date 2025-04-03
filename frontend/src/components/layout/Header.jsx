import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Bell,
  Search,
  X,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShoppingCart,
} from "lucide-react";
import { Input } from "../ui/input";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Sample notifications - in a real app, these would come from an API
  const notifications = [
    {
      id: 1,
      type: "alert",
      message: "Low stock alert: Desk Lamp",
      time: "10 minutes ago",
      isRead: false,
      link: "/reports/inventory",
    },
    {
      id: 2,
      type: "success",
      message: "New customer registered: Emily Watson",
      time: "2 hours ago",
      isRead: false,
      link: "/customers",
    },
    {
      id: 3,
      type: "info",
      message: "Daily sales target achieved!",
      time: "Today, 3:45 PM",
      isRead: true,
      link: "/reports/sales",
    },
    {
      id: 4,
      type: "alert",
      message: "Transaction #TRX-20230608-002 was refunded",
      time: "Yesterday",
      isRead: true,
      link: "/transactions",
    },
  ];

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "alert":
        return <AlertCircle size={16} className="text-red-500" />;
      case "info":
        return <ShoppingCart size={16} className="text-blue-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <header className="h-16 px-4 border-b dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between z-30">
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
            className="w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
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
                className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 p-2 text-gray-500 dark:text-gray-400"
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
        <div className="relative" ref={notificationsRef}>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white relative"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-30"
              >
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      Notifications
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {unreadCount} unread
                    </span>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                            notification.isRead
                              ? ""
                              : "bg-blue-50 dark:bg-blue-900/20"
                          }`}
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            navigate(notification.link);
                          }}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${
                                  notification.isRead
                                    ? "text-gray-600 dark:text-gray-400"
                                    : "text-gray-900 dark:text-white font-medium"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-500">
                                <Clock size={12} className="mr-1" />
                                {notification.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications yet
                    </div>
                  )}
                </div>

                <div className="p-2 border-t dark:border-gray-700 text-center">
                  <div className="p-2 border-t dark:border-gray-700 text-center">
                    <a
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/notifications");
                      }}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User profile */}
        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center focus:outline-none"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
          >
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                {user?.name || "User"}
                <ChevronDown size={14} className="ml-1" />
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {user?.role || "Guest"}
              </p>
            </div>
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-30"
              >
                <div className="p-4 border-b dark:border-gray-700">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <div className="py-2">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <User
                      size={16}
                      className="mr-2 text-gray-500 dark:text-gray-400"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      My Profile
                    </span>
                  </button>

                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/settings");
                    }}
                  >
                    <Settings
                      size={16}
                      className="mr-2 text-gray-500 dark:text-gray-400"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Settings
                    </span>
                  </button>

                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    onClick={toggleTheme}
                  >
                    {isDarkMode ? (
                      <>
                        <Sun
                          size={16}
                          className="mr-2 text-gray-500 dark:text-gray-400"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          Light Mode
                        </span>
                      </>
                    ) : (
                      <>
                        <Moon
                          size={16}
                          className="mr-2 text-gray-500 dark:text-gray-400"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          Dark Mode
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="py-2 border-t dark:border-gray-700">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;

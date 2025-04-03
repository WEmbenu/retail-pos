// src/pages/notifications/Notifications.jsx
import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShoppingCart,
  Filter,
  ChevronDown,
  Check,
  Search,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { useSnackbar } from "notistack";

const Notifications = () => {
  // Sample notifications - in a real app, these would come from an API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      message: "Low stock alert: Desk Lamp",
      description:
        "The product 'Desk Lamp' has reached the low stock threshold. Current stock: 0 units.",
      time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      isRead: false,
      link: "/reports/inventory",
    },
    {
      id: 2,
      type: "success",
      message: "New customer registered: Emily Watson",
      description:
        "A new customer account has been created. Customer ID: CUST-005",
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      link: "/customers",
    },
    {
      id: 3,
      type: "info",
      message: "Daily sales target achieved!",
      description:
        "Congratulations! Your store has reached the daily sales target of $1,000.",
      time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      link: "/reports/sales",
    },
    {
      id: 4,
      type: "alert",
      message: "Transaction #TRX-20230608-002 was refunded",
      description:
        "A refund has been processed for Transaction #TRX-20230608-002. Amount: $215.95",
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      link: "/transactions",
    },
    {
      id: 5,
      type: "success",
      message: "Inventory reconciliation complete",
      description:
        "The scheduled inventory reconciliation has been completed successfully.",
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      link: "/reports/inventory",
    },
    {
      id: 6,
      type: "info",
      message: "New product category added: Electronics",
      description:
        "A new product category 'Electronics' has been added to the system.",
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      link: "/products",
    },
    {
      id: 7,
      type: "alert",
      message: "Failed login attempt",
      description:
        "There was a failed login attempt to your account from an unknown device.",
      time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      link: "/settings",
    },
    {
      id: 8,
      type: "success",
      message: "Backup completed successfully",
      description: "The weekly system backup has been completed successfully.",
      time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      link: "/settings",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={20} className="text-green-500" />;
      case "alert":
        return <AlertCircle size={20} className="text-red-500" />;
      case "info":
        return <ShoppingCart size={20} className="text-blue-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  // Format notification time
  const formatNotificationTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 7) {
      return date.toLocaleDateString();
    } else if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by type
    if (filterType !== "all" && notification.type !== filterType) {
      return false;
    }

    // Filter by search term
    if (
      searchTerm &&
      !notification.message.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !notification.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
      setLoading(false);
      enqueueSnackbar("All notifications marked as read", {
        variant: "success",
      });
    }, 800);
  };

  // Mark one notification as read
  const handleMarkAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Delete all notifications
  const handleDeleteAll = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setNotifications([]);
      setLoading(false);
      enqueueSnackbar("All notifications cleared", { variant: "success" });
    }, 800);
  };

  // Delete a single notification
  const handleDeleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
    enqueueSnackbar("Notification removed", { variant: "success" });
  };

  // Reload notifications
  const handleReload = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch new notifications here
      setLoading(false);
      enqueueSnackbar("Notifications refreshed", { variant: "success" });
    }, 800);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all your system notifications
        </p>
      </div>

      {/* Notification Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-50 dark:bg-gray-700 w-full sm:w-64"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between w-full sm:w-44 p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300"
              >
                <div className="flex items-center">
                  <Filter size={16} className="mr-2 text-gray-500" />
                  <span>
                    {filterType === "all"
                      ? "All Types"
                      : filterType === "success"
                      ? "Success"
                      : filterType === "alert"
                      ? "Alerts"
                      : "Information"}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute mt-1 w-full sm:w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setFilterType("all");
                        setIsFilterOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span>All Types</span>
                      {filterType === "all" && (
                        <Check size={16} className="text-primary-600" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setFilterType("success");
                        setIsFilterOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span>Success</span>
                      {filterType === "success" && (
                        <Check size={16} className="text-primary-600" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setFilterType("alert");
                        setIsFilterOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span>Alerts</span>
                      {filterType === "alert" && (
                        <Check size={16} className="text-primary-600" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setFilterType("info");
                        setIsFilterOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span>Information</span>
                      {filterType === "info" && (
                        <Check size={16} className="text-primary-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading || notifications.every((n) => n.isRead)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Check size={16} className="mr-1" />
              Mark All Read
            </button>

            <button
              onClick={handleReload}
              disabled={loading}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <RefreshCw
                size={16}
                className={`mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              onClick={handleDeleteAll}
              disabled={loading || notifications.length === 0}
              className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <Trash2 size={16} className="mr-1" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            All Notifications
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {notifications.filter((n) => !n.isRead).length} unread
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading notifications...
            </span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center px-4">
            <Bell size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
              No notifications
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              You don't have any notifications at the moment. They will appear
              here when system events occur.
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center px-4">
            <Search
              size={48}
              className="text-gray-300 dark:text-gray-600 mb-4"
            />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
              No matching notifications
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              No notifications match your current search or filter criteria. Try
              adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 relative ${
                  notification.isRead ? "" : "bg-blue-50 dark:bg-blue-900/20"
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.type === "success"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : notification.type === "alert"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-blue-100 dark:bg-blue-900/30"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p
                        className={`text-sm font-medium ${
                          notification.isRead
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center ml-2">
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {notification.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {formatNotificationTime(notification.time)}
                      </div>

                      <div className="flex items-center">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline mr-3"
                          >
                            Mark as read
                          </button>
                        )}
                        <Link
                          to={notification.link}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredNotifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredNotifications.length} of {notifications.length}{" "}
              notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

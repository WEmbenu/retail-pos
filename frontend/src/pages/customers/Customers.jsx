import React from "react";
import { Users } from "lucide-react";

const Customers = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Customers
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your customer relationships
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Customer Management Coming Soon
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          This part of the application is under development. Check back soon for
          full customer management capabilities.
        </p>
      </div>
    </div>
  );
};

export default Customers;

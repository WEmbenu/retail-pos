import React from "react";
import { Receipt } from "lucide-react";

const Transactions = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Receipt className="h-6 w-6 mr-2" />
          Transactions
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          View and manage sales transactions
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Transactions History Coming Soon
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          This part of the application is under development. Check back soon for
          full transaction history and management.
        </p>
      </div>
    </div>
  );
};

export default Transactions;

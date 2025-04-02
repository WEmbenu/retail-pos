import React from "react";
import { BarChart } from "lucide-react";

const SalesReport = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart className="h-6 w-6 mr-2" />
          Sales Report
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Analyze your sales performance
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Sales Reporting Coming Soon
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          This part of the application is under development. Check back soon for
          comprehensive sales analysis and reporting.
        </p>
      </div>
    </div>
  );
};

export default SalesReport;

import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <SettingsIcon className="h-6 w-6 mr-2" />
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configure your POS system
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          System Settings Coming Soon
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          This part of the application is under development. Check back soon for
          full system configuration options.
        </p>
      </div>
    </div>
  );
};

export default Settings;

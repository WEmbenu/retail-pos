import React from "react";
import { Tab } from "@headlessui/react";

const Tabs = ({ defaultValue, ...props }) => {
  const defaultIndex = React.Children.toArray(props.children)
    .filter((child) => React.isValidElement(child) && child.type === TabsList)
    .flatMap((tabsList) => React.Children.toArray(tabsList.props.children))
    .findIndex(
      (child) =>
        React.isValidElement(child) && child.props.value === defaultValue
    );

  return (
    <Tab.Group
      defaultIndex={defaultIndex !== -1 ? defaultIndex : 0}
      {...props}
    />
  );
};

const TabsList = ({ className, ...props }) => (
  <Tab.List
    className={`inline-flex items-center justify-center rounded-lg bg-gray-100 p-1 ${className}`}
    {...props}
  />
);

const TabsTrigger = ({ className, value, ...props }) => (
  <Tab
    className={({ selected }) =>
      `inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm ${className}`
    }
    {...props}
  />
);

const TabsContent = ({ className, value, ...props }) => (
  <Tab.Panel
    className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`}
    {...props}
  />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };

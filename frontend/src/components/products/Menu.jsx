import React from "react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

// This is a wrapper component around HeadlessUI's Menu
// It properly handles the props by using a div element instead of a Fragment
const Menu = ({
  children,
  label = "Options",
  buttonClassName = "",
  menuClassName = "",
  align = "right",
  ...props
}) => {
  return (
    <HeadlessMenu
      as="div"
      className="relative inline-block text-left"
      {...props}
    >
      {({ open }) => (
        <>
          <HeadlessMenu.Button
            className={`inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 ${buttonClassName}`}
          >
            {label}
            <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
          </HeadlessMenu.Button>

          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HeadlessMenu.Items
              className={`absolute z-10 mt-2 ${
                align === "right" ? "right-0" : "left-0"
              } w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 ${menuClassName}`}
            >
              <div className="py-1">{children}</div>
            </HeadlessMenu.Items>
          </Transition>
        </>
      )}
    </HeadlessMenu>
  );
};

// MenuItem component for easier usage
const MenuItem = ({ onClick, disabled = false, children, className = "" }) => {
  return (
    <HeadlessMenu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          disabled={disabled}
          className={`${
            active
              ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
              : "text-gray-700 dark:text-gray-200"
          } group flex w-full items-center px-4 py-2 text-sm ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
        >
          {children}
        </button>
      )}
    </HeadlessMenu.Item>
  );
};

// Export both the Menu and the MenuItem components
Menu.Item = MenuItem;

export default Menu;

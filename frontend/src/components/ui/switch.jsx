import * as React from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";

const Switch = React.forwardRef(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <HeadlessSwitch
        checked={checked}
        onChange={onCheckedChange}
        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
          checked ? "bg-cyan-600" : "bg-gray-200"
        } ${className}`}
        ref={ref}
        {...props}
      >
        <span className="sr-only">Toggle</span>
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </HeadlessSwitch>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };

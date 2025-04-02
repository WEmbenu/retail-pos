import React, { useState } from "react";

const Tooltip = ({
  children,
  text,
  position = "top",
  delay = 400,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-700 border-r-transparent border-b-transparent border-l-transparent",
    bottom:
      "bottom-full left-1/2 transform -translate-x-1/2 border-t-transparent border-r-transparent border-b-gray-700 border-l-transparent",
    left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-r-transparent border-b-transparent border-l-gray-700",
    right:
      "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-r-gray-700 border-b-transparent border-l-transparent",
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg whitespace-nowrap max-w-xs ${positionClasses[position]}`}
        >
          {text}
          <span
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          ></span>
        </div>
      )}
    </div>
  );
};

export default Tooltip;

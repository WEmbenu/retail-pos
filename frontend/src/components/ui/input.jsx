import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(
  (
    {
      className,
      type,
      icon: Icon,
      variant = "default",
      iconClassName,
      error,
      defaultPlaceholder = "",
      ...props
    },
    ref
  ) => {
    const getPlaceholder = () => {
      if (error) {
        return error.message || error;
      }
      return props.placeholder || defaultPlaceholder;
    };

    const baseInputStyles = cn(
      "flex h-10 w-full rounded border border-gray-200 bg-background py-2 text-sm",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus:outline-none focus:border-bcg_sidebar_col focus:ring-1 focus:ring-bcg_sidebar_col",
      "disabled:cursor-not-allowed disabled:opacity-50",
      error && "border-red-500 placeholder-red-500"
    );

    const variants = {
      default: "px-3",
      icon: (
        <div className="relative flex overflow-hidden rounded text-black">
          <input
            type={type}
            className={cn(baseInputStyles, "pl-12 pr-3", className)}
            ref={ref}
            placeholder={getPlaceholder()}
            {...props}
          />
          {Icon && (
            <div className="absolute inset-y-[1px] left-[1px] flex items-center justify-center w-10 bg-gray-100 rounded-l z-10 pointer-events-none">
              <Icon
                className={cn(
                  "h-5 w-5",
                  error ? "text-red-500" : "text-gray-500",
                  iconClassName
                )}
              />
            </div>
          )}
        </div>
      ),
      "with-icon": (
        <div className="relative overflow-hidden">
          {Icon && (
            <Icon
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                error ? "text-red-500" : "text-gray-400",
                iconClassName
              )}
            />
          )}
          <input
            type={type}
            className={cn(baseInputStyles, "pl-10 pr-3", className)}
            ref={ref}
            placeholder={getPlaceholder()}
            {...props}
          />
        </div>
      ),
    };

    if (variant === "icon" || variant === "with-icon") {
      return variants[variant];
    }

    return (
      <input
        type={type}
        className={cn(baseInputStyles, variants.default, className)}
        ref={ref}
        placeholder={getPlaceholder()}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

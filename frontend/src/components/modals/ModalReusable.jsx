import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ModalReusable = ({
  isOpen,
  onClose,
  title,
  children,
  icon: Icon,
  size = "md",
  position = "center",
  showCloseButton = true,
  closeOnOverlayClick = true,
  handleEscKey = true,
  headerClassName = "",
  bodyClassName = "",
  overlayClassName = "",
  maxHeight,
  variant = "gradient", // 'gradient', 'solid', or 'minimal'
  showBackdrop = true,
  preventScroll = true,
}) => {
  const modalRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set initial viewport height
    setViewportHeight(window.innerHeight);

    // Update viewport height on resize
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    // Handle ESC key press with stopPropagation to prevent parent navigation
    const handleKeyDown = (e) => {
      if (handleEscKey && e.key === "Escape" && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    // Only add listeners when modal is open
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown, true); // Using capture phase
      window.addEventListener("resize", handleResize);
    }

    // Focus trap - lock focus inside modal when open
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    // Re-enable scrolling when modal closes
    if (isOpen && preventScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      if (isOpen) {
        window.removeEventListener("keydown", handleKeyDown, true);
        window.removeEventListener("resize", handleResize);
      }
      if (preventScroll) {
        document.body.style.overflow = "auto";
      }
    };
  }, [isOpen, onClose, handleEscKey, preventScroll]);

  // Set modal size - responsively
  const sizeClasses = {
    xs: "max-w-xs w-full",
    sm: "max-w-md w-full",
    md: "max-w-xl w-full",
    lg: "max-w-3xl w-full",
    xl: "max-w-5xl w-full",
    full: "max-w-full w-full h-full rounded-none",
  };

  // Set modal position with improved mobile handling
  const positionClasses = {
    center: "place-items-center",
    top: "items-start justify-center pt-4 sm:pt-10",
    bottom: "items-end justify-center pb-4 sm:pb-10",
  };

  const handleOverlayClick = closeOnOverlayClick
    ? onClose
    : (e) => e.stopPropagation();

  // Calculate max height for content area
  const getContentMaxHeight = () => {
    if (!mounted) return "90vh";
    // Default to 90% of viewport on mobile, with a bit more room on larger screens
    const defaultMaxHeight = `${Math.min(viewportHeight * 0.9, 800)}px`;
    return maxHeight || defaultMaxHeight;
  };

  // Get header styles based on variant
  const getHeaderStyles = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-r from-cyan-700 to-purple-700 text-white";
      case "solid":
        return "bg-cyan-700 dark:bg-cyan-800 text-white";
      case "minimal":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700";
      default:
        return "bg-gradient-to-r from-cyan-700 to-purple-700 text-white";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          className={`fixed inset-0 z-40 grid ${
            positionClasses[position]
          } overflow-y-auto ${
            showBackdrop ? "bg-black/40 dark:bg-black/60 backdrop-blur-sm" : ""
          } cursor-pointer px-4 sm:px-6 ${overlayClassName}`}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white dark:bg-gray-900 rounded-lg ${sizeClasses[size]} shadow-2xl dark:shadow-gray-950/20 cursor-default relative overflow-hidden m-auto border border-gray-200 dark:border-gray-800`}
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            style={{
              maxHeight:
                position !== "center" || size === "full"
                  ? "auto"
                  : `min(${getContentMaxHeight()}, 100vh - 2rem)`,
            }}
          >
            {/* Header */}
            <div
              className={`${getHeaderStyles()} p-1.5 sm:p-3 flex items-center justify-between z-10 sticky top-0 ${headerClassName}`}
            >
              <div className="flex items-center z-10 gap-2 overflow-hidden">
                {Icon && (
                  <span
                    className={
                      variant === "minimal"
                        ? "text-cyan-600 dark:text-cyan-400 flex-shrink-0"
                        : "text-white flex-shrink-0"
                    }
                  >
                    <Icon size={14} />
                  </span>
                )}
                <span
                  id="modal-title"
                  className={`text-sm font-medium ${
                    variant === "minimal"
                      ? "text-gray-800 dark:text-gray-200"
                      : "text-white"
                  } truncate`}
                >
                  {title}
                </span>
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={`
                    cursor-pointer rounded-full p-1.5 flex-shrink-0 ml-2 transition-colors
                    ${
                      variant === "minimal"
                        ? "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-400 dark:focus:ring-gray-500"
                        : "text-white/90 hover:text-white hover:bg-white/10 focus:ring-white/30"
                    }
                    focus:outline-none focus:ring-2
                  `}
                  aria-label="Close modal"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Content with scrollable container */}
            <div
              className={`relative p-3 sm:p-5 bg-white dark:bg-gray-900 w-full overflow-y-auto ${bodyClassName}`}
              style={{
                maxHeight:
                  position === "center" && size !== "full"
                    ? `calc(${getContentMaxHeight()} - ${
                        variant === "minimal" ? "3.5rem" : "3.75rem"
                      })` // Adjust for header height
                    : size === "full"
                    ? "calc(100vh - 3.75rem)"
                    : `calc(90vh - 3.75rem)`,
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalReusable;

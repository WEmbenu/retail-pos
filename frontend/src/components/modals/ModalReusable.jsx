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
}) => {
  const modalRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      if (isOpen) {
        window.removeEventListener("keydown", handleKeyDown, true);
        window.removeEventListener("resize", handleResize);
      }
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, handleEscKey]);

  // Set modal size - responsively
  const sizeClasses = {
    sm: "max-w-md w-full",
    md: "max-w-xl w-full",
    lg: "max-w-3xl w-full",
    xl: "max-w-5xl w-full",
    full: "max-w-full w-full",
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
    // Default to 90% of viewport on mobile, with a bit more room on larger screens
    const defaultMaxHeight = `${Math.min(viewportHeight * 0.9, 800)}px`;
    return maxHeight || defaultMaxHeight;
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
          className={`fixed inset-0 z-40 grid ${positionClasses[position]} overflow-y-auto bg-black/40 backdrop-blur-sm cursor-pointer px-4 sm:px-6 ${overlayClassName}`}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-lg ${sizeClasses[size]} shadow-2xl cursor-default relative overflow-hidden m-auto`}
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
                position !== "center"
                  ? "auto"
                  : `min(${getContentMaxHeight()}, 100vh - 2rem)`,
            }}
          >
            {/* Header */}
            <div
              className={`bg-gradient-to-r from-cyan-700 to-purple-700 p-1 sm:p-2 flex items-center justify-between z-10 sticky top-0 ${headerClassName}`}
            >
              <div className="flex items-center z-10 gap-2 overflow-hidden">
                {Icon && (
                  <span className="text-white flex-shrink-0">
                    <Icon size={12} />
                  </span>
                )}
                <span id="modal-title" className="text-sm  text-white truncate">
                  {title}
                </span>
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-white/90 cursor-pointer hover:text-red-200 transition-colors rounded-full p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 flex-shrink-0 ml-2"
                  aria-label="Close modal"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Content with scrollable container */}
            <div
              className={`relative p-3 sm:p-5 bg-white w-full overflow-y-auto ${bodyClassName}`}
              style={{
                maxHeight:
                  position === "center"
                    ? `calc(${getContentMaxHeight()} - 3rem)` // Subtract header height
                    : `calc(90vh - 3rem)`,
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

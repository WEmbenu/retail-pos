import React, { useState, useEffect } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const DeleteConfirmationModal = ({
  open,
  onOpenChange,
  entityType = "", // Optional type, like "Facility Type" or "Facility"
  entityName = "", // Name of the item being deleted
  onConfirm,
  onCancel,
}) => {
  const [status, setStatus] = useState("idle");

  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && open) {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleConfirm = async () => {
    setStatus("processing");
    try {
      await onConfirm();
      setStatus("success");
      // Auto close after animation completes
      setTimeout(() => {
        setStatus("idle");
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      setStatus("error");
      console.error("Error in deletion action:", error);
      // Reset status after showing error
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setStatus("idle");
    onOpenChange(false);
  };

  // Helper functions to generate text based on available context
  const getTitle = () =>
    entityType ? `Delete ${entityType}` : "Delete Confirmation";

  const getDescription = () => {
    if (entityType && entityName) {
      return (
        <div>
          <p>
            Are you sure you want to delete ${entityType.toLowerCase()} "$
            {entityName}"?
          </p>
          <p className="italic text-gray-300 text-sm">
            This action cannot be undone.
          </p>
        </div>
      );
    } else if (entityName) {
      return (
        <div>
          <p>Are you sure you want to delete "${entityName}"?</p>{" "}
          <p className="italic text-gray-300 text-sm">
            This action cannot be undone.
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <p>Are you sure you want to delete this item?</p>
          <p className="italic text-gray-300 text-sm">
            {" "}
            This action cannot be undone.
          </p>
        </div>
      );
    }
  };

  const getDisplayName = () => {
    if (entityType && entityName) {
      return `${entityType} "${entityName}"`;
    } else if (entityName) {
      return `"${entityName}"`;
    }
    return null;
  };

  const getSuccessMessage = () => {
    if (entityType) {
      return `${entityType} deleted successfully!`;
    } else if (entityName) {
      return `"${entityName}" deleted successfully!`;
    }
    return "Deleted successfully!";
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay with blur effect */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur grid place-items-center overflow-y-scroll cursor-pointer"
        onClick={handleCancel}
      >
        {/* Modal container */}
        <div
          className="bg-gradient-to-r from-cyan-700 to-purple-700 text-white rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Alert Icon */}
          <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -right-24" />

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center py-8 relative z-10 w-full"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="p-4 bg-green-900/20 rounded-full mb-4">
                    <FiCheckCircle size={60} className="text-green-500" />
                  </div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-base font-semibold text-center text-white"
                >
                  {getSuccessMessage()}
                </motion.h2>
              </motion.div>
            ) : status === "error" ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8 relative z-10 w-full"
              >
                <div className="p-3 bg-red-900/20 rounded-full mb-4">
                  <FiXCircle size={60} className="text-red-500" />
                </div>
                <p className="text-base font-semibold text-center text-white">
                  Delete operation failed
                </p>
                <p className="text-white/80 mt-2 text-center text-xs">
                  Please try again later.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 w-full"
              >
                <div className="flex flex-col space-y-2 text-center sm:text-left">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-base font-semibold text-white">
                      {getTitle()}
                    </p>
                    <button
                      onClick={handleCancel}
                      className="text-white/90 cursor-pointer hover:text-red-200 transition-colors rounded-full p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 flex-shrink-0 ml-2"
                      aria-label="Close modal"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                  <p className="text-sm text-white/80">{getDescription()}</p>
                  {getDisplayName() && (
                    <p className="mt-2 text-white font-medium p-2 bg-white/10 rounded-md text-sm">
                      {getDisplayName()}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleCancel}
                    disabled={status === "processing"}
                    className="bg-white hover:opacity-90 transition-opacity text-[#013049] hover:text-[#013049] w-full py-2 btn"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={status === "processing"}
                    className={`bg-red-600 hover:opacity-90 transition-opacity text-white w-full py-2 btn ${
                      status === "processing"
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {status === "processing" ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";

const OnboardingTour = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  storageKey = "tour_completed",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState(null);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // Reset step when tour opens
  useEffect(() => {
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  // Find and track target element position
  useEffect(() => {
    if (!isOpen || !steps[currentStep]) return;

    const getTargetPosition = () => {
      const selector = steps[currentStep].target;
      const element = document.querySelector(selector);

      if (element) {
        setTargetElement(element);
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    getTargetPosition();

    // Reposition on resize or scroll
    window.addEventListener("resize", getTargetPosition);
    window.addEventListener("scroll", getTargetPosition);

    return () => {
      window.removeEventListener("resize", getTargetPosition);
      window.removeEventListener("scroll", getTargetPosition);
    };
  }, [isOpen, currentStep, steps]);

  // Calculate tooltip position based on placement
  const getTooltipPosition = () => {
    const placement = steps[currentStep]?.placement || "bottom";
    const tooltipWidth = 300;
    const tooltipHeight = 160;
    const margin = 12;

    switch (placement) {
      case "top":
        return {
          top: position.top - tooltipHeight - margin,
          left: position.left + position.width / 2 - tooltipWidth / 2,
        };
      case "bottom":
        return {
          top: position.top + position.height + margin,
          left: position.left + position.width / 2 - tooltipWidth / 2,
        };
      case "left":
        return {
          top: position.top + position.height / 2 - tooltipHeight / 2,
          left: position.left - tooltipWidth - margin,
        };
      case "right":
        return {
          top: position.top + position.height / 2 - tooltipHeight / 2,
          left: position.left + position.width + margin,
        };
      default:
        return {
          top: position.top + position.height + margin,
          left: position.left + position.width / 2 - tooltipWidth / 2,
        };
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (storageKey) {
      localStorage.setItem(storageKey, "true");
    }
    if (onComplete) onComplete();
    onClose();
  };

  if (!isOpen || !steps[currentStep]) return null;

  const tooltipPosition = getTooltipPosition();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Semi-transparent overlay */}
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />

      {/* Highlight target element */}
      {targetElement && (
        <div
          className="absolute rounded-lg bg-transparent pointer-events-none z-10"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          }}
        />
      )}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bg-white rounded-lg shadow-xl border border-gray-200 w-[300px] max-w-[calc(100vw-32px)] pointer-events-auto z-20 overflow-hidden"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-3 flex justify-between items-center">
            <h3 className="text-white font-medium text-sm">
              {steps[currentStep].title}
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-700 text-sm">
              {steps[currentStep].content}
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3 flex justify-between items-center bg-gray-50">
            <div className="text-xs text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>

            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 px-2 py-1"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center text-sm bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700"
              >
                {isLastStep ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingTour;

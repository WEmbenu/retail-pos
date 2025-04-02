import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Switch } from "../../components/ui/switch";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  GripVertical,
  Settings,
  Save,
  X,
  Search,
  Info,
  AlertTriangle,
  Loader,
  Check,
  RefreshCw,
  HelpCircle,
  LayoutDashboard,
  BarChart,
  Receipt,
  Clock,
  DollarSign,
  Package,
} from "lucide-react";
import ModalReusable from "../../components/modals/ModalReusable";
import { useSnackbar } from "notistack";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "../../components/ui/input";
import isEqual from "lodash/isEqual";
import OnboardingTour from "../../components/modals/OnboardingTour";

/**
 * Confirmation Modal Component inspired by DeleteConfirmationModal
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [status, setStatus] = useState("idle");

  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    setStatus("processing");
    try {
      await onConfirm();
      setStatus("success");
      // Auto close after animation completes
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 1000);
    } catch (error) {
      setStatus("error");
      console.error("Error in confirmation action:", error);
      // Reset status after showing error
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-r from-cyan-700 to-purple-700 text-white rounded-lg w-full max-w-md shadow-xl overflow-hidden p-4 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-4 relative z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <div className="p-3 bg-green-500/20 rounded-full mb-3">
                  <Check className="h-8 w-8 text-green-300" />
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base font-medium text-center text-white"
              >
                Settings reset successfully!
              </motion.h2>
            </motion.div>
          ) : status === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-4 relative z-10"
            >
              <div className="p-3 bg-red-500/20 rounded-full mb-3">
                <AlertTriangle className="h-8 w-8 text-red-300" />
              </div>
              <h2 className="text-base font-medium text-center text-white">
                Reset operation failed
              </h2>
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
            >
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-semibold text-white">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-white/90 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-white/90 mb-3">{message}</p>
                <p className="italic text-white/60 text-xs mb-3">
                  This will restore the original widget configuration.
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={onClose}
                  disabled={status === "processing"}
                  className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={status === "processing"}
                  className={`bg-blue-500 hover:bg-blue-600 transition-colors text-white w-full py-2 rounded font-medium text-sm flex items-center justify-center ${
                    status === "processing"
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {status === "processing" ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </span>
                  ) : (
                    "Reset"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Drag-and-drop Widget Item Component
const DraggableWidgetItem = ({
  id,
  index,
  widget,
  widgetId,
  checked,
  onChange,
  moveWidget,
  searchTerm,
}) => {
  const ref = React.useRef(null);

  // Highlight search matches
  const highlightMatches = (text, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "WIDGET",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      ref={ref}
      className={`p-2.5 mb-2 bg-white dark:bg-gray-800 rounded-lg border ${
        isOver
          ? "border-cyan-400 shadow-lg"
          : "border-gray-200 dark:border-gray-700"
      } ${
        isDragging ? "opacity-50 shadow-xl" : "opacity-100"
      } hover:shadow-md transition-all flex items-center cursor-grab active:cursor-grabbing`}
    >
      <div className="mr-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-move">
        <GripVertical className="h-4 w-4" />
      </div>

      <div
        className={`p-1.5 rounded-lg mr-2 flex items-center justify-center w-8 h-8 ${
          checked
            ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
        }`}
      >
        {widget.icon || <Settings className="h-4 w-4" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
          {highlightMatches(widget.name || widgetId, searchTerm)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {highlightMatches(
            widget.description || "Widget settings",
            searchTerm
          )}
        </p>
      </div>

      <Switch
        checked={checked}
        onCheckedChange={(isChecked) => onChange(widgetId, isChecked)}
        className="ml-1 scale-90"
      />
    </motion.div>
  );
};

const WidgetList = ({
  section,
  sectionConfig,
  settings,
  onChange,
  moveWidget,
  widgetsRegistry,
  searchTerm,
}) => {
  // Filter widgets based on search term
  const filteredWidgets = useMemo(() => {
    if (!searchTerm) return sectionConfig.order;

    return sectionConfig.order.filter((widgetId) => {
      const widget = widgetsRegistry[widgetId] || {};
      const name = widget.name || widgetId;
      const description = widget.description || "";

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sectionConfig.order, widgetsRegistry, searchTerm]);

  return (
    <AnimatePresence>
      {filteredWidgets.length > 0 ? (
        filteredWidgets.map((widgetId, index) => {
          // Get widget definition from registry or use a basic fallback
          const widget = widgetsRegistry[widgetId] || {
            name: widgetId,
            description: "Widget configuration",
          };

          return (
            <DraggableWidgetItem
              key={`${section}-${widgetId}`}
              id={`${section}-${widgetId}`}
              widgetId={widgetId}
              widget={widget}
              checked={settings[section]?.widgets[widgetId]?.visible ?? false}
              onChange={(widgetId, checked) =>
                onChange(section, widgetId, checked)
              }
              index={index}
              moveWidget={(dragIndex, hoverIndex) =>
                moveWidget(section, dragIndex, hoverIndex)
              }
              searchTerm={searchTerm}
            />
          );
        })
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700"
        >
          <Info className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-1.5" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No widgets match your search.
          </p>
          {searchTerm && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Try adjusting your search term.
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Enhanced Dynamic Dashboard Settings Component
 */
const DashboardSettings = ({ isOpen, onClose, settings, onSave }) => {
  // Define default dashboard configuration
  const dashboardConfig = {
    sections: {
      general: {
        name: "General",
        icon: <LayoutDashboard size={16} />,
        instructions: "Customize your main dashboard widgets",
        requiresAuth: false,
      },
    },
    widgets: {
      statusCards: {
        name: "Status Cards",
        icon: <DollarSign size={16} />,
        description: "Shows summary cards with key metrics",
      },
      weeklyChart: {
        name: "Weekly Sales Chart",
        icon: <BarChart size={16} />,
        description: "Shows sales trends by week",
      },
      recentTransactions: {
        name: "Recent Transactions",
        icon: <Receipt size={16} />,
        description: "Displays a list of recent transactions",
      },
      popularProducts: {
        name: "Popular Products",
        icon: <Package size={16} />,
        description: "Displays top selling products",
      },
      dateTimeDisplay: {
        name: "Date & Time Display",
        icon: <Clock size={16} />,
        description: "Shows current date and time",
      },
      salesByCategory: {
        name: "Sales By Category",
        icon: <BarChart size={16} />,
        description: "Displays sales breakdown by category",
      },
    },
  };

  // Transform the settings to match the expected format
  const transformedSettings = {
    general: {
      widgets: {
        statusCards: { visible: settings.general?.statusCards ?? true },
        weeklyChart: { visible: settings.general?.weeklyChart ?? true },
        recentTransactions: {
          visible: settings.general?.recentTransactions ?? true,
        },
        popularProducts: { visible: settings.general?.popularProducts ?? true },
        dateTimeDisplay: { visible: settings.general?.dateTimeDisplay ?? true },
        salesByCategory: { visible: settings.general?.salesByCategory ?? true },
      },
      order: settings.widgetOrder?.general || [
        "statusCards",
        "weeklyChart",
        "recentTransactions",
        "popularProducts",
        "dateTimeDisplay",
        "salesByCategory",
      ],
    },
  };

  // Access snackbar for notifications
  const { enqueueSnackbar } = useSnackbar();

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");

  // Loading state
  const [isSaving, setIsSaving] = useState(false);

  // Extract configuration
  const { sections = {}, widgets = {} } = dashboardConfig || {};

  // Filter sections based on authorization
  const availableSections = Object.entries(sections)
    .filter(([sectionId, section]) => {
      // If section requires authorization, check if user has permission
      if (section.requiresAuth && section.authCheck) {
        return section.authCheck();
      }
      // Otherwise, always show the section
      return true;
    })
    .map(([sectionId]) => sectionId);

  const defaultActiveSection =
    availableSections.length > 0 ? availableSections[0] : null;

  // State for active section tab
  const [activeSection, setActiveSection] = useState(defaultActiveSection);

  // Local state
  const [localSettings, setLocalSettings] = useState(transformedSettings);

  // Track original settings to detect changes
  const [originalSettings, setOriginalSettings] = useState(null);

  // Modal state for reset confirmation
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [sectionToReset, setSectionToReset] = useState(null);

  // State for onboarding tour
  const [tourOpen, setTourOpen] = useState(false);

  // Define tour steps with more precise selectors
  const tourSteps = [
    {
      target: '[id="dashboard-settings-header"]',
      title: "Dashboard Customization",
      content:
        "Welcome to the dashboard customization tool! Here you can personalize which widgets appear on your dashboard and rearrange them.",
      placement: "bottom",
    },
    {
      target: '[id="dashboard-search-widgets"]',
      title: "Search Widgets",
      content:
        "Looking for a specific widget? Use the search box to quickly find widgets by name or description.",
      placement: "bottom",
    },
    {
      target: '[id="dashboard-section-tabs"]',
      title: "Dashboard Sections",
      content:
        "Switch between different dashboard sections using these tabs. The numbers show how many widgets are currently visible.",
      placement: "bottom",
    },
    {
      target: '[id="dashboard-widgets-list"]',
      title: "Customize Widgets",
      content:
        "Toggle widgets on/off using the switches. Drag widgets up or down to change their order on the dashboard.",
      placement: "top",
    },
    {
      target: '[id="dashboard-reset-button"]',
      title: "Reset Section",
      content:
        "Reset this section to its default settings if you want to start over.",
      placement: "left",
    },
    {
      target: '[id="dashboard-save-button"]',
      title: "Save Changes",
      content:
        "Don't forget to save your changes when you're done customizing!",
      placement: "top",
    },
  ];

  // Detect if settings have been changed
  const hasUnsavedChanges = useMemo(() => {
    return originalSettings && !isEqual(originalSettings, localSettings);
  }, [originalSettings, localSettings]);

  // Initialize from props when component mounts or props change
  useEffect(() => {
    setLocalSettings(transformedSettings);
    setOriginalSettings(transformedSettings);
  }, []);

  // Start tour automatically on first visit with a longer delay
  useEffect(() => {
    if (isOpen) {
      const tourCompleted =
        localStorage.getItem("dashboard_settings_tour_completed") === "true";
      if (!tourCompleted) {
        // Use a longer delay to ensure the DOM is fully rendered
        const timer = setTimeout(() => {
          setTourOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);

  // Handle widget visibility toggle
  const handleChange = (sectionId, widgetId, visible) => {
    setLocalSettings((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        widgets: {
          ...(prev[sectionId]?.widgets || {}),
          [widgetId]: {
            ...(prev[sectionId]?.widgets?.[widgetId] || {}),
            visible,
          },
        },
      },
    }));

    // Provide immediate feedback
    enqueueSnackbar(
      `Widget ${visible ? "shown" : "hidden"} in ${
        sections[sectionId]?.name || sectionId
      }`,
      {
        variant: "info",
        autoHideDuration: 1500,
      }
    );
  };

  // Handle modal close with confirmation if there are unsaved changes
  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        onClose();
        // Reset search on close
        setSearchTerm("");
      }
    } else {
      onClose();
      // Reset search on close
      setSearchTerm("");
    }
  }, [hasUnsavedChanges, onClose]);

  // Transform settings back to the original format before saving
  const transformSettingsForSave = (settings) => {
    const result = {
      general: {},
      widgetOrder: { general: settings.general.order },
    };

    // Extract visible state for each widget
    Object.entries(settings.general.widgets).forEach(([widgetId, config]) => {
      result.general[widgetId] = config.visible;
    });

    return result;
  };

  // Handle save with loading state and notifications
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Transform the settings back to the format expected by the parent component
      const transformedSettingsForSave =
        transformSettingsForSave(localSettings);

      await onSave(transformedSettingsForSave);

      // Update original settings to match current
      setOriginalSettings({ ...localSettings });

      // Show success notification
      enqueueSnackbar("Dashboard settings saved successfully", {
        variant: "success",
        autoHideDuration: 3000,
      });

      // Close the modal
      onClose();

      // Reset search
      setSearchTerm("");
    } catch (error) {
      // Show error notification
      enqueueSnackbar(
        `Error saving settings: ${error.message || "Unknown error"}`,
        {
          variant: "error",
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle widget reordering with enhanced animation
  const moveWidget = (sectionId, dragIndex, hoverIndex) => {
    // Get the current order array
    const currentOrder = [...(localSettings[sectionId]?.order || [])];

    // Get the widget being moved
    const dragWidget = currentOrder[dragIndex];

    // Create new order by removing from drag position and inserting at hover position
    currentOrder.splice(dragIndex, 1);
    currentOrder.splice(hoverIndex, 0, dragWidget);

    // Update settings with new order
    setLocalSettings((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        order: currentOrder,
      },
    }));
  };

  // Reset section settings to defaults
  const openResetConfirmation = (sectionId) => {
    setSectionToReset(sectionId);
    setResetModalOpen(true);
  };

  const handleResetConfirm = async () => {
    if (!sectionToReset) return;

    // Reset to the original transformed settings for this section
    setLocalSettings((prev) => ({
      ...prev,
      [sectionToReset]: { ...transformedSettings[sectionToReset] },
    }));

    enqueueSnackbar(
      `${sections[sectionToReset]?.name || sectionToReset} reset to defaults`,
      {
        variant: "info",
      }
    );

    // Close the modal
    setResetModalOpen(false);
    setSectionToReset(null);
  };

  // Function to handle tour completion
  const handleTourComplete = () => {
    localStorage.setItem("dashboard_settings_tour_completed", "true");
    enqueueSnackbar(
      "Tour completed! You can restart it anytime from the help button.",
      {
        variant: "success",
      }
    );
  };

  // If no sections defined or available, show empty state
  if (availableSections.length === 0) {
    return (
      <ModalReusable
        isOpen={isOpen}
        onClose={onClose}
        title="Dashboard Customization"
        icon={Settings}
      >
        <div className="p-6 text-center text-gray-500">
          <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No Customization Available
          </h3>
          <p>
            No dashboard sections are configured or you don't have permission to
            customize them.
          </p>
        </div>
      </ModalReusable>
    );
  }

  return (
    <ModalReusable
      isOpen={isOpen}
      onClose={handleClose}
      title="Dashboard Customization"
      icon={Settings}
      size="md"
    >
      <div className="max-w-full">
        {/* Tour Help Button */}
        <div className="absolute top-1 right-5">
          <button
            onClick={() => setTourOpen(true)}
            className="p-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
            title="Start tour"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>

        {/* Header with description and search */}
        <div
          id="dashboard-settings-header"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"
        >
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              Customize Your Dashboard
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Select which widgets to display and drag to reorder them.
            </p>
          </div>

          <div
            id="dashboard-search-widgets"
            className="relative w-full sm:w-56"
          >
            <Input
              type="text"
              variant="icon"
              icon={Search}
              placeholder="Search widgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-1.5 text-sm w-full bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 h-9"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Unsaved changes indicator */}
        {hasUnsavedChanges && (
          <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg text-xs text-amber-700 dark:text-amber-400 flex items-center">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>You have unsaved changes.</span>
          </div>
        )}

        <div className="mt-4">
          {/* Custom tabs */}
          <div
            id="dashboard-section-tabs"
            className="border-b border-gray-200 dark:border-gray-700 mb-3"
          >
            <div className="flex overflow-x-auto hide-scrollbar">
              {availableSections.map((sectionId) => {
                const section = sections[sectionId] || {};
                // Count active widgets in this section
                const activeWidgetCount = Object.values(
                  localSettings[sectionId]?.widgets || {}
                ).filter((widget) => widget.visible).length;

                return (
                  <button
                    key={sectionId}
                    onClick={() => setActiveSection(sectionId)}
                    className={`px-3 py-2 text-sm font-medium whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
                      activeSection === sectionId
                        ? "border-cyan-600 dark:border-cyan-500 text-cyan-600 dark:text-cyan-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    } transition-colors`}
                  >
                    {section.icon && (
                      <span className="text-inherit">{section.icon}</span>
                    )}
                    <span>{section.name || sectionId}</span>
                    {activeWidgetCount > 0 && (
                      <span
                        className={`inline-flex items-center justify-center rounded-full min-w-5 h-5 px-1 text-xs ${
                          activeSection === sectionId
                            ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {activeWidgetCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabs content */}
          <DndProvider backend={HTML5Backend}>
            {availableSections.map((sectionId) => {
              const section = sections[sectionId] || {};
              const sectionSettings = localSettings[sectionId] || {
                widgets: {},
                order: [],
              };

              // Count number of visible widgets
              const visibleWidgets = Object.entries(
                sectionSettings.widgets || {}
              ).filter(([_, config]) => config.visible).length;

              // Count total widgets in this section
              const totalWidgets = sectionSettings.order?.length || 0;

              return (
                <div
                  key={sectionId}
                  className={activeSection === sectionId ? "block" : "hidden"}
                >
                  <div className="mb-3 p-2.5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center text-cyan-700 dark:text-cyan-400 mb-2 sm:mb-0">
                      <Settings className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {section.instructions ||
                          `Drag to reorder ${
                            section.name || sectionId
                          } widgets`}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                        {visibleWidgets}/{totalWidgets} visible
                      </span>

                      <button
                        id="dashboard-reset-button"
                        onClick={() => openResetConfirmation(sectionId)}
                        className="px-2 py-1 text-xs bg-white dark:bg-gray-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded border border-cyan-200 dark:border-cyan-800/30 transition-colors whitespace-nowrap flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Reset
                      </button>
                    </div>
                  </div>

                  <div id="dashboard-widgets-list">
                    <WidgetList
                      section={sectionId}
                      sectionConfig={sectionSettings}
                      settings={localSettings}
                      onChange={handleChange}
                      moveWidget={moveWidget}
                      widgetsRegistry={widgets}
                      searchTerm={searchTerm}
                    />
                  </div>
                </div>
              );
            })}
          </DndProvider>
        </div>

        <div className="mt-4 flex justify-between items-center border-t dark:border-gray-700 pt-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {hasUnsavedChanges ? (
              <span className="flex items-center text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Unsaved changes
              </span>
            ) : (
              <span className="flex items-center text-green-600 dark:text-green-400">
                <Check className="h-3.5 w-3.5 mr-1" />
                All saved
              </span>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              id="dashboard-save-button"
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={`px-4 py-2 rounded-md flex gap-1 items-center ${
                hasUnsavedChanges
                  ? "bg-primary-600 hover:bg-primary-700 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <>
                  <Loader className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset to Default Settings"
        message={`Reset all ${
          sections[sectionToReset]?.name || sectionToReset || ""
        } widgets to default settings?`}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        steps={tourSteps}
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
        onComplete={handleTourComplete}
        storageKey="dashboard_settings_tour_completed"
      />
    </ModalReusable>
  );
};

export default DashboardSettings;

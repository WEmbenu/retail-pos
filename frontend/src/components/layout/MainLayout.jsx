import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();

  // Close sidebar on screen resize (if mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
        {/* Sidebar - desktop version */}
        <div className="hidden lg:block h-full">
          <Sidebar />
        </div>

        {/* Mobile sidebar - shown when toggle is active */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={toggleSidebar}
            ></div>
            <div className="fixed inset-y-0 left-0 z-40 w-64 lg:hidden">
              <Sidebar isMobile={true} onCloseMobile={toggleSidebar} />
            </div>
          </>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-800">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SnackbarProvider>
  );
};

export default MainLayout;

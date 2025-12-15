import { useState, useMemo } from "react";
import Sidebar from "./sidebarLayout"; 
import DashboardNavbar from "./dashboardNavbar"; 
import { useLocation } from "react-router-dom";


const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");

    window.location.href = "/";
  };

  const location = useLocation();

  const pageTitle = useMemo(() => {
    const path = location.pathname.toLowerCase(); 

    if (path.startsWith("/ticketing")) return "Ticketing";

    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/ticketing":
        return "Ticketing";
      case "/support":
        return "Support";
      case "/predict":
        return "Predict";
      case "/chatai":
        return "Chat with AI";
      case "/settings":
        return "Settings";
      case "/admin":
        return "Admin Page"; 
      default:
        return "Dashboard";
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="relative w-full max-w-[1960px] mx-auto font-roboto h-screen md:flex">
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
        ></div>
      )}

      <Sidebar
        onLogout={handleLogout} 
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardNavbar
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout} 
          title={pageTitle}
        />

        <main className="flex-1 px-4 sm:px-7 overflow-y-auto bg-gray-100 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

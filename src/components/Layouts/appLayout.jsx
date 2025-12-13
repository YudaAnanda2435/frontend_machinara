import { useState, useContext, useMemo } from "react";
import Sidebar from "./sidebarLayout"; // Pastikan path import ini benar sesuai struktur folder Anda
import DashboardNavbar from "./dashboardNavbar"; // Pastikan path ini benar
import { useLocation } from "react-router-dom";

import LocaleContext from "../../contexts/LocaleContext";
import content from "../../utils/content";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleLogout = () => {
    // Hapus data autentikasi
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");

    window.location.href = "/login";
  };

  const location = useLocation();
  const { locale } = useContext(LocaleContext);

  const pageTitle = useMemo(() => {
    const path = location.pathname.toLowerCase(); 

    if (path.startsWith("/ticketing")) return content.addTicket[locale];

    switch (path) {
      case "/dashboard":
        return content.dashboard[locale];
      case "/ticketing":
        return content.addTicket[locale];
      case "/support":
        return content.supports[locale];
      case "/predict":
        return content.predict[locale];
      case "/chatai":
        return content.chatAI[locale];
      case "/settings":
        return content.settings[locale];
      case "/admin":
        return "Admin Page"; 
      default:
        return "Dashboard";
    }
  }, [location.pathname, locale]);

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

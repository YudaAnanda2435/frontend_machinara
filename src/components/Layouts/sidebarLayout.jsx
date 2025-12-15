import { NavLink } from "react-router-dom";
import Logo from "/logo-dashboard.png";
import Dashboard from "/Dashboard-icon.svg";
import Ticket from "/ticket-icon.svg";
import Support from "/support-icon.svg";
import ChartLine from "/Chart_Line.svg";
import ChatAi from "/chat-sidebar-icon.svg";
import Settings from "/settings-icon.svg";
import Logout from "/logout-icon.svg";
import DashboardActive from "/Dashboard-icon-active.svg";
import TicketActive from "/ticket-icon-active.svg";
import ChartLineActive from "/Chart_Line_active.svg";
import ChatAiActive from "/chat-sidebar-icon-active.svg";
import SupportActive from "/support-icon-active.svg";
import SettingsActive from "/settings-icon-active.svg";
import NavigationItem from "../elements/navigation/navigationItem";

const Sidebar = ({ isSidebarOpen, closeSidebar, onLogout }) => {
  const navItems = [
    {
      id: "dashboard",
      to: "/dashboard",
      text: "Dashboard",
      icon: Dashboard,
      activeIcon: DashboardActive,
    },
    {
      id: "predict",
      to: "/predict",
      text: "Predict",
      icon: ChartLine,
      activeIcon: ChartLineActive,
    },
    {
      id: "ticketing",
      to: "/ticketing",
      text: "Ticketing",
      icon: Ticket,
      activeIcon: TicketActive,
    },
    {
      id: "chat-ai",
      to: "/chatai",
      text: "Chat with AI",
      icon: ChatAi,
      activeIcon: ChatAiActive,
    },
    {
      id: "support",
      to: "/support",
      text: "Support",
      icon: Support,
      activeIcon: SupportActive,
    },
    {
      id: "settings",
      to: "/settings",
      text: "Settings",
      icon: Settings,
      activeIcon: SettingsActive,
    },
  ];

  const logoutItem = {
    id: "logout",
    icon: Logout,
    text: "Logout",
  };

  return (
    <div
      className={`fixed inset-y-0 flex flex-col bg-white gap-14 left-0 px-5 sm:x-7 lg:px-[46px] pt-[30px] w-[280px] lg:w-[345px] transform transition-transform duration-300 ease-in-out z-30 
                  md:relative md:translate-x-0 
                  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex justify-between items-center">
        <img className="w-[180px] sm:w-fit" src={Logo} alt="Machinara Logo" />
        <button onClick={closeSidebar} className="md:hidden p-2">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <ul className="flex flex-col gap-4 grow">
        {navItems.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.to}
              onClick={closeSidebar}
              className="block"
              end={item.to === "/dashboard"}
            >
              {({ isActive }) => (
                <NavigationItem
                  icon={
                    isActive && item.activeIcon ? item.activeIcon : item.icon
                  }
                  text={item.text}
                  isActive={isActive}
                />
              )}
            </NavLink>
          </li>
        ))}

        <li className="mt-auto mb-6">
          <button
            onClick={() => {
              onLogout();
              closeSidebar();
            }}
            className="w-full"
          >
            <NavigationItem
              icon={logoutItem.icon}
              text={logoutItem.text}
              isActive={false}
            />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

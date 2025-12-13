import React, { useState, useEffect, useRef } from "react";
import LanguageSwitcher from "../fragments/LanguageSwitcher";
import Avatar from "../../assets/img/engineer.png";
import NotifIcon from "/notification.svg";
import RedNotif from "/red-notif.svg";
import {
  Loader2,
  AlertTriangle,
  XCircle,
  Calendar,
  Activity,
} from "lucide-react";

// --- KONFIGURASI API ---
// Mengambil status Critical DAN Warning
const ML_API_URL =
  "https://machinelearning-production-344f.up.railway.app/dashboard/machines?status=Critical&status=Warning";

const DashboardNavbar = ({ onToggleSidebar, title, onLogout }) => {
  const [userData, setUserData] = useState({
    name: "Loading...",
    role: "Team",
  });

  // State Notifikasi
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLoadingNotif, setIsLoadingNotif] = useState(false);

  const notifRef = useRef(null);

  // 1. Load User Data
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("user_data");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData({
          name: parsedData.name || "User",
          role: parsedData.role || "Team",
        });
      }
    } catch (error) {
      console.error("Gagal load user:", error);
    }
  }, []);

  // 2. Fetch Notifications (Realtime Poll)
  useEffect(() => {
    fetchCriticalMachines();

    // Auto refresh setiap 30 detik agar lebih responsif
    const interval = setInterval(fetchCriticalMachines, 30000);
    return () => clearInterval(interval);
  }, []);

  // 3. Close Dropdown Click Outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  // --- LOGIC FETCH & SMART SORTING ---
  const fetchCriticalMachines = async () => {
    // Jangan set loading true jika ini auto-refresh background (agar tidak kedip)
    if (notifications.length === 0) setIsLoadingNotif(true);

    try {
      const response = await fetch(ML_API_URL);
      if (!response.ok) throw new Error("Gagal fetch data machine");

      const data = await response.json();
      const machineList = Array.isArray(data) ? data : [];

      // TRANSFORMASI DATA
      const mappedNotifs = machineList.map((machine) => ({
        id: machine.product_id,
        title: `${machine.status} Alert: ${machine.product_id}`,
        status: machine.status, // "Critical" atau "Warning"
        health: machine.health_score,
        date: machine.last_maintenance,
        message: `Health Score is critical at ${machine.health_score}%. Immediate check required.`,
      }));

      // SORTING PRIORITAS:
      // 1. Status "Critical" harus paling atas
      // 2. Jika status sama, urutkan berdasarkan Health Score terendah (Paling rusak)
      const sortedNotifs = mappedNotifs.sort((a, b) => {
        if (a.status === "Critical" && b.status !== "Critical") return -1;
        if (b.status === "Critical" && a.status !== "Critical") return 1;
        return a.health - b.health; // Ascending (0 dulu baru 100)
      });

      setNotifications(sortedNotifs);
      setUnreadCount(sortedNotifs.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoadingNotif(false);
    }
  };

  // Helper formatting tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "No Maintenance Record";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <nav className="sticky top-0 z-20 bg-white h-16 sm:h-[90px] px-4 md:px-9 flex justify-between items-center shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
      {/* KIRI: Toggle & Title */}
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-2 md:hidden">
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
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <h2 className="text-[20px] md:text-[36px] font-roboto font-semibold text-black hidden md:block">
          {title}
        </h2>
      </div>

      {/* KANAN: Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        <LanguageSwitcher />

        {/* NOTIFIKASI DROPDOWN */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 sm:p-3 relative bg-[#FFFAF1] rounded-xl cursor-pointer hover:bg-orange-100 transition-all active:scale-95"
          >
            <img className="w-5 sm:w-6" src={NotifIcon} alt="Notification" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
              </span>
            )}
          </button>

          {/* ISI DROPDOWN */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              {/* Header Dropdown */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    Machine Alerts
                  </h4>
                  <p className="text-[10px] text-gray-500">
                    Real-time anomaly detection
                  </p>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs px-2.5 py-1 rounded-full font-bold border border-red-200">
                    {unreadCount} Issues
                  </span>
                )}
              </div>

              {/* List Notifikasi */}
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {isLoadingNotif ? (
                  <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                    <span className="text-xs">Scanning system...</span>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <div
                      key={idx}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group relative ${
                        notif.status === "Critical"
                          ? "bg-red-50/30 hover:bg-red-50"
                          : "bg-white"
                      }`}
                    >
                      {/* Indicator Bar Kiri */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          notif.status === "Critical"
                            ? "bg-red-500"
                            : "bg-orange-400"
                        }`}
                      ></div>

                      <div className="flex gap-3 ml-2">
                        {/* Icon Status */}
                        <div className="mt-1">
                          {notif.status === "Critical" ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h5
                              className={`text-sm font-bold ${
                                notif.status === "Critical"
                                  ? "text-red-700"
                                  : "text-orange-700"
                              }`}
                            >
                              {notif.title}
                            </h5>
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(notif.date)}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 leading-snug">
                            Health Score:{" "}
                            <span className="font-bold text-gray-800">
                              {notif.health}%
                            </span>
                            . Check maintenance logs immediately.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      All Systems Normal
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      No critical anomalies detected.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFIL USER */}
        <div
          onClick={onLogout}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all border border-transparent hover:border-gray-200"
        >
          <img
            src={Avatar}
            alt="Profil"
            className="w-8 sm:w-10 rounded-full bg-gray-200 object-cover border border-gray-100"
          />
          <div className="hidden lg:block text-left">
            <p className="font-bold text-gray-800 capitalize text-sm leading-tight">
              {userData.name}
            </p>
            <p className="text-[11px] text-gray-500 capitalize font-medium">
              {userData.role}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;

import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  Navigate,
} from "react-router-dom";

// Impor Provider
import { LocaleProvider } from "./contexts/LocaleContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Impor Halaman
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Ticketing from "./Pages/Ticketing";
import Support from "./Pages/Support";
import Predict from "./Pages/Predict";
import ChatAi from "./Pages/ChatAI";
import Settings from "./Pages/Settings";
import AdminPage from "./Pages/AdminPage";

// Impor ChatCopilot
import ChatCopilot from "./components/fragments/chatCopilot";

// Impor Smooth Scroll
import SmoothScroll from "./components/fragments/lenis";

// --- 2. KOMPONEN PROTECTED ROUTE (SATPAM) ---
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// --- 1. KOMPONEN LAYOUT UTAMA ---
const RootLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // 1. Logika ChatCopilot (Sembunyikan di halaman ini)
  const hideChatPaths = [
    "/chatai",
    "/login",
    "/register",
    "/admin",
    "/settings",
    "/dashboard",
    "/predict",
    "/ticketing",
    "/support",
  ];
  const shouldShowChat = !hideChatPaths.includes(path);

  // 2. Logika Smooth Scroll (MATIKAN di halaman dashboard/admin)
  // Kita matikan Lenis di halaman ini agar scroll dashboard tidak macet
  const disableSmoothScrollPaths = [
    "/dashboard",
    "/admin",
    "/ticketing",
    "/support",
    "/predict",
    "/chatai",
    "/settings",
    "/login",
  ];

  // Cek apakah URL saat ini ada di daftar "disable"
  // .some() & .startsWith() memastikan sub-menu seperti /dashboard/profile juga kena
  const isSmoothScrollDisabled = disableSmoothScrollPaths.some((p) =>
    path.startsWith(p)
  );

  // Konten Utama
  const content = (
    <>
      <Outlet />
      {shouldShowChat && <ChatCopilot />}
    </>
  );

  // --- KEPUTUSAN FINAL ---
  // Jika ini halaman Dashboard -> Render biasa (Native Scroll)
  if (isSmoothScrollDisabled) {
    return <div className="native-scroll-layout">{content}</div>;
  }

  // Jika ini halaman Home/Landing -> Bungkus dengan SmoothScroll
  return <SmoothScroll>{content}</SmoothScroll>;
};

function App() {
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        { path: "/", element: <Home /> }, // Ini akan kena Smooth Scroll
        { path: "/login", element: <Login /> },
        {
          element: <ProtectedRoute />,
          children: [
            // Semua di bawah ini pakai Native Scroll (Aman dari macet)
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/predict", element: <Predict /> },
            { path: "/ticketing", element: <Ticketing /> },
            { path: "/support", element: <Support /> },
            { path: "/chatai", element: <ChatAi /> },
            { path: "/Settings", element: <Settings /> },
            { path: "/admin", element: <AdminPage /> },
          ],
        },
      ],
    },
  ]);

  return (
    <ThemeProvider>
      <LocaleProvider>
        <RouterProvider router={router} />
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;

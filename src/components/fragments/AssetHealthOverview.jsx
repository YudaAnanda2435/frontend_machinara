import React, { useState, useEffect } from "react";
import {
  Leaf,
  Clock,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Minus, // Icon untuk data statis
} from "lucide-react";
import Critical from "/critical.svg";
import Warning from "/warning.svg";
import Normal from "/normal.svg";
import Score from "/score.svg";

// ------------------------------------------------------------------
// [MOCK UI COMPONENTS]
// ------------------------------------------------------------------

const Card = ({ className, children }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${
      className || ""
    }`}
  >
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={`pb-6 ${className || ""}`}>{children}</div>
);

const CardTitle = ({ className, children }) => (
  <h3
    className={`font-semibold leading-none tracking-tight ${className || ""}`}
  >
    {children}
  </h3>
);

const CardDescription = ({ className, children }) => (
  <p className={`text-sm text-gray-500 ${className || ""}`}>{children}</p>
);

const CardContent = ({ className, children }) => (
  <div className={` pt-0 ${className || ""}`}>{children}</div>
);

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className || ""}`} />
);

const ToggleGroup = ({ value, onValueChange, className, children }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500 ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isActive: child.props.value === value,
            onClick: () => onValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

// [FIX] Menghapus 'value' dari props karena tidak digunakan di dalam render function ini
const ToggleGroupItem = ({ children, isActive, onClick, className }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      isActive
        ? "bg-white text-blue-700 shadow-sm"
        : "text-gray-500 hover:text-gray-900"
    } ${className}`}
  >
    {children}
  </button>
);

// ------------------------------------------------------------------
// [INTERNAL COMPONENT] AssetStatCard
// ------------------------------------------------------------------
const AssetStatCard = ({ title, value, label, delta, icon, colorScheme }) => {
  // Logic Cek Tren (+/-)
  // Karena sekarang semua data statis, logic ini akan false (menampilkan icon Minus)
  const isTrend = delta.includes("+") || delta.includes("-");
  const isNegative = delta.includes("-");

  return (
    <div
      className={`relative rounded-3xl p-6 ${colorScheme.bg} transition-all hover:shadow-md`}
    >
      {/* Baris 1: Icon & Judul */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center ${colorScheme.iconBg} ${colorScheme.iconColor}`}
        >
          {React.cloneElement(icon, { className: "h-5 w-5 fill-current" })}
        </div>
        <span className={`font-bold text-lg ${colorScheme.titleColor}`}>
          {title}
        </span>
      </div>

      {/* Baris 2: Nilai Besar */}
      <div className="mb-1">
        <span className={`text-[24px] sm:text-3xl font-extrabold ${colorScheme.textColor}`}>
          {value}
        </span>
      </div>

      {/* Baris 3: Label Jenis Data */}
      <div className={`text-sm font-medium ${colorScheme.labelColor} mb-6`}>
        {label}
      </div>

      {/* Baris 4: Footer (Status Statis) */}
      <div className={`text-sm font-semibold ${colorScheme.trendColor}`}>
        <span className="bg-white/60 px-2 py-1 rounded-md font-medium text-gray-700 border border-gray-200/50 flex items-center gap-1 w-fit">
          {isTrend ? (
            isNegative ? (
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            ) : (
              <ArrowUpRight className="h-3 w-3 text-green-600" />
            )
          ) : (
            // Icon Minus untuk menunjukkan data snapshot (Live Data)
            <Minus className="h-3 w-3 text-gray-400" />
          )}
          {delta}
        </span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// [STYLE HELPER]
// ------------------------------------------------------------------
const getStyleByType = (type) => {
  switch (type) {
    case "critical":
      return {
        icon: <img src={Critical } alt="ciritical icon" />,
        colorScheme: {
          bg: "bg-red-50",
          iconBg: "bg-red-500",
          iconColor: "text-white",
          titleColor: "text-gray-800",
          textColor: "text-gray-900",
          labelColor: "text-gray-500",
          trendColor: "text-blue-600",
        },
      };
    case "warning":
      return {
        icon: <img src={Warning } alt="warning icon" />,
        colorScheme: {
          bg: "bg-orange-50",
          iconBg: "bg-orange-400",
          iconColor: "text-white",
          titleColor: "text-gray-800",
          textColor: "text-gray-900",
          labelColor: "text-gray-500",
          trendColor: "text-blue-600",
        },
      };
    case "normal":
      return {
        icon: <img src={ Normal} alt="normal icon" />,
        colorScheme: {
          bg: "bg-green-50",
          iconBg: "bg-green-500",
          iconColor: "text-white",
          titleColor: "text-gray-800",
          textColor: "text-gray-900",
          labelColor: "text-gray-500",
          trendColor: "text-blue-600",
        },
      };
    case "avg_score":
      return {
        icon: <img src={ Score} alt="avg score icon" />,
        colorScheme: {
          bg: "bg-purple-50",
          iconBg: "bg-purple-500",
          iconColor: "text-white",
          titleColor: "text-gray-800",
          textColor: "text-gray-900",
          labelColor: "text-gray-500",
          trendColor: "text-blue-600",
        },
      };
    default:
      return {
        icon: <Leaf />,
        colorScheme: {
          bg: "bg-gray-50",
          iconBg: "bg-gray-500",
          iconColor: "text-white",
          titleColor: "text-gray-800",
          textColor: "text-gray-900",
          labelColor: "text-gray-500",
          trendColor: "text-blue-600",
        },
      };
  }
};

// ------------------------------------------------------------------
// [MAIN COMPONENT] AssetHealthOverview
// ------------------------------------------------------------------
const AssetHealthOverview = () => {
  const [activeTab, setActiveTab] = useState("realtime");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // [FIX] Hapus state error karena tidak ditampilkan di UI (diganti fallback data)
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const url = new URL(
          "https://machinelearning-production-344f.up.railway.app/dashboard/stats"
        );
        url.searchParams.append("period", activeTab);

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data statistik.");
        }

        const result = await response.json();

        // -----------------------------------------------------------
        // [DATA MAPPING - FINAL]
        // Semua data menggunakan Label Statis ("Action Required", "Total Count", dll).
        // Tidak ada lagi persentase atau tren palsu.
        // -----------------------------------------------------------

        const mappedData = [
          {
            id: 1,
            type: "critical",
            title: "Critical",
            value: result.critical_count?.toString() || "0",
            label: "Machines",
            delta: "Action Required", // Statis
          },
          {
            id: 2,
            type: "warning",
            title: "Warning",
            value: result.warning_count?.toString() || "0",
            label: "Machines",
            delta: "Total Count", // Statis
          },
          {
            id: 3,
            type: "normal",
            title: "Normal",
            value: result.normal_count?.toString() || "0",
            label: "Machines",
            delta: "Total Count", // Statis
          },
          {
            id: 4,
            type: "avg_score",
            title: "Avg Score",
            value: `${result.avg_health_score}%`,
            label: "Overall Health",
            delta: "Live Monitor", // Statis
          },
        ];

        setData(mappedData);
      } catch (err) {
        console.error("Error fetching stats:", err);

        // Fallback Data saat error/offline
        setData([
          {
            id: 1,
            type: "critical",
            title: "Critical",
            value: "-",
            label: "Error",
            delta: "Offline",
          },
          {
            id: 2,
            type: "warning",
            title: "Warning",
            value: "-",
            label: "Error",
            delta: "Offline",
          },
          {
            id: 3,
            type: "normal",
            title: "Normal",
            value: "-",
            label: "Error",
            delta: "Offline",
          },
          {
            id: 4,
            type: "avg_score",
            title: "Avg Score",
            value: "-",
            label: "Error",
            delta: "Offline",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <Card className="w-full mx-auto border-2 rounded-2xl shadow-lg p-4 bg-white">
      {/* HEADER */}
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
        <div>
          <CardTitle className="text-2xl font-bold text-blue-900">
            Asset Health Overview
          </CardTitle>
          <CardDescription className="text-md text-gray-500 mt-1">
            Machine Condition Summary
          </CardDescription>
        </div>

        {/* Custom Toggle Group */}
        <ToggleGroup
          value={activeTab}
          onValueChange={(value) => {
            if (value) setActiveTab(value);
          }}
          className="bg-gray-100 p-1 rounded-lg"
        >
          <ToggleGroupItem value="realtime">
            <Clock className="h-4 w-4 mr-2" />
            Real Time
          </ToggleGroupItem>
          {/* <ToggleGroupItem value="last24h">
            <History className="h-4 w-4 mr-2" />
            Last 24h
          </ToggleGroupItem> */}
        </ToggleGroup>
      </CardHeader>

      {/* KONTEN */}
      <CardContent className="px-0">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-48 bg-gray-50 rounded-3xl flex flex-col p-6 gap-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-10 w-24 mt-2" />
                <Skeleton className="h-4 w-32 mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((item) => {
              const style = getStyleByType(item.type);
              return (
                <AssetStatCard
                  key={item.id}
                  title={item.title}
                  value={item.value}
                  label={item.label}
                  delta={item.delta}
                  icon={style.icon}
                  colorScheme={style.colorScheme}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetHealthOverview;

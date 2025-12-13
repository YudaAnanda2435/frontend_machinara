import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";

// --- IMPORT CHART.JS ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- Helper: Text Formatting ---
const formatAiText = (text) => {
  if (!text) return null;
  return text.split("\n").map((line, index) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={index} className="mb-1 last:mb-0">
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={i} className="font-bold text-gray-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    );
  });
};

// --- Helper: Status Badge ---
const StatusBadge = ({ status }) => {
  let color = "bg-gray-100 text-gray-600";
  let Icon = CheckCircle2;

  if (status === "Critical") {
    color = "bg-red-100 text-red-700 border border-red-200";
    Icon = XCircle;
  } else if (status === "Warning") {
    color = "bg-yellow-100 text-yellow-700 border border-yellow-200";
    Icon = AlertTriangle;
  } else if (status === "Normal") {
    color = "bg-green-100 text-green-700 border border-green-200";
    Icon = CheckCircle2;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      <Icon className="w-3 h-3" /> {status}
    </span>
  );
};

export const ForecastResultViewer = ({ rawResult }) => {
  let data = null;
  let isJson = false;

  try {
    if (typeof rawResult === "object") {
      data = rawResult;
      isJson = true;
    } else {
      data = JSON.parse(rawResult);
      isJson = true;
    }
  } catch (e) {
    data = rawResult;
    isJson = false;
  }

  if (!isJson) {
    return (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{rawResult}</p>
      </div>
    );
  }

  // --- PREPARE CHART DATA ---
  const currentTrend = data.current_trend || [];
  const simulatedTrend = data.simulated_trend || [];

  const trendData = currentTrend.length > 0 ? currentTrend : simulatedTrend;
  const labels = trendData.map((item) => `Day ${item.day}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Current Risk Score",
        data: currentTrend.map((item) => item.risk_score),
        borderColor: "rgb(239, 68, 68)", // Red-500
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        tension: 0.3,
        pointRadius: 4,
        // FIX 1: Matikan clipping agar titik di pinggir tidak terpotong
        clip: false,
      },
      {
        label: "Simulated Risk Prediction",
        data: simulatedTrend.map((item) => item.risk_score),
        borderColor: "rgb(249, 115, 22)", // Orange-500
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        borderDash: [5, 5],
        tension: 0.3,
        pointRadius: 4,
        // FIX 1: Matikan clipping
        clip: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10, // Sedikit padding tambahan
        right: 20,
        left: 10,
        bottom: 5,
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 11 },
          usePointStyle: true,
        },
      },
      title: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Risk Score (%)",
          font: { size: 11, weight: "bold" },
        },
        beginAtZero: true,
        // FIX 2: Set MAX ke 105 (di atas 100) agar ada ruang kosong di atap grafik
        max: 100,
        
        grid: { color: "#f3f4f6" },
        ticks: {
          // Opsional: Pastikan label sumbu Y tetap terlihat rapi (misal step size 20)
          stepSize: 20,
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
      {/* 1. Maintenance Estimation */}
      {data.maintenance_estimation && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 shadow-sm">
          <h5 className="text-xs font-bold text-orange-600 uppercase mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Maintenance Prediction
          </h5>
          <div className="text-sm text-gray-800 leading-relaxed">
            {formatAiText(data.maintenance_estimation)}
          </div>
        </div>
      )}

      {/* 2. AI Analysis */}
      {data.analysis_text && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h5 className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> AI Analysis
          </h5>
          <div className="text-sm text-gray-700 leading-relaxed text-justify">
            {formatAiText(data.analysis_text)}
          </div>
        </div>
      )}

      {/* 3. CHART SECTION (Risk Score) */}
      {(currentTrend.length > 0 || simulatedTrend.length > 0) && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h5 className="text-xs font-bold text-gray-600 uppercase mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Risk Forecast Chart
          </h5>
          <div className="h-[400px] w-full">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
      )}

      {/* 4. Table Data */}
      {(simulatedTrend.length > 0 || currentTrend.length > 0) && (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h5 className="text-xs font-bold text-gray-600 uppercase">
              {simulatedTrend.length > 0
                ? "Simulated Data (30 Days)"
                : "Current Trend Data"}
            </h5>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="p-3 font-medium">Day</th>
                  <th className="p-3 font-medium">Risk Score</th>{" "}
                  {/* Utamakan Risk Score */}
                  <th className="p-3 font-medium">Tool Wear Est</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {(simulatedTrend.length > 0
                  ? simulatedTrend
                  : currentTrend
                ).map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-bold text-gray-900">
                      Day {row.day}
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          row.risk_score > 80 ? "text-red-600" : "text-gray-800"
                        }`}
                      >
                        {Math.round(row.risk_score)}%
                      </span>
                    </td>
                    <td className="p-3 font-mono text-gray-600">
                      {Math.round(row.tool_wear_est)}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td
                      className="p-3 text-xs text-gray-500 max-w-[200px] truncate"
                      title={row.reason}
                    >
                      {row.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

import React from "react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";

// --- Status Badge & Progress Bar (Tetap Sama) ---
const StatusBadge = ({ status, children }) => {
  let styles = "bg-gray-100 text-gray-800";
  if (status) {
    const s = status.toLowerCase().trim();
    if (s === "healthy" || s === "normal")
      styles = "bg-green-100 text-green-800 border border-green-200";
    else if (s === "warning")
      styles = "bg-yellow-100 text-yellow-800 border border-yellow-200";
    else if (s === "critical")
      styles = "bg-red-100 text-red-800 border border-red-200";
  }
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}
    >
      {children}
    </span>
  );
};

const ProgressBar = ({ value, status }) => {
  let colorClass = "bg-gray-600";
  if (status) {
    const s = status.toLowerCase().trim();
    if (s === "healthy" || s === "normal") colorClass = "bg-green-600";
    else if (s === "warning") colorClass = "bg-yellow-500";
    else if (s === "critical") colorClass = "bg-red-600";
  }
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
      <div
        className={`h-1.5 rounded-full ${colorClass}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      ></div>
    </div>
  );
};

// --- EQUIPMENT LIST UTAMA ---
export const EquipmentList = ({
  data = [],
  selectedId,
  onSelect,
  onLoadMore,
  hasMore,
  isLoadingMore,
  activeTab,
  onTabChange,
  // isAnomalyMode tidak lagi dipakai di UI karena tombol selalu aktif
}) => {
  const tabs = ["All", "Normal", "Critical", "Warning"];

  return (
    <div className="space-y-4">
      {/* Header Filter */}
      <div className="flex flex-col space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <h2 className="font-semibold text-lg">
            Machine List ({data.length})
          </h2>
        </div>
        <div className="flex space-x-2">
          {tabs.map((status) => (
            <button
              key={status}
              onClick={() => onTabChange(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                activeTab === status
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 h-screen overflow-y-auto pr-1 custom-scrollbar">
        {data.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed rounded-xl">
            {isLoadingMore ? "Loading..." : `No ${activeTab} machines found.`}
          </div>
        ) : (
          <>
            {data.map((item) => (
              <div
                key={item.product_id}
                onClick={() => onSelect(item.product_id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedId === item.product_id
                    ? "bg-gray-100 border-gray-400 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start space-x-3">
                    {(item.status === "Healthy" ||
                      item.status === "Normal") && (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    )}
                    {item.status === "Warning" && (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
                    )}
                    {item.status === "Critical" && (
                      <XCircle className="w-5 h-5 text-red-500 mt-1" />
                    )}
                    <div>
                      <h3 className="font-bold text-sm">{item.product_id}</h3>
                      <p className="text-xs text-gray-500">
                        Machine Type {item.product_id.charAt(0)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={item.status}>{item.status}</StatusBadge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Health Score</span>
                    <span className="font-bold">{item.health_score}%</span>
                  </div>
                  <ProgressBar value={item.health_score} status={item.status} />
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500 border-t pt-3">
                  <div>
                    <p>Remaining Life</p>
                    <p className="font-medium text-gray-900">
                      {item.remaining_life} Years
                    </p>
                  </div>
                  <div className="text-right">
                    <p>Last Maintenance</p>
                    <p className="font-medium text-gray-900">
                      {item.last_maintenance}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Tombol Load More hanya muncul jika ada data lebih */}
            {hasMore && (
              <button
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="w-full py-3 mt-4 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors flex justify-center items-center gap-2"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading more...
                  </>
                ) : (
                  <>
                    Load More Machines <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

import React from "react";
import {
  Activity,
  Clock,
  Calendar,
  ImageIcon,
  Loader2,
  Search,
  Thermometer,
  Gauge,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wrench,
  MoveDiagonal,
  Flame,
  Info,
  Sparkles,
  FileText, 
} from "lucide-react";

// IMPORT VIEWER
import { ForecastResultViewer } from "./ForecastResultViewer";

const StatusBadge = ({ status, children }) => {
  let styles = "bg-gray-100 text-gray-800";
  if (status) {
    const s = status.toLowerCase();
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

const renderAIText = (text) => {
  if (!text)
    return (
      <p className="text-gray-400 italic">Analisis detail belum dimuat.</p>
    );
  return text.split("\n").map((line, index) => {
    if (!line.trim()) return <br key={index} />;
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p
        key={index}
        className="mb-2 last:mb-0 text-sm text-gray-700 leading-relaxed"
      >
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

export const EquipmentHeader = ({
  basicInfo,
  detailData,
  isLoading,
  viewMode, 
  forecastData,
}) => {
  if (viewMode === "failure") {
    if (!forecastData) {
      return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-gray-400 animate-in fade-in">
          <Sparkles className="w-12 h-12 mb-4 opacity-20" />
          <p>Run a Failure Prediction below to see AI analysis here.</p>
        </div>
      );
    }
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px] animate-in fade-in">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              AI Risk Forecast
            </h1>
            <p className="text-sm text-gray-500">
              Target Machine: {basicInfo.product_id || "Unknown"}
            </p>
          </div>
        </div>
        <ForecastResultViewer rawResult={forecastData} />
      </div>
    );
  }

  if (viewMode === "manual") {
    if (!detailData || !basicInfo.product_id) {
      return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-gray-400 animate-in fade-in">
          <FileText className="w-12 h-12 mb-4 opacity-20" />
          <p>Enter a Machine ID below to check its status.</p>
        </div>
      );
    }

    const analysisData = detailData?.report_data?.analisis || {};
    const mesin = detailData?.report_data?.mesin || {};
    const prediksi = detailData?.report_data?.prediksi || {};
    const metrics = analysisData.calculated_metrics || {};

    let visualData = analysisData.radar_chart;
    let imageSrc = visualData;
    if (
      visualData &&
      visualData.length > 50 &&
      !visualData.startsWith("http") &&
      !visualData.startsWith("data:image")
    ) {
      imageSrc = `data:image/png;base64,${visualData}`;
    }
    const isImageAvailable =
      visualData && (visualData.length > 200 || visualData.startsWith("http"));

    // Config Warna
    const getStatusConfig = (statusRaw) => {
      const status = statusRaw ? statusRaw.toUpperCase() : "UNKNOWN";
      if (status === "NORMAL")
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          badgeBg: "bg-green-100",
          badgeText: "text-green-700",
          iconColor: "text-green-600",
          Icon: CheckCircle2,
          title: "Machine Optimal",
        };
      else if (status === "WARNING")
        return {
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          badgeBg: "bg-amber-100",
          badgeText: "text-amber-700",
          iconColor: "text-amber-600",
          Icon: AlertTriangle,
          title: "Warning Alert",
        };
      else
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          badgeBg: "bg-red-100",
          badgeText: "text-red-700",
          iconColor: "text-red-600",
          Icon: XCircle,
          title: "Critical Failure",
        };
    };
    const statusConfig = getStatusConfig(prediksi.status_label);

    return (
      <div
        className={`mt-0 ${statusConfig.bgColor} rounded-2xl p-6 border ${statusConfig.borderColor} shadow-sm animate-in fade-in`}
      >
        <div
          className={`flex flex-col gap-3 mb-4 pb-3 border-b ${statusConfig.borderColor}`}
        >
          <div className="flex items-center gap-3">
            <statusConfig.Icon
              className={`${statusConfig.iconColor} w-8 h-8`}
            />
            <div>
              <h5 className="font-bold text-gray-900 text-lg">
                {statusConfig.title}
              </h5>
              <p className="text-xs text-gray-600">
                ID: {basicInfo.product_id} •{" "}
                {mesin.product_type || "Type Unknown"}
              </p>
            </div>
            <div
              className={`ml-auto ${statusConfig.badgeBg} ${statusConfig.badgeText} px-3 py-1 rounded-full text-sm font-bold uppercase`}
            >
              {prediksi.status_label || "UNKNOWN"}
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="bg-white/60 px-2 py-1 rounded border border-gray-200">
              Risk: <b>{prediksi.current_risk}</b>
            </span>
            <span className="bg-white/60 px-2 py-1 rounded border border-gray-200">
              Confidence: <b>{prediksi.ai_confidence}</b>
            </span>
          </div>
        </div>

        {prediksi.pesan_fisik && (
          <div className="mb-4 bg-white/70 p-3 rounded-lg border border-gray-200 flex gap-3 items-start">
            <Info
              className={`w-5 h-5 mt-0.5 shrink-0 ${statusConfig.iconColor}`}
            />
            <div className="text-sm text-gray-800 font-medium whitespace-pre-wrap">
              {prediksi.pesan_fisik}
            </div>
          </div>
        )}

        {/* Metrics */}
        <h6 className="text-xs font-bold text-gray-500 uppercase mb-2">
          Detailed Metrics
        </h6>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Thermometer className="w-3 h-3" /> Process Temp
            </div>
            <p className="font-mono font-semibold text-gray-800">
              {mesin.process_temperature} K
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Gauge className="w-3 h-3" /> RPM
            </div>
            <p className="font-mono font-semibold text-gray-800">
              {mesin.rotational_speed}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <MoveDiagonal className="w-3 h-3" /> Torque
            </div>
            <p className="font-mono font-semibold text-gray-800">
              {mesin.torque} Nm
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Wrench className="w-3 h-3" /> Tool Wear
            </div>
            <p className="font-mono font-semibold text-gray-800">
              {mesin.tool_wear} min
            </p>
          </div>
          {/* Calculated Metrics */}
          {metrics.power && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 text-xs mb-1">
                <Zap className="w-3 h-3" /> Power
              </div>
              <p className="font-mono font-bold text-blue-900">
                {metrics.power}
              </p>
            </div>
          )}
          {metrics.strain && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 text-xs mb-1">
                <BarChart3 className="w-3 h-3" /> Strain
              </div>
              <p className="font-mono font-bold text-blue-900">
                {metrics.strain}
              </p>
            </div>
          )}
          {metrics.temp_diff && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 text-xs mb-1">
                <Flame className="w-3 h-3" /> Temp Diff
              </div>
              <p className="font-mono font-bold text-blue-900">
                {metrics.temp_diff}
              </p>
            </div>
          )}
          {metrics.time_to_critical && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 text-xs mb-1">
                <Clock className="w-3 h-3" /> Critical Time
              </div>
              <p className="font-mono font-bold text-blue-900 text-xs">
                {metrics.time_to_critical}
              </p>
            </div>
          )}
        </div>

        {/* AI & SHAP */}
        <div
          className={`p-4 rounded-xl border bg-white ${statusConfig.borderColor} shadow-sm`}
        >
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <h6 className="text-sm font-bold text-gray-800">
              AI Explanation (SHAP)
            </h6>
          </div>
          <div className="text-xs text-gray-600 mb-4 leading-relaxed border-l-2 border-purple-300 pl-3">
            {renderAIText(analysisData.ai_analysis)}
          </div>
          {isImageAvailable ? (
            <div className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex justify-center p-2">
              <img
                src={imageSrc}
                alt="SHAP"
                className="w-full h-auto object-contain max-h-[300px]"
              />
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded border border-dashed text-center text-gray-400">
              <p className="text-xs">Visualisasi tidak tersedia</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const analysisData = detailData?.report_data?.analisis || {};
  let visualDataDefault = analysisData.radar_chart;
  let imageSrcDefault = visualDataDefault;
  if (
    visualDataDefault &&
    visualDataDefault.length > 50 &&
    !visualDataDefault.startsWith("http") &&
    !visualDataDefault.startsWith("data:image")
  ) {
    imageSrcDefault = `data:image/png;base64,${visualDataDefault}`;
  }
  const isImageAvailableDefault =
    visualDataDefault &&
    (visualDataDefault.length > 200 || visualDataDefault.startsWith("http"));

  if (!basicInfo.product_id) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-gray-400">
        <Search className="w-12 h-12 mb-4 opacity-20" />
        <p>Select a machine from the list to view details.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px] animate-in fade-in">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold">
              {basicInfo.product_id || "Unknown ID"}
            </h1>
            <p className="text-sm text-gray-500">
              Machine Type {basicInfo.product_id?.charAt(0) || "-"}
            </p>
          </div>
        </div>
        <StatusBadge status={basicInfo.status?.toLowerCase()}>
          {basicInfo.status || "Unknown"}
        </StatusBadge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Remaining Life
          </p>
          <p className="font-medium text-sm">
            {basicInfo.remaining_life !== undefined
              ? `${basicInfo.remaining_life} Years`
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Health Score
          </p>
          <p
            className={`font-bold ${
              basicInfo.health_score < 50 ? "text-red-600" : "text-green-600"
            }`}
          >
            {basicInfo.health_score || 0}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Last Maintenance
          </p>
          <p className="font-medium text-sm">
            {basicInfo.last_maintenance || "-"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50/50 min-h-[250px]">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 self-start flex items-center gap-2">
            <ImageIcon className="w-3 h-3" /> Health Visualization
          </h3>
          {isLoading ? (
            <div className="flex flex-col items-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-xs">Loading visualization...</span>
            </div>
          ) : isImageAvailableDefault ? (
            <img
              src={imageSrcDefault}
              alt="SHAP"
              className="w-full h-auto object-contain max-h-[250px] rounded-lg"
            />
          ) : (
            <div className="text-center text-gray-400 py-10">
              <p className="text-xs">No visualization available</p>
            </div>
          )}
        </div>
        <div className="border rounded-xl p-4 bg-blue-50/30 border-blue-100 flex flex-col">
          <h3 className="text-xs font-bold text-blue-700 uppercase mb-3 flex items-center gap-2">
            <Activity className="w-3 h-3" /> AI Analysis
          </h3>
          <div className="flex-1 overflow-y-auto max-h-[250px] custom-scrollbar pr-2">
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ) : (
              renderAIText(analysisData.ai_analysis)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

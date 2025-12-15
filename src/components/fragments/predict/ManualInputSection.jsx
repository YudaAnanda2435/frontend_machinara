import React, { useState, useEffect } from "react";
import {
  Wrench,
  Activity,
  AlertTriangle,
  FileText,
  Loader2,
  Bug,
  Search,
  Sparkles,
  ChartNoAxesCombined,
  Ticket,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const ManualInputSection = ({
  selectedId,
  onAnomaliesFound,
  onStatusCheckSuccess,
  onForecastSuccess,
  onTabChange,
  forecastCache,
  setForecastCache,
}) => {
  const [inputType, setInputType] = useState("anomaly");
  const [machineId, setMachineId] = useState("");

  const [forecastQuery, setForecastQuery] = useState("");
  const [isForecastLoading, setIsForecastLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isAnomalyLoading, setIsAnomalyLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "error", 
    title: "",
    message: "",
  });

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isTicketLoading, setIsTicketLoading] = useState(false);
  const [ticketData, setTicketData] = useState({ issue: "", date: "" });

  const showModal = (type, title, message) => {
    setModalConfig({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (onTabChange) {
      onTabChange(inputType);
    }
  }, [inputType, onTabChange]);

  useEffect(() => {
    if (!selectedId) {
      setForecastQuery("");
      return;
    }
    if (forecastCache && forecastCache[selectedId]) {
      setForecastQuery(forecastCache[selectedId].query);
      if (onForecastSuccess)
        onForecastSuccess(forecastCache[selectedId].result);
    } else {
      setForecastQuery("");
      if (onForecastSuccess) onForecastSuccess(null);
    }
  }, [selectedId, forecastCache]);

  const handleCheckAnomaly = async () => {
    setIsAnomalyLoading(true);
    try {
      const priorityPromise = fetch(
        "https://machinelearning-production-344f.up.railway.app/dashboard/machines?status=Critical&status=Warning&limit=50",
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      const normalPromise = fetch(
        "https://machinelearning-production-344f.up.railway.app/dashboard/machines?status=Normal&limit=20",
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      const [priorityRes, normalRes] = await Promise.all([
        priorityPromise,
        normalPromise,
      ]);

      if (!priorityRes.ok || !normalRes.ok) {
        throw new Error("Partial fetch failed");
      }

      const priorityData = await priorityRes.json();
      const normalData = await normalRes.json();

      const criticalAndWarningList = Array.isArray(priorityData)
        ? priorityData
        : priorityData.data || [];

      const normalList = Array.isArray(normalData)
        ? normalData
        : normalData.data || [];

      const combinedList = [...criticalAndWarningList, ...normalList];

      if (onAnomaliesFound) onAnomaliesFound(combinedList);
    } catch (error) {
      console.error("Anomaly Scan Error:", error);
      showModal(
        "error",
        "Scan Failed",
        "Failed to fetch machine data. Server might be busy."
      );
    } finally {
      setIsAnomalyLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!machineId.trim()) {
      showModal("error", "Action Required", "Machine ID cannot be empty.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://manualinput-be.up.railway.app/api/manual-input",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ machine_name: machineId }),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data.");
      const data = await response.json();
      if (onStatusCheckSuccess) onStatusCheckSuccess(data);
    } catch (error) {
      showModal(
        "error",
        "Connection Error",
        "Failed to connect to server or Machine ID not found."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunPrediction = async () => {
    if (!selectedId) {
      showModal(
        "error",
        "Selection Required",
        "Please select a machine from the anomaly list first."
      );
      return;
    }
    if (!forecastQuery.trim()) {
      showModal(
        "error",
        "Input Required",
        "Please enter a question or description."
      );
      return;
    }

    const lowerQuery = forecastQuery.toLowerCase();

    const explicitCommands = [
      "buatkan ticket",
      "buatkan tiket",
      "create ticket",
      "bikin tiket",
      "buat ticket",
      "buat tiket",
      "create issue",
      "submit ticket",
    ];

    const agreementWords = [
      "ya",
      "yes",
      "oke",
      "ok",
      "setuju",
      "nggih",
      "iyo",
      "y",
      "izinn",
      "izin",
    ];

    const hasExplicitCommand = explicitCommands.some((cmd) =>
      lowerQuery.includes(cmd)
    );

    const words = lowerQuery.split(/[\s,?!.]+/).filter((w) => w.length > 0);
    const hasAgreementWord = words.some((word) =>
      agreementWords.includes(word)
    );

    const isTicketIntent =
      hasExplicitCommand || (hasAgreementWord && words.length <= 6);
    const hasPriorContext = forecastCache && forecastCache[selectedId];
    if (isTicketIntent && !hasPriorContext) {
      showModal(
        "error",
        "Simulation Required",
        "Please run a simulation/prediction first before creating a ticket."
      );
      return; 
    }

    if (isTicketIntent && hasPriorContext) {
      setIsForecastLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Anda harus login untuk membuat tiket.");
        const previousResult =
          forecastCache?.[selectedId]?.result?.answer || "";
        const autoIssue = previousResult
          ? `Auto-generated from AI Risk Forecast: ${previousResult.slice(
              0,
              200
            )}...`
          : `Maintenance required for machine ${selectedId} based on AI Prediction.`;

        const payload = {
          machine_name: selectedId,
          date: new Date().toISOString().split("T")[0],
          issue: autoIssue,
        };

        const response = await fetch(
          "https://api-ticketing.up.railway.app/api/tickets",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) throw new Error("Gagal membuat tiket otomatis.");

        // Sukses
        showModal("success", "Success", "Ticket Created Automatically by AI!");
        setForecastQuery(""); 
      } catch (error) {
        showModal("error", "Auto-Ticket Failed", error.message);
      } finally {
        setIsForecastLoading(false);
      }

      return; 
    }
    setIsForecastLoading(true);

    try {
      const contextMessage = `Machine ID ${selectedId}: ${forecastQuery}`;
      const sessionId = "session_" + new Date().getTime();

      const response = await fetch(
        "https://machinelearning-production-344f.up.railway.app/forecast",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: contextMessage,
            session_id: sessionId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to get forecast prediction.");
      const data = await response.json();

      if (setForecastCache) {
        setForecastCache((prev) => ({
          ...prev,
          [selectedId]: { result: data, query: forecastQuery },
        }));
      }

      if (onForecastSuccess) onForecastSuccess(data);
    } catch (error) {
      console.error("Error forecast:", error);
      showModal("error", "AI Error", "AI Service is currently unavailable.");
    } finally {
      setIsForecastLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    setIsTicketLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token missing. Please login.");

      const payload = {
        machine_name: selectedId,
        date: ticketData.date,
        issue: ticketData.issue,
      };

      const response = await fetch(
        "https://api-ticketing.up.railway.app/api/tickets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to create ticket");

      setIsTicketModalOpen(false);
      setForecastQuery("");
      showModal("success", "Success", "Ticket created successfully!");
    } catch (error) {
      showModal("error", "Failed", "Failed to create ticket: " + error.message);
    } finally {
      setIsTicketLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm ">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-gray-800">Machine Check</h3>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          Maintenance and service actions for machine
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setInputType("anomaly")}
            className={`py-4 rounded-lg border text-sm font-medium flex flex-col items-center justify-center gap-2 transition-all ${
              inputType === "anomaly"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white border-gray-200 hover:border-gray-300 text-gray-600"
            }`}
          >
            <Activity className="w-4 h-4" /> Anomaly Detection
          </button>
          <button
            onClick={() => setInputType("failure")}
            className={`py-4 rounded-lg border text-sm font-medium flex flex-col items-center justify-center gap-2 transition-all ${
              inputType === "failure"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white border-gray-200 hover:border-gray-300 text-gray-600"
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Failure Prediction
          </button>
          <button
            onClick={() => setInputType("document")}
            className={`py-4 rounded-lg border text-sm font-medium flex flex-col items-center justify-center gap-2 transition-all ${
              inputType === "document"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white border-gray-200 hover:border-gray-300 text-gray-600"
            }`}
          >
            <FileText className="w-4 h-4" /> Status Machine
          </button>
        </div>

        <div className="space-y-6">
          {inputType === "anomaly" && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <h4 className="font-medium text-sm text-gray-700">
                Fleet Anomaly Scan
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-2 mt-2">
                <p className="text-xs text-gray-500 mb-2">
                  Scan entire fleet for Critical and Warning statuses.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border shadow-sm">
                    <span className="text-xs text-gray-400">Target</span>
                    <p className="font-bold text-sm">All Machines</p>
                  </div>
                  <div className="bg-white p-3 w-full rounded-lg border shadow-sm">
                    <span className="text-xs text-gray-400">Filter</span>
                    <p className="font-bold text-sm">Critical & Warning</p>
                  </div>
                </div>
              </div>
              <Button
                className="w-full py-6 mt-4 bg-primary hover:bg-primary/90 item text-white font-semibold text-md"
                onClick={handleCheckAnomaly}
                disabled={isAnomalyLoading}
              >
                <div className="flex flex-row items-center gap-2">
                  <Bug className="w-12 h-12 text-white   " />

                  {isAnomalyLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                      Scanning...
                    </>
                  ) : (
                    "Check Anomalies"
                  )}
                </div>
              </Button>
            </div>
          )}
          {/* TAB 2: FAILURE PREDICTION */}
          {inputType === "failure" && (
            <div className="flex flex-col animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-sm text-gray-700">
                  AI Risk Forecast
                </h4>
                {selectedId && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/15">
                    Target: <b>{selectedId}</b>
                  </span>
                )}
              </div>
              <div className="relative">
                <textarea
                  className="w-full p-4 sm:pr-12 text-sm border rounded-xl focus:ring-2 focus:ring-primary/15 outline-none min-h-[100px] resize-none transition-all shadow-sm"
                  placeholder="Ask AI or type 'Yes' to create a ticket automatically..."
                  value={forecastQuery}
                  onChange={(e) => setForecastQuery(e.target.value)}
                  disabled={isForecastLoading}
                  // --- PERBAIKAN EVENT HANDLER ---
                  onKeyDown={(e) => {                   
                    if (e.key === "Enter") {                    
                      if (!e.shiftKey) {
                        e.preventDefault();                         
                        console.log(
                          "Enter ditekan. Mengirim data...",
                          forecastQuery
                        );

                        handleRunPrediction(); 
                      }
                    }
                  }}
                />
                {isForecastLoading && (
                  <div className="absolute right-3 bottom-3">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  className="w-full py-6 bg-primary hover:bg-primary/90 text-white font-semibold text-md shadow-md hover:shadow-lg transition-all"
                  onClick={handleRunPrediction}
                  disabled={isForecastLoading}
                >
                  {isForecastLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Run Prediction
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {inputType === "document" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h4 className="font-medium text-sm text-gray-700">
                Machine Identification
              </h4>
              <div className="relative ">
                <textarea
                  className="w-full leading-px resize-none py-5 sm:py-8 px-4 pl-12 text-sm border rounded-xl focus:ring-2 focus:ring-primary/15 outline-none"
                  placeholder="Enter Machine ID "
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        console.log(
                          "Enter ditekan. Mengirim data...",
                          machineId
                        );
                        handleCheckStatus(); 
                      }
                    }
                  }}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <Button
                className="w-full py-6 mt-2 bg-primary hover:bg-primary/90 text-white font-semibold text-md"
                onClick={handleCheckStatus}
                disabled={isLoading}
              >
                <ChartNoAxesCombined />
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                    Checking...
                  </>
                ) : (
                  "Check Status"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* UNIFIED ALERT MODAL (ERROR & SUCCESS) */}
      <Dialog open={modalConfig.isOpen} onOpenChange={closeModal}>
        <DialogContent
          className={`sm:max-w-md bg-white border-l-4 ${
            modalConfig.type === "success"
              ? "border-green-500"
              : "border-red-500"
          }`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-bold text-center flex flex-col items-center gap-2 ${
                modalConfig.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <div
                className={`h-14 w-14 rounded-full flex items-center justify-center mb-2 ${
                  modalConfig.type === "success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {modalConfig.type === "success" ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              {modalConfig.title}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700 text-[16px]">
              {modalConfig.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              variant={
                modalConfig.type === "success" ? "default" : "destructive"
              }
              className={
                modalConfig.type === "success"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
              onClick={closeModal}
            >
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Ticket Modal (Confirmation) */}
      <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-600" />
              Confirm Ticket Creation
            </DialogTitle>
            <DialogDescription>
              Review details before submitting.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Machine ID</label>
              <Input value={selectedId} disabled className="bg-gray-100" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={ticketData.date}
                onChange={(e) =>
                  setTicketData({ ...ticketData, date: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Issue Description</label>
              <textarea
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={ticketData.issue}
                onChange={(e) =>
                  setTicketData({ ...ticketData, issue: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTicketModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTicket} disabled={isTicketLoading}>
              {isTicketLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Create Ticket"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

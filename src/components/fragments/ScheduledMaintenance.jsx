import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CalendarCheck2,
  Clock,
  Wrench,
  Search,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const API_URL = "https://backend-dev-service.up.railway.app/api/tickets";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const options = { weekday: "short", day: "numeric", month: "short" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const getStatusStyle = (priority) => {
  const p = priority ? priority.toLowerCase() : "medium"; 
  if (p === "high" || p === "critical")
    return {
      style: "bg-red-100 text-red-600",
      colorText: "text-red-600",
      Icon: AlertTriangle,
    };
  if (p === "medium" || p === "warning")
    return {
      style: "bg-yellow-100 text-yellow-600",
      colorText: "text-yellow-600",
      Icon: AlertTriangle,
    };
  return {
    style: "bg-blue-100 text-blue-600",
    colorText: "text-blue-600",
    Icon: CalendarCheck2,
  };
};

const StatusIcon = ({ priority }) => {
  const { style, Icon } = getStatusStyle(priority);
  return (
    <div className={`p-3 rounded-xl shrink-0 ${style}`}>
      <Icon className="h-5 w-5" />
    </div>
  );
};

const MaintenanceItem = ({ item }) => {
  const { colorText } = getStatusStyle(item.priority);

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 rounded-lg">
      <StatusIcon priority={item.priority} />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-start">
          <p className="text-sm font-bold text-gray-800 leading-tight line-clamp-1">
            {item.title}
          </p>
          <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-medium uppercase">
            {item.priority}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <Clock className="h-3 w-3" />
          <span>{formatDate(item.date)}</span>
          <span className="text-gray-300">|</span>
          <Wrench className="h-3 w-3" />
          <span className="font-mono">ID: {item.machineId}</span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs font-medium ${colorText} capitalize`}>
            ● {item.status}
          </p>
          {item.isAuto && (
            <span className="flex items-center gap-1 text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
              <Sparkles className="w-2 h-2" /> AI
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ScheduledMaintenance = ({ selectedDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` }, 
        });

        const json = await response.json();
        const rawData = Array.isArray(json) ? json : json.data || [];

        const mappedData = rawData.map((ticket) => ({
          id: ticket.id,
          title: ticket.issue, 
          machineId: ticket.machine_name,         
          date: new Date(ticket.date || ticket.createdAt),
          priority: ticket.priority || "Medium", 
          status: ticket.status || "Open",
          isAuto: false, 
        }));

        mappedData.sort((a, b) => b.date - a.date);

        setMaintenanceData(mappedData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const dashboardData = selectedDate
    ? maintenanceData.filter((item) => isSameDay(item.date, selectedDate))
    : maintenanceData;

  const modalData = maintenanceData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.machineId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card className="rounded-2xl shadow-md h-full bg-white border-none flex flex-col">
        <CardHeader className="flex flex-col space-y-1 pb-4 border-b border-gray-100">
          <div className="flex flex-row items-center w-full justify-between">
            <CardTitle className="text-md font-bold text-gray-800">
              Scheduled Maintenance
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              className="text-blue-600 font-semibold px-0 hover:text-blue-800"
              onClick={() => setIsModalOpen(true)}
            >
              View All
            </Button>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Showing for:{" "}
            <span className="text-gray-800 font-bold">
              {selectedDate ? formatDate(selectedDate) : "All Dates"}
            </span>
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-0 p-0 overflow-y-auto max-h-[500px] min-h-[200px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-xs">Loading schedules...</p>
            </div>
          ) : (
            <>
              {dashboardData.length > 0 ? (
                dashboardData.map((item) => (
                  <MaintenanceItem key={item.id} item={item} />
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                  <CalendarCheck2 className="h-8 w-8 opacity-20" />
                  <p>No schedules for this date.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CalendarCheck2 className="h-6 w-6 text-blue-600" />
              All Maintenance Schedules
            </DialogTitle>
            <DialogDescription>
              Complete list of upcoming maintenance tasks.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-2 mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by issue or machine ID..."
              className="pl-9 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 my-2 border rounded-lg min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Loading data...</p>
              </div>
            ) : modalData.length > 0 ? (
              modalData.map((item) => (
                <MaintenanceItem key={item.id} item={item} />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No schedules found matching "{searchQuery}"
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduledMaintenance;

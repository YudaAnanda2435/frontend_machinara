import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Check,
  Activity,
  Loader2,
} from "lucide-react";

// --- Helper Icon ---
const AlertIcon = ({ type }) => {
  if (type === "critical" || type === "high")
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  if (type === "maintenance" || type === "warning")
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  if (type === "success")
    return <CheckCircle className="h-5 w-5 text-blue-500" />;
  return <Bell className="h-5 w-5" />;
};

const AlertFeed = () => {
  const [allAlerts, setAllAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // State untuk loading data tambahan

  // STATE PAGINATION
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true); // Cek apakah data di server masih ada

  const [activeAlerts, setActiveAlerts] = useState([]);
  const [queueAlerts, setQueueAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- FUNGSI SORTING UTAMA ---
  const sortAlerts = (data) => {
    return [...data].sort((a, b) => {
      // 1. Prioritas Utama: Yang BELUM di-acknowledge harus di atas
      if (a.isAcknowledged !== b.isAcknowledged) {
        return a.isAcknowledged ? 1 : -1;
      }
      // 2. Prioritas Kedua: Critical > Warning
      if (a.status !== b.status) {
        if (a.status === "critical") return -1;
        if (b.status === "critical") return 1;
      }
      // 3. Prioritas Ketiga: Health Score Terendah
      return a.healthScore - b.healthScore;
    });
  };

  // --- UPDATE TAMPILAN ---
  const refreshViews = (data) => {
    const sorted = sortAlerts(data);
    setActiveAlerts(sorted.slice(0, 2));
    setQueueAlerts(sorted.slice(2));
    setUnreadCount(data.filter((a) => !a.isAcknowledged).length);
  };

  // --- FUNGSI FETCH DATA (BISA UNTUK HALAMAN PERTAMA MAUPUN SELANJUTNYA) ---
  const fetchAlerts = async (pageNum, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      // KEMBALIKAN LIMIT JADI 20 (Agar ringan load per batch)
      // Tapi kita mainkan PAGE nya.
      const response = await fetch(
        `https://machinelearning-production-344f.up.railway.app/dashboard/machines?status=Critical&status=Warning&limit=20&page=${pageNum}`
      );
      const rawData = await response.json();
      const dataList = Array.isArray(rawData) ? rawData : rawData.data || [];

      // Jika data kosong, berarti sudah habis
      if (dataList.length === 0) {
        setHasMoreData(false);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      const mappedData = dataList.map((machine) => ({
        id: machine.product_id,
        title: `Machine ${machine.product_id}`,
        status: machine.status.toLowerCase(),
        healthScore: machine.health_score,
        date: `Maint: ${machine.last_maintenance}`,
        description: `Health: ${machine.health_score}% | Life: ${machine.remaining_life}h`,
        isAcknowledged: false,
      }));

      setAllAlerts((prev) => {
        // GABUNGKAN DATA LAMA + DATA BARU (Cegah duplikat id jika ada)
        const combined = isLoadMore ? [...prev, ...mappedData] : mappedData;
        // Filter unik berdasarkan ID (jaga-jaga API kirim duplikat)
        const unique = combined.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );

        refreshViews(unique);
        return unique;
      });
    } catch (error) {
      console.error("Gagal mengambil alert:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial Load (Page 1)
  useEffect(() => {
    fetchAlerts(1, false);
  }, []);

  // --- HANDLE ACKNOWLEDGE (DENGAN AUTO REFILL) ---
  const handleAcknowledge = (id) => {
    // 1. Update status 'Done'
    const updatedAlerts = allAlerts.map((alert) =>
      alert.id === id ? { ...alert, isAcknowledged: true } : alert
    );
    setAllAlerts(updatedAlerts);
    refreshViews(updatedAlerts);

    // 2. CEK JUMLAH SISA UNREAD
    const remainingUnread = updatedAlerts.filter(
      (a) => !a.isAcknowledged
    ).length;

    // 3. LOGIKA REFILL OTOMATIS:
    // Jika sisa yang belum dibaca kurang dari 5, DAN masih ada data di server, DAN tidak sedang loading
    if (remainingUnread < 5 && hasMoreData && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage); // Naikkan counter halaman
      console.log(
        `Queue menipis (${remainingUnread} sisa). Mengambil data halaman ${nextPage}...`
      );
      fetchAlerts(nextPage, true); // Fetch halaman berikutnya
    }
  };

  return (
    <Card className="w-full mx-auto border-2 rounded-2xl shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg font-bold">Alert Feed</CardTitle>
        </div>
        <Badge
          variant="secondary"
          className="bg-gray-200 text-gray-700 transition-all"
        >
          {unreadCount} unread
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 px-6 pb-6">
        {/* === BAGIAN 1: ACTIVE ALERTS === */}
        <div>
          <h3 className="text-sm font-semibold text-red-500 mb-3 flex justify-between items-center">
            <span>Highest Priority</span>
            {/* Indikator Loading Kecil saat Auto-Refill */}
            {loadingMore && (
              <span className="text-[10px] flex items-center gap-1 text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" /> Fetching more...
              </span>
            )}
          </h3>

          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin text-gray-400" />
              </div>
            ) : activeAlerts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-2">
                All priority alerts handled.
              </p>
            ) : (
              activeAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`flex flex-row p-4 rounded-lg transition-all duration-500 ease-in-out ${
                    alert.isAcknowledged
                      ? "bg-gray-50 border-gray-200 opacity-60 translate-y-2"
                      : alert.status === "critical"
                      ? "border-red-200 bg-red-50"
                      : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="shrink-0 mr-4 mt-1">
                    {alert.isAcknowledged ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertIcon type={alert.status} />
                    )}
                  </div>

                  <div className="w-full">
                    <div className="flex justify-between items-start mb-1">
                      <p
                        className={`font-bold text-sm sm:text-base ${
                          alert.isAcknowledged
                            ? "text-gray-500 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {alert.title}
                      </p>

                      {!alert.isAcknowledged && (
                        <Badge
                          variant="destructive"
                          className={`text-[10px] sm:text-xs px-2 py-0.5 h-fit capitalize ${
                            alert.status === "critical"
                              ? "bg-red-700 hover:bg-red-700"
                              : "bg-yellow-600 hover:bg-yellow-600"
                          }`}
                        >
                          {alert.status}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mb-1">{alert.date}</p>
                    <p className="text-sm text-gray-700 leading-snug font-medium">
                      {alert.description}
                    </p>
                  </div>

                  {!alert.isAcknowledged && (
                    <>
                      <Separator
                        orientation="vertical"
                        className="h-auto mx-3 sm:mx-4"
                      />
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                          className="shrink-0 bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors h-8 text-xs sm:text-sm px-3 group"
                        >
                          <span className="hidden sm:inline group-hover:hidden">
                            Check
                          </span>
                          <span className="hidden sm:group-hover:inline">
                            Done
                          </span>
                          <span className="sm:hidden">
                            <Check className="w-4 h-4" />
                          </span>
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* === BAGIAN 2: NEXT ATTENTION === */}
        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2 sticky top-0 bg-white pb-2 z-10">
            <Activity className="w-4 h-4" />
            Next Attention Needed ({queueAlerts.length})
          </h3>
          <div className="flex flex-col gap-3">
            {queueAlerts.length === 0 && !loading ? (
              <p className="text-xs text-gray-400 italic">No pending queue.</p>
            ) : (
              queueAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`flex flex-row p-4 rounded-lg border transition-colors ${
                    alert.isAcknowledged
                      ? "bg-gray-50 border-gray-100 opacity-50"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="shrink-0 mr-4 mt-1">
                    {alert.isAcknowledged ? (
                      <CheckCircle className="h-5 w-5 text-gray-400" />
                    ) : (
                      <AlertIcon type={alert.status} />
                    )}
                  </div>

                  <div className="w-full">
                    <p
                      className={`font-bold text-sm sm:text-base ${
                        alert.isAcknowledged ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {alert.title}
                    </p>
                    <p className="text-xs text-gray-400 mb-1">{alert.date}</p>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                  </div>

                  <div className="ml-auto self-start">
                    {!alert.isAcknowledged && (
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                          alert.status === "critical"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {alert.status}
                      </span>
                    )}
                    {alert.isAcknowledged && (
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-400">
                        Done
                      </span>
                    )}
                  </div>
                </Card>
              ))
            )}

            {/* Indikator Loading Bawah */}
            {loadingMore && (
              <div className="flex justify-center py-2">
                <Loader2 className="animate-spin text-gray-400 w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertFeed;

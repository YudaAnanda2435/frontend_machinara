"use client";

import React, { useState, useEffect, useRef } from "react";
import { EquipmentList } from "@/components/fragments/predict/EquipmentList";
import { ManualInputSection } from "@/components/fragments/predict/ManualInputSection";
import { EquipmentHeader } from "@/components/fragments/predict/EquipmentHeader";

const API_BASE_URL =
  "https://machinelearning-production-344f.up.railway.app/dashboard/machines";

export default function PredictPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);

  // --- STATE PAGINATION ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Default Tab sekarang "All"
  const [activeTab, setActiveTab] = useState("All");
  // Default Params kosong ("") artinya ambil semua data
  const [activeParams, setActiveParams] = useState("");

  // Mode Anomaly: Hanya mengunci tab Critical & Warning
  const [isAnomalyMode, setIsAnomalyMode] = useState(false);

  // State Detail & Header
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [manualDetail, setManualDetail] = useState(null);
  const [headerMode, setHeaderMode] = useState("sidebar");
  const [forecastData, setForecastData] = useState(null);
  const [forecastCache, setForecastCache] = useState({});
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // 1. INITIAL LOAD
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsDetailLoading(true);
      setPage(1);
      setHasMore(true);

      // --- SETUP DEFAULT KE TAB "All" ---
      setActiveTab("All");
      setActiveParams(""); // Kosong = Endpoint default (All Status)
      setIsAnomalyMode(false);

      // Fetch Data Page 1 (Tanpa parameter status = All)
      const response = await fetch(`${API_BASE_URL}?page=1&limit=20`);
      if (!response.ok) throw new Error("Gagal ambil data");

      const data = await response.json();
      const list = Array.isArray(data) ? data : data.data || [];

      setEquipmentList(list);

      if (list.length > 0) {
        setSelectedId(list[0].product_id);
        setHeaderMode("sidebar");
      }
    } catch (error) {
      console.error("Error initial load:", error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // --- LOGIKA GANTI TAB ---
  const handleListTabChange = async (tabName) => {
    setActiveTab(tabName);
    setPage(1);

    // --- LOGIKA PENYARINGAN (FILTERING) ---
    // Tab "Critical" & "Warning" HANYA boleh fetch jika sudah Scan Anomaly.
    // Tab "All" & "Normal" BOLEH fetch kapan saja.
    const restrictedTabs = ["Critical", "Warning"];

    if (restrictedTabs.includes(tabName) && !isAnomalyMode) {
      // Jika tab terlarang dan belum mode anomali -> Kosongkan list
      setEquipmentList([]);
      setHasMore(false);
      setActiveParams(""); // Dummy param
      return;
    }

    // Jika Lolos (All, Normal, atau sudah Scan), Lanjut Fetch:
    setHasMore(true);
    setEquipmentList([]);

    let newParams = "";
    if (tabName === "Normal") newParams = "status=Normal";
    else if (tabName === "Critical") newParams = "status=Critical";
    else if (tabName === "Warning") newParams = "status=Warning";
    else if (tabName === "All") newParams = ""; // Kosong = All

    setActiveParams(newParams);

    try {
      // Construct URL: Jika newParams kosong, jangan tambah tanda tanya ganda yg aneh, tapi fetch handle otomatis
      const query = newParams
        ? `${newParams}&page=1&limit=20`
        : `page=1&limit=20`;

      const response = await fetch(`${API_BASE_URL}?${query}`);
      if (!response.ok) throw new Error("Gagal load tab data");

      const data = await response.json();
      const list = Array.isArray(data) ? data : data.data || [];

      setEquipmentList(list);
    } catch (error) {
      console.error("Error switching tab:", error);
    }
  };

  // --- LOAD MORE ---
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      // Pastikan format query benar (cek apakah activeParams ada isinya)
      const queryParams = activeParams
        ? `${activeParams}&page=${nextPage}&limit=20`
        : `page=${nextPage}&limit=20`;

      const response = await fetch(`${API_BASE_URL}?${queryParams}`);

      if (!response.ok) throw new Error("Gagal load more");

      const data = await response.json();
      const newList = Array.isArray(data) ? data : data.data || [];

      if (newList.length === 0) {
        setHasMore(false);
      } else {
        setEquipmentList((prev) => [...prev, ...newList]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!selectedId) return;
    const fetchDetail = async () => {
      setIsDetailLoading(true);
      if (!manualDetail) setHeaderMode("sidebar");

      try {
        const response = await fetch(
          "https://manualinput-be.up.railway.app/api/manual-input",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ machine_name: selectedId }),
          }
        );
        if (!response.ok) throw new Error("Failed detail");
        const result = await response.json();
        setSelectedDetail(result);

        if (!manualDetail) setHeaderMode("sidebar");
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setIsDetailLoading(false);
      }
    };
    fetchDetail();
  }, [selectedId]);

  // --- HANDLERS ---
  const handleAnomaliesFound = (data) => {
    setEquipmentList(data);
    setHasMore(true);
    setPage(1);

    // Buka akses ke tab Critical & Warning
    setIsAnomalyMode(true);

    // Tetap di tab "All" karena hasil scan adalah campuran
    setActiveTab("All");
    setActiveParams("");

    if (data.length > 0) {
      setSelectedId(data[0].product_id);
      setManualDetail(null);
      setHeaderMode("sidebar");
    }
  };

  const handleManualStatusSuccess = (data) => {
    setSelectedId(null);
    setSelectedDetail(null);
    setManualDetail(data);
    setHeaderMode("manual");
  };

  const handleForecastSuccess = (data) => setForecastData(data);

  const handleTabChange = (inputType) => {
    if (inputType === "failure") setHeaderMode("failure");
    else if (inputType === "document") {
      if (manualDetail) setHeaderMode("manual");
      else setHeaderMode("manual");
    } else {
      setHeaderMode("sidebar");
    }
  };

  let headerBasicInfo = {};
  if (headerMode === "manual" && manualDetail) {
    headerBasicInfo = {
      product_id: manualDetail.product_id,
      status: manualDetail.report_data?.prediksi?.status_label,
      health_score: manualDetail.report_data?.prediksi?.ai_confidence
        ? parseFloat(manualDetail.report_data.prediksi.ai_confidence)
        : 0,
      remaining_life: "-",
      last_maintenance: "-",
    };
  } else if (selectedId) {
    headerBasicInfo =
      equipmentList.find((d) => d.product_id === selectedId) || {};
  }

  let detailDataForHeader =
    headerMode === "sidebar"
      ? selectedDetail
      : headerMode === "manual"
      ? manualDetail
      : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <EquipmentList
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setManualDetail(null);
              setHeaderMode("sidebar");
            }}
            data={equipmentList}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            activeTab={activeTab}
            onTabChange={handleListTabChange}
          />
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-6">
          <EquipmentHeader
            basicInfo={headerBasicInfo}
            detailData={detailDataForHeader}
            isLoading={isDetailLoading}
            viewMode={headerMode}
            forecastData={forecastData}
            isManualView={headerMode === "manual"}
          />

          <ManualInputSection
            selectedId={selectedId}
            onAnomaliesFound={handleAnomaliesFound}
            onStatusCheckSuccess={handleManualStatusSuccess}
            onForecastSuccess={handleForecastSuccess}
            onTabChange={handleTabChange}
            forecastCache={forecastCache}
            setForecastCache={setForecastCache}
          />
        </div>
      </div>
    </div>
  );
}

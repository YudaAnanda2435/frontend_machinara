"use client";

import React, { useState, useEffect, useRef } from "react";
import { EquipmentList } from "@/components/fragments/predict/EquipmentList";
import { ManualInputSection } from "@/components/fragments/predict/ManualInputSection";
import { EquipmentHeader } from "@/components/fragments/predict/EquipmentHeader";

// Base URL tanpa page/limit (kita atur dinamis nanti)
const BASE_NORMAL_API =
  "https://machinelearning-production-344f.up.railway.app/dashboard/machines?status=Normal";

export default function PredictPage() {
  const [selectedId, setSelectedId] = useState(null);

  // State Data
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [manualDetail, setManualDetail] = useState(null);

  // State Pagination (BARU)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Cek apakah masih ada data di server
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // State Tampilan Header
  const [headerMode, setHeaderMode] = useState("sidebar");
  const [forecastData, setForecastData] = useState(null);

  const [forecastCache, setForecastCache] = useState({});
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const isMounted = useRef(false);

  // 1. EFFECT LOAD
  useEffect(() => {
    const isReloading = sessionStorage.getItem("is_predict_reloading");

    if (isReloading) {
      // Restore session...
      const savedData = sessionStorage.getItem("predict_page_state");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setEquipmentList(parsed.equipmentList || []);
        setSelectedId(parsed.selectedId || null);
        setSelectedDetail(parsed.selectedDetail || null);
        setManualDetail(parsed.manualDetail || null);
        setForecastCache(parsed.forecastCache || {});
        // Restore page state juga
        setPage(parsed.page || 1);
        setHasMore(parsed.hasMore ?? true);
      }
      sessionStorage.removeItem("is_predict_reloading");
    } else {
      // FRESH LOAD
      sessionStorage.removeItem("predict_page_state");
      fetchInitialData(); // Panggil fungsi fetch awal
    }

    isMounted.current = true;
    const handleBeforeUnload = () => {
      sessionStorage.setItem("is_predict_reloading", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // 2. EFFECT SAVE (Update simpan page & hasMore)
  useEffect(() => {
    if (isMounted.current) {
      const stateToSave = {
        equipmentList,
        selectedId,
        selectedDetail,
        manualDetail,
        forecastCache,
        page, // Simpan halaman terakhir
        hasMore, // Simpan status
      };
      sessionStorage.setItem("predict_page_state", JSON.stringify(stateToSave));
    }
  }, [
    equipmentList,
    selectedId,
    selectedDetail,
    manualDetail,
    forecastCache,
    page,
    hasMore,
  ]);

  // --- FUNGSI FETCH DATA AWAL (Page 1) ---
  const fetchInitialData = async () => {
    try {
      // Reset State
      setPage(1);
      setHasMore(true);

      const response = await fetch(`${BASE_NORMAL_API}&page=1&limit=20`);
      if (!response.ok) throw new Error("Gagal ambil data");

      const data = await response.json();
      const list = Array.isArray(data) ? data : data.data || [];

      setEquipmentList(list);

      // Auto select first item
      if (list.length > 0) {
        setSelectedId(list[0].product_id);
        setHeaderMode("sidebar");
      }
    } catch (error) {
      console.error("Error initial load:", error);
    }
  };

  // --- FUNGSI LOAD MORE (Page 2, 3, dst) ---
  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const response = await fetch(
        `${BASE_NORMAL_API}&page=${nextPage}&limit=20`
      );
      if (!response.ok) throw new Error("Gagal load more");

      const data = await response.json();
      const newList = Array.isArray(data) ? data : data.data || [];

      if (newList.length === 0) {
        setHasMore(false); // Stop jika data habis
      } else {
        // GABUNGKAN DATA LAMA + DATA BARU
        setEquipmentList((prev) => [...prev, ...newList]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // --- FETCH DETAIL MESIN ---
  useEffect(() => {
    if (!selectedId) return;
    const fetchDetail = async () => {
      setIsDetailLoading(true);
      setManualDetail(null);
      setHeaderMode("sidebar");
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
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setIsDetailLoading(false);
      }
    };
    fetchDetail();
  }, [selectedId]);

  // Handler Anomaly (Reset Pagination karena ganti list)
  const handleAnomaliesFound = (data) => {
    setEquipmentList(data);
    setHasMore(false); // Anomaly scan biasanya tidak pagination (kecuali dihandle BE)
    if (data.length > 0) {
      setSelectedId(data[0].product_id);
      setManualDetail(null);
      setHeaderMode("sidebar");
    }
  };

  // Handler Lainnya (Sama)
  const handleManualStatusSuccess = (data) => {
    setSelectedId(null);
    setSelectedDetail(null);
    setManualDetail(data);
    setHeaderMode("manual");
  };

  const handleForecastSuccess = (data) => setForecastData(data);

  const handleTabChange = (inputType) => {
    if (inputType === "failure") setHeaderMode("failure");
    else if (inputType === "document") setHeaderMode("manual");
    else setHeaderMode("sidebar");
  };

  // Logic Header Info
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
  } else {
    if (selectedId)
      headerBasicInfo =
        equipmentList.find((d) => d.product_id === selectedId) || {};
  }

  let detailDataForHeader = null;
  if (headerMode === "sidebar") detailDataForHeader = selectedDetail;
  if (headerMode === "manual") detailDataForHeader = manualDetail;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <EquipmentList
            selectedId={selectedId}
            onSelect={setSelectedId}
            data={equipmentList}
            // Props Baru untuk Pagination
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
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

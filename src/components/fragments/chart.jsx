import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- KONFIGURASI API ---
const API_URL = "https://backend-dev-service.up.railway.app/api/tickets";

const MixBarChart = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const ticketList = Array.isArray(data) ? data : data.data || [];
        setTickets(ticketList);
      } catch (error) {
        console.error("Gagal mengambil data tiket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // --- 2. OLAH DATA (JAN - DES) ---
  const chartData = useMemo(() => {
    const months = [];
    const currentYear = new Date().getFullYear(); // Ambil tahun saat ini (misal: 2025)

    // --- PERUBAHAN DISINI: Loop Tetap dari 0 (Jan) s/d 11 (Des) ---
    for (let i = 0; i < 12; i++) {
      const d = new Date(currentYear, i, 1); // Tahun ini, Bulan ke-i, Tanggal 1

      months.push({
        monthIndex: i, // 0 = Jan, 1 = Feb, dst
        year: currentYear,
        name: d.toLocaleString("id-ID", { month: "long" }), // "Januari", "Februari"
        total: 0,
      });
    }

    // B. Mapping Data (Tetap Prioritaskan 'date')
    tickets.forEach((ticket) => {
      const rawDate = ticket.date || ticket.createdAt || ticket.created_at;

      if (!rawDate) return;

      const ticketDate = new Date(rawDate);

      // Validasi tanggal
      if (isNaN(ticketDate.getTime())) return;

      // Cari bulan yang cocok
      // Kita mencocokkan bulan DAN tahun agar data tahun lalu tidak masuk ke grafik tahun ini
      const monthData = months.find(
        (m) =>
          m.monthIndex === ticketDate.getMonth() &&
          m.year === ticketDate.getFullYear()
      );

      if (monthData) {
        monthData.total += 1;
      }
    });

    return months;
  }, [tickets]);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        Loading Chart...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxHeight: "70vh", aspectRatio: 1.5 }}>
      <h3 className="text-lg font-bold text-gray-700 mb-4 px-2">
        Statistik Tiket Tahun Ini
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          {/* Grid Putus-putus */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={true}
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            interval={0} // Agar semua label bulan muncul (tidak di-skip)
            tickFormatter={(value) => value.substring(0, 3)} // Potong jadi 3 huruf (Jan, Feb, Mar) biar muat
            dy={10}
          />

          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }}  />

          <Tooltip
            cursor={{ fill: "#F3F4F6" }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-primary">
                      Total Masuk:{" "}
                      <span className="font-bold">{payload[0].value}</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Legend wrapperStyle={{ paddingTop: "20px" }} />

          <Bar
            dataKey="total"
            name="Total Masuk"
            fill="#1c3347"
            radius={[4, 4, 0, 0]}
            barSize={40} // Ukuran bar disesuaikan biar muat 12 bulan
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MixBarChart;

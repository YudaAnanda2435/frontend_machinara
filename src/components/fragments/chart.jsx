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
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      const d = new Date(currentYear, i, 1);
      months.push({
        monthIndex: i,
        year: currentYear,
        name: d.toLocaleString("id-ID", { month: "long" }),
        total: 0,
      });
    }

    tickets.forEach((ticket) => {
      const rawDate = ticket.date || ticket.createdAt || ticket.created_at;
      if (!rawDate) return;

      const ticketDate = new Date(rawDate);
      if (isNaN(ticketDate.getTime())) return;

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
    // Hapus style width/aspectRatio manual, gunakan class tailwind agar responsif mengikuti parent card
    <div className="w-full h-[70vh] mt-4">
      <h3 className="text-lg font-bold text-gray-700 mb-4 px-2">
        Statistik Tiket Tahun Ini
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          // PERBAIKAN: Margin Kiri Negatif agar mepet ke kiri
          margin={{
            top: 5,
            right: 0,
            left: -20, // Menarik sumbu Y ke kiri
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="5 5"
            vertical={false} // Hapus garis vertikal agar lebih bersih
            stroke="#D1D5DB"
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 10 }} // Font lebih kecil agar muat
            interval={0}
            tickFormatter={(value) => value.substring(0, 3)}
            dy={10}
            axisLine={false}
            tickLine={true}
          />

          <YAxis
            tick={{ fill: "#6B7280", fontSize: 10 }}
            axisLine={{ stroke: "#D1D5DB" }}
            tickLine={false}
          />

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

          <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />

          <Bar
            dataKey="total"
            name="Total Masuk"
            fill="#1c3347"
            // radius={[4, 4, 0, 0]}
            barSize={40} // Bar lebih ramping agar elegan
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MixBarChart;

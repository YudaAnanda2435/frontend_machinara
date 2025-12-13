import React, { useState } from "react";
import AppLayout from "../components/Layouts/appLayout";

// 1. Impor komponen-komponen "luar" kita
import CreateTicketForm from "@/components/fragments/CreateTicketForm";
import ScheduledMaintenance from "@/components/fragments/ScheduledMaintenance";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

const Ticketing = () => {
  // State untuk kalender besar. Default ke hari ini.
  const [date, setDate] = useState(new Date());

  return (
    <AppLayout>
      {/* 2. Gunakan layout yang sama seperti Dashboard.jsx */}
      <div className="flex flex-col gap-6 py-6 relative">
        {/* 3. Panggil Form Ticket */}
        <CreateTicketForm />

        {/* 4. Buat Grid untuk bagian bawah */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kalender (mengambil 2/3 ruang di desktop) */}
          <Card className="lg:col-span-2 rounded-2xl shadow-md p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full" // Membuat kalender mengisi kartu
              // Class untuk styling kustom agar cocok dengan desain (Tetap dipertahankan)
              classNames={{
                head_cell:
                  "w-full text-sm font-semibold text-gray-500 uppercase",
                cell: "h-14 w-full text-[16px]",
                day: "h-14 w-full text-[16px] rounded-md",
                day_selected:
                  "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
              }}
            />
          </Card>

          {/* Kolom Maintenance (mengambil 1/3 ruang di desktop) */}
          <div className="lg:col-span-1">
            {/* PENTING: Kirim props 'selectedDate={date}' agar filter berfungsi */}
            <ScheduledMaintenance selectedDate={date} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Ticketing;

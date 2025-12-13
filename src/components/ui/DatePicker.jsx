import React, { useState } from "react"; // Tambahkan useState
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ value, onChange, className, disabled, id }) {
  // 1. Kita butuh state internal untuk mengontrol buka/tutup Popover
  const [open, setOpen] = useState(false);

  // 2. Fungsi wrapper saat tanggal dipilih di kalender
  const handleSelect = (date) => {
    // Kirim data tanggal ke parent (CreateTicketForm)
    if (onChange) {
      onChange(date);
    }
    // PENTING: Tutup popover setelah memilih!
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect} // <--- Pakai fungsi handleSelect yang kita buat di atas
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

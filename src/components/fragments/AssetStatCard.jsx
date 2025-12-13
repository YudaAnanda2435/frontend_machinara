import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Komponen Kartu Statistik yang Dapat Dipakai Ulang
 * Menerima props untuk ikon, judul, nilai, label, delta, dan skema warna
 */
export const AssetStatCard = ({
  icon,
  title,
  value,
  label,
  delta,
  colorScheme,
}) => {
  // colorScheme akan berisi class Tailwind, misal:
  // { bg: "bg-red-100", iconBg: "bg-red-200", text: "text-red-700" }

  return (
    <Card className={`rounded-2xl  border-none ${colorScheme.bg}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* Ikon dalam lingkaran berwarna */}
        <div
          className={`h-12 w-12 rounded-full ${colorScheme.iconBg} flex items-center justify-center`}
        >
          {React.cloneElement(icon, {
            className: `h-6 w-6 ${colorScheme.text}`,
          })}
        </div>
        <CardTitle className={`text-md font-medium ${colorScheme.text}`}>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Nilai Statistik Utama */}
        <div className="text-2xl font-bold text-gray-900">{value}</div>

        {/* Label di bawah nilai */}
        <p className="text-sm text-gray-700">{label}</p>

        {/* Persentase perubahan */}
        <p className="text-xs text-blue-600 mt-2">{delta}</p>
      </CardContent>
    </Card>
  );
};

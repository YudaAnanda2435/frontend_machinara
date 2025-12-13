import { createContext, useState, useContext } from "react";

// 1. Buat Context
const LocaleContext = createContext();

// 2. Buat komponen PROVIDER kustom
// Ini akan "membungkus" aplikasi Anda dan MENYEDIAKAN 'value'
export const LocaleProvider = ({ children }) => {
  // 3. Buat state untuk bahasa
  const [locale, setLocale] = useState("en"); // Bahasa default

  // 4. Buat objek 'value' yang akan dibagikan
  // Inilah yang dicari oleh Sidebar Anda!
  const value = {
    locale,
    setLocale,
  };

  // 5. Render Provider bawaan React dan teruskan 'value' Anda
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

// 6. Buat hook kustom untuk kemudahan
// eslint-disable-next-line react-refresh/only-export-components
export const useLocale = () => {
  const context = useContext(LocaleContext);

  // Penanganan error yang baik
  if (context === undefined) {
    throw new Error("useLocale harus digunakan di dalam LocaleProvider");
  }

  return context;
};

// 7. Ekspor default (opsional)
export default LocaleContext;

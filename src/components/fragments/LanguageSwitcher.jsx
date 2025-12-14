import React, { useState, useContext } from "react";
// Pastikan package react-icons sudah terinstal
import { FaChevronDown } from "react-icons/fa";

// Impor Context Anda
import LocaleContext from "../../contexts/LocaleContext";

// 1. Definisikan pilihan Anda
const languages = [
  { value: "id", label: "Indonesia", flag: "id" },
  { value: "en", label: "Eng (Us)", flag: "us" },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 2. Ambil 'locale' dan 'setLocale' dari Global Context
  const { locale, setLocale } = useContext(LocaleContext);

  // 3. Tentukan bahasa yang sedang aktif
  // Pastikan logika ini tidak mengubah state (setLocale), hanya membaca.
  const selected =
    languages.find((lang) => lang.value === locale) || languages[0];

  const handleSelect = (lang) => {
    setLocale(lang.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-40">
      <button
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="h-[50px] w-full gap-1 sm:gap-2 text-[16px] font-normal pl-4 sm:pr-4 rounded-2xl  flex items-center justify-end sm:justify-between text-gray-700  transition-colors border border-transparent "
      >
        <span className="flex items-center gap-3">
          <span className={`fi fi-${selected.flag} rounded`}></span>
          {selected.label}
        </span>
        <FaChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full bg-white shadow-xl border border-gray-100 rounded-2xl mt-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {languages.map((lang) => (
            <li
              key={lang.value}
              onClick={() => handleSelect(lang)}
              className={`flex items-center gap-3 p-4 text-[16px] cursor-pointer transition-colors
                ${
                  locale === lang.value
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              <span className={`fi fi-${lang.flag} rounded`}></span>
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;

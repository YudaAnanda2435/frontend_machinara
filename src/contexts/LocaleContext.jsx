import { createContext, useState, useContext } from "react";
const LocaleContext = createContext();
export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");
  const value = {
    locale,
    setLocale,
  };
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale harus digunakan di dalam LocaleProvider");
  }

  return context;
};
export default LocaleContext;

import React from "react";

export const StatusBadge = ({ status, children }) => {
  const styles = {
    healthy: "bg-black text-white",
    warning: "bg-gray-200 text-gray-800",
    critical: "bg-red-500 text-white",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || styles.healthy
      }`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
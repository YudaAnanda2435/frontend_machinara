import React from "react";

export const ProgressBar = ({ value, status }) => {
  const colors = {
    healthy: "bg-black!",
    warning: "bg-yellow-500!",
    critical: "bg-red-500!",
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div
        className={`${colors[status]} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

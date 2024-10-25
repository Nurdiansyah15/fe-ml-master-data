import React from "react";

const Spinner = ({ size = 24, color = "rgb(59, 130, 246)" }) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderColor: `${color} transparent transparent transparent`,
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-4"
        style={spinnerStyle}
      ></div>
    </div>
  );
};

export default Spinner;

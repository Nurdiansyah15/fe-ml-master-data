import { User } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const ToastContainer = ({ icon, message }) => {
  return (
    <div className="flex flex-row items-center gap-3">
      {icon}
      <div>{message}</div>
    </div>
  );
};

const CustomToast = (message, type = "success") => {
  let icon = <User />;
  if (type === "success") {
    icon = <User color="white" />;
  }
  if (type === "error" || type === "warning" || type === "info") {
    icon = <User color="white" />;
  }

  toast(<ToastContainer icon={icon} message={message} />, {
    style: {
      background:
        type === "success"
          ? "#4caf50"
          : type === "error"
          ? "#f44336"
          : type === "warning"
          ? "#ff9000"
          : "#2196f3",
      color: "#fff",
    },
  });
};

export default CustomToast;

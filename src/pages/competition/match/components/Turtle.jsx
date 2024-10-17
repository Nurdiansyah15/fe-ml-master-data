import React, { useMemo, useState } from "react";
import EditableTable from "../../../../components/global/EditableTable";
import CustomEditableTable from "../../../../archive/CustomEditableTable";
import { useDispatch } from "react-redux";

export default function Turtle() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);

  const columns = [
    {
      label: "phase", field: "Phase", type: "text"
    },
    {
      label: "Setup", field: "setup", type: "select", renderCell: (value, options) => {
        const result = options.find(option => option.value == value);
        let style = "bg-[#4b3232] text-[#ab6161]";
        if (result?.value === "early") {
          style = "bg-[#324B39] text-[#61AB76]";
        } else if (result?.value === "late") {
          style = "bg-[#494b32] text-[#d4b560]";
        }
        
        return (
          <div className={`${style} px-4 py-2 rounded-full`}>
            <span>{result?.label || "Unknown"}</span>
          </div>
        );
      }
    },
    {
      label: "Initiate", field: "initiate", type: "select", renderCell: (value, options) => {
        const result = options.find(option => option.value == value);
        let style = "bg-[#4b3232] text-[#ab6161]";
        if (result?.value === "early") {
          style = "bg-[#324B39] text-[#61AB76]";
        } else if (result?.value === "late") {
          style = "bg-[#494b32] text-[#d4b560]";
        }
        
        return (
          <div className={`${style} px-4 py-2 rounded-full`}>
            <span>{result?.label || "Unknown"}</span>
          </div>
        );
      }
    },
    {
      label: "Result", field: "result", type: "select", renderCell: (value, options) => {
        const result = options.find(option => option.value == value);
        let style = "bg-[#4b3232] text-[#ab6161]";
        if (result?.value === "early") {
          style = "bg-[#324B39] text-[#61AB76]";
        } else if (result?.value === "late") {
          style = "bg-[#494b32] text-[#d4b560]";
        }
        
        return (
          <div className={`${style} px-4 py-2 rounded-full`}>
            <span>{result?.label || "Unknown"}</span>
          </div>
        );
      }
    },
  ];

  const selectOptions = useMemo(() => {
    return {
      setup: [
        { value: "early", label: "Early" },
        { value: "late", label: "Late" },
        { value: "no", label: "No" },
      ],
      initiate: [
        { value: "early", label: "Early" },
        { value: "late", label: "Late" },
        { value: "no", label: "No" },
      ],
      result: [
        { value: "early", label: "Early" },
        { value: "late", label: "Late" },
        { value: "no", label: "No" },
      ],
    };
  }, []);

  const handleSaveRow = (rowData) => {
    console.log("Data yang disimpan:", rowData);
  };

  const handleDeleteRow = (index) => {
    console.log("Data yang dihapus:", initialData[index]);

  };


  // if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full flex flex-col">
      <CustomEditableTable columns={columns} initialData={initialData} selectOptions={selectOptions} onSaveRow={handleSaveRow} onDeleteRow={handleDeleteRow} />
    </div>
  );
}

import { EditIcon, Save, Trash } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
const HeroPickBanRow = ({
  cols,
  rowData,
  onChange,
  index,
  onDelete,
  isEditing,
  setEditingIndex,
  selectOptions,
  handleSaveRow,
}) => {
  const [isEditingState, setIsEditingState] = useState(isEditing);
  const [hasError, setHasError] = useState(false);
  const [tempRowData, setTempRowData] = useState(rowData);

  useEffect(() => {
    setIsEditingState(isEditing);
    setTempRowData(rowData);
  }, [isEditing, rowData]);

  const startEditing = () => {
    setIsEditingState(true);
    setEditingIndex(index);
  };

  const saveRow = () => {
    if (validateRow()) {
      const newTotal = calculateTotal(tempRowData);
      handleSaveRow(index, { ...tempRowData, total: newTotal });
      setIsEditingState(false);
      setEditingIndex(null);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const handleInputChange = (field, value) => {
    setHasError(false);
    setTempRowData((prev) => ({ ...prev, [field]: value }));
  };

  const validateRow = () => {
    return cols.every((col) => {
      if (col.type === "checkbox") return true;
      if (col.field === "total") return true;
      return (
        tempRowData[col.field] !== undefined && tempRowData[col.field] !== ""
      );
    });
  };

  const handleDelete = () => onDelete(rowData.id);

  const calculateTotal = (data) => {
    return cols.filter((col) => col.type === "checkbox" && data[col.field])
      .length;
  };

  const tempTotal = useMemo(
    () => calculateTotal(tempRowData),
    [tempRowData, cols]
  );

  return (
    <tr className={hasError ? "bg-red-100" : ""}>
      {cols.map((col, colIndex) => {
        if (col.field === "total") {
          return (
            <td key={colIndex} className="py-2 w-32 p-2 rounded-md">
              <span className="text-center w-full block">
                {isEditingState ? tempTotal : rowData.total}
              </span>
            </td>
          );
        }

        return (
          <td className="py-2 w-32 p-2 rounded-md" key={colIndex}>
            {col.type === "checkbox" ? (
              <div
                className={`flex items-center justify-center p-1 rounded-md ${
                  isEditingState ? "bg-slate-800" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    isEditingState ? tempRowData[col.field] : rowData[col.field]
                  }
                  onChange={(e) =>
                    handleInputChange(col.field, e.target.checked)
                  }
                  disabled={!isEditingState}
                  className="w-5 h-6 cursor-pointer"
                />
              </div>
            ) : col.type === "select" ? (
              isEditingState ? (
                <select
                  value={tempRowData[col.field] || ""}
                  onChange={(e) => handleInputChange(col.field, e.target.value)}
                  className="bg-slate-800 text-white rounded-md p-1 w-full text-center"
                >
                  <option value="">Pilih {col.label}</option>
                  {selectOptions[col.field].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <img
                    src={
                      selectOptions[col.field].find(
                        (option) => option.value == rowData[col.field]
                      )?.image || "https://via.placeholder.com/32"
                    }
                    alt="Team Logo"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-center block">
                    {selectOptions[col.field].find(
                      (option) => option.value == rowData[col.field]
                    )?.label || "Unknown Team"}
                  </span>
                </div>
              )
            ) : isEditingState ? (
              <input
                type="text"
                value={tempRowData[col.field] || ""}
                onChange={(e) => handleInputChange(col.field, e.target.value)}
                className={`bg-slate-800 text-white rounded-md p-1 w-full text-center ${
                  hasError && !tempRowData[col.field]?.trim()
                    ? "border border-red-500"
                    : ""
                }`}
                onKeyDown={(e) => e.key === "Enter" && saveRow()}
              />
            ) : (
              <span className="text-center w-full block">
                {rowData[col.field]}
              </span>
            )}
          </td>
        );
      })}
      <td className="py-2 w-5">
        <div className="flex items-center justify-center">
          {!isEditingState ? (
            <button
              className="text-white px-4 py-2 rounded-md"
              onClick={startEditing}
            >
              <EditIcon />
            </button>
          ) : (
            <button
              className="text-white px-4 py-2 rounded-md"
              onClick={saveRow}
            >
              <Save />
            </button>
          )}
          <button
            className="text-white px-4 py-2 rounded-md"
            onClick={handleDelete}
          >
            <Trash />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default HeroPickBanRow;

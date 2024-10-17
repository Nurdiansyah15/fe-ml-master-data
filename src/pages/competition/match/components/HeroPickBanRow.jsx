import React, { useEffect, useMemo, useState } from "react";
import { Save, Trash, EditIcon } from "lucide-react";

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
  const [localRowData, setLocalRowData] = useState(rowData);

  useEffect(() => {
    setIsEditingState(isEditing);
  }, [isEditing]);

  useEffect(() => {
    setLocalRowData(rowData);
  }, [rowData]);

  const startEditing = () => {
    setIsEditingState(true);
    setEditingIndex(index);
  };

  const saveRow = () => {
    if (validateRow()) {
      handleSaveRow(index, localRowData);
      setIsEditingState(false);
      setEditingIndex(null);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const handleInputChange = (field, value) => {
    setHasError(false);
    const updatedRowData = { ...localRowData, [field]: value };

    // Recalculate total
    const newTotal = cols.filter(
      (col) => col.type === "checkbox" && updatedRowData[col.field]
    ).length;
    updatedRowData.total = newTotal;

    setLocalRowData(updatedRowData);
    onChange(index, field, value);
  };

  const validateRow = () => {
    return cols.every((col) => {
      if (col.type === "checkbox" || col.field === "total") return true;
      if (col.type === "select")
        return (
          localRowData[col.field] !== undefined &&
          localRowData[col.field] !== ""
        );
      return (
        localRowData[col.field] !== undefined &&
        localRowData[col.field].toString().trim() !== ""
      );
    });
  };

  const handleDelete = () => onDelete(rowData.id);

  const renderInput = (col) => {
    const options = selectOptions[col.field] || [];
    const isDisabled = !isEditingState || col.field === "total";

    switch (col.type) {
      case "checkbox":
        return (
          <div
            className={`flex items-center justify-center p-1 rounded-md ${
              isEditingState ? "bg-[#363638]" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={localRowData[col.field] || false}
              onChange={(e) => handleInputChange(col.field, e.target.checked)}
              disabled={isDisabled}
              className="w-5 h-6 cursor-pointer"
            />
          </div>
        );
      case "select":
        return isEditingState ? (
          <select
            value={localRowData[col.field] || ""}
            onChange={(e) => handleInputChange(col.field, e.target.value)}
            disabled={isDisabled}
            className="bg-[#363638] text-white rounded-md p-1 w-full text-center"
          >
            <option value="">Choose {col.label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center gap-2 justify-center">
            <img
              src={
                options.find(
                  (option) => option.value == localRowData[col.field]
                )?.image || "https://via.placeholder.com/32"
              }
              alt="Team Logo"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-center block">
              {options.find((option) => option.value == localRowData[col.field])
                ?.label || "Unknown"}
            </span>
          </div>
        );
      case "number":
      case "text":
      default:
        const value = localRowData[col.field];
        const displayValue = value !== undefined && value !== null ? value : "";

        return isEditingState && col.field !== "total" ? (
          <input
            type={col.type === "number" ? "number" : "text"}
            value={displayValue}
            onChange={(e) => handleInputChange(col.field, e.target.value)}
            disabled={isDisabled}
            className={`bg-[#363638] text-white rounded-md p-1 w-full text-center ${
              hasError && displayValue.toString().trim() === ""
                ? "border border-red-500"
                : ""
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onKeyDown={(e) => e.key === "Enter" && saveRow()}
          />
        ) : (
          <span className="text-center w-full block">{displayValue}</span>
        );
    }
  };

  return (
    <tr>
      {cols.map((col, colIndex) => (
        <td className="py-2 w-32 p-2 rounded-md" key={colIndex}>
          {renderInput(col)}
        </td>
      ))}
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

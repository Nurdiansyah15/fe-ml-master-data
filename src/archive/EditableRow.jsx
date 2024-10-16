import { Save, Trash, EditIcon } from "lucide-react";
import { useEffect, useState } from "react";

const EditableRow = ({
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

  useEffect(() => {
    setIsEditingState(isEditing);
  }, [isEditing]);

  const startEditing = () => {
    setIsEditingState(true);
    setEditingIndex(index);
  };

  const saveRow = () => {
    if (!validateRow()) {
      setHasError(true);
      return;
    }
    handleSaveRow(index); // Call parent save handler
    setIsEditingState(false);
    setEditingIndex(null);
  };

  const handleInputChange = (field, value) => {
    setHasError(false);
    onChange(index, field, value);
  };

  const validateRow = () => {
    return cols.every((col) =>
      col.type === "checkbox" ? true : rowData[col.field]
    );
  };

  const handleDelete = () => onDelete(index);

  return (
    <tr>
      {cols.map((col, colIndex) => (
        <td className="py-2 w-32 p-2 rounded-md" key={colIndex}>
          {col.type === "checkbox" ? (
            <div
              className={`flex items-center justify-center p-1 rounded-md ${
                isEditingState ? "bg-slate-800" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={rowData[col.field]}
                onChange={(e) => handleInputChange(col.field, e.target.checked)}
                disabled={!isEditingState}
                className="w-5 h-6 cursor-pointer"
              />
            </div>
          ) : col.type === "select" ? (
            isEditingState ? (
              <select
                value={rowData[col.field] || ""}
                onChange={(e) => handleInputChange(col.field, e.target.value)}
                className="bg-slate-800 text-white rounded-md p-1 w-full text-center"
              >
                <option value="">Pilih Team</option>
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
              value={rowData[col.field]}
              onChange={(e) => handleInputChange(col.field, e.target.value)}
              className={`bg-slate-800 text-white rounded-md p-1 w-full text-center ${
                hasError && !rowData[col.field]?.trim()
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

export default EditableRow;

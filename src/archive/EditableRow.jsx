import { Save } from "lucide-react";
import { Trash } from "lucide-react";
import { EditIcon } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

const EditableRow = ({
  cols,
  rowData,
  onChange,
  index,
  onDelete,
  isEditing,
  setEditingIndex,
}) => {
  const [isEditingState, setIsEditingState] = useState(isEditing);

  useEffect(() => {
    setIsEditingState(isEditing); // Update local state when isEditing prop changes
  }, [isEditing]);

  const toggleEditing = () => {
    setIsEditingState(!isEditingState);
    setEditingIndex(isEditingState ? null : index); // Set editing index
  };
  const handleInputChange = (field, value) => {
    onChange(index, field, value);
  };

  const handleDelete = () => {
    onDelete(index); // Panggil fungsi delete dari props
  };

  const handleCancel = () => {
    setRows(originalData); // Reset ke data asli
    setIsEditingState(false); // Keluar dari mode edit
    setHasChanges(false); // Reset state perubahan
  };

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
          ) : isEditingState ? (
            <input
              type="text"
              value={rowData[col.field]}
              onChange={(e) => handleInputChange(col.field, e.target.value)}
              className="bg-slate-800 text-white rounded-md p-1 w-full text-center"
              onKeyDown={(e) => e.key === "Enter" && toggleEditing()}
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
          <button
            className="text-white px-4 py-2 rounded-md"
            onClick={() => toggleEditing()}
          >
            {!isEditingState ? <EditIcon /> : <Save />}
          </button>
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

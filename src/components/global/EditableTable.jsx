import { Edit, Plus, Save } from "lucide-react";
import React, { useState } from "react";
import EditableRow from "./EditableRow";

const EditableTable = ({ columns, initialData }) => {
  const [rows, setRows] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false); // State untuk melacak perubahan

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
    setHasChanges(true);
  };

  const addRow = () => {
    const emptyRow = {};
    columns.forEach((col) => {
      emptyRow[col.field] = col.type === "checkbox" ? false : "";
    });
    setRows([...rows, emptyRow]);
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Data yang disimpan:", rows);
    setHasChanges(false); // Reset state perubahan setelah menyimpan
    setIsEditing(false); // Keluar dari mode edit
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setHasChanges(false); // Reset hasChanges jika keluar dari mode edit
      console.log("Data yang disimpan:", rows);
    } else {
      setHasChanges(true); // Set hasChanges ke true saat masuk mode edit
    }
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
    setHasChanges(true);
  };

  return (
    <div className="w-full p-2">
      <table className="w-full text-center">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th className="py-2" key={index}>
                <div className="bg-gray-700 p-2 mx-1 rounded-md">
                  {col.label}
                </div>
              </th>
            ))}
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <EditableRow
              key={index}
              cols={columns}
              rowData={row}
              onChange={handleChange}
              index={index}
              onDelete={handleDeleteRow}
              isEditing={isEditing}
              onSave={handleEditToggle}
            />
          ))}
        </tbody>
      </table>

      <div className="mt-4 mx-6 text-right flex justify-end gap-2">
        <button onClick={addRow} className="text-white px-4 py-2 rounded-md">
          <Plus />
        </button>
        <button
          onClick={handleEditToggle} // Toggle mode edit
          className={`text-white px-4 py-2 rounded-md`}
        >
          {isEditing ? <Save /> : <Edit />}
        </button>
      </div>
    </div>
  );
};

export default EditableTable;

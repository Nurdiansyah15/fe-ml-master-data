import React, { useState } from "react";
import EditableRow from "./EditableRow";

const EditableTable = ({ columns, initialData }) => {
  const [rows, setRows] = useState(initialData);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // State untuk menyimpan index baris yang sedang diedit

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
    setEditingIndex(rows.length); // Set index baris yang baru ditambahkan ke mode edit
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Data yang disimpan:", rows);
    setHasChanges(false);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
    setHasChanges(true);
  };

  return (
    <div className="w-full p-10">
      <table className="w-full text-center">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th className="py-2" key={index}>
                {col.label}
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
              isEditing={editingIndex === index} // Pass isEditing state to EditableRow
              setEditingIndex={setEditingIndex} // Pass setter function
            />
          ))}
        </tbody>
      </table>

      <div className="mt-4 mx-10 text-right">
        <button
          onClick={addRow}
          className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
        >
          Add Row
        </button>
        <button
          onClick={handleSave}
          className={`bg-green-600 text-white px-4 py-2 rounded-md ${
            hasChanges ? "" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!hasChanges}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditableTable;

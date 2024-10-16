import React, { useState } from "react";
import EditableRow from "./EditableRow";

const EditableTable = ({ columns, initialData, selectOptions, onSaveRow }) => {
  const [rows, setRows] = useState(
    initialData.map((row) => ({ ...row, isNew: false })) // Mark existing rows as not new
  );
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // console.log("initialData", initialData);

  const addRow = () => {
    const emptyRow = { isNew: true }; // New row with 'isNew' flag
    columns.forEach((col) => {
      emptyRow[col.field] = col.type === "checkbox" ? false : "";
    });
    setRows([...rows, emptyRow]);
    setEditingIndex(rows.length);
  };

  const handleSaveRow = (index) => {
    const row = rows[index];
    if (onSaveRow) {
      onSaveRow(row); // Pass the type and data to parent
    }
    row.isNew = false; // Mark as existing after saving
    setEditingIndex(null); // Stop editing
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
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
              isEditing={editingIndex === index}
              setEditingIndex={setEditingIndex}
              selectOptions={selectOptions}
              handleSaveRow={handleSaveRow}
            />
          ))}
        </tbody>
      </table>

      <div className="mt-4 mx-10 text-right">
        <button
          onClick={addRow}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Row
        </button>
      </div>
    </div>
  );
};

export default EditableTable;

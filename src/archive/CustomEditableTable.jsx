import React, { useState, useEffect } from "react";
import { Save, Trash, EditIcon } from "lucide-react";

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
    if (!validateRow()) {
      setHasError(true);
      return;
    }
    handleSaveRow(index, localRowData);
    setIsEditingState(false);
    setEditingIndex(null);
  };

  const handleInputChange = (field, value) => {
    setHasError(false);
    const updatedRowData = { ...localRowData, [field]: value };
    
    // Recalculate dependent fields
    cols.forEach(col => {
      if (col.dependsOn) {
        updatedRowData[col.field] = col.calculate(updatedRowData);
      }
    });

    setLocalRowData(updatedRowData);
    onChange(index, updatedRowData);
  };

  const validateRow = () => {
    return cols.every((col) =>
      col.type === "checkbox" ? true : localRowData[col.field]
    );
  };

  const handleDelete = () => onDelete(index);

  const renderInput = (col) => {
    const options = selectOptions[col.field] || [];
    const isDisabled = !isEditingState || col.dependsOn || col.readOnly;
    
    switch (col.type) {
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={localRowData[col.field]}
            onChange={(e) => handleInputChange(col.field, e.target.checked)}
            disabled={isDisabled}
            className="w-5 h-6 cursor-pointer"
          />
        );
      case "select":
        return isEditingState && !col.readOnly ? (
          <select
            value={localRowData[col.field] || ""}
            onChange={(e) => handleInputChange(col.field, e.target.value)}
            disabled={isDisabled}
            className="bg-slate-800 text-white rounded-md p-1 w-full text-center"
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
            {col.renderCell ? (
              col.renderCell(localRowData[col.field], options)
            ) : (
              <span className="text-center block">
                {options.find((option) => option.value == localRowData[col.field])?.label || localRowData[col.field] || "Unknown"}
              </span>
            )}
          </div>
        );
      case "number":
      case "text":
      default:
        return isEditingState && !col.readOnly ? (
          <input
            type={col.type === "number" ? "number" : "text"}
            value={localRowData[col.field]}
            onChange={(e) => handleInputChange(col.field, e.target.value)}
            disabled={isDisabled}
            className={`bg-slate-800 text-white rounded-md p-1 w-full text-center ${
              hasError && !localRowData[col.field]?.toString().trim() ? "border border-red-500" : ""
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onKeyDown={(e) => e.key === "Enter" && saveRow()}
          />
        ) : (
          <span className="text-center w-full block">{localRowData[col.field]}</span>
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

const CustomEditableTable = ({ columns, initialData, selectOptions, onSaveRow }) => {
  const [rows, setRows] = useState(
    initialData.map((row) => ({ ...row, isNew: false }))
  );
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (index, updatedRowData) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRowData, isNew: rows[index].isNew };
    setRows(updatedRows);
  };

  const addRow = () => {
    const emptyRow = { isNew: true };
    columns.forEach((col) => {
      if (col.dependsOn) {
        emptyRow[col.field] = col.calculate(emptyRow);
      } else {
        emptyRow[col.field] = col.defaultValue !== undefined ? col.defaultValue : 
          (col.type === "checkbox" ? false : "");
      }
    });
    setRows([...rows, emptyRow]);
    setEditingIndex(rows.length);
  };

  const handleSaveRow = (index, rowData) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...rowData, isNew: false };
    setRows(updatedRows);
    if (onSaveRow) {
      onSaveRow(rowData);
    }
    setEditingIndex(null);
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

export default CustomEditableTable;
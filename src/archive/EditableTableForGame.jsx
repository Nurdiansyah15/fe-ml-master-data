import React, { useState, useEffect } from "react";
import { Save, Trash, EditIcon } from "lucide-react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useContext } from "react";
import MatchEditContext from "../contexts/MatchEditContext";

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
  onFieldChange,
}) => {
  const { isEditingMatch, toggleEditing, removeEditing } =
    useContext(MatchEditContext);
  const [isEditingState, setIsEditingState] = useState(isEditing);
  const [hasError, setHasError] = useState(false);
  const [localRowData, setLocalRowData] = useState(rowData);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // State modal

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

    cols.forEach((col) => {
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

  const handleConfirmDelete = () => {
    onDelete(index, localRowData);
    setConfirmModalOpen(false); // Tutup modal setelah konfirmasi
  };

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
            className="border-b-1 border-gray-600 bg-[#1f1f1f] text-white rounded-md p-1 w-full text-center"
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
                {options.find(
                  (option) => option.value == localRowData[col.field]
                )?.label ||
                  localRowData[col.field] ||
                  "Unknown"}
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
            className={`border-b-1 border-gray-600 bg-transparent text-white rounded-md p-1 w-full text-center ${
              hasError && !localRowData[col.field]?.toString().trim()
                ? "border border-red-500"
                : ""
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onKeyDown={(e) => e.key === "Enter" && saveRow()}
          />
        ) : (
          <span className="text-center w-full block">
            {localRowData[col.field]}
          </span>
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
        {isEditingMatch && (
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
              onClick={() => setConfirmModalOpen(true)} // Buka modal saat klik delete
            >
              <Trash />
            </button>

            <Modal
              isOpen={confirmModalOpen}
              onClose={() => setConfirmModalOpen(false)}
            >
              <ModalContent className="bg-gray-800 text-white">
                <ModalHeader>Delete Confirmation</ModalHeader>
                <ModalBody>
                  <p>Are you sure you want to delete this row?</p>
                  <p className="text-red-500">
                    This action will{" "}
                    <span className="font-bold">delete all data related</span>{" "}
                    to this row.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={handleConfirmDelete}>
                    Delete
                  </Button>
                  <Button
                    color="default"
                    onClick={() => setConfirmModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        )}
      </td>
    </tr>
  );
};

const EditableTableForGame = ({
  columns,
  initialData,
  selectOptions,
  onSaveRow,
  onDeleteRow,
  onFieldChange,
  maxRows,
}) => {
  const { isEditingMatch, toggleEditing, removeEditing } =
    useContext(MatchEditContext);
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
      } else if (col.field === "total") {
        emptyRow[col.field] = 0; // Default value for new rows
      } else {
        emptyRow[col.field] =
          col.defaultValue !== undefined
            ? col.defaultValue
            : col.type === "checkbox"
            ? false
            : "";
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

  const handleDeleteRow = (index, rowData) => {
    const rowToDelete = rows[index];
    onDeleteRow(rowToDelete, rowData);
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };

  useEffect(() => {
    setRows(initialData);
  }, [initialData]);

  return (
    <div className="w-full p-10">
      <table className="w-full text-center">
        <thead className="">
          <tr>
            {columns.map((col, index) => (
              <th className="py-2" key={index}>
                <div className="bg-[#363638] rounded-xl p-2 mx-1">
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
              isEditing={editingIndex === index}
              setEditingIndex={setEditingIndex}
              selectOptions={selectOptions}
              handleSaveRow={handleSaveRow}
              onFieldChange={onFieldChange}
            />
          ))}
        </tbody>
      </table>

      {editingIndex === null &&
        (!maxRows || rows.length < maxRows) &&
        isEditingMatch && (
          <div className="mt-4 mx-10 text-right">
            <button
              disabled={editingIndex !== null}
              onClick={addRow}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add Row
            </button>
          </div>
        )}
    </div>
  );
};

export default EditableTableForGame;

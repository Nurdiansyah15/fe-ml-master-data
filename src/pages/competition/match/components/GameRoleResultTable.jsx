import React, { useEffect, useState } from "react";
import GameRoleResultRow from "./GameRoleResultRow";
import { useContext } from "react";
import MatchEditContext from "../../../../contexts/MatchEditContext";

const GameRoleResultTable = ({
  headerClassName,
  cellClassName,
  columns,
  initialData,
  selectOptions,
  onSaveRow,
  onDelete,
  maxRows,
}) => {
  const { isEditingMatch, toggleEditing, removeEditing } =
    useContext(MatchEditContext);
  const [rows, setRows] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const newRows = initialData.map((row) => ({ ...row, isNew: false }));
    setRows(newRows);
  }, [initialData]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    const emptyRow = { isNew: true, total: 0 };
    columns.forEach((col) => {
      emptyRow[col.field] = col.type === "checkbox" ? false : "";
    });
    setRows([...rows, emptyRow]);
    setEditingIndex(rows.length);
  };

  const handleSaveRow = (index, updatedRowData) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRowData, isNew: false };
    setRows(updatedRows);
    setEditingIndex(null);
    if (onSaveRow) {
      onSaveRow(updatedRowData);
    }
  };

  const handleDeleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    setEditingIndex(null);
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="w-full p-10">
      <table className="w-full text-center">
        <thead className="">
          <tr>
            {columns.map((col, index) => (
              <th className="py-2" key={index}>
                <div className={`bg-[#363638] rounded-xl p-2 mx-1 ${headerClassName}`}>
                  {col.label}
                </div>
              </th>
            ))}
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <GameRoleResultRow
              cellClassName={cellClassName}
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

export default GameRoleResultTable;

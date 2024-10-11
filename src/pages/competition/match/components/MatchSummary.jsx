import React, { useState } from "react";
import { Edit, Save } from "lucide-react";

const MatchSummary = ({ summary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState(summary); // Initialize rows with summary data
  const [hasChanges, setHasChanges] = useState(false); // Track if there are any changes

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (hasChanges) {
      console.log("Data yang disimpan:", rows);
      setHasChanges(false); // Reset hasChanges after saving
    }
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && hasChanges) {
      handleSave();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const columns = [
    { label: "Game", field: "game" },
    { label: "First Pick", field: "firstPick" },
    { label: "Second Pick", field: "secondPick" },
    { label: "Winner", field: "winner" },
  ];

  return (
    <div className="mt-4 w-full">
      <table className="table-auto w-full text-center border-collapse">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th className="py-2" key={index}>
                <div className="bg-gray-700 p-2 mx-1 rounded-md">
                  {col.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr key={index}>
              <td className="py-2 w-32 p-2 rounded-md">
                <div
                  className={`${
                    isEditing
                      ? "border border-gray-700 rounded-md"
                      : "bg-transparent"
                  }`}
                >
                  <input
                    type="text"
                    value={item.game}
                    onChange={(e) =>
                      handleChange(index, "game", e.target.value)
                    }
                    onKeyDown={handleKeyPress} // Detect "Enter" key
                    className={`text-white bg-transparent text-lg p-1 w-full text-center ${
                      isEditing ? "" : "cursor-not-allowed"
                    }`}
                    disabled={!isEditing} // Disable jika tidak dalam mode edit
                  />
                </div>
              </td>
              <td className="py-2 w-32 p-2 rounded-md">
                <div
                  className={`${
                    isEditing
                      ? "border border-gray-700 rounded-md"
                      : "bg-transparent"
                  }`}
                >
                  <input
                    type="text"
                    value={item.firstPick}
                    onChange={(e) =>
                      handleChange(index, "firstPick", e.target.value)
                    }
                    onKeyDown={handleKeyPress} // Detect "Enter" key
                    className={`text-white bg-transparent text-lg p-1 w-full text-center ${
                      isEditing ? "" : "cursor-not-allowed"
                    }`}
                    disabled={!isEditing} // Disable jika tidak dalam mode edit
                  />
                </div>
              </td>
              <td className="py-2 w-32 p-2 rounded-md">
                <div
                  className={`${
                    isEditing
                      ? "border border-gray-700 rounded-md"
                      : "bg-transparent"
                  }`}
                >
                  <input
                    type="text"
                    value={item.secondPick}
                    onChange={(e) =>
                      handleChange(index, "secondPick", e.target.value)
                    }
                    onKeyDown={handleKeyPress} // Detect "Enter" key
                    className={`text-white bg-transparent text-lg p-1 w-full text-center ${
                      isEditing ? "" : "cursor-not-allowed"
                    }`}
                    disabled={!isEditing} // Disable jika tidak dalam mode edit
                  />
                </div>
              </td>
              <td className="py-2 w-32 p-2 rounded-md">
                <div
                  className={`${
                    isEditing
                      ? "border border-gray-700 rounded-md"
                      : "bg-transparent"
                  }`}
                >
                  <input
                    type="text"
                    value={item.winner}
                    onChange={(e) =>
                      handleChange(index, "winner", e.target.value)
                    }
                    onKeyDown={handleKeyPress} // Detect "Enter" key
                    className={`text-white bg-transparent text-lg p-1 w-full text-center ${
                      isEditing ? "" : "cursor-not-allowed"
                    }`}
                    disabled={!isEditing} // Disable jika tidak dalam mode edit
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <button
          onClick={handleEditToggle}
          className="text-white px-4 py-2 rounded-md"
        >
          {isEditing ? <Save /> : <Edit />}
        </button>
      </div>
    </div>
  );
};

export default MatchSummary;

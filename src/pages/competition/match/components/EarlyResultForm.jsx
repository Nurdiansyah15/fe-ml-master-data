import { Edit } from "lucide-react";
import { Save } from "lucide-react";
import React, { useState, useEffect } from "react";

const EarlyResultForm = ({ onSelect, onSave, initialResult = "" }) => {
  const [earlyResult, setEarlyResult] = useState(initialResult);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Atur nilai awal ketika initialResult berubah
  useEffect(() => {
    setEarlyResult(initialResult);
  }, [initialResult]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setEarlyResult(selectedValue);
    setError(""); // Reset error saat pengguna memilih opsi
  };

  const handleSave = () => {
    if (!earlyResult) {
      setError("Please select a valid result.");
      return;
    }
    onSave(earlyResult); // Kirim nilai ke parent saat disimpan
    setIsEditing(false); // Nonaktifkan mode edit
  };

  const handleEdit = () => setIsEditing(true);

  return (
    <div className="w-full flex items-center gap-4 border-t-1 border-[#363638] mx-2 pt-2">
      <div className="w-full flex items-center space-x-5 p-2">
        <div>
          <select
            value={earlyResult}
            onChange={handleSelectChange}
            disabled={!isEditing}
            className={`bg-[#363638] text-white p-[10px] rounded-xl w-full ${
              isEditing ? "border border-blue-500" : ""
            }`}
          >
            <option value="">Choose Result</option>
            <option value="win">Win</option>
            <option value="draw">Draw</option>
            <option value="lose">Lose</option>
          </select>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <div>
          {isEditing ? (
            <Save
              onClick={handleSave}
              className="cursor-pointer hover:opacity-80"
            />
          ) : (
            <Edit
              onClick={handleEdit}
              className="cursor-pointer hover:opacity-80"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EarlyResultForm;

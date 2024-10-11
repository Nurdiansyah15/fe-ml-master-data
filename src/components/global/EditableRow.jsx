import { Trash } from "lucide-react";

const EditableRow = ({
  cols,
  rowData,
  onChange,
  index,
  onDelete,
  isEditing,
  onSave, // Tambahkan onSave sebagai prop untuk memanggil fungsi save
}) => {
  const handleInputChange = (field, value) => {
    onChange(index, field, value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Ketika tombol Enter ditekan
      onSave(); // Panggil fungsi onSave
    }
  };

  return (
    <tr>
      {cols.map((col, colIndex) => (
        <td className="py-2 w-32 p-2 rounded-md" key={colIndex}>
          {col.type === "checkbox" ? (
            <div
              className={`flex items-center justify-center p-1 rounded-md text-lg ${
                isEditing ? "border border-gray-700" : "bg-transparent"
              }`}
            >
              <input
                type="checkbox"
                checked={rowData[col.field]}
                onChange={(e) => handleInputChange(col.field, e.target.checked)}
                disabled={!isEditing} // Disable jika tidak dalam mode edit
                className={`w-5 h-7 ${!isEditing && "cursor-not-allowed"}`}
              />
            </div>
          ) : (
            <div
              className={`${
                isEditing
                  ? "border border-gray-700 rounded-md"
                  : "bg-transparent"
              }`}
            >
              <input
                type="text"
                value={rowData[col.field]}
                onChange={(e) => handleInputChange(col.field, e.target.value)}
                className={`text-white bg-transparent text-lg p-1 w-full text-center ${
                  isEditing ? "" : "cursor-not-allowed"
                }`}
                disabled={!isEditing} // Disable jika tidak dalam mode edit
                onKeyDown={handleKeyDown} // Tambahkan event listener untuk mendeteksi Enter
              />
            </div>
          )}
        </td>
      ))}
      <td className="p-2 w-5">
        <button
          className="text-white px-2 py-1 rounded-md"
          onClick={() => onDelete(index)} // Hapus baris
        >
          <Trash />
        </button>
      </td>
    </tr>
  );
};

export default EditableRow;

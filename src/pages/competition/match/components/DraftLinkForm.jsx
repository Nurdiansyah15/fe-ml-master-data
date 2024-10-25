import React, { useState, useEffect } from "react";
import { Edit, Save } from "lucide-react";
import Card from "../../../../components/Card";
import { useContext } from "react";
import MatchEditContext from "../../../../contexts/MatchEditContext";

const DraftLinkForm = ({ className, initialVideoLink = "", initialImageLink, onSave }) => {
  const { isEditingMatch, toggleEditing, removeEditing } =
    useContext(MatchEditContext);
  const [videoLink, setVideoLink] = useState(initialVideoLink);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialImageLink);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  useEffect(() => {
    setVideoLink(initialVideoLink);
    setPreview(initialImageLink);
  }, [initialVideoLink, initialImageLink]);

  const handleFileChange = (file) => {
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleSave = () => {
    onSave({ videoLink, imageFile }); // Kirim data ke parent
    setIsEditing(false);
  };

  const handleEdit = () => setIsEditing(true);

  const toggleModal = () => setIsModalOpen(!isModalOpen); // Toggle modal

  return (
    <Card className={`flex flex-col gap-4 p-4 w-full rounded-lg ${className}`}>
      {/* Video Link Section */}
      <div>
        <label className="block mb-1 text-md font-bold">Video Link</label>
        {isEditing ? (
          <input
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full p-2 border rounded bg-transparent"
            placeholder="Enter video link"
          />
        ) : (
          <a
            href={videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {videoLink || "No video link available"}
          </a>
        )}
      </div>

      {/* Image Preview Section */}
      <div>
        <label className="block mb-1 text-md font-bold">Image Draft</label>
        <img
          src={preview || "https://placehold.co/600x400"}
          alt="Draft Preview"
          className="w-full h-[350px] object-contain border rounded cursor-pointer"
          onClick={toggleModal} // Buka modal saat gambar diklik
        />
      </div>

      {/* Image Upload Section */}
      {isEditing && (
        <div>
          <label className="block mb-1 text-md font-bold">
            Upload New Image Draft
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
        </div>
      )}

      {/* Action Buttons */}
      {isEditingMatch && (
        <div className="flex justify-end gap-2">
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
      )}

      {/* Modal for Image Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={preview || "https://placehold.co/600x400"}
              alt="Full Image Preview"
              className="max-w-full max-h-screen object-contain"
            />
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DraftLinkForm;

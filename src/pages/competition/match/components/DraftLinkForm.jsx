import React, { useState, useEffect } from "react";
import { Edit, Save } from "lucide-react";
import Card from "../../../../components/Card";

const DraftLinkForm = ({
  initialVideoLink = "",
  initialImageLink = "https://placehold.co/600x400",
  onSave,
}) => {
  const [videoLink, setVideoLink] = useState(initialVideoLink);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialImageLink);
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <Card className="flex flex-col gap-4 p-4 w-full rounded-lg">
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

      {/* Image Preview */}
      <div>
        <label className="block mb-1 text-md font-bold">Image Draft</label>
        {preview ? (
          <img
            src={preview}
            alt="Draft Preview"
            className="w-full h-64 object-cover border rounded"
          />
        ) : (
          <p>No image available.</p>
        )}
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
    </Card>
  );
};

export default DraftLinkForm;

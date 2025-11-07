import React, { useState } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { uploadAPI } from "../services/api";

const ImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);

    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      // Upload to backend
      const response = await uploadAPI.uploadImages(formData);

      if (response.data.success) {
        // Add uploaded image URLs to the list
        const newImageUrls = response.data.images.map((img) => img.url);
        onImagesChange([...images, ...newImageUrls]);
        console.log("Images uploaded successfully:", newImageUrls);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
      event.target.value = ""; // Reset file input
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);

    if (files.length > 0) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.multiple = true;
      fileInput.accept = "image/*";
      fileInput.files = event.dataTransfer.files;
      fileInput.onchange = (e) => handleFileSelect(e);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors"
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />

          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-3"
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            ) : (
              <FiImage className="w-8 h-8 text-gray-400" />
            )}

            <div>
              <p className="text-sm font-medium text-gray-700">
                {uploading
                  ? "Uploading..."
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP up to 5MB ({maxImages - images.length} remaining)
              </p>
            </div>
          </label>
        </div>
      )}

      {images.length >= maxImages && (
        <p className="text-sm text-gray-500 text-center">
          Maximum {maxImages} images reached
        </p>
      )}
    </div>
  );
};

export default ImageUpload;

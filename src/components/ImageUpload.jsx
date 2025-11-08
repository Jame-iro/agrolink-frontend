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
      // Compress images before uploading
      const compressedFiles = await Promise.all(
        files.map((file) => compressImage(file))
      );

      const formData = new FormData();
      compressedFiles.forEach((file) => {
        formData.append("images", file);
      });

      console.log("Sending compressed upload request...");

      const response = await uploadAPI.uploadImages(formData);

      if (response.data.success) {
        const newImageUrls =
          response.data.imageUrls || response.data.images || [];

        if (newImageUrls.length > 0) {
          onImagesChange([...images, ...newImageUrls]);
          console.log("Compressed images added successfully");
        } else {
          throw new Error("No image URLs received from server");
        }
      } else {
        throw new Error(response.data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  // Image compression function
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set maximum dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let { width, height } = img;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed JPEG
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.7 // 70% quality
          );
        };
      };
    });
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
  {
    images.length < maxImages && (
      <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        Note: For now, demo images will be used. Real image upload coming soon!
      </div>
    );
  }
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

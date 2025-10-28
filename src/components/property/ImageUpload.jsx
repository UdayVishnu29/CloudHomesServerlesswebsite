import { useState } from "react";
import { generateUploadUrl } from "../../utils/api";

export default function ImageUpload({ onImagesChange }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log("📁 Files selected:", files);
    setUploading(true);

    try {
      const uploadedFileKeys = [];

      for (const file of files) {
        try {
          console.log("🔄 Starting upload for:", file.name);

          // Get presigned URL from API
          console.log("📡 Calling generateUploadUrl API...");
          const uploadData = await generateUploadUrl(file.name, file.type);
          console.log("✅ Upload data received:", uploadData);

          if (!uploadData || !uploadData.uploadUrl) {
            console.error("❌ Invalid upload data received");
            throw new Error("Failed to get upload URL from API");
          }

          console.log("🚀 Uploading to S3 URL:", uploadData.uploadUrl);

          // Upload file directly to S3 using presigned URL
          const uploadResponse = await fetch(uploadData.uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          console.log("📤 S3 upload response status:", uploadResponse.status);

          if (!uploadResponse.ok) {
            console.error(
              "❌ S3 upload failed:",
              uploadResponse.status,
              uploadResponse.statusText
            );
            throw new Error(`S3 upload failed: ${uploadResponse.status}`);
          }

          console.log("✅ S3 upload successful");

          // Store the fileKey
          if (uploadData.fileKey) {
            uploadedFileKeys.push(uploadData.fileKey);
            console.log("💾 Stored fileKey:", uploadData.fileKey);
          } else {
            console.error("❌ No fileKey in response");
          }
        } catch (uploadError) {
          console.error("❌ Error uploading single file:", uploadError);
          // Continue with other files even if one fails
        }
      }

      console.log("📋 All uploads completed. FileKeys:", uploadedFileKeys);

      // Update state with fileKeys
      const newImages = [...images, ...uploadedFileKeys];
      console.log("🔄 Setting images state to:", newImages);
      setImages(newImages);

      console.log("📞 Calling onImagesChange with:", newImages);
      onImagesChange(newImages);

      console.log("🎉 Image upload process completed successfully");
    } catch (error) {
      console.error("💥 Error in image upload process:", error);
      alert("Error uploading images. Please check console and try again.");
    } finally {
      console.log("🏁 Upload process finished, setting uploading to false");
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  // Safe function to get file name
  const getFileName = (fileKey) => {
    if (!fileKey || typeof fileKey !== "string") {
      return "Unknown file";
    }
    return fileKey.split("/").pop() || fileKey;
  };

  return (
    <div className="image-upload">
      <div className="upload-area">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
          id="property-images"
          disabled={uploading}
        />
        <label htmlFor="property-images" className="upload-label">
          <div className="upload-content">
            <span className="upload-icon">📸</span>
            <span className="upload-text">
              {uploading ? "Uploading..." : "Click to upload property images"}
            </span>
            <span className="upload-hint">PNG, JPG, WEBP up to 10MB</span>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div className="image-preview">
          <h4 className="preview-title">Selected Images ({images.length})</h4>
          <div className="preview-grid">
            {images.map((fileKey, index) => (
              <div key={index} className="preview-item">
                <div className="preview-image-container">
                  <span className="file-name">{getFileName(fileKey)}</span>
                  <span className="file-status">✓ Uploaded</span>
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="remove-btn"
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .image-upload {
          width: 100%;
        }
        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: #f9fafb;
        }
        .upload-area:hover {
          border-color: #2563eb;
          background: #f0f9ff;
        }
        .file-input {
          display: none;
        }
        .upload-label {
          cursor: pointer;
          display: block;
        }
        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .upload-icon {
          font-size: 2rem;
        }
        .upload-text {
          font-weight: 500;
          color: #374151;
        }
        .upload-hint {
          font-size: 0.875rem;
          color: #6b7280;
        }
        .image-preview {
          margin-top: 1.5rem;
        }
        .preview-title {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .preview-item {
          position: relative;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          background: white;
        }
        .preview-image-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .file-name {
          font-size: 0.875rem;
          color: #374151;
          word-break: break-all;
        }
        .file-status {
          font-size: 0.75rem;
          color: #059669;
          font-weight: 500;
        }
        .remove-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 1rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .remove-btn:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
}

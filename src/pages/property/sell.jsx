import { useState } from "react";
import { useRouter } from "next/router";
import ImageUpload from "../../components/property/ImageUpload";
import { createProperty } from "../../utils/api";
import styles from "../../styles/Home.module.css"; // Add this import

export default function SellProperty() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // In the handleSubmit function, add validation:
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 SUBMITTING FORM DATA:", formData);
    console.log("📸 Images in formData:", formData.images);
    console.log("📸 Images length:", formData.images?.length);

    if (!formData.images || formData.images.length === 0) {
      console.warn("⚠️ No images in formData, using empty array");
    }

    const submitData = {
      ...formData,
      images: formData.images || [],
    };

    console.log("📤 Submitting with images:", submitData.images);

    setLoading(true);

    try {
      const result = await createProperty(formData);
      console.log("✅ Property created successfully:", result);
      alert("Property listed successfully!");
      router.push("/home");
    } catch (error) {
      console.error("❌ Error creating property:", error);
      alert("Error listing property: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // In the sell.jsx page, update the ImageUpload usage:
  const handleImagesChange = (newImages) => {
    console.log("📨 Images changed in parent:", newImages);
    console.log("📨 New images array:", newImages);

    setFormData((prev) => {
      const updated = {
        ...prev,
        images: newImages,
      };
      console.log("📝 Updated formData:", updated);
      return updated;
    });
  };
  // And in the form:
  <ImageUpload onImagesChange={handleImagesChange} />;

  return (
    <div className={styles.sellContainer}>
      <h1>Sell Your Home</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Property Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Price (in Crores)</label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Property Images</label>
          <ImageUpload onImagesChange={handleImagesChange} />
        </div>

        <button type="submit" disabled={loading} className={styles.loginBtn}>
          {loading ? "Listing Property..." : "List Property"}
        </button>
      </form>
    </div>
  );
}

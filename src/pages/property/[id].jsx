import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getPropertyById, generateImageUrl } from "../../utils/api";
import styles from "../../styles/Home.module.css";

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await getPropertyById(id);
      setProperty(data);

      // Load images after property data is fetched
      if (data.images && data.images.length > 0) {
        await loadPropertyImages(data.images);
      } else {
        setImagesLoading(false);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPropertyImages = async (images) => {
    try {
      const urls = [];

      for (const image of images) {
        if (image) {
          // If it's already a full URL, use it directly
          if (image.startsWith("http")) {
            urls.push(image);
          } else {
            // If it's a fileKey, generate presigned URL
            try {
              const url = await generateImageUrl(image);
              urls.push(url);
            } catch (error) {
              console.error("Error generating image URL:", error);
              // Use placeholder if image fails to load
              urls.push(
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
              );
            }
          }
        }
      }

      setImageUrls(urls);
    } catch (error) {
      console.error("Error loading property images:", error);
      // Use placeholder images if all fail
      setImageUrls([
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      ]);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleImageError = (e, index) => {
    e.target.src =
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop";
  };

  // Mock seller phone number (you'll need to get this from user data)
  const getSellerPhone = () => {
    // For now, return a mock phone number
    // In production, you'd get this from the user's profile
    return "+91 98765 43210";
  };

  if (loading)
    return <div className={styles.loading}>Loading property details...</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className={styles.propertyDetailsContainer}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← Back to Properties
      </button>

      <div className={styles.propertyImages}>
        {imagesLoading ? (
          <div className={styles.imagesLoading}>Loading images...</div>
        ) : (
          <>
            {imageUrls.length > 0 ? (
              imageUrls.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Property ${index + 1}`}
                  onError={(e) => handleImageError(e, index)}
                  width={800}
                  height={600}
                  style={{ width: "100%", height: "auto" }}
                />
              ))
            ) : (
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="Property placeholder"
                width={800}
                height={600}
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </>
        )}
      </div>

      <div className={styles.propertyInfo}>
        <h1>{property.title}</h1>
        <p className={styles.location}>📍 {property.location}</p>
        <p className={styles.price}>₹ {property.price} Crores</p>
        <p className={styles.description}>{property.description}</p>

        <div className={styles.contactSection}>
          <h3>Contact Seller</h3>
          <p className={styles.contactNumber}>📞 {getSellerPhone()}</p>
          <button
            className={styles.contactButton}
            onClick={() =>
              window.open(`tel:${getSellerPhone().replace(/\D/g, "")}`, "_self")
            }
          >
            Call Seller
          </button>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { generateImageUrl } from "../../utils/api";
import { useState, useEffect, useRef } from "react";

export default function PropertyCard({ property }) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const mountedRef = useRef(true);

  const formatPrice = (price) => {
    return `₹ ${price} Crore${price !== "1" ? "s" : ""}`;
  };

  useEffect(() => {
    mountedRef.current = true;
    console.log("🔄 PropertyCard useEffect triggered", {
      propertyId: property.propertyId,
      images: property.images,
      firstImage: property.images?.[0],
    });

    const loadRealImage = async () => {
      if (!mountedRef.current) return;

      try {
        // Start with a placeholder
        setImageUrl("/images/placeholder-property.jpg");

        if (
          property.images &&
          property.images.length > 0 &&
          property.images[0]
        ) {
          const fileKey = property.images[0];
          console.log("🔑 Attempting to load image with fileKey:", fileKey);

          // Validate fileKey format
          if (typeof fileKey !== "string" || fileKey.trim() === "") {
            console.error("❌ Invalid fileKey:", fileKey);
            setImageLoading(false);
            return;
          }

          console.log("📡 Calling generateImageUrl...");
          const url = await generateImageUrl(fileKey);
          console.log("✅ generateImageUrl returned:", url);

          if (mountedRef.current && url) {
            // Test if the URL works by creating an Image object
            const testImage = new Image();
            testImage.onload = () => {
              console.log("✅ Image loaded successfully");
              setImageUrl(url);
            };
            testImage.onerror = () => {
              console.error("❌ Image failed to load, using placeholder");
              setImageUrl("/images/placeholder-property.jpg");
            };
            testImage.src = url;
          }
        } else {
          console.log("ℹ️ No images available, using placeholder");
        }
      } catch (error) {
        console.error("💥 Error loading image:", error);
        setImageUrl("/images/placeholder-property.jpg");
      } finally {
        if (mountedRef.current) {
          setImageLoading(false);
          console.log("🏁 Image loading finished");
        }
      }
    };

    loadRealImage();

    return () => {
      mountedRef.current = false;
    };
  }, [property.images, property.propertyId]);

  const handleImageError = (e) => {
    console.error("🖼️ Image failed to load:", imageUrl);
    e.target.src = "/api/placeholder/400/200"; // Fallback on error
  };

  return (
    <div className="property-card">
      <div className="property-image">
        {imageLoading ? (
          <div className="image-loading">Loading real image...</div>
        ) : (
          <img
            src={imageUrl}
            alt={property.title || "Property image"}
            onError={handleImageError}
            loading="lazy"
          />
        )}
      </div>
      <div className="property-content">
        <h3 className="property-title">{property.title}</h3>
        <p className="property-location">📍 {property.location}</p>
        <p className="property-price">{formatPrice(property.price)}</p>
        <p className="property-description">{property.description}</p>

        <Link href={`/property/${property.propertyId}`}>
          <button className="view-details-btn">View Details</button>
        </Link>
      </div>

      <style jsx>{`
        .property-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }
        .property-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
        }
        .property-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f3f4f6;
        }
        .property-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .property-card:hover .property-image img {
          transform: scale(1.05);
        }
        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 0.875rem;
          gap: 0.5rem;
        }
        .image-loading {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          color: #6b7280;
        }
        .placeholder-icon {
          font-size: 2rem;
        }
        .placeholder-text {
          font-size: 0.875rem;
          opacity: 0.9;
        }
        .property-content {
          padding: 1.5rem;
        }
        .property-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .property-location {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .property-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #059669;
          margin-bottom: 0.75rem;
        }
        .property-description {
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .view-details-btn {
          width: 100%;
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: background-color 0.2s;
          cursor: pointer;
        }
        .view-details-btn:hover {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  );
}

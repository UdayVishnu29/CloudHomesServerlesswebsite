import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyGrid from "../components/property/PropertyGrid";
import { getProperties } from "../utils/api";
import styles from "../styles/Home.module.css";

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.homeHeader}>
        <h1>Available Properties</h1>
        <Link href="/property/sell">
          <button className={styles.sellButton}>Sell Your Home</button>
        </Link>
      </header>

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={fetchProperties} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          Loading properties from database...
        </div>
      ) : (
        <>
          <div className={styles.resultsInfo}>
            Found {properties.length} propert
            {properties.length === 1 ? "y" : "ies"}
          </div>
          <PropertyGrid properties={properties} />
        </>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function LandingPage() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Debug: Check if video is loading
    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", () => {
        console.log("✅ Video loaded successfully");
      });

      videoRef.current.addEventListener("error", () => {
        console.log("❌ Video failed to load");
        setVideoError(true);
      });
    }
  }, []);

  return (
    <div className={styles.landingContainer}>
      <Head>
        <title>CloudHomes - Find Your Dream Home</title>
      </Head>

      {/* Video Background */}
      <div className={styles.videoBackground}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={styles.backgroundVideo}
          onError={() => setVideoError(true)}
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          {/* Fallback if video doesn't load */}
          Your browser does not support the video tag.
        </video>
        <div className={styles.videoOverlay}></div>

        {/* Debug info */}
        {videoError && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "red",
              color: "white",
              padding: "10px",
              zIndex: 1000,
            }}
          >
            Video failed to load. Check console.
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to CloudHomes</h1>
          <p className={styles.heroSubtitle}>
            Experience the Premier Real Estate Platform
          </p>
          <button
            className={styles.ctaButton}
            onClick={() => setShowLoginPrompt(true)}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Rest of your code remains the same */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>Buy Properties</h3>
            <p>
              Find your perfect home from thousands of listings across India
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Sell Properties</h3>
            <p>List your property and reach genuine buyers quickly</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Secure Transactions</h3>
            <p>Verified listings and secure communication channels</p>
          </div>
        </div>
      </section>

      {showLoginPrompt && (
        <div className={styles.loginPromptOverlay}>
          <div className={styles.loginPrompt}>
            <h2>Join CloudHomes</h2>
            <p>Login to explore properties or list your own</p>
            <Link href="/login">
              <button className={styles.loginBtn}>Login / Sign Up</button>
            </Link>
            <button
              className={styles.closeBtn}
              onClick={() => setShowLoginPrompt(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser, signOut } from "../../utils/auth";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="header" style={{ backgroundColor: "#333" }}>
      <div className="header-container">
        <div className="logo">
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h2 style={{ color: "white" }}>🏠 CloudHomes</h2>
          </Link>
        </div>

        <nav className="nav">
          {!loading && (
            <>
              {user ? (
                <div className="user-section">
                  <span style={{ color: "white" }}>Welcome, User!</span>
                  <Link
                    href="/home"
                    className="nav-link"
                    style={{ color: "white" }}
                  >
                    Properties
                  </Link>
                  <Link
                    href="/property/sell"
                    className="nav-link"
                    style={{ color: "white" }}
                  >
                    Sell
                  </Link>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="login-link"
                  style={{ color: "white" }}
                >
                  Login
                </Link>
              )}
            </>
          )}
        </nav>
      </div>

      <style jsx>{`
        .header {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }
        .logo h2 {
          margin: 0;
          color: #2563eb;
          cursor: pointer;
        }
        .nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          color: #4b5563;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #2563eb;
        }
        .login-link {
          background: #2563eb;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
        }
        .login-link:hover {
          background: #1d4ed8;
        }
        .logout-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        .logout-btn:hover {
          background: #dc2626;
        }
      `}</style>
    </header>
  );
}

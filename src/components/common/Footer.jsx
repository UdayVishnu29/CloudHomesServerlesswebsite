import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🏠 CloudHomes</h3>
          <p>Premier Real Estate Platform</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/home">Properties</Link>
            </li>
            <li>
              <Link href="/property/sell">Sell Property</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@cloudhomes.com</p>
          <p>Phone: +91 1800-123-456</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 CloudHomes. All rights reserved.</p>
      </div>

      <style jsx>{`
        .footer {
          background: #1f2937;
          color: white;
          margin-top: auto;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        .footer-section h3 {
          color: #60a5fa;
          margin-bottom: 1rem;
        }
        .footer-section h4 {
          color: #d1d5db;
          margin-bottom: 1rem;
        }
        .footer-section ul {
          list-style: none;
          padding: 0;
        }
        .footer-section ul li {
          margin-bottom: 0.5rem;
        }
        .footer-section a {
          color: #9ca3af;
          text-decoration: none;
        }
        .footer-section a:hover {
          color: white;
        }
        .footer-bottom {
          border-top: 1px solid #374151;
          padding: 1.5rem 2rem;
          text-align: center;
          color: #9ca3af;
        }
      `}</style>
    </footer>
  );
}

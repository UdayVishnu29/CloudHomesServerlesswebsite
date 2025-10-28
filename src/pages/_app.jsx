import "../styles/globals.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "../utils/aws-config"; // This must import first

export default function MyApp({ Component, pageProps }) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <main style={{ flex: 1 }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

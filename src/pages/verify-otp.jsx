import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Auth } from "aws-amplify";
import styles from "../styles/Home.module.css";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [action, setAction] = useState("signup");
  const router = useRouter();

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email);
    }
    if (router.query.action) {
      setAction(router.query.action);
    }
  }, [router.query]);

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      if (action === "signup") {
        // Verify email for new user
        await Auth.confirmSignUp(email, otpString);
        alert("Email verified successfully! Please sign in.");
        router.push("/login");
      } else {
        // Handle other verification scenarios if needed
        alert("Verification successful!");
        router.push("/home");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await Auth.resendSignUp(email);
      alert("OTP resent successfully! Check your email.");
    } catch (error) {
      alert("Error resending OTP: " + error.message);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      const nextInput = element.nextElementSibling;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = e.target.previousElementSibling;
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.otpContainer}>
        <h2>Verify Your Email</h2>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                style={{
                  width: "3rem",
                  height: "3rem",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  outline: "none",
                }}
                required
              />
            ))}
          </div>

          <button type="submit" disabled={loading} className={styles.loginBtn}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            type="button"
            onClick={handleResendOTP}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.875rem",
            }}
          >
            Didnt receive code? Resend OTP
          </button>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#f3f4f6",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              textAlign: "center",
              margin: 0,
            }}
          >
            <strong>Note:</strong> Check your spam folder if you dont see the
            email
          </p>
        </div>
      </div>
    </div>
  );
}

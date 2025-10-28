import { useState, useRef } from "react";

export default function OTPForm({
  phoneNumber,
  onVerify,
  onResend,
  loading = false,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.value !== "" && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!isNaN(pasteData)) {
      const pasteArray = pasteData.split("");
      const newOtp = [...otp];
      pasteArray.forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);

      // Focus the last filled input
      const lastFilledIndex = Math.min(pasteArray.length - 1, 5);
      inputsRef.current[lastFilledIndex].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  return (
    <div className="otp-form">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Enter OTP</h2>
        <p className="text-gray-600 mt-2">
          We sent a code to <strong>{phoneNumber}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="otp-inputs-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="otp-input"
              disabled={loading}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join("").length !== 6}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold mt-6"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
        >
          Did not receive code? Resend OTP
        </button>
      </div>

      <style jsx>{`
        .otp-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
        }
        .otp-inputs-container {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }
        .otp-input {
          width: 3.5rem;
          height: 3.5rem;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          transition: all 0.2s;
        }
        .otp-input:focus {
          border-color: #2563eb;
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .otp-input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { useRouter } from "next/router";
import { Auth } from "aws-amplify";
import styles from "../styles/Home.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (isSignUp) {
      // Sign Up Flow
      if (!password) {
        alert("Please enter a password");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (password.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
      }

      await handleSignUp();
    } else {
      // Sign In Flow
      if (!password) {
        alert("Please enter your password");
        return;
      }
      await handleSignIn();
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      console.log("Signing up user:", email);

      const response = await Auth.signUp({
        username: email,
        password: password,
        attributes: {
          email: email,
        },
      });

      console.log("Sign up successful, OTP sent:", response);
      alert("Account created! Please check your email for verification code.");
      router.push(
        `/verify-otp?email=${encodeURIComponent(email)}&action=signup`
      );
    } catch (error) {
      console.error("Sign up error:", error);
      if (error.code === "UsernameExistsException") {
        alert("User already exists. Please sign in instead.");
        setIsSignUp(false);
      } else {
        alert("Error creating account: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      console.log("Signing in user:", email);

      const user = await Auth.signIn(email, password);
      console.log("Sign in successful:", user);

      // Check if user needs to verify email
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        alert("Please complete your account setup.");
        router.push(
          `/verify-otp?email=${encodeURIComponent(email)}&action=signup`
        );
      } else {
        // Successfully signed in
        alert("Welcome back!");
        router.push("/home");
      }
    } catch (error) {
      console.error("Sign in error:", error);

      if (error.code === "UserNotConfirmedException") {
        alert(
          "Please verify your email first. Check your inbox for verification code."
        );
        router.push(
          `/verify-otp?email=${encodeURIComponent(email)}&action=signup`
        );
      } else if (error.code === "NotAuthorizedException") {
        alert("Invalid email or password.");
      } else if (error.code === "UserNotFoundException") {
        alert("User not found. Please sign up first.");
        setIsSignUp(true);
      } else {
        alert("Error signing in: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.loginContainer}>
        <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          {isSignUp
            ? "Create your CloudHomes account"
            : "Welcome back to CloudHomes"}
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? "Create password" : "Enter your password"}
              required
            />
          </div>

          {isSignUp && (
            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button type="submit" disabled={loading} className={styles.loginBtn}>
            {loading
              ? "Please wait..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p style={{ color: "#6b7280" }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setPassword("");
                setConfirmPassword("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                cursor: "pointer",
                marginLeft: "0.5rem",
                textDecoration: "underline",
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
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
            <strong>Demo Tip:</strong>{" "}
            {isSignUp
              ? "You will receive OTP after account creation"
              : "Use your registered email and password"}
          </p>
        </div>
      </div>
    </div>
  );
}

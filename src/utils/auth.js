// Direct imports - no dynamic imports
import { Auth } from "aws-amplify";

export const sendOTP = async (email) => {
  try {
    console.log("Sending OTP to:", email);

    const response = await Auth.signUp({
      username: email,
      password: "TempPassword123!",
      attributes: {
        email: email,
      },
    });

    console.log("OTP sent successfully");
    return response;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error(error.message || "Failed to send OTP");
  }
};

export const verifyOTP = async (email, code) => {
  try {
    const confirmResponse = await Auth.confirmSignUp(email, code);
    const user = await Auth.signIn(email, "TempPassword123!");
    return user;
  } catch (error) {
    throw new Error(error.message || "Invalid OTP code");
  }
};

export const getCurrentUser = async () => {
  try {
    return await Auth.currentAuthenticatedUser();
  } catch (error) {
    return null;
  }
};

export const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    throw error;
  }
};

import { useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, signOut } from "../../utils/auth";

export default function LoginButton() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check auth state on component mount
  useState(() => {
    checkAuthState();
  }, []);

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-700">Welcome!</span>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
    >
      Login / Sign Up
    </button>
  );
}

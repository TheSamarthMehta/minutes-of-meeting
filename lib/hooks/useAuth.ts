"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { LoginInput, SignupInput } from "@/lib/validations/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { login, logout, user, token, isAuthenticated, setLoading, setError } = useAuthStore();
  const router = useRouter();

  const signUp = async (data: SignupInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Signup failed");
      }

      // Store user and token
      login(result.user, result.token);

      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during signup";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: LoginInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      // Store user and token
      login(result.user, result.token);

      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during login";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);

    try {
      // Call logout endpoint if needed
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear local state
      logout();
      router.push("/login");

      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      // Still logout locally even if server call fails
      logout();
      router.push("/login");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    if (!token) {
      return { success: false, error: "No token available" };
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch user");
      }

      return { success: true, data: result.user };
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
  };
}

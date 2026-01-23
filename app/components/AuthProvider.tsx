"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

const publicRoutes = ["/login", "/signup"];

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, checkTokenExpiry, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for store to rehydrate from localStorage
    if (!_hasHydrated) {
      return;
    }

    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Check if token has expired
    const hasExpired = checkTokenExpiry();
    if (hasExpired && !isPublicRoute) {
      router.push("/login");
      setIsChecking(false);
      return;
    }

    // If not authenticated and not on a public route, redirect to login
    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
      setIsChecking(false);
      return;
    }

    // If authenticated and on login/signup page, redirect to dashboard
    if (isAuthenticated && isPublicRoute) {
      router.push("/dashboard");
      setIsChecking(false);
      return;
    }

    // Done checking, allow rendering
    setIsChecking(false);
  }, [isAuthenticated, pathname, router, checkTokenExpiry, _hasHydrated]);

  // Set up interval to check token expiry every minute
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const hasExpired = checkTokenExpiry();
      if (hasExpired) {
        router.push("/login");
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, checkTokenExpiry, router]);

  // Show nothing while checking auth to prevent flash of wrong content
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

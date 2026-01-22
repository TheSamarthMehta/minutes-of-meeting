"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

const publicRoutes = ["/login", "/signup"];

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // If not authenticated and not on a public route, redirect to login
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/login");
      }

      // If authenticated and on login/signup page, redirect to home
      if (isAuthenticated && isPublicRoute) {
        router.push("/");
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, pathname, router, token]);

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

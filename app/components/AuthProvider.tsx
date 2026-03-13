"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

const publicRoutes = ["/login", "/signup"];

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, checkTokenExpiry, logout, _hasHydrated, setUser } =
    useAuthStore();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Sync NextAuth session with Zustand store
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("[AuthProvider] Syncing NextAuth session to Zustand store", {
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
      });

      // Update Zustand store with NextAuth session data
      setUser({
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role || "STAFF",
      });
    } else if (status === "unauthenticated") {
      console.log("[AuthProvider] NextAuth session unauthenticated");
    }
  }, [session, status, setUser]);

  useEffect(() => {
    // Wait for store to rehydrate from localStorage and NextAuth to load
    if (!_hasHydrated || status === "loading") {
      return;
    }

    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route),
    );

    // Check if user is authenticated via NextAuth OR custom token
    const isAuthenticatedViaNextAuth = status === "authenticated";
    const isAuthenticatedViaCustomToken = isAuthenticated;
    const userIsAuthenticated =
      isAuthenticatedViaNextAuth || isAuthenticatedViaCustomToken;

    // Check if custom token has expired (only for custom auth users)
    if (isAuthenticatedViaCustomToken && !isAuthenticatedViaNextAuth) {
      const hasExpired = checkTokenExpiry();
      if (hasExpired && !isPublicRoute) {
        router.push("/login");
        setIsChecking(false);
        return;
      }
    }

    // If not authenticated and not on a public route, redirect to login
    if (!userIsAuthenticated && !isPublicRoute) {
      router.push("/login");
      setIsChecking(false);
      return;
    }

    // If authenticated and on login/signup page, redirect to dashboard
    if (userIsAuthenticated && isPublicRoute) {
      router.push("/dashboard");
      setIsChecking(false);
      return;
    }

    // Done checking, allow rendering
    setIsChecking(false);
  }, [
    isAuthenticated,
    pathname,
    router,
    checkTokenExpiry,
    _hasHydrated,
    status,
    session,
    setUser,
  ]);

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

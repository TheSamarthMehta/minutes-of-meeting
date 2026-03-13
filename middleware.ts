import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getToken } from "next-auth/jwt";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/signup"];

// Define API routes that don't require authentication
const publicApiRoutes = ["/api/auth/login", "/api/auth/signup", "/api/auth"];

// Page-level RBAC: route prefix → minimum role required
// Hierarchy: STAFF < MANAGER < ADMIN
const roleProtectedPages: Array<{ prefix: string; minRole: string }> = [
  { prefix: "/admin", minRole: "MANAGER" }, // /admin/* needs MANAGER+
  { prefix: "/master_configuration", minRole: "ADMIN" }, // config pages are admin-only
];

const roleHierarchy: Record<string, number> = {
  STAFF: 0,
  MANAGER: 1,
  ADMIN: 2,
};

function hasMinRole(userRole: string, minRole: string): boolean {
  return (roleHierarchy[userRole] ?? 0) >= (roleHierarchy[minRole] ?? 99);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow ALL NextAuth API routes (including session, callback, etc.)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow other public API routes
  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for token in cookies or authorization header
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // Check for NextAuth session token
  const nextAuthToken = 
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  // If no token and no NextAuth session, redirect to login for page routes, return 401 for API routes
  if (!token && !nextAuthToken) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If NextAuth session exists, parse JWT payload and pass identity to API routes.
  if (nextAuthToken) {
    const nextAuthPayload = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!nextAuthPayload?.id || !nextAuthPayload?.email) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Unauthorized - Invalid session token" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = String(nextAuthPayload.role || "STAFF");

    // Page-level RBAC check
    if (!pathname.startsWith("/api/")) {
      for (const { prefix, minRole } of roleProtectedPages) {
        if (pathname.startsWith(prefix) && !hasMinRole(userRole, minRole)) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }

    if (pathname.startsWith("/api/")) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", String(nextAuthPayload.id));
      requestHeaders.set("x-user-email", String(nextAuthPayload.email));
      requestHeaders.set("x-user-role", userRole);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  }

  // Verify custom JWT token
  if (!token) {
    // Should be unreachable, but guard for TypeScript
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const payload = await verifyToken(token);

  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = payload.role;

  // Page-level RBAC check for custom JWT users
  if (!pathname.startsWith("/api/")) {
    for (const { prefix, minRole } of roleProtectedPages) {
      if (pathname.startsWith(prefix) && !hasMinRole(userRole, minRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Add user info to request headers for API routes
  if (pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-email", payload.email);
    requestHeaders.set("x-user-role", userRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};

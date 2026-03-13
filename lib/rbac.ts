import { NextRequest, NextResponse } from "next/server";
import { getUserFromHeaders } from "@/lib/auth";

export type Role = "STAFF" | "MANAGER" | "ADMIN";

// Role hierarchy – higher index = more privileged
const ROLE_HIERARCHY: Role[] = ["STAFF", "MANAGER", "ADMIN"];

/**
 * Returns true when the actor's role meets or exceeds the required minimum role.
 */
export function hasRole(actorRole: string, required: Role): boolean {
  const actorIdx = ROLE_HIERARCHY.indexOf(actorRole as Role);
  const requiredIdx = ROLE_HIERARCHY.indexOf(required);
  return actorIdx >= requiredIdx;
}

/**
 * Returns true when actorRole is exactly one of the allowed roles.
 */
export function isOneOf(actorRole: string, allowed: Role[]): boolean {
  return allowed.includes(actorRole as Role);
}

/**
 * API route guard – reads x-user-role injected by middleware and checks
 * whether the caller has at least `minimumRole`.
 *
 * Usage:
 *   const guard = requireRole(request, "ADMIN");
 *   if (guard) return guard;   // 403 already built
 */
export function requireRole(
  request: NextRequest,
  minimumRole: Role
): NextResponse | null {
  const user = getUserFromHeaders(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasRole(user.role, minimumRole)) {
    return NextResponse.json(
      {
        error: `Forbidden – requires ${minimumRole} or higher. Your role: ${user.role}`,
      },
      { status: 403 }
    );
  }
  return null; // allowed
}

/**
 * Strict variant – caller must be one of the exact allowed roles.
 */
export function requireExactRole(
  request: NextRequest,
  allowed: Role[]
): NextResponse | null {
  const user = getUserFromHeaders(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isOneOf(user.role, allowed)) {
    return NextResponse.json(
      {
        error: `Forbidden – route only accessible to: ${allowed.join(", ")}. Your role: ${user.role}`,
      },
      { status: 403 }
    );
  }
  return null;
}

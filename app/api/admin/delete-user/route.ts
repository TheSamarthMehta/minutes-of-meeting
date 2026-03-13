import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { getUserFromHeaders } from "@/lib/auth";

/**
 * DELETE /api/admin/delete-user
 * Body: { userId: string }
 * Admin-only.
 */
export async function DELETE(request: NextRequest) {
  const guard = requireRole(request, "ADMIN");
  if (guard) return guard;

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    const actor = getUserFromHeaders(request);

    // Prevent self-deletion
    if (actor?.userId === userId) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });

    console.log(`[Admin] User ${userId} deleted by ${actor?.email}`);

    return NextResponse.json({ message: "User deleted successfully." });
  } catch (err: any) {
    if (err.code === "P2025") {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    console.error("[Admin] delete-user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/admin/delete-user  → list all users (Admin-only)
 */
export async function GET(request: NextRequest) {
  const guard = requireRole(request, "ADMIN");
  if (guard) return guard;

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, createdBy: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

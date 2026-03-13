import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/nextAuth";

export async function GET(request: NextRequest) {
  try {
    // Try custom JWT first, then fallback to NextAuth session.
    const jwtUser = await authenticateRequest(request);
    const session = jwtUser ? null : await auth();

    const authenticatedUserId =
      jwtUser?.userId || session?.user?.id || undefined;

    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    // Fetch fresh user data from database
    const currentUser = await prisma.user.findUnique({
      where: { id: authenticatedUserId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: currentUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

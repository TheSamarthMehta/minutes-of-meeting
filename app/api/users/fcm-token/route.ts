import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromHeaders } from "@/lib/auth";

/**
 * POST /api/users/fcm-token
 * Body: { token: string }
 * Any authenticated user can register/update their FCM token.
 */
export async function POST(request: NextRequest) {
  const actor = getUserFromHeaders(request);
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "A valid FCM token string is required." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: actor.userId },
      data: { fcmToken: token },
    });

    return NextResponse.json({ message: "FCM token registered." });
  } catch (err: any) {
    console.error("[FCM] token registration error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

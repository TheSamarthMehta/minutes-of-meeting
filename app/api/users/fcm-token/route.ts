import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromHeaders } from "@/lib/auth";
import { logApiError, logApiIncoming, logApiOutgoing } from "@/lib/apiLogger";

/**
 * POST /api/users/fcm-token
 * Body: { token: string }
 * Any authenticated user can register/update their FCM token.
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const label = "POST /api/users/fcm-token";

  const actor = getUserFromHeaders(request);
  if (!actor) {
    const payload = { error: "Unauthorized" };
    logApiOutgoing(label, 401, payload, startedAt);
    return NextResponse.json(payload, { status: 401 });
  }

  try {
    const body = await request.json();
    logApiIncoming(label, request, body);

    const { token } = body;

    if (!token || typeof token !== "string") {
      const payload = { error: "A valid FCM token string is required." };
      logApiOutgoing(label, 400, payload, startedAt);
      return NextResponse.json(payload, { status: 400 });
    }

    await prisma.user.update({
      where: { id: actor.userId },
      data: { fcmToken: token },
    });

    const payload = { message: "FCM token registered." };
    logApiOutgoing(label, 200, payload, startedAt);
    return NextResponse.json(payload);
  } catch (err: any) {
    logApiError(label, err, startedAt);
    console.error("[FCM] token registration error:", err);
    const payload = { error: "Internal server error" };
    logApiOutgoing(label, 500, payload, startedAt);
    return NextResponse.json(payload, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { sendPushNotification } from "@/lib/firebase";
import { logApiError, logApiIncoming, logApiOutgoing } from "@/lib/apiLogger";

/**
 * POST /api/meetings/assign
 * ADMIN or MANAGER can assign a meeting to a user.
 * Body: { meetingId: string, userId: string }
 * Sends an FCM push notification to the assigned user.
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const label = "POST /api/meetings/assign";

  const guard = requireRole(request, "MANAGER");
  if (guard) {
    logApiOutgoing(label, guard.status, { error: "Forbidden" }, startedAt);
    return guard;
  }

  try {
    const body = await request.json();
    logApiIncoming(label, request, body);
    const { meetingId, userId } = body;

    if (!meetingId || !userId) {
      const payload = { error: "meetingId and userId are required." };
      logApiOutgoing(label, 400, payload, startedAt);
      return NextResponse.json(payload, { status: 400 });
    }

    const [meeting, user] = await Promise.all([
      prisma.meeting.findUnique({ where: { id: meetingId }, select: { id: true, title: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, fcmToken: true } }),
    ]);

    if (!meeting) {
      const payload = { error: "Meeting not found." };
      logApiOutgoing(label, 404, payload, startedAt);
      return NextResponse.json(payload, { status: 404 });
    }
    if (!user) {
      const payload = { error: "User not found." };
      logApiOutgoing(label, 404, payload, startedAt);
      return NextResponse.json(payload, { status: 404 });
    }

    if (user.fcmToken) {
      await sendPushNotification(user.fcmToken, {
        title: "Meeting Assigned",
        body: `You have been assigned to meeting: \"${meeting.title}\"`,
        data: { meetingId, type: "MEETING_ASSIGNED" },
      });
    }

    const payload = { message: "Meeting assigned and notification sent." };
    logApiOutgoing(label, 200, payload, startedAt);
    return NextResponse.json(payload);
  } catch (err: any) {
    logApiError(label, err, startedAt);
    console.error("[MeetingAssign] error:", err);
    const payload = { error: "Internal server error" };
    logApiOutgoing(label, 500, payload, startedAt);
    return NextResponse.json(payload, { status: 500 });
  }
}

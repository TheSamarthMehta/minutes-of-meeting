import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { getUserFromHeaders } from "@/lib/auth";
import { sendPushNotification } from "@/lib/firebase";

/**
 * POST /api/meetings/assign
 * ADMIN or MANAGER can assign a meeting to a user.
 * Body: { meetingId: string, userId: string }
 * Sends an FCM push notification to the assigned user.
 */
export async function POST(request: NextRequest) {
  const guard = requireRole(request, "MANAGER");
  if (guard) return guard;

  try {
    const body = await request.json();
    const { meetingId, userId } = body;

    if (!meetingId || !userId) {
      return NextResponse.json(
        { error: "meetingId and userId are required." },
        { status: 400 }
      );
    }

    const [meeting, user] = await Promise.all([
      prisma.meeting.findUnique({ where: { id: meetingId }, select: { id: true, title: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, fcmToken: true } }),
    ]);

    if (!meeting) return NextResponse.json({ error: "Meeting not found." }, { status: 404 });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    // Send FCM push notification if the user has a registered token
    if (user.fcmToken) {
      await sendPushNotification(user.fcmToken, {
        title: "Meeting Assigned",
        body: `You have been assigned to meeting: "${meeting.title}"`,
        data: { meetingId, type: "MEETING_ASSIGNED" },
      });
    }

    return NextResponse.json({ message: "Meeting assigned and notification sent." });
  } catch (err: any) {
    console.error("[MeetingAssign] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

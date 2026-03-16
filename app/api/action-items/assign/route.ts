import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { sendPushNotification } from "@/lib/firebase";
import { logApiError, logApiIncoming, logApiOutgoing } from "@/lib/apiLogger";

/**
 * POST /api/action-items/assign
 * ADMIN or MANAGER can assign a task/action-item to a user.
 * Body: { taskId: string, userId: string }
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const label = "POST /api/action-items/assign";

  const guard = requireRole(request, "MANAGER");
  if (guard) {
    logApiOutgoing(label, guard.status, { error: "Forbidden" }, startedAt);
    return guard;
  }

  try {
    const body = await request.json();
    logApiIncoming(label, request, body);
    const { taskId, userId } = body;

    if (!taskId || !userId) {
      const payload = { error: "taskId and userId are required." };
      logApiOutgoing(label, 400, payload, startedAt);
      return NextResponse.json(payload, { status: 400 });
    }

    const [task, user] = await Promise.all([
      prisma.actionItem.findUnique({ where: { id: taskId }, select: { id: true, task: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, fcmToken: true } }),
    ]);

    if (!task) {
      const payload = { error: "Task not found." };
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
        title: "Task Assigned",
        body: `A new task has been assigned to you: \"${task.task}\"`,
        data: { taskId, type: "TASK_ASSIGNED" },
      });
    }

    const payload = { message: "Task assigned and notification sent." };
    logApiOutgoing(label, 200, payload, startedAt);
    return NextResponse.json(payload);
  } catch (err: any) {
    logApiError(label, err, startedAt);
    console.error("[TaskAssign] error:", err);
    const payload = { error: "Internal server error" };
    logApiOutgoing(label, 500, payload, startedAt);
    return NextResponse.json(payload, { status: 500 });
  }
}

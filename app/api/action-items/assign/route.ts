import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { sendPushNotification } from "@/lib/firebase";

/**
 * POST /api/action-items/assign
 * ADMIN or MANAGER can assign a task/action-item to a user.
 * Body: { taskId: string, userId: string }
 */
export async function POST(request: NextRequest) {
  const guard = requireRole(request, "MANAGER");
  if (guard) return guard;

  try {
    const body = await request.json();
    const { taskId, userId } = body;

    if (!taskId || !userId) {
      return NextResponse.json(
        { error: "taskId and userId are required." },
        { status: 400 }
      );
    }

    const [task, user] = await Promise.all([
      prisma.actionItem.findUnique({ where: { id: taskId }, select: { id: true, task: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, fcmToken: true } }),
    ]);

    if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    if (user.fcmToken) {
      await sendPushNotification(user.fcmToken, {
        title: "Task Assigned",
        body: `A new task has been assigned to you: "${task.task}"`,
        data: { taskId, type: "TASK_ASSIGNED" },
      });
    }

    return NextResponse.json({ message: "Task assigned and notification sent." });
  } catch (err: any) {
    console.error("[TaskAssign] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

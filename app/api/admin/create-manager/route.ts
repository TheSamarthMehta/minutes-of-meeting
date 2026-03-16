import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { getUserFromHeaders } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mailer";
import { logApiError, logApiIncoming, logApiOutgoing } from "@/lib/apiLogger";

const createManagerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).optional(),
  organizationId: z.string().optional(),
});

/**
 * POST /api/admin/create-manager
 * Admin-only: creates a Manager account and sends a welcome email.
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const label = "POST /api/admin/create-manager";

  // RBAC guard – ADMIN only
  const guard = requireRole(request, "ADMIN");
  if (guard) {
    logApiOutgoing(label, guard.status, { error: "Forbidden" }, startedAt);
    return guard;
  }

  try {
    const body = await request.json();
    logApiIncoming(label, request, body);

    const data = createManagerSchema.parse(body);
    const actor = getUserFromHeaders(request);

    // Check for duplicate email
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      const payload = { error: "A user with this email already exists." };
      logApiOutgoing(label, 400, payload, startedAt);
      return NextResponse.json(payload, { status: 400 });
    }

    // Hash password (auto-generate if not provided)
    const rawPassword = data.password ?? Math.random().toString(36).slice(-10) + "A1!";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const manager = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "MANAGER",
        createdBy: actor?.userId,
        organizationId: data.organizationId,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const emailResult = await sendWelcomeEmail({
      toEmail: manager.email,
      toName: manager.name,
      role: "Manager",
    });

    console.log(
      `[Admin] Manager created: ${manager.email} by ${actor?.email}. ` +
        `emailSent=${emailResult.sent}`
    );

    const payload = {
      message: "Manager account created successfully.",
      user: manager,
      email: emailResult,
    };
    logApiOutgoing(label, 201, payload, startedAt);
    return NextResponse.json(payload, { status: 201 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      const payload = { error: "Validation failed", details: err.errors };
      logApiOutgoing(label, 400, payload, startedAt);
      return NextResponse.json(payload, { status: 400 });
    }
    logApiError(label, err, startedAt);
    console.error("[Admin] create-manager error:", err);
    const payload = { error: "Internal server error" };
    logApiOutgoing(label, 500, payload, startedAt);
    return NextResponse.json(payload, { status: 500 });
  }
}

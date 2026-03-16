import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { getUserFromHeaders } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mailer";
import { logApiError, logApiIncoming, logApiOutgoing } from "@/lib/apiLogger";

const createStaffSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).optional(),
  organizationId: z.string().optional(),
});

/**
 * POST /api/admin/create-staff
 * ADMIN or MANAGER can create Staff accounts.
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const label = "POST /api/admin/create-staff";

  // RBAC guard – MANAGER or higher
  const guard = requireRole(request, "MANAGER");
  if (guard) {
    logApiOutgoing(label, guard.status, { error: "Forbidden" }, startedAt);
    return guard;
  }

  try {
    const body = await request.json();
    logApiIncoming(label, request, body);

    const data = createStaffSchema.parse(body);
    const actor = getUserFromHeaders(request);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      const payload = { error: "A user with this email already exists." };
      logApiOutgoing(label, 400, payload, startedAt);
      return NextResponse.json(payload, { status: 400 });
    }

    const rawPassword = data.password ?? Math.random().toString(36).slice(-10) + "A1!";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const staff = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "STAFF",
        createdBy: actor?.userId,
        organizationId: data.organizationId,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const emailResult = await sendWelcomeEmail({
      toEmail: staff.email,
      toName: staff.name,
      role: "Staff",
    });

    console.log(
      `[Admin] Staff created: ${staff.email} by ${actor?.email}. ` +
        `emailSent=${emailResult.sent}`
    );

    const payload = {
      message: "Staff account created successfully.",
      user: staff,
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
    console.error("[Admin] create-staff error:", err);
    const payload = { error: "Internal server error" };
    logApiOutgoing(label, 500, payload, startedAt);
    return NextResponse.json(payload, { status: 500 });
  }
}

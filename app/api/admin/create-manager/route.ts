import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { getUserFromHeaders } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mailer";
import { sendPushNotification } from "@/lib/firebase";

const createManagerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).optional(),
  organizationId: z.string().optional(),
});

/**
 * POST /api/admin/create-manager
 * Admin-only: creates a Manager account, sends welcome email + FCM push.
 */
export async function POST(request: NextRequest) {
  // RBAC guard – ADMIN only
  const guard = requireRole(request, "ADMIN");
  if (guard) return guard;

  try {
    const body = await request.json();
    const data = createManagerSchema.parse(body);
    const actor = getUserFromHeaders(request);

    // Check for duplicate email
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 400 }
      );
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

    // Email notification (non-blocking)
    sendWelcomeEmail({
      toEmail: manager.email,
      toName: manager.name,
      role: "Manager",
    });

    // FCM push – token not available at creation time, skip gracefully
    // Token will be registered on first login by the manager.

    console.log(`[Admin] Manager created: ${manager.email} by ${actor?.email}`);

    return NextResponse.json(
      { message: "Manager account created successfully.", user: manager },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("[Admin] create-manager error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

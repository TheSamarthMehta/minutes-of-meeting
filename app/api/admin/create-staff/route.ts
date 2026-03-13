import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { getUserFromHeaders } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mailer";

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
  // RBAC guard – MANAGER or higher
  const guard = requireRole(request, "MANAGER");
  if (guard) return guard;

  try {
    const body = await request.json();
    const data = createStaffSchema.parse(body);
    const actor = getUserFromHeaders(request);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 400 }
      );
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

    sendWelcomeEmail({
      toEmail: staff.email,
      toName: staff.name,
      role: "Staff",
    });

    console.log(`[Admin] Staff created: ${staff.email} by ${actor?.email}`);

    return NextResponse.json(
      { message: "Staff account created successfully.", user: staff },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("[Admin] create-staff error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

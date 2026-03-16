import nodemailer from "nodemailer";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const parsedPort = Number(process.env.SMTP_PORT ?? 587);
  const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const missing: string[] = [];
  if (!host) missing.push("SMTP_HOST");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");

  if (missing.length > 0) {
    return {
      transporter: null,
      reason: `Missing SMTP settings: ${missing.join(", ")}. Set them in .env.`,
    };
  }

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    }),
    reason: null,
  };
}

export interface WelcomeEmailPayload {
  toEmail: string;
  toName: string;
  role: string;
  loginUrl?: string;
}

export interface EmailDeliveryResult {
  sent: boolean;
  reason?: string;
  messageId?: string;
}

function resolveFromAddress(): string {
  const fromEnv = process.env.SMTP_FROM?.trim();

  if (fromEnv && fromEnv.includes("<") && fromEnv.includes(">")) {
    return fromEnv;
  }

  const rawEmail = (fromEnv || process.env.SMTP_USER || "").trim();
  return `"MinutesMaster" <${rawEmail}>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends a welcome email when a new Manager or Staff account is created.
 */
export async function sendWelcomeEmail(
  payload: WelcomeEmailPayload
): Promise<EmailDeliveryResult> {
  const { toEmail, toName, role, loginUrl } = payload;
  const url = loginUrl ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000/login";
  const escapedName = escapeHtml(toName);
  const escapedRole = escapeHtml(role);

  const { transporter, reason: transportReason } = createTransport();
  if (!transporter) {
    const reason =
      transportReason ||
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.";
    console.error(`[Email] ${reason}`);
    return { sent: false, reason };
  }

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background:#f4f7fb; padding:24px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
        <div style="background:#0f172a; padding:24px 28px;">
          <h1 style="color:#ffffff; margin:0; font-size:22px; letter-spacing:0.2px;">MinutesMaster</h1>
          <p style="color:#cbd5e1; margin:8px 0 0; font-size:13px;">Meeting Management Platform</p>
        </div>
        <div style="padding:28px; color:#0f172a;">
          <p style="margin:0 0 12px; font-size:15px;">Hello ${escapedName},</p>
          <p style="margin:0 0 16px; font-size:15px; line-height:1.65; color:#334155;">
            Your account has been created successfully. You can now sign in and start using the platform.
          </p>

          <table style="width:100%; border-collapse:collapse; margin:16px 0 24px; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
            <tr>
              <td style="padding:10px 12px; width:35%; background:#f8fafc; color:#64748b; font-size:13px;">Role</td>
              <td style="padding:10px 12px; color:#0f172a; font-size:13px; font-weight:600;">${escapedRole}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px; background:#f8fafc; color:#64748b; font-size:13px;">Email</td>
              <td style="padding:10px 12px; color:#0f172a; font-size:13px;">${toEmail}</td>
            </tr>
          </table>

          <a href="${url}"
             style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:8px; font-size:14px; font-weight:600;">
            Sign In to MinutesMaster
          </a>

          <p style="margin:20px 0 0; font-size:12px; line-height:1.6; color:#64748b;">
            If you did not expect this email, you can safely ignore it.
          </p>
        </div>
        <div style="padding:14px 28px; background:#f8fafc; border-top:1px solid #e2e8f0; color:#64748b; font-size:12px;">
          This is an automated message from MinutesMaster.
        </div>
      </div>
    </div>`;

  const text = [
    `Hello ${toName},`,
    "",
    "Your MinutesMaster account has been created successfully.",
    `Role: ${role}`,
    `Email: ${toEmail}`,
    "",
    `Login: ${url}`,
    "",
    "If you did not expect this email, please ignore it.",
  ].join("\n");

  try {
    const info = await transporter.sendMail({
      from: resolveFromAddress(),
      to: toEmail,
      subject: "Welcome to MinutesMaster",
      text,
      html,
    });

    console.log(`[Email] Welcome email sent to ${toEmail}. messageId=${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (err: any) {
    const reason = err?.message ?? "Unknown SMTP error";
    console.error("[Email] sendWelcomeEmail error:", reason);
    return { sent: false, reason };
  }
}

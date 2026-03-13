import nodemailer from "nodemailer";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // Fall back to Ethereal/test account warning – never crash in dev
    console.warn(
      "[Email] SMTP credentials are not fully set. " +
        "Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to .env"
    );
  }

  return nodemailer.createTransport({
    host: host ?? "smtp.ethereal.email",
    port,
    secure: port === 465,
    auth: { user: user ?? "", pass: pass ?? "" },
  });
}

export interface WelcomeEmailPayload {
  toEmail: string;
  toName: string;
  role: string;
  loginUrl?: string;
}

/**
 * Sends a welcome email when a new Manager or Staff account is created.
 * Silently logs on failure so the user-creation API still returns success.
 */
export async function sendWelcomeEmail(payload: WelcomeEmailPayload): Promise<void> {
  const { toEmail, toName, role, loginUrl } = payload;
  const url = loginUrl ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000/login";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg,#2563eb,#7c3aed); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color:#fff; margin:0; font-size:24px;">Welcome to MinutesMaster</h1>
      </div>
      <div style="background:#1a1a1a; padding:32px; border-radius:0 0 12px 12px; color:#d1d5db;">
        <p style="font-size:16px;">Hello <strong style="color:#fff">${toName}</strong>,</p>
        <p>Your MinutesMaster account has been created.</p>
        <table style="width:100%; border-collapse:collapse; margin:16px 0;">
          <tr><td style="padding:8px; color:#9ca3af;">Role</td>
              <td style="padding:8px; color:#fff; font-weight:600;">${role}</td></tr>
        </table>
        <a href="${url}"
           style="display:inline-block; background:#2563eb; color:#fff; text-decoration:none;
                  padding:12px 28px; border-radius:8px; font-weight:600; margin-top:8px;">
          Login to MinutesMaster
        </a>
        <p style="font-size:12px; color:#6b7280; margin-top:24px;">
          If you did not expect this email, please ignore it.
        </p>
      </div>
    </div>`;

  try {
    const transporter = createTransport();
    await transporter.sendMail({
      from: `"MinutesMaster" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Welcome to MinutesMaster",
      html,
    });
    console.log(`[Email] Welcome email sent to ${toEmail}`);
  } catch (err: any) {
    console.error("[Email] sendWelcomeEmail error:", err?.message ?? err);
  }
}

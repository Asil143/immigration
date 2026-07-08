import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@statusclock.com";

export async function sendDeadlineReminder(params: {
  to: string;
  name: string;
  deadlineTitle: string;
  dueDate: string;
  daysUntil: number;
}) {
  const urgency =
    params.daysUntil <= 7 ? "URGENT: " : params.daysUntil <= 30 ? "Reminder: " : "";

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `${urgency}Immigration deadline in ${params.daysUntil} days — ${params.deadlineTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">StatusClock</h1>
        </div>
        <div style="padding: 24px; background: #f8fafc; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b;">Hi ${params.name},</h2>
          <p style="color: #475569; font-size: 16px;">
            You have an upcoming immigration deadline:
          </p>
          <div style="background: ${params.daysUntil <= 7 ? "#fef2f2" : "#eff6ff"}; border-left: 4px solid ${params.daysUntil <= 7 ? "#ef4444" : "#2563eb"}; padding: 16px; border-radius: 4px; margin: 16px 0;">
            <strong style="color: #1e293b; font-size: 18px;">${params.deadlineTitle}</strong>
            <p style="color: #64748b; margin: 8px 0 0;">Due: ${params.dueDate} (${params.daysUntil} days away)</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/timeline"
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 16px;">
            View Your Timeline
          </a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
            StatusClock provides general information, not legal advice. Consult a licensed immigration attorney for your specific situation.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminFormAlert(params: {
  userName: string;
  userEmail: string;
  formType: string;
  fields: Record<string, string>;
  submissionId: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "kamepalliasil143@gmail.com";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const rows = Object.entries(params.fields)
    .filter(([, v]) => v && v !== "N/A")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;white-space:nowrap">${k.replace(/_/g, " ")}</td><td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b">${v}</td></tr>`
    )
    .join("");

  return getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `New ${params.formType} submission — ${params.userName}`,
    html: `
      <div style="font-family:sans-serif;max-width:680px;margin:0 auto;">
        <div style="background:#1e293b;padding:20px 24px;border-radius:8px 8px 0 0;display:flex;align-items:center;gap:12px;">
          <span style="color:white;font-size:20px;font-weight:700;">StatusClock Admin</span>
          <span style="background:#3b82f6;color:white;font-size:11px;font-weight:600;padding:2px 8px;border-radius:9999px;">${params.formType}</span>
        </div>
        <div style="padding:24px;background:#f8fafc;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          <h2 style="margin:0 0 4px;color:#1e293b;">New form submission received</h2>
          <p style="color:#64748b;margin:0 0 20px;">
            <strong>${params.userName}</strong> (${params.userEmail}) just completed the <strong>${params.formType}</strong> guided interview.
          </p>
          <a href="${appUrl}/admin/form-submissions"
             style="display:inline-block;background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;margin-bottom:24px;">
            Review in Admin Panel →
          </a>
          <h3 style="color:#475569;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px;">Submitted Answers</h3>
          <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div style="padding:16px 24px;background:#f1f5f9;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;border-top:0;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">Submission ID: ${params.submissionId}</p>
        </div>
      </div>
    `,
  });
}

export async function sendUserFormConfirmation(params: {
  to: string;
  name: string;
  formType: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `We received your ${params.formType} — StatusClock`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#2563eb;padding:24px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:22px;">StatusClock</h1>
        </div>
        <div style="padding:28px;background:#f8fafc;border-radius:0 0 8px 8px;">
          <h2 style="color:#1e293b;margin:0 0 8px;">Hi ${params.name},</h2>
          <p style="color:#475569;font-size:16px;line-height:1.6;">
            We received your <strong>${params.formType}</strong> answers. Our team will review your information and prepare your official form.
          </p>
          <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:16px;border-radius:4px;margin:20px 0;">
            <p style="color:#1e40af;margin:0;font-weight:600;">What happens next?</p>
            <ul style="color:#3b82f6;margin:8px 0 0;padding-left:18px;font-size:14px;line-height:1.8;">
              <li>We review your answers (usually within 1–2 business days)</li>
              <li>We fill out the official USCIS form on your behalf</li>
              <li>We email you the completed form for review and signature</li>
            </ul>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
            Go to Dashboard
          </a>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
            Questions? Reply to this email or use the AI Assistant on your dashboard.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: "Welcome to StatusClock — never miss another immigration deadline",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to StatusClock</h1>
        </div>
        <div style="padding: 24px;">
          <h2>Hi ${params.name},</h2>
          <p>You're now set up on StatusClock — your AI-powered immigration deadline tracker.</p>
          <p>Here's what you can do right now:</p>
          <ul>
            <li>Ask our AI assistant any immigration question</li>
            <li>Set up your visa case and track deadlines</li>
            <li>Browse our step-by-step visa guides</li>
            <li>Connect with the community</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            Go to Dashboard
          </a>
        </div>
      </div>
    `,
  });
}

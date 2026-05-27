import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@visapilot.com";

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
          <h1 style="color: white; margin: 0; font-size: 24px;">VisaPilot</h1>
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
            VisaPilot provides general information, not legal advice. Consult a licensed immigration attorney for your specific situation.
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
    subject: "Welcome to VisaPilot — your immigration co-pilot",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to VisaPilot</h1>
        </div>
        <div style="padding: 24px;">
          <h2>Hi ${params.name},</h2>
          <p>You're now set up on VisaPilot — your AI-powered immigration co-pilot.</p>
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

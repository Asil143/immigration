import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Log to console for now — wire to email provider (Resend/SendGrid) when ready
    console.log("[contact-form]", { name, email, subject, message, ts: new Date().toISOString() });

    // TODO: send email via Resend or SendGrid
    // await resend.emails.send({
    //   from: "noreply@visapilot.app",
    //   to: "support@visapilot.app",
    //   subject: `Contact form: ${subject || "General"}`,
    //   text: `From: ${name} <${email}>\n\n${message}`,
    // });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

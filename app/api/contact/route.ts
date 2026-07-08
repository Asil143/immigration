import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { allowRequest } from "@/lib/utils/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!allowRequest(`contact:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { name, email, subject, message, attachment } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: "kamepalliasil143@gmail.com",
      replyTo: email,
      subject: subject ? `[StatusClock] ${subject}` : "[StatusClock] Contact Form Submission",
      text: `From: ${name} <${email}>\n\n${message}`,
      ...(attachment && {
        attachments: [{ filename: attachment.filename, content: attachment.content }],
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

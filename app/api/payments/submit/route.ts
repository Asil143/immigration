import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const body = await req.json();
  const { email, planId, planName, amount, txNote, screenshot } = body;

  if (!email || !planId || !planName || !amount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createAdminClient();
  let screenshotUrl: string | null = null;

  // Try to upload screenshot to Supabase Storage (best-effort)
  if (screenshot?.content && screenshot?.filename) {
    try {
      const buffer = Buffer.from(screenshot.content, "base64");
      const ext = screenshot.filename.split(".").pop()?.toLowerCase() || "png";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(path, buffer, { contentType: `image/${ext}`, upsert: false });
      if (!uploadError) {
        const { data } = supabase.storage.from("payment-screenshots").getPublicUrl(path);
        screenshotUrl = data.publicUrl;
      }
    } catch (e) {
      console.error("[screenshot-upload]", e);
    }
  }

  // Send admin email FIRST — always, regardless of DB state
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: "kamepalliasil143@gmail.com",
      subject: `[StatusClock] New Payment — ${planName} ($${amount})`,
      text: [
        `New payment submission received!`,
        ``,
        `Plan: ${planName}`,
        `Amount: $${amount}`,
        `Customer: ${email}`,
        `Note: ${txNote || "none"}`,
        `Screenshot: ${screenshotUrl ?? "(see attachment)"}`,
        ``,
        `Activate at: https://statusclock-one.vercel.app/admin/payments`,
      ].join("\n"),
      // Attach screenshot directly in case storage upload failed
      ...(screenshot?.content && !screenshotUrl && {
        attachments: [{ filename: screenshot.filename || "payment.png", content: screenshot.content }],
      }),
    });
  } catch (e) {
    console.error("[payment-notify]", e);
  }

  // Try to save submission to DB (best-effort — tables may not exist yet)
  try {
    await supabase
      .from("payment_submissions")
      .insert({
        email,
        clerk_id: userId ?? null,
        plan_id: planId,
        plan_name: planName,
        amount,
        tx_note: txNote || null,
        screenshot_url: screenshotUrl,
        status: "pending",
      });
  } catch (e) {
    console.error("[payment-db]", e);
  }

  return NextResponse.json({ ok: true });
}

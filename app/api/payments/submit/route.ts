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

  // Upload screenshot to Supabase Storage
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
      } else {
        console.error("[screenshot-upload]", uploadError);
      }
    } catch (e) {
      console.error("[screenshot-upload]", e);
    }
  }

  // Save submission
  const { data: submission, error } = await supabase
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
    })
    .select()
    .single();

  if (error) {
    console.error("[payment-submit]", error);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }

  // Notify admin
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: "kamepalliasil143@gmail.com",
      subject: `[VisaPilot] New Payment — ${planName} ($${amount})`,
      text: [
        `New payment submission received!`,
        ``,
        `Plan: ${planName}`,
        `Amount: $${amount}`,
        `Customer: ${email}`,
        `Note: ${txNote || "none"}`,
        `Screenshot: ${screenshotUrl ?? "not provided"}`,
        ``,
        `Activate at: https://visapilot-one.vercel.app/admin/payments`,
      ].join("\n"),
    });
  } catch (e) {
    console.error("[payment-notify]", e);
  }

  return NextResponse.json({ ok: true, id: submission.id });
}

import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/resend/client";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: { type: string; data: Record<string, unknown> };
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as typeof evt;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created") {
    const supabase = createAdminClient();
    const userData = evt.data as {
      id: string;
      email_addresses: Array<{ email_address: string }>;
      first_name: string;
      last_name: string;
      image_url: string;
    };

    const email = userData.email_addresses[0]?.email_address ?? "";
    const fullName = `${userData.first_name ?? ""} ${userData.last_name ?? ""}`.trim();

    await supabase.from("profiles").upsert({
      clerk_id: userData.id,
      email,
      full_name: fullName,
      avatar_url: userData.image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (email) {
      await sendWelcomeEmail({ to: email, name: userData.first_name ?? "there" });
    }
  }

  return NextResponse.json({ ok: true });
}

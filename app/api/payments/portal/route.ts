import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { stripe, createPortalSession } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("clerk_id", userId)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account found." }, { status: 404 });
  }

  const origin = req.headers.get("origin") ?? "https://visapilot-one.vercel.app";
  const url = await createPortalSession(profile.stripe_customer_id, `${origin}/settings`);
  return NextResponse.json({ url });
}

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { stripe, createOrRetrieveCustomer, createCheckoutSession, PLANS } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planId, billing = "monthly" } = await req.json();

  const plan = PLANS[planId as keyof typeof PLANS];
  if (!plan || planId === "free") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = billing === "yearly"
    ? (plan as { yearlyPrice?: number; priceId?: string | null }).priceId
    : (plan as { priceId?: string | null }).priceId;

  if (!priceId) {
    return NextResponse.json({ error: "Plan not configured — contact support." }, { status: 400 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  // Get or create Stripe customer, save customer ID to profile
  const customerId = await createOrRetrieveCustomer(userId, email, name);
  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({ stripe_customer_id: customerId })
    .eq("clerk_id", userId);

  const origin = req.headers.get("origin") ?? "https://visapilot-one.vercel.app";
  const url = await createCheckoutSession(
    customerId,
    priceId,
    `${origin}/billing/success?plan=${planId}`,
    `${origin}/billing/cancel`,
  );

  return NextResponse.json({ url });
}

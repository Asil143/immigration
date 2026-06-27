import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ plan: "free" });

  const supabase = createAdminClient();

  // Check user_plans (manual payment activations)
  const { data: plans } = await supabase
    .from("user_plans")
    .select("plan_id, expires_at")
    .eq("clerk_id", userId)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("created_at", { ascending: false })
    .limit(1);

  if (plans && plans.length > 0) {
    return NextResponse.json({ plan: plans[0].plan_id });
  }

  // Fallback: subscription_plan column on profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("clerk_id", userId)
    .single();

  return NextResponse.json({ plan: profile?.subscription_plan ?? "free" });
}

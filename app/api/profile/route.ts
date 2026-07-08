import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Fields a user may set about themselves. Deliberately excludes identity
// fields (clerk_id/email/full_name/avatar_url — always derived from the
// authenticated Clerk session) and system/monetization fields
// (subscription_plan, ai_queries_used_today, ai_queries_reset_at, etc.)
// that must only ever be written by the payment activation flow, the
// Stripe webhook, or a cron job — never directly by the client.
const ALLOWED_PROFILE_FIELDS = new Set([
  "visa_type", "country_of_birth", "employer",
  "ead_expiry", "i94_expiry", "visa_stamp_expiry", "passport_expiry",
  "h1b_start_date", "opt_start_date", "opt_end_date",
  "stem_opt_start_date", "stem_opt_end_date",
  "visa_start_date", "passport_issue_date", "i94_is_ds", "i20_end_date",
  "h1b_expiry", "advance_parole_issue_date", "advance_parole_expiry",
  "i140_approval_date", "h4_ead_issue_date", "h4_ead_expiry",
  "j1_end_date", "tn_start_date", "tn_expiry", "l1_start_date", "l1_expiry",
  "perm_filing_date", "priority_date",
  "green_card_stage", "green_card_category",
  "goals", "onboarding_complete",
  "ssn", "a_number", "mailing_street", "mailing_city", "mailing_state", "mailing_zip", "phone",
  "date_of_birth", "middle_name", "first_name", "last_name",
  "notification_prefs",
]);

function pickAllowedFields(body: Record<string, unknown>): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const key of Object.keys(body)) {
    if (ALLOWED_PROFILE_FIELDS.has(key)) picked[key] = body[key];
  }
  return picked;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("profiles")
    .upsert({
      ...pickAllowedFields(body),
      clerk_id: userId,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      avatar_url: user.imageUrl,
      updated_at: new Date().toISOString(),
    }, { onConflict: "clerk_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  // PGRST116 = no rows found — profile doesn't exist yet, return null
  if (error?.code === "PGRST116") return NextResponse.json(null);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

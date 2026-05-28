import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendDeadlineReminder } from "@/lib/resend/client";

// Vercel Cron calls this with a CRON_SECRET header for security
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("clerk_id, email, full_name, ead_expiry, i94_expiry, visa_stamp_expiry, passport_expiry")
    .not("email", "is", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ALERT_THRESHOLDS = [7, 30, 90];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineChecks = [
    { key: "ead_expiry", label: "OPT / STEM OPT Work Authorization" },
    { key: "i94_expiry", label: "I-94 Authorized Stay" },
    { key: "visa_stamp_expiry", label: "Visa Stamp" },
    { key: "passport_expiry", label: "Passport" },
  ];

  let sent = 0;
  const errors: string[] = [];

  for (const profile of profiles ?? []) {
    if (!profile.email) continue;

    for (const check of deadlineChecks) {
      const dateStr = profile[check.key as keyof typeof profile] as string | null;
      if (!dateStr) continue;

      const dueDate = new Date(dateStr);
      dueDate.setHours(0, 0, 0, 0);
      const daysUntil = Math.round((dueDate.getTime() - today.getTime()) / 86400000);

      if (ALERT_THRESHOLDS.includes(daysUntil)) {
        try {
          await sendDeadlineReminder({
            to: profile.email,
            name: profile.full_name?.split(" ")[0] || "there",
            deadlineTitle: check.label,
            dueDate: dueDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            daysUntil,
          });
          sent++;
        } catch (e) {
          errors.push(`${profile.email}: ${String(e)}`);
        }
      }
    }
  }

  return NextResponse.json({ ok: true, sent, errors: errors.length > 0 ? errors : undefined });
}

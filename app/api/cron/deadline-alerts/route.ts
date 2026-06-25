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
    .select(`clerk_id, email, full_name,
      ead_expiry, i94_expiry, visa_stamp_expiry, passport_expiry,
      opt_end_date, stem_opt_end_date, h1b_expiry, i20_end_date,
      tn_expiry, l1_expiry, h4_ead_expiry, advance_parole_expiry,
      opt_start_date, h1b_start_date, stem_opt_start_date`)
    .not("email", "is", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ALERT_THRESHOLDS = [7, 30, 60, 90];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineChecks = [
    { key: "ead_expiry",            label: "EAD / Work Permit" },
    { key: "i94_expiry",            label: "I-94 Authorized Stay" },
    { key: "visa_stamp_expiry",     label: "Visa Stamp" },
    { key: "passport_expiry",       label: "Passport" },
    { key: "opt_end_date",          label: "OPT Authorization" },
    { key: "stem_opt_end_date",     label: "STEM OPT Authorization" },
    { key: "h1b_expiry",            label: "H-1B Status" },
    { key: "i20_end_date",          label: "I-20 Program End Date" },
    { key: "tn_expiry",             label: "TN Status" },
    { key: "l1_expiry",             label: "L-1 Status" },
    { key: "h4_ead_expiry",         label: "H-4 EAD" },
    { key: "advance_parole_expiry", label: "Advance Parole" },
  ];

  // OPT application window opens 90 days before opt_start_date
  const windowChecks = [
    { key: "opt_start_date",      label: "OPT 90-day application window opens today", windowDays: 90 },
    { key: "h1b_start_date",      label: "H-1B start date",                           windowDays: 0  },
    { key: "stem_opt_start_date", label: "STEM OPT start date",                       windowDays: 0  },
  ];

  let sent = 0;
  const errors: string[] = [];

  for (const profile of profiles ?? []) {
    if (!profile.email) continue;
    const firstName = profile.full_name?.split(" ")[0] || "there";

    // Expiry deadline checks
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
            name: firstName,
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

    // Application window checks (e.g. OPT must be filed 90 days before start)
    for (const w of windowChecks) {
      if (w.windowDays === 0) continue;
      const dateStr = profile[w.key as keyof typeof profile] as string | null;
      if (!dateStr) continue;

      const startDate = new Date(dateStr);
      startDate.setHours(0, 0, 0, 0);
      const daysUntilStart = Math.round((startDate.getTime() - today.getTime()) / 86400000);

      if (daysUntilStart === w.windowDays) {
        try {
          await sendDeadlineReminder({
            to: profile.email,
            name: firstName,
            deadlineTitle: w.label,
            dueDate: startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            daysUntil: w.windowDays,
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

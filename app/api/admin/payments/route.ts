import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const ADMIN_EMAIL = "kamepalliasil143@gmail.com";
const resend = new Resend(process.env.RESEND_API_KEY);

async function checkAdmin(): Promise<boolean> {
  const user = await currentUser();
  return user?.emailAddresses?.some(e => e.emailAddress === ADMIN_EMAIL) ?? false;
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("payment_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, action } = await req.json();
  if (!id || !action) return NextResponse.json({ error: "Missing id or action" }, { status: 400 });

  const supabase = createAdminClient();

  const { data: sub, error: fetchErr } = await supabase
    .from("payment_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !sub) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

  const newStatus = action === "activate" ? "activated" : "rejected";

  await supabase
    .from("payment_submissions")
    .update({
      status: newStatus,
      activated_at: action === "activate" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (action === "activate") {
    // Calculate expiry — All-Access is 1 year, packs are lifetime
    const expiresAt = sub.plan_id === "all-access"
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    await supabase.from("user_plans").insert({
      clerk_id: sub.clerk_id ?? null,
      email: sub.email,
      plan_id: sub.plan_id,
      plan_name: sub.plan_name,
      expires_at: expiresAt,
    });

    // Confirmation email to user
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: sub.email,
        subject: `✅ Your VisaPilot ${sub.plan_name} is now active!`,
        text: [
          `Hi!`,
          ``,
          `Your ${sub.plan_name} has been activated on VisaPilot.`,
          ``,
          `You now have full access to all features included in your plan.`,
          `Log in at https://visapilot-one.vercel.app/dashboard to get started.`,
          ``,
          `Thank you for your purchase!`,
          `— VisaPilot Team`,
        ].join("\n"),
      });
    } catch (e) {
      console.error("[activation-email]", e);
    }
  }

  return NextResponse.json({ ok: true });
}

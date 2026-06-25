import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("notification_prefs")
    .eq("clerk_id", userId)
    .single();

  if (error) return NextResponse.json({ prefs: null });
  return NextResponse.json({ prefs: data?.notification_prefs ?? null });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prefs } = await req.json();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ notification_prefs: prefs, updated_at: new Date().toISOString() })
    .eq("clerk_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

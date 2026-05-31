/*
  Supabase table required:

  create table opt_tracker (
    user_id    text        primary key,
    opt_type   text        not null default 'standard',
    periods    jsonb       not null default '[]',
    updated_at timestamptz not null default now()
  );
*/

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ opt_type: "standard", periods: [] });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("opt_tracker")
    .select("opt_type, periods")
    .eq("user_id", userId)
    .single();

  return NextResponse.json({
    opt_type: data?.opt_type ?? "standard",
    periods: data?.periods ?? [],
  });
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { opt_type, periods } = await req.json();
  const supabase = createAdminClient();

  await supabase.from("opt_tracker").upsert(
    { user_id: userId, opt_type, periods, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );

  return NextResponse.json({ ok: true });
}

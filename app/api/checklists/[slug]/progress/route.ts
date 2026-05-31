/*
  Supabase table required:

  create table checklist_progress (
    user_id      text        not null,
    checklist_slug text      not null,
    checked_items  jsonb     not null default '{}',
    updated_at   timestamptz not null default now(),
    primary key (user_id, checklist_slug)
  );
*/

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ checked: {} });

  const { slug } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("checklist_progress")
    .select("checked_items")
    .eq("user_id", userId)
    .eq("checklist_slug", slug)
    .single();

  return NextResponse.json({ checked: data?.checked_items ?? {} });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const { checked } = await req.json();

  const supabase = createAdminClient();
  await supabase.from("checklist_progress").upsert(
    { user_id: userId, checklist_slug: slug, checked_items: checked, updated_at: new Date().toISOString() },
    { onConflict: "user_id,checklist_slug" }
  );

  return NextResponse.json({ ok: true });
}

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "kamepalliasil143@gmail.com";

async function assertAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("email")
    .eq("clerk_id", userId)
    .single();
  return data?.email === ADMIN_EMAIL;
}

// GET /api/admin/form-submissions — all submissions
export async function GET() {
  if (!(await assertAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// PATCH /api/admin/form-submissions — update status or admin_notes
export async function PATCH(req: NextRequest) {
  if (!(await assertAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, status, admin_notes } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const update: Record<string, string> = { updated_at: new Date().toISOString() };
  if (status) update.status = status;
  if (admin_notes !== undefined) update.admin_notes = admin_notes;

  const { data, error } = await supabase
    .from("form_submissions")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// POST /api/forms/submissions — save a completed form
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const body = await req.json();
  const { form_type = "I-864", fields } = body;

  if (!fields || typeof fields !== "object")
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const supabase = createAdminClient();

  // Upsert — one active submission per user per form type
  const { data, error } = await supabase
    .from("form_submissions")
    .upsert(
      {
        clerk_id: userId,
        form_type,
        fields,
        user_email: user?.emailAddresses[0]?.emailAddress ?? null,
        user_name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || null,
        status: "submitted",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_id,form_type" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// GET /api/forms/submissions — fetch the current user's submissions
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("form_submissions")
    .select("id, form_type, status, admin_notes, created_at, updated_at")
    .eq("clerk_id", userId)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

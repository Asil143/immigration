import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Saves manually entered status to Supabase
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("monitored_cases")
    .update({
      last_status: status,
      last_checked_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("clerk_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

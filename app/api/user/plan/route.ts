import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ plans: [] });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("user_plans")
    .select("*")
    .eq("clerk_id", userId)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  return NextResponse.json({ plans: data ?? [] });
}

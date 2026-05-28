import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("profiles")
    .upsert({
      clerk_id: userId,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      avatar_url: user.imageUrl,
      ...body,
      updated_at: new Date().toISOString(),
    }, { onConflict: "clerk_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  // PGRST116 = no rows found — profile doesn't exist yet, return null
  if (error?.code === "PGRST116") return NextResponse.json(null);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

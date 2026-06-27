import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// GET /api/chat/conversations — list user's conversations (newest first, 30 max)
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("chat_conversations")
    .select("id, title, created_at, updated_at")
    .eq("clerk_id", userId)
    .order("updated_at", { ascending: false })
    .limit(30);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/chat/conversations — create a new conversation
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, messages } = await req.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("chat_conversations")
    .insert({
      clerk_id: userId,
      title: title || "New conversation",
      messages: messages ?? [],
      updated_at: new Date().toISOString(),
    })
    .select("id, title, created_at, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

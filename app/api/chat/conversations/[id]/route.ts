import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// PATCH /api/chat/conversations/[id] — update messages and optionally title
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { messages, title } = await req.json();
  const supabase = createAdminClient();

  const update: Record<string, unknown> = { messages, updated_at: new Date().toISOString() };
  if (title) update.title = title;

  const { data, error } = await supabase
    .from("chat_conversations")
    .update(update)
    .eq("id", id)
    .eq("clerk_id", userId)
    .select("id, title, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/chat/conversations/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("chat_conversations")
    .delete()
    .eq("id", id)
    .eq("clerk_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// GET /api/chat/conversations/[id] — load full conversation with messages
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("id", id)
    .eq("clerk_id", userId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

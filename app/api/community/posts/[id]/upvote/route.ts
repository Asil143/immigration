import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: post, error: fetchErr } = await supabase
    .from("community_posts")
    .select("upvotes")
    .eq("id", id)
    .single();

  if (fetchErr || !post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("community_posts")
    .update({ upvotes: post.upvotes + 1 })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ upvotes: data.upvotes });
}

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// GET /api/community?category=&sort=new|top&limit=&offset=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "new";
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const supabase = createAdminClient();
  let query = supabase
    .from("community_posts")
    .select("id, title, body, category, user_name, upvotes, reply_count, created_at")
    .range(offset, offset + limit - 1);

  if (category !== "all") query = query.eq("category", category);
  if (sort === "top") query = query.order("upvotes", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/community — create a post
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const { title, body, category } = await req.json();
  if (!title?.trim() || !body?.trim() || !category)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      clerk_id: userId,
      user_name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Anonymous",
      title: title.trim(),
      body: body.trim(),
      category,
      upvotes: 0,
      reply_count: 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH /api/community — upvote a post
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("increment_upvotes", { post_id: id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

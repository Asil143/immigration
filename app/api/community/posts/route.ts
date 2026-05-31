import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "hot";

  const supabase = createAdminClient();
  let query = supabase.from("community_posts").select("*");

  if (category !== "all") {
    query = query.eq("category", category);
  }

  if (sort === "new") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "top") {
    query = query.order("replies", { ascending: false });
  } else {
    query = query.order("upvotes", { ascending: false });
  }

  query = query.limit(50);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const { title, body, category, tags } = await req.json();

  if (!title?.trim() || !body?.trim() || !category?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const name = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Anonymous";

  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const tagArray = tags
    ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      user_id: userId,
      author_name: name,
      author_initials: initials,
      author_visa: "F-1",
      category,
      title: title.trim(),
      body: body.trim(),
      tags: tagArray,
      upvotes: 0,
      replies: 0,
      is_answered: false,
      is_pinned: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

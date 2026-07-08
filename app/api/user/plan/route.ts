import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserPlan } from "@/lib/supabase/subscription";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ plan: "free" });

  return NextResponse.json({ plan: await getUserPlan(userId) });
}

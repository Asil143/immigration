import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Temporary debug endpoint — remove after confirming setup works
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let userEmail = null;
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    userEmail = user.emailAddresses[0]?.emailAddress;
  } catch (e) {
    userEmail = `error: ${e}`;
  }

  const supabase = createAdminClient();
  const { data: submissions, error } = await supabase
    .from("payment_submissions")
    .select("id, email, plan_name, amount, status, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    userId,
    userEmail,
    isAdmin: userEmail === "kamepalliasil143@gmail.com",
    submissionsInDb: submissions ?? [],
    dbError: error?.message ?? null,
  });
}

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

async function fetchUSCISStatus(receiptNumber: string): Promise<string> {
  const url = "https://egov.uscis.gov/casestatus/mycasestatus.do";
  const body = new URLSearchParams({
    appReceiptNum: receiptNumber,
    caseStatusSearchBtn: "CHECK STATUS",
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (compatible; VisaPilot/1.0)",
    },
    body: body.toString(),
  });

  const html = await res.text();

  // Extract status from the USCIS response HTML
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (match) {
    const status = match[1].replace(/<[^>]+>/g, "").trim();
    if (status && status.length > 2) return status;
  }

  // Fallback: look for common status phrases
  if (html.includes("Case Was Approved")) return "Case Was Approved";
  if (html.includes("Card Was Mailed")) return "Card Was Mailed To Me";
  if (html.includes("Case Was Received")) return "Case Was Received";
  if (html.includes("Request for Evidence")) return "Request for Evidence Was Sent";
  if (html.includes("Case Was Transferred")) return "Case Was Transferred";
  if (html.includes("Case Was Denied")) return "Case Was Denied";
  if (html.includes("Case Was Rejected")) return "Case Was Rejected";
  if (html.includes("Fingerprint Fee")) return "Fingerprint Fee Was Received";
  if (html.includes("Interview")) return "Interview Was Scheduled";

  return "Unable to retrieve status";
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, receipt_number } = await req.json();

  let status = "Unable to retrieve status";
  try {
    status = await fetchUSCISStatus(receipt_number);
  } catch {
    status = "Unable to retrieve status";
  }

  const supabase = createAdminClient();
  await supabase
    .from("monitored_cases")
    .update({
      last_status: status,
      last_checked_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("clerk_id", userId);

  return NextResponse.json({ status });
}

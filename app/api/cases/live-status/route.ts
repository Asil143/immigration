import { NextRequest, NextResponse } from "next/server";

const USCIS_URL = "https://egov.uscis.gov/casestatus/mycasestatus.do";

function parseUSCISResponse(html: string): { status: string; description: string; valid: boolean } {
  // USCIS returns status in: <div class="rows text-center"><h1>STATUS</h1><p>DESCRIPTION</p></div>
  const h1Match = html.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/i);
  const pMatch = html.match(/<div[^>]*class="[^"]*rows[^"]*"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);

  const rawStatus = h1Match ? h1Match[1].replace(/<[^>]+>/g, "").trim() : "";
  const rawDesc = pMatch ? pMatch[1].replace(/<[^>]+>/g, "").trim() : "";

  if (!rawStatus || rawStatus.toLowerCase().includes("invalid")) {
    return { status: "Invalid Receipt Number", description: "Please check your receipt number and try again.", valid: false };
  }

  return { status: rawStatus, description: rawDesc, valid: true };
}

export async function GET(req: NextRequest) {
  const receipt = req.nextUrl.searchParams.get("receipt")?.trim().toUpperCase().replace(/\s/g, "");
  if (!receipt) return NextResponse.json({ error: "Receipt number required" }, { status: 400 });

  // Basic receipt number validation: 3 letters + 10 digits
  if (!/^[A-Z]{3}\d{10}$/.test(receipt)) {
    return NextResponse.json({
      status: "Invalid format",
      description: "Receipt numbers are 3 letters followed by 10 digits (e.g. IOE0912345678).",
      valid: false,
    });
  }

  try {
    const res = await fetch(USCIS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; VisaPilot/1.0)",
        "Accept": "text/html",
        "Referer": "https://egov.uscis.gov/casestatus/landing.do",
      },
      body: new URLSearchParams({
        appReceiptNum: receipt,
        caseStatusSearchBtn: "CHECK STATUS",
      }).toString(),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`USCIS returned ${res.status}`);
    const html = await res.text();
    const result = parseUSCISResponse(html);
    return NextResponse.json({ ...result, receipt, checkedAt: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("timeout") || message.includes("abort")) {
      return NextResponse.json({ error: "USCIS is taking too long to respond. Try again in a moment." }, { status: 504 });
    }
    return NextResponse.json({ error: "Could not reach USCIS. Try again or check uscis.gov directly." }, { status: 502 });
  }
}

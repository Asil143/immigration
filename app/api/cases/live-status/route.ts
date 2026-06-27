import { NextRequest, NextResponse } from "next/server";

const USCIS_URL = "https://egov.uscis.gov/casestatus/mycasestatus.do";

// Vercel hobby plan: 10s function timeout — keep fetch under 8s
const FETCH_TIMEOUT_MS = 7000;

function parseUSCISResponse(html: string): { status: string; description: string; valid: boolean } {
  // USCIS wraps the result in <div class="rows text-center"><h1>...</h1><p>...</p></div>
  const h1Match = html.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/i);
  const pMatch = html.match(/<div[^>]*class="[^"]*rows[^"]*"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);

  const rawStatus = h1Match ? h1Match[1].replace(/<[^>]+>/g, "").trim() : "";
  const rawDesc = pMatch ? pMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";

  if (!rawStatus || rawStatus.toLowerCase().includes("invalid") || rawStatus.toLowerCase().includes("error")) {
    return { status: "Invalid Receipt Number", description: "Please double-check your receipt number and try again.", valid: false };
  }

  return { status: rawStatus, description: rawDesc || "No description available.", valid: true };
}

export async function GET(req: NextRequest) {
  const receipt = req.nextUrl.searchParams.get("receipt")?.trim().toUpperCase().replace(/\s/g, "") ?? "";

  if (!receipt) {
    return NextResponse.json({ status: "Error", description: "Receipt number required.", valid: false, receipt: "", checkedAt: new Date().toISOString() });
  }

  if (!/^[A-Z]{3}\d{10}$/.test(receipt)) {
    return NextResponse.json({
      status: "Invalid format",
      description: "Receipt numbers are 3 letters followed by 10 digits — e.g. IOE0912345678, WAC2512345678.",
      valid: false,
      receipt,
      checkedAt: new Date().toISOString(),
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(USCIS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://egov.uscis.gov/casestatus/landing.do",
        "Origin": "https://egov.uscis.gov",
      },
      body: new URLSearchParams({
        appReceiptNum: receipt,
        caseStatusSearchBtn: "CHECK STATUS",
      }).toString(),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json({
        status: "USCIS Unavailable",
        description: `USCIS returned an error (HTTP ${res.status}). Please try again or check egov.uscis.gov directly.`,
        valid: false,
        receipt,
        checkedAt: new Date().toISOString(),
      });
    }

    const html = await res.text();
    const result = parseUSCISResponse(html);
    return NextResponse.json({ ...result, receipt, checkedAt: new Date().toISOString() });

  } catch (err) {
    clearTimeout(timer);
    const isAbort = err instanceof Error && (err.name === "AbortError" || err.message.includes("abort"));
    return NextResponse.json({
      status: isAbort ? "Timeout" : "Connection Error",
      description: isAbort
        ? "USCIS took too long to respond. Try again in a moment or check egov.uscis.gov directly."
        : "Could not connect to USCIS. Check your connection or visit egov.uscis.gov directly.",
      valid: false,
      receipt,
      checkedAt: new Date().toISOString(),
    });
  }
}

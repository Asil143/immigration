import { NextRequest, NextResponse } from "next/server";

// Opens a page that auto-submits the receipt number to USCIS
export async function GET(req: NextRequest) {
  const receipt = req.nextUrl.searchParams.get("receipt") ?? "";

  const html = `<!DOCTYPE html>
<html>
<head><title>Checking USCIS status...</title></head>
<body>
  <p style="font-family:sans-serif;text-align:center;margin-top:40px;color:#64748b;">
    Opening USCIS case status for <strong>${receipt}</strong>...
  </p>
  <form id="f" action="https://egov.uscis.gov/casestatus/mycasestatus.do" method="POST">
    <input type="hidden" name="appReceiptNum" value="${receipt}" />
    <input type="hidden" name="caseStatusSearchBtn" value="CHECK STATUS" />
  </form>
  <script>document.getElementById('f').submit();</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, CheckCircle2, Clock, AlertCircle, RefreshCw, ExternalLink, History } from "lucide-react";

const MOCK_RESULTS: Record<string, {
  receipt: string; form: string; title: string; status: string;
  detail: string; last_updated: string; field_office: string; type: "approved" | "pending" | "notice";
}> = {
  "IOE0912345678": {
    receipt: "IOE0912345678", form: "I-765", title: "Application for Employment Authorization",
    status: "Card Was Delivered To Me By The Post Office",
    detail: "On May 23, 2025, USPS delivered your new card ending in 3456. If you did not receive your card, please call USCIS at 1-800-375-5283.",
    last_updated: "May 23, 2025", field_office: "Nebraska Service Center", type: "approved",
  },
  "WAC2512345678": {
    receipt: "WAC2512345678", form: "I-129", title: "Petition for Nonimmigrant Worker (H-1B)",
    status: "Request for Evidence Was Sent",
    detail: "On May 10, 2025, we mailed you a notice requesting additional evidence for your I-129. Please respond by July 10, 2025.",
    last_updated: "May 10, 2025", field_office: "California Service Center", type: "notice",
  },
  "MSC2512345678": {
    receipt: "MSC2512345678", form: "I-140", title: "Immigrant Petition for Alien Workers (EB-2 NIW)",
    status: "Case Is Being Actively Reviewed By USCIS",
    detail: "As of May 27, 2025, we are actively reviewing your Form I-140. We will mail you a decision or send you a notice requesting more information.",
    last_updated: "May 27, 2025", field_office: "Nebraska Service Center", type: "pending",
  },
};

const RECENT_CHECKS = [
  { receipt: "IOE0912345678", form: "I-765", status: "Approved", date: "Today" },
  { receipt: "WAC2512345678", form: "I-129", status: "RFE Sent", date: "Yesterday" },
];

export default function CaseStatusPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<typeof MOCK_RESULTS[string] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  function check() {
    setLoading(true);
    setNotFound(false);
    setTimeout(() => {
      const r = MOCK_RESULTS[input.toUpperCase().replace(/\s/g, "")];
      if (r) { setResult(r); }
      else { setResult(null); setNotFound(true); }
      setLoading(false);
    }, 800);
  }

  const statusIcon = result?.type === "approved" ? CheckCircle2 : result?.type === "notice" ? AlertCircle : Clock;
  const statusColor = result?.type === "approved" ? "text-green-600 bg-green-50" : result?.type === "notice" ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50";
  const badgeVariant = result?.type === "approved" ? "success" : result?.type === "notice" ? "warning" : "info";

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">USCIS Case Status</h1>
        </div>
        <p className="text-muted-foreground">Enter your receipt number to check your case status</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && check()}
              placeholder="e.g. IOE0912345678, WAC2512345678..."
              className="font-mono text-sm flex-1"
            />
            <Button onClick={check} disabled={!input.trim() || loading}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Check</span>
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.keys(MOCK_RESULTS).map(r => (
              <button key={r} onClick={() => { setInput(r); }} className="text-xs text-primary hover:underline font-mono bg-primary/5 px-2 py-0.5 rounded">
                Try: {r}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className={`rounded-xl p-3 ${statusColor}`}>
                {result.type === "approved" ? (
                  <CheckCircle2 className="h-7 w-7" />
                ) : result.type === "notice" ? (
                  <AlertCircle className="h-7 w-7" />
                ) : (
                  <Clock className="h-7 w-7" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">{result.receipt}</p>
                    <p className="font-bold mt-0.5">{result.title}</p>
                    <Badge variant={badgeVariant} className="mt-1.5 text-xs">{result.form}</Badge>
                  </div>
                  <Badge variant={badgeVariant}>{result.type === "approved" ? "Approved" : result.type === "notice" ? "Action Required" : "In Progress"}</Badge>
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 p-3">
                  <p className="font-semibold text-sm">{result.status}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-5">{result.detail}</p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last updated: {result.last_updated}</span>
                  <span>{result.field_office}</span>
                </div>
              </div>
            </div>

            <Separator className="my-4" />
            <div className="flex gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href="https://egov.uscis.gov/casestatus/landing.do" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Verify on USCIS.gov
                </a>
              </Button>
              {result.type === "notice" && (
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <AlertCircle className="mr-2 h-4 w-4" /> Get RFE Help
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {notFound && (
        <Card className="mb-6 border-dashed">
          <CardContent className="p-5 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="font-medium">Receipt number not found</p>
            <p className="text-sm text-muted-foreground mt-1">Try entering it exactly as shown on your I-797 notice (e.g. IOE0912345678)</p>
          </CardContent>
        </Card>
      )}

      {/* Recent checks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="h-4 w-4" /> Recent Lookups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {RECENT_CHECKS.map(c => (
            <button key={c.receipt} onClick={() => setInput(c.receipt)} className="w-full flex items-center justify-between text-sm rounded-lg border px-3 py-2 hover:bg-accent text-left">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{c.receipt}</span>
                <Badge variant="outline" className="text-xs">{c.form}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{c.status}</span>
                <span>·</span>
                <span>{c.date}</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

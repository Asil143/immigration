"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, ExternalLink, History, Loader2, CheckCircle2,
  AlertCircle, Clock, RefreshCw, ChevronRight,
} from "lucide-react";
import { GuestPreviewBanner } from "@/components/ui/guest-preview-banner";

interface VisaCase {
  id: string;
  visa_type: string;
  title: string;
  status: string;
  receipt_number: string | null;
}

interface LiveResult {
  receipt: string;
  status: string;
  description: string;
  valid: boolean;
  checkedAt: string;
  error?: string;
}

const DEMO_CASES: VisaCase[] = [
  { id: "1", visa_type: "H-1B", title: "H-1B Petition — Software Engineer", status: "Approved", receipt_number: "WAC2512345678" },
  { id: "2", visa_type: "EAD", title: "OPT Employment Authorization", status: "Case Was Received", receipt_number: "IOE0987654321" },
  { id: "3", visa_type: "I-140", title: "EB-2 Immigrant Petition", status: "Initial Review", receipt_number: "LIN2498765432" },
];

function statusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("approved") || s.includes("issued") || s.includes("mailed") || s.includes("delivered")) return "bg-green-100 text-green-800 border-green-200";
  if (s.includes("denied") || s.includes("rejected") || s.includes("invalid") || s.includes("terminated")) return "bg-red-100 text-red-800 border-red-200";
  if (s.includes("rfe") || s.includes("noid") || s.includes("intent to deny") || s.includes("additional")) return "bg-orange-100 text-orange-800 border-orange-200";
  if (s.includes("transferred") || s.includes("reopened") || s.includes("withdrawn")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-blue-100 text-blue-800 border-blue-200";
}

function statusIcon(status: string) {
  const s = status.toLowerCase();
  if (s.includes("approved") || s.includes("issued") || s.includes("mailed") || s.includes("delivered"))
    return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  if (s.includes("denied") || s.includes("rejected") || s.includes("invalid"))
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  if (s.includes("rfe") || s.includes("intent"))
    return <AlertCircle className="h-5 w-5 text-orange-500" />;
  return <Clock className="h-5 w-5 text-blue-500" />;
}

export default function CaseStatusPage() {
  const { isSignedIn } = useUser();
  const [input, setInput] = useState("");
  const [cases, setCases] = useState<VisaCase[]>([]);
  const [result, setResult] = useState<LiveResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<LiveResult[]>([]);

  useEffect(() => {
    if (!isSignedIn) { setCases(DEMO_CASES); return; }
    fetch("/api/visa-cases")
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setCases(data); });
  }, [isSignedIn]);

  async function checkStatus(receipt?: string) {
    const num = (receipt ?? input).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!num) return;
    setInput(num);
    setLoading(true);
    setResult(null);

    const fallback: LiveResult = {
      receipt: num,
      status: "Error",
      description: "Could not reach USCIS. Try again or check egov.uscis.gov directly.",
      valid: false,
      checkedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`/api/cases/live-status?receipt=${encodeURIComponent(num)}`);
      let data: LiveResult;
      try {
        data = await res.json();
        // Ensure all required fields are present
        if (!data.receipt) data.receipt = num;
        if (!data.checkedAt) data.checkedAt = new Date().toISOString();
        if (!data.status) data.status = "Unknown";
        if (data.description === undefined) data.description = "";
        if (data.valid === undefined) data.valid = false;
      } catch {
        data = fallback;
      }
      setResult(data);
      if (data.valid) {
        setHistory(prev => [data, ...prev.filter(h => h.receipt !== num)].slice(0, 10));
      }
    } catch {
      setResult(fallback);
    } finally {
      setLoading(false);
    }
  }

  const casesWithReceipt = cases.filter(c => c.receipt_number);
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">USCIS Case Status</h1>
        </div>
        <p className="text-muted-foreground text-sm">Live status lookup — results pulled directly from USCIS</p>
      </div>

      {!isSignedIn && (
        <GuestPreviewBanner
          title="Sign in to track your real cases"
          description="You're seeing sample cases. Sign in to add your receipt numbers and track your actual USCIS cases."
        />
      )}

      {/* Search */}
      <Card className="mb-5">
        <CardContent className="p-5">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={e => setInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
              onKeyDown={e => e.key === "Enter" && checkStatus()}
              placeholder="e.g. IOE0912345678"
              className="font-mono text-sm flex-1"
              maxLength={13}
            />
            <Button onClick={() => checkStatus()} disabled={!input.trim() || loading} className="shrink-0">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              {loading ? "Checking…" : "Check Status"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Format: 3 letters + 10 digits &nbsp;·&nbsp; e.g. IOE, WAC, EAC, LIN, SRC, NBC
          </p>
        </CardContent>
      </Card>

      {/* Live result */}
      {result && (
        <Card className={`mb-5 border ${result.valid ? "border-l-4 border-l-primary" : "border-red-200"}`}>
          <CardContent className="p-5">
            <div className="flex items-start gap-3 mb-3">
              {statusIcon(result.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${statusColor(result.status)}`}>
                    {result.status}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{result.receipt}</span>
                </div>
              </div>
              <button onClick={() => checkStatus(result.receipt)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0" title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            {result.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{result.description}</p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
              <span>Checked at {fmtTime(result.checkedAt)}</span>
              <a
                href={`/api/cases/uscis-redirect?receipt=${result.receipt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                View on USCIS.gov <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved cases */}
      {casesWithReceipt.length > 0 && (
        <Card className="mb-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="h-4 w-4" />
              {isSignedIn ? "Your Cases" : "Sample Cases"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {casesWithReceipt.map(c => (
              <button
                key={c.id}
                onClick={() => checkStatus(c.receipt_number!)}
                className="w-full flex items-center gap-3 text-sm rounded-lg border px-3 py-2.5 hover:bg-accent text-left transition-colors group"
              >
                <span className="font-mono text-xs text-muted-foreground shrink-0">{c.receipt_number}</span>
                <Badge variant="outline" className="text-xs shrink-0">{c.visa_type}</Badge>
                <span className="text-xs text-muted-foreground truncate flex-1">{c.title}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Session history */}
      {history.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent lookups this session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 pt-0">
            {history.map(h => (
              <button
                key={h.receipt}
                onClick={() => { setInput(h.receipt); setResult(h); }}
                className="w-full flex items-center justify-between text-xs rounded-lg px-3 py-2 hover:bg-accent text-left transition-colors"
              >
                <span className="font-mono text-muted-foreground">{h.receipt}</span>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColor(h.status)}`}>
                  {h.status}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Footer note */}
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Status data is fetched live from USCIS at the time of lookup. Processing times may differ from published averages.
      </p>
    </div>
  );
}

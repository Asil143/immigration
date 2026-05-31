"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, History, FolderOpen, Copy, CheckCircle2 } from "lucide-react";
import { GuestPreviewBanner } from "@/components/ui/guest-preview-banner";

interface VisaCase {
  id: string;
  visa_type: string;
  title: string;
  status: string;
  receipt_number: string | null;
}

const DEMO_CASES: VisaCase[] = [
  { id: "1", visa_type: "H-1B", title: "H-1B Petition — Software Engineer", status: "Approved", receipt_number: "WAC2512345678" },
  { id: "2", visa_type: "EAD", title: "OPT Employment Authorization", status: "Case Received", receipt_number: "IOE0987654321" },
  { id: "3", visa_type: "I-140", title: "EB-2 Immigrant Petition", status: "Initial Review", receipt_number: "LIN2498765432" },
];

export default function CaseStatusPage() {
  const { isSignedIn } = useUser();
  const [input, setInput] = useState("");
  const [cases, setCases] = useState<VisaCase[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setCases(DEMO_CASES);
      return;
    }
    fetch("/api/visa-cases")
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setCases(data); });
  }, [isSignedIn]);

  function openUSCIS() {
    const receipt = input.trim().toUpperCase().replace(/\s/g, "");
    if (!receipt) return;
    navigator.clipboard.writeText(receipt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    window.open("https://egov.uscis.gov/casestatus/landing.do", "_blank", "noopener");
  }

  const casesWithReceipt = cases.filter(c => c.receipt_number);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">USCIS Case Status</h1>
        </div>
        <p className="text-muted-foreground">Check your case status directly on USCIS.gov</p>
      </div>

      {!isSignedIn && (
        <GuestPreviewBanner
          title="Sign in to track your real cases"
          description="You're seeing sample cases. Sign in to add your receipt numbers and track your actual USCIS cases."
        />
      )}

      <Card className="mb-6">
        <CardContent className="p-5 space-y-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={e => setInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && openUSCIS()}
              placeholder="e.g. IOE0912345678, WAC2512345678..."
              className="font-mono text-sm flex-1"
            />
            <Button onClick={openUSCIS} disabled={!input.trim()}>
              {copied ? <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> : <ExternalLink className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Check on USCIS"}
            </Button>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
            Your receipt number will be copied to clipboard and USCIS.gov will open — just paste it in the search box.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            {isSignedIn ? "Your Cases" : "Sample Cases — Preview"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {casesWithReceipt.map(c => (
            <button
              key={c.id}
              onClick={() => setInput(c.receipt_number!)}
              className="w-full flex items-center justify-between text-sm rounded-lg border px-3 py-2 hover:bg-accent text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{c.receipt_number}</span>
                <Badge variant="outline" className="text-xs">{c.visa_type}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground truncate max-w-[160px]">{c.title}</span>
                <Badge variant="secondary" className="text-[10px]">{c.status}</Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

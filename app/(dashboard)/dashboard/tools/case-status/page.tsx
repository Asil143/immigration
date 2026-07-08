"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, History, Info, ChevronRight } from "lucide-react";
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
  { id: "2", visa_type: "EAD", title: "OPT Employment Authorization", status: "Case Was Received", receipt_number: "IOE0987654321" },
  { id: "3", visa_type: "I-140", title: "EB-2 Immigrant Petition", status: "Initial Review", receipt_number: "LIN2498765432" },
];

const SERVICE_CENTERS: Record<string, string> = {
  WAC: "California SC", EAC: "Vermont SC", LIN: "Nebraska SC",
  SRC: "Texas SC", MSC: "Missouri (NBC)", IOE: "ELIS (Online)",
  NBC: "National Benefits Center", TSC: "Texas SC",
};

function formatReceipt(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 13);
}

function validateReceipt(r: string): string | null {
  if (!r) return null;
  if (!/^[A-Z]{3}\d{10}$/.test(r)) return "Must be 3 letters + 10 digits (e.g. IOE0912345678)";
  return null;
}

export default function CaseStatusPage() {
  const { isSignedIn } = useUser();
  const [input, setInput] = useState("");
  const [cases, setCases] = useState<VisaCase[]>([]);

  useEffect(() => {
    if (!isSignedIn) { Promise.resolve().then(() => setCases(DEMO_CASES)); return; }
    fetch("/api/visa-cases")
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setCases(data); });
  }, [isSignedIn]);

  function openUSCIS(receipt?: string) {
    const num = (receipt ?? input).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!num || validateReceipt(num)) return;
    window.open(`/api/cases/uscis-redirect?receipt=${num}`, "_blank", "noopener,noreferrer");
  }

  const validationError = validateReceipt(input);
  const sc = input.length >= 3 ? SERVICE_CENTERS[input.slice(0, 3)] : null;
  const casesWithReceipt = cases.filter(c => c.receipt_number);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">USCIS Case Status</h1>
        </div>
        <p className="text-muted-foreground text-sm">Enter your receipt number — we open USCIS.gov with it pre-filled</p>
      </div>

      {!isSignedIn && (
        <GuestPreviewBanner
          title="Sign in to track your real cases"
          description="You're seeing sample cases. Sign in to add your receipt numbers and track your actual USCIS cases."
        />
      )}

      {/* Search */}
      <Card className="mb-5">
        <CardContent className="p-5 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <Input
                value={input}
                onChange={e => setInput(formatReceipt(e.target.value))}
                onKeyDown={e => e.key === "Enter" && openUSCIS()}
                placeholder="e.g. IOE0912345678"
                className={`font-mono text-sm ${validationError && input.length > 0 ? "border-red-400" : ""}`}
                maxLength={13}
              />
              {input.length > 0 && validationError && (
                <p className="text-xs text-red-500">{validationError}</p>
              )}
              {sc && !validationError && (
                <p className="text-xs text-muted-foreground">Service Center: <strong>{sc}</strong></p>
              )}
            </div>
            <Button
              onClick={() => openUSCIS()}
              disabled={!input || !!validationError}
              className="shrink-0"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Check on USCIS
            </Button>
          </div>

          {/* How it works */}
          <div className="flex gap-2.5 rounded-lg bg-blue-50 border border-blue-100 px-3.5 py-3 text-xs text-blue-800">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-500" />
            <span>
              USCIS requires requests to come from a real browser — we open USCIS.gov in a new tab with your receipt number pre-submitted so you see your status immediately.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Receipt format guide */}
      <Card className="mb-5">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm">Receipt Number Format</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(SERVICE_CENTERS).map(([code, name]) => (
              <div key={code} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono font-bold text-foreground w-8">{code}</span>
                <span>{name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 border-t pt-3">
            Format: <span className="font-mono font-medium">WAC2512345678</span> — 3-letter SC code + 10 digits. Find it on your I-797 Notice of Action.
          </p>
        </CardContent>
      </Card>

      {/* Saved cases */}
      {casesWithReceipt.length > 0 && (
        <Card>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="h-4 w-4" />
              {isSignedIn ? "Your Cases — Quick Check" : "Sample Cases"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {casesWithReceipt.map(c => (
              <button
                key={c.id}
                onClick={() => openUSCIS(c.receipt_number!)}
                className="w-full flex items-center gap-3 text-sm rounded-lg border px-3 py-2.5 hover:bg-accent text-left transition-colors group"
              >
                <span className="font-mono text-xs text-muted-foreground shrink-0">{c.receipt_number}</span>
                <Badge variant="outline" className="text-xs shrink-0">{c.visa_type}</Badge>
                <span className="text-xs text-muted-foreground truncate flex-1">{c.title}</span>
                <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

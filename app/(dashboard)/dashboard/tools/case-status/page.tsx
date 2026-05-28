"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, History, FolderOpen, Copy, CheckCircle2 } from "lucide-react";

interface VisaCase {
  id: string;
  visa_type: string;
  title: string;
  status: string;
  receipt_number: string | null;
}

export default function CaseStatusPage() {
  const [input, setInput] = useState("");
  const [cases, setCases] = useState<VisaCase[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/visa-cases")
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setCases(data); });
  }, []);

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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">USCIS Case Status</h1>
        </div>
        <p className="text-muted-foreground">Check your case status directly on USCIS.gov</p>
      </div>

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

      {/* Cases from profile */}
      {casesWithReceipt.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="h-4 w-4" /> Your Cases
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
                <span className="text-xs text-muted-foreground truncate max-w-[160px]">{c.title}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {casesWithReceipt.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <FolderOpen className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-muted-foreground">No saved cases with receipt numbers</p>
            <p className="text-xs text-muted-foreground mt-1">Add cases with receipt numbers in My Cases to see them here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

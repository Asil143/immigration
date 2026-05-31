"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle, Sparkles, CheckCircle2, Circle, ChevronDown,
  ChevronRight, FileText, Copy, Download, Info, Clock, AlertCircle,
} from "lucide-react";

const SAMPLE_RFE = `USCIS — California Service Center
Form I-129, Petition for H-1B Nonimmigrant Worker
Receipt: WAC2512345678

REQUEST FOR EVIDENCE

Issue 1: Specialty Occupation
The evidence submitted does not sufficiently establish that the proffered position qualifies as a specialty occupation under 8 C.F.R. §214.2(h)(4)(ii). The position of "Software Engineer" as described does not demonstrate that a bachelor's degree in a specific specialty is normally required for the position.

Issue 2: Employer-Employee Relationship
The documentation submitted does not sufficiently demonstrate that the petitioner will maintain a valid employer-employee relationship with the beneficiary throughout the period of the requested H-1B status, particularly as it relates to control and supervision.

Issue 3: Specialty Degree Requirement
The evidence does not establish that the proffered position requires the theoretical and practical application of highly specialized knowledge typically acquired through the attainment of a bachelor's or higher degree in a specific specialty.

You must respond to this notice within 87 days from the date of this notice.`;

interface RFEIssue {
  title: string;
  description: string;
  checklist: string[];
  sampleResponse: string;
  resolved: boolean;
}

interface RFEAnalysis {
  issueCount: number;
  deadline: string;
  visaType: string;
  issues: RFEIssue[];
}

export default function RFEAssistantPage() {
  const [step, setStep] = useState<"paste" | "analyze" | "response">("paste");
  const [rfeText, setRfeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RFEAnalysis | null>(null);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [copied, setCopied] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/rfe-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis({ ...data, issues: data.issues.map((i: Omit<RFEIssue, "resolved">) => ({ ...i, resolved: false })) });
      setStep("analyze");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  function toggleResolved(idx: number) {
    if (!analysis) return;
    setAnalysis({
      ...analysis,
      issues: analysis.issues.map((iss, i) => i === idx ? { ...iss, resolved: !iss.resolved } : iss),
    });
  }

  function handleCopy(idx: number) {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.issues[idx].sampleResponse);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  const resolvedCount = analysis?.issues.filter((i) => i.resolved).length ?? 0;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold">RFE Response Assistant</h1>
          <Badge variant="warning" className="text-xs">Pro</Badge>
        </div>
        <p className="text-muted-foreground">
          Paste your USCIS Request for Evidence — Claude AI will break it down and draft your response
        </p>
      </div>

      {/* Step 1: Paste */}
      {step === "paste" && (
        <div>
          <Card className="mb-4">
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Paste your RFE notice</p>
                <Textarea
                  value={rfeText}
                  onChange={(e) => setRfeText(e.target.value)}
                  placeholder="Paste the full text from your USCIS Request for Evidence notice here..."
                  rows={12}
                  className="font-mono text-xs"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setRfeText(SAMPLE_RFE)}
                  className="text-xs text-primary hover:underline"
                >
                  Try sample RFE (H-1B)
                </button>
                <Button onClick={handleAnalyze} disabled={!rfeText.trim() || analyzing}>
                  {analyzing ? (
                    <><Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Analyzing with AI…</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Analyze RFE</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">What Claude will do</p>
              <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs text-blue-700">
                <li>Identify each distinct issue in your RFE</li>
                <li>Generate a specific evidence checklist for each issue</li>
                <li>Draft a professional response framework for each issue</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Analysis */}
      {step === "analyze" && analysis && (
        <div>
          {/* Summary bar */}
          <Card className="mb-5 border-orange-200 bg-orange-50/50">
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">
                    {analysis.issueCount} Issue{analysis.issueCount !== 1 ? "s" : ""} Identified
                    {analysis.visaType && <span className="ml-2 font-normal text-muted-foreground">· {analysis.visaType}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{resolvedCount} of {analysis.issues.length} addressed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{analysis.deadline}</span>
                </div>
                <Button size="sm" onClick={() => setStep("response")}>
                  <FileText className="mr-2 h-4 w-4" /> Build Full Response
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          <div className="space-y-3">
            {analysis.issues.map((issue, idx) => (
              <Card key={idx} className={issue.resolved ? "opacity-60" : ""}>
                <button className="w-full" onClick={() => setExpanded(expanded === idx ? null : idx)}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleResolved(idx); }}
                          className="shrink-0"
                        >
                          {issue.resolved
                            ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                            : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />}
                        </button>
                        <div className="text-left">
                          <p className="font-semibold text-sm">{issue.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${expanded === idx ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                </button>

                {expanded === idx && (
                  <CardContent className="px-4 pb-4 pt-0">
                    <Separator className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Evidence Checklist</p>
                        <ul className="space-y-2">
                          {issue.checklist.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Draft Response</p>
                          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleCopy(idx)}>
                            <Copy className="h-3 w-3 mr-1" />
                            {copied === idx ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-50 rounded-lg p-3 leading-5 max-h-48 overflow-y-auto text-muted-foreground">
                          {issue.sampleResponse}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => { setStep("paste"); setAnalysis(null); }}>
              Paste New RFE
            </Button>
            <Button onClick={() => setStep("response")}>
              <Download className="mr-2 h-4 w-4" /> Export Full Response Package
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Full response */}
      {step === "response" && analysis && (
        <div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Full Response Package Ready
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-5 space-y-3">
              {analysis.issues.map((issue, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{issue.title}</p>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleCopy(i)}>
                      <Copy className="h-3 w-3 mr-1.5" /> {copied === i ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-50 rounded-lg p-3 leading-5 text-muted-foreground">
                    {issue.sampleResponse}
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            <p className="font-semibold">Attorney Review Required</p>
            <p className="mt-1 text-xs text-yellow-700">
              This AI-generated draft must be reviewed and finalized by a licensed immigration attorney before
              submission. RFE responses have strict deadlines — typically 87 days.
            </p>
          </div>

          <Button variant="outline" className="mt-4" onClick={() => setStep("analyze")}>
            ← Back to Issues
          </Button>
        </div>
      )}
    </div>
  );
}

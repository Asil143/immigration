"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Sparkles, CheckCircle2, Circle, ChevronDown, ChevronRight, FileText, Copy, Download, Info, Clock } from "lucide-react";

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

const MOCK_ANALYSIS: RFEIssue[] = [
  {
    title: "Issue 1: Specialty Occupation",
    description: "USCIS is questioning whether your Software Engineer position qualifies as a specialty occupation requiring a specific degree.",
    checklist: [
      "Provide a detailed position description listing specific duties (at least 1 full page)",
      "Include industry wage survey data (e.g., OES, DOL) showing bachelor's degree requirement",
      "Obtain an expert opinion letter from an occupational expert",
      "Provide job postings for similar positions at other companies showing degree requirements",
      "Submit organizational chart showing where the position fits",
      "Attach Occupational Outlook Handbook excerpt for Software Developers",
    ],
    sampleResponse: `Regarding Issue 1 — Specialty Occupation:\n\nThe proffered position of Software Engineer (SOC 15-1252) qualifies as a specialty occupation under INA 214(i)(1) and 8 C.F.R. §214.2(h)(4)(ii) for the following reasons:\n\n1. The position normally requires a minimum of a bachelor's degree in Computer Science, Software Engineering, or a closely related technical field...\n\n[Continue with specific evidence citations]`,
    resolved: false,
  },
  {
    title: "Issue 2: Employer-Employee Relationship",
    description: "USCIS needs evidence that you maintain control and supervision over the beneficiary's work, especially important for consulting or third-party placement arrangements.",
    checklist: [
      "Provide signed MSA/SOW with end client (redact confidential terms)",
      "Submit organizational charts for both petitioner and end client",
      "Provide itinerary/work schedule showing petitioner's oversight",
      "Explain day-to-day control: performance reviews, timesheet approval, HR policies",
      "Attach offer letter, employee handbook, and benefits documentation",
      "Submit W-2s or pay stubs showing payroll relationship",
    ],
    sampleResponse: `Regarding Issue 2 — Employer-Employee Relationship:\n\nThe Petitioner maintains a bona fide employer-employee relationship with the Beneficiary as evidenced by the following:\n\n1. The Petitioner retains the right to control the Beneficiary's work by [specific methods]...\n\n[Continue with supporting documentation list]`,
    resolved: false,
  },
  {
    title: "Issue 3: Specialty Degree Requirement",
    description: "USCIS wants more evidence that your position specifically requires a bachelor's degree in a related field — not just a general degree.",
    checklist: [
      "Document that the degree field directly relates to the position duties",
      "Submit the beneficiary's official transcripts and degree evaluation (if foreign)",
      "Provide course descriptions showing how education relates to job duties",
      "Include employer's written explanation of why specific degree is required",
      "Attach at least 3 similar job postings from other employers in the industry",
    ],
    sampleResponse: `Regarding Issue 3 — Specialty Degree Requirement:\n\nThe Petitioner requires a bachelor's degree in Computer Science (or a directly related field) for the following specific reasons tied to the position's duties:\n\n1. The position requires applying theoretical principles of algorithms and data structures, which are covered specifically in computer science curricula...\n\n[Continue with degree-duty mapping]`,
    resolved: false,
  },
];

export default function RFEAssistantPage() {
  const [step, setStep] = useState<"paste" | "analyze" | "response">("paste");
  const [rfeText, setRfeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [issues, setIssues] = useState<RFEIssue[]>([]);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [copied, setCopied] = useState<number | null>(null);

  function handleAnalyze() {
    setAnalyzing(true);
    setTimeout(() => {
      setIssues(MOCK_ANALYSIS.map(i => ({ ...i })));
      setAnalyzing(false);
      setStep("analyze");
    }, 2000);
  }

  function toggleResolved(idx: number) {
    setIssues(prev => prev.map((iss, i) => i === idx ? { ...iss, resolved: !iss.resolved } : iss));
  }

  function handleCopy(idx: number) {
    navigator.clipboard.writeText(issues[idx].sampleResponse);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  const resolvedCount = issues.filter(i => i.resolved).length;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold">RFE Response Assistant</h1>
          <Badge variant="warning" className="text-xs">Pro</Badge>
        </div>
        <p className="text-muted-foreground">Paste your USCIS Request for Evidence — we&apos;ll break it down and draft your response</p>
      </div>

      {step === "paste" && (
        <div>
          <Card className="mb-4">
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Paste your RFE notice</p>
                <Textarea
                  value={rfeText}
                  onChange={e => setRfeText(e.target.value)}
                  placeholder="Paste the full text from your USCIS Request for Evidence notice here..."
                  rows={12}
                  className="font-mono text-xs"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setRfeText(SAMPLE_RFE)}
                  className="text-xs text-primary hover:underline"
                >
                  Try sample RFE (H-1B)
                </button>
                <Button onClick={handleAnalyze} disabled={!rfeText.trim() || analyzing}>
                  {analyzing ? (
                    <><Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Analyzing…</>
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
              <p className="font-semibold">What happens next</p>
              <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs text-blue-700">
                <li>AI identifies each distinct issue in your RFE</li>
                <li>Generates a checklist of documents and evidence to gather</li>
                <li>Drafts a response for each issue you can customize</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {step === "analyze" && issues.length > 0 && (
        <div>
          {/* Summary bar */}
          <Card className="mb-5 border-orange-200 bg-orange-50/50">
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">{issues.length} Issues Identified</p>
                  <p className="text-xs text-muted-foreground">{resolvedCount} of {issues.length} addressed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>87-day deadline</span>
                </div>
                <Button size="sm" onClick={() => setStep("response")}>
                  <FileText className="mr-2 h-4 w-4" /> Build Full Response
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          <div className="space-y-3">
            {issues.map((issue, idx) => (
              <Card key={idx} className={issue.resolved ? "opacity-60" : ""}>
                <button
                  className="w-full"
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={e => { e.stopPropagation(); toggleResolved(idx); }}
                          className="shrink-0"
                        >
                          {issue.resolved
                            ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                            : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                          }
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
            <Button variant="outline" onClick={() => { setStep("paste"); setIssues([]); }}>
              Paste New RFE
            </Button>
            <Button onClick={() => setStep("response")}>
              <Download className="mr-2 h-4 w-4" /> Export Full Response Package
            </Button>
          </div>
        </div>
      )}

      {step === "response" && (
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
              {issues.map((issue, i) => (
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

              <Button className="w-full mt-2">
                <Download className="mr-2 h-4 w-4" /> Download as Word Document (.docx)
              </Button>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            <p className="font-semibold">Attorney Review Recommended</p>
            <p className="mt-1 text-xs text-yellow-700">This AI-generated draft should be reviewed by a licensed immigration attorney before submission. RFE responses have strict deadlines — typically 87 days.</p>
          </div>

          <Button variant="outline" className="mt-4" onClick={() => setStep("analyze")}>
            ← Back to Issues
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  AlertTriangle, ChevronDown, ChevronUp, Loader2, CheckCircle2,
  FileText, Shield, Clock, Lightbulb, ArrowRight, X, Lock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RFEIssue {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  response_strategy: string;
  evidence_needed: string[];
}

interface RFEAnalysis {
  summary: string;
  issues: RFEIssue[];
  response_tips: string[];
  deadline_note: string;
  attorney_recommendation: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const VISA_TYPES = [
  "H-1B Specialty Occupation", "H-1B Extension", "L-1A Intracompany Manager",
  "L-1B Specialized Knowledge", "O-1A Extraordinary Ability",
  "EB-1A Extraordinary Ability", "EB-1B Outstanding Researcher",
  "EB-2 NIW (National Interest Waiver)", "EB-2 PERM", "EB-3 Skilled Worker",
  "I-485 Adjustment of Status", "I-130 Petition", "Other",
];

const SEVERITY_CONFIG = {
  high:   { label: "High Priority",   color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  medium: { label: "Medium Priority", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  low:    { label: "Lower Priority",  color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
};

const EXAMPLE_RFE = `Dear Petitioner,

This office has reviewed the Form I-129 petition filed on behalf of the above-referenced beneficiary. The petition is requesting classification under the H-1B nonimmigrant worker category.

After careful consideration, the record does not establish eligibility as required by the applicable statute and regulations for the following reasons:

ISSUE 1: THE PROFFERED POSITION DOES NOT QUALIFY AS A SPECIALTY OCCUPATION

The evidence does not establish that the proffered position qualifies as a specialty occupation. Specifically, the job duties described appear to be general in nature and do not demonstrate that attainment of a bachelor's or higher degree (or its equivalent) in a specific specialty is the minimum entry requirement for the position.

Please provide:
- A detailed description of the specific job duties performed on a day-to-day basis
- Evidence that a bachelor's degree in a specific specialty is normally required for this position
- Industry sources showing degree requirements for similar positions`;

// ─── Issue Card ───────────────────────────────────────────────────────────────
function IssueCard({ issue, index }: { issue: RFEIssue; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const sev = SEVERITY_CONFIG[issue.severity] ?? SEVERITY_CONFIG.medium;

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: sev.border }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:opacity-90"
        style={{ background: sev.bg }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ color: sev.color, background: "white", border: `1px solid ${sev.border}` }}
          >
            {sev.label}
          </span>
          <span className="font-semibold text-slate-800 text-[14px]">{issue.title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />}
      </button>

      {open && (
        <div className="p-5 bg-white border-t space-y-4" style={{ borderColor: sev.border }}>
          <div>
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1">What USCIS is asking</p>
            <p className="text-slate-700 text-sm leading-relaxed">{issue.description}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Response Strategy</p>
            <p className="text-slate-700 text-sm leading-relaxed">{issue.response_strategy}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Evidence Needed</p>
            <ul className="space-y-1.5">
              {issue.evidence_needed.map((ev, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: sev.color }} />
                  {ev}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RFEAssistantPage() {
  const { isSignedIn } = useUser();
  const [visaType, setVisaType] = useState("");
  const [rfeText, setRfeText] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [analysis, setAnalysis] = useState<RFEAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    if (!rfeText.trim()) { setError("Please paste your RFE text."); return; }
    setLoading(true); setError(""); setAnalysis(null);
    try {
      const res = await fetch("/api/rfe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visaType, rfeText, additionalContext }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setAnalysis(data.analysis);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-14 md:py-20">
          <div className="flex items-center gap-2 text-rose-200 text-sm font-medium mb-4">
            <AlertTriangle className="h-4 w-4" /> RFE Assistant
            <span className="ml-2 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PRO</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">RFE Response Builder</h1>
          <p className="text-rose-100 text-lg max-w-xl">
            Paste your USCIS Request for Evidence and get a detailed response strategy, evidence checklist, and argument framework — instantly.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { step: "1", icon: FileText, title: "Paste your RFE", desc: "Copy the full text of the RFE you received from USCIS" },
            { step: "2", icon: Lightbulb, title: "AI analyzes it", desc: "Our AI identifies each issue and builds a response strategy" },
            { step: "3", icon: CheckCircle2, title: "Get your plan", desc: "Receive an evidence checklist and argument framework" },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 text-sm font-bold flex items-center justify-center mx-auto mb-3">
                {step}
              </div>
              <Icon className="h-5 w-5 text-slate-400 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 text-sm mb-1">{title}</h3>
              <p className="text-slate-500 text-[13px]">{desc}</p>
            </div>
          ))}
        </div>

        {!isSignedIn ? (
          /* Sign-in gate */
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <Lock className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Sign in to use the RFE Assistant</h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Create a free account to analyze your RFE and get a personalized response strategy.
            </p>
            <a
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Input form */}
            {!analysis && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h2 className="text-lg font-bold text-slate-800">Analyze Your RFE</h2>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Visa Type (optional)</label>
                  <select
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Select visa type…</option>
                    {VISA_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">RFE Text *</label>
                    <button
                      onClick={() => setRfeText(EXAMPLE_RFE)}
                      className="text-[12px] text-rose-600 font-medium hover:underline"
                    >
                      Load example
                    </button>
                  </div>
                  <textarea
                    value={rfeText}
                    onChange={(e) => setRfeText(e.target.value)}
                    placeholder="Paste the full text of your RFE here…"
                    rows={10}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Additional Context (optional)</label>
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="E.g. I am a software engineer with 5 years experience. My employer is a startup with 50 employees…"
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                    <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={analyze}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 disabled:opacity-60 transition-colors"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing your RFE…</>
                  ) : (
                    <><Lightbulb className="h-4 w-4" /> Analyze RFE</>
                  )}
                </button>

                <p className="text-center text-[12px] text-slate-400">
                  Analysis takes 10–20 seconds. Your RFE text is not stored.
                </p>
              </div>
            )}

            {/* Results */}
            {analysis && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">Your RFE Analysis</h2>
                  <button
                    onClick={() => setAnalysis(null)}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg"
                  >
                    <ArrowRight className="h-3.5 w-3.5 rotate-180" /> New Analysis
                  </button>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <h3 className="font-semibold text-slate-800 text-sm">Summary</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
                </div>

                {/* Deadline note */}
                {analysis.deadline_note && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800 text-sm mb-0.5">Deadline Note</p>
                      <p className="text-amber-700 text-sm">{analysis.deadline_note}</p>
                    </div>
                  </div>
                )}

                {/* Issues */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">
                    Issues to Address ({analysis.issues?.length ?? 0})
                  </h3>
                  <div className="space-y-3">
                    {(analysis.issues ?? []).map((issue, i) => (
                      <IssueCard key={i} issue={issue} index={i} />
                    ))}
                  </div>
                </div>

                {/* Tips */}
                {analysis.response_tips?.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-indigo-500" />
                      <h3 className="font-semibold text-slate-800 text-sm">Response Tips</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.response_tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Attorney recommendation */}
                {analysis.attorney_recommendation && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-green-500" />
                      <h3 className="font-semibold text-slate-800 text-sm">Attorney Recommendation</h3>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{analysis.attorney_recommendation}</p>
                    <a
                      href="/lawyers"
                      className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-indigo-600 hover:underline"
                    >
                      Find an immigration attorney <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="bg-slate-100 rounded-xl p-4">
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    <strong>Disclaimer:</strong> This analysis is generated by AI and is for informational purposes only. It does not constitute legal advice. RFE responses are legally complex and time-sensitive — consulting a qualified immigration attorney is strongly recommended.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

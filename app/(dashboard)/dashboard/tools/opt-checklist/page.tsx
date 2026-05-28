"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, Circle, AlertCircle, Info, ExternalLink,
  FileText, DollarSign, Clock, User, BookOpen, Send, CreditCard, RotateCcw,
} from "lucide-react";

const STORAGE_KEY = "visapilot_opt_checklist";

interface ChecklistItem {
  id: string;
  text: string;
  note?: string;
  type?: "doc" | "form" | "fee" | "action" | "online";
  link?: { label: string; url: string };
}

interface Phase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  items: ChecklistItem[];
  alert?: string;
}

const PHASES: Phase[] = [
  {
    id: "eligibility",
    number: 1,
    title: "Confirm Eligibility & Timing",
    subtitle: "Do this first — before contacting your DSO",
    icon: BookOpen,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    alert: "Apply no earlier than 90 days before graduation. OPT must start within 60 days after your program end date.",
    items: [
      { id: "e1", text: "You have been enrolled full-time for at least 1 full academic year", type: "action" },
      { id: "e2", text: "You have confirmed your program end date / graduation date with your school", type: "action" },
      { id: "e3", text: "Your intended job is directly related to your field of study", note: "USCIS and your DSO may ask you to explain this connection", type: "action" },
      { id: "e4", text: "You have NOT previously used all 12 months of post-completion OPT", type: "action" },
      { id: "e5", text: "Your filing date will be within the 90-day early window before graduation", note: "Earliest you can apply: 90 days before program end date", type: "action" },
    ],
  },
  {
    id: "dso",
    number: 2,
    title: "Meet with Your DSO",
    subtitle: "International Student Office — this is required before filing",
    icon: User,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    alert: "Your DSO must enter the OPT recommendation in SEVIS before you can file Form I-765. You cannot skip this step.",
    items: [
      { id: "d1", text: "Schedule appointment with your International Student Office (ISO/DSO)", type: "action" },
      { id: "d2", text: "Decide your desired OPT start date with DSO", note: "Cannot be before your graduation date for post-completion OPT; must be within 60 days after", type: "action" },
      { id: "d3", text: "DSO enters OPT recommendation into SEVIS", type: "action" },
      { id: "d4", text: "Receive updated I-20 with OPT recommendation (page 3 filled and signed)", type: "doc", note: "Check that page 3 shows 'OPT Recommended' with dates and DSO signature" },
      { id: "d5", text: "Get travel signature on I-20 (page 1) if you plan to travel before receiving EAD", type: "doc", note: "Travel signatures are valid for 6 months" },
    ],
  },
  {
    id: "documents",
    number: 3,
    title: "Gather All Documents",
    subtitle: "Collect everything before you start Form I-765",
    icon: FileText,
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    items: [
      { id: "doc1", text: "I-20 with OPT recommendation from DSO (most recent)", type: "doc", note: "Required — this is your authorization from the school" },
      { id: "doc2", text: "Copies of ALL previous I-20s (every one ever issued to you)", type: "doc", note: "USCIS wants to see your entire F-1 history" },
      { id: "doc3", text: "Passport biographical page (copy)", type: "doc", note: "The page with your photo, name, and expiry date" },
      { id: "doc4", text: "US visa stamp page from passport (copy)", type: "doc", note: "Even if your F-1 visa stamp is expired — it still counts" },
      { id: "doc5", text: "I-94 Arrival/Departure Record (printed from i94.cbp.dhs.gov)", type: "doc", link: { label: "Download I-94", url: "https://i94.cbp.dhs.gov" } },
      { id: "doc6", text: "Copies of any previous EAD cards (front AND back)", type: "doc", note: "Only required if you had prior OPT or other work authorization" },
      { id: "doc7", text: "2 passport-style photos (2×2 in, white background)", type: "doc", note: "Required only if filing by PAPER mail — not needed for online filing" },
    ],
  },
  {
    id: "form",
    number: 4,
    title: "Complete Form I-765",
    subtitle: "Application for Employment Authorization — file online at my.uscis.gov",
    icon: Send,
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    alert: "Online filing is strongly recommended — faster processing and no lost mail risk. Paper filing requires mailing to a USCIS service center.",
    items: [
      { id: "f1", text: "Create account at my.uscis.gov (if you don't have one)", type: "online", link: { label: "Create myUSCIS account", url: "https://my.uscis.gov" } },
      { id: "f2", text: "Start a new Form I-765 application online", type: "form" },
      { id: "f3", text: "Select eligibility category: (c)(3)(B) — Post-completion OPT", note: "(c)(3)(A) = Pre-completion OPT | (c)(3)(B) = Post-completion OPT (most common)", type: "form" },
      { id: "f4", text: "Enter your desired OPT start date (within 60 days after graduation)", type: "form" },
      { id: "f5", text: "Enter your SEVIS ID number (starts with N, found on your I-20)", type: "form" },
      { id: "f6", text: "Answer all personal information questions accurately", type: "form" },
      { id: "f7", text: "Upload all supporting documents (I-20, passport, I-94, prior EADs)", type: "form" },
      { id: "f8", text: "Review the entire application carefully before submitting", type: "action" },
    ],
  },
  {
    id: "fee",
    number: 5,
    title: "Pay Filing Fee & Submit",
    subtitle: "Confirm payment and keep your receipt",
    icon: DollarSign,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    items: [
      { id: "fee1", text: "Pay the $520 Form I-765 filing fee", type: "fee", note: "Online: credit/debit card. Paper: money order or check payable to 'U.S. Department of Homeland Security'", link: { label: "Verify current fee at uscis.gov", url: "https://www.uscis.gov/i-765" } },
      { id: "fee2", text: "Submit the application and confirm you receive a submission confirmation", type: "action" },
      { id: "fee3", text: "Save/screenshot the USCIS receipt number (starts with IOE, EAC, WAC, etc.)", type: "action", note: "You will need this to track your case status" },
      { id: "fee4", text: "Save confirmation email from USCIS", type: "action" },
    ],
  },
  {
    id: "waiting",
    number: 6,
    title: "After Filing — While You Wait",
    subtitle: "Processing typically takes 3–5 months",
    icon: Clock,
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    alert: "Do NOT start working before you receive your EAD card AND the start date on the card has arrived. Working without authorization is a serious immigration violation.",
    items: [
      { id: "w1", text: "Receive USCIS Receipt Notice (Form I-797) by mail or email", type: "doc", note: "Usually arrives within 2–3 weeks of filing" },
      { id: "w2", text: "Track your case status using your receipt number at egov.uscis.gov", type: "online", link: { label: "Track USCIS case", url: "https://egov.uscis.gov/casestatus/landing.do" } },
      { id: "w3", text: "Notify your DSO if your address changes after filing", type: "action" },
      { id: "w4", text: "Keep your I-94 and passport valid during this period", type: "action" },
      { id: "w5", text: "If your OPT start date passes before EAD arrives, contact DSO immediately", type: "action", note: "DSO may need to update your I-20 with a new start date" },
    ],
  },
  {
    id: "received",
    number: 7,
    title: "After Receiving Your EAD Card",
    subtitle: "Final steps before and after starting work",
    icon: CreditCard,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    items: [
      { id: "r1", text: "Verify all info on EAD is correct: name, DOB, category C(3)(B), dates", type: "action", note: "If anything is wrong, contact USCIS immediately — do not use an incorrect card" },
      { id: "r2", text: "Make copies of both the front and back of your EAD", type: "doc" },
      { id: "r3", text: "Report your employer information to your DSO within 10 days of starting work", type: "action", note: "This is a SEVIS reporting requirement — failure can affect your F-1 status" },
      { id: "r4", text: "Begin tracking your unemployment days (max 90 days allowed on standard OPT)", type: "action", link: { label: "Use OPT Day Counter", url: "/dashboard/tools/opt-tracker" } },
      { id: "r5", text: "Always carry your EAD, passport, and I-20 when traveling or working", type: "action" },
      { id: "r6", text: "If changing jobs, report new employer to DSO within 10 days", type: "action" },
      { id: "r7", text: "If eligible, start STEM OPT extension process at least 90 days before OPT expiry", type: "action", note: "Requires a qualifying STEM degree and E-Verify employer" },
    ],
  },
];

const typeConfig = {
  doc:    { label: "Document",    color: "bg-blue-100 text-blue-700"   },
  form:   { label: "Form",        color: "bg-orange-100 text-orange-700" },
  fee:    { label: "Fee",         color: "bg-red-100 text-red-700"     },
  action: { label: "Action",      color: "bg-slate-100 text-slate-600" },
  online: { label: "Online",      color: "bg-green-100 text-green-700" },
};

export default function OPTChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      setChecked(saved);
    } catch {}
  }, []);

  function toggle(id: string) {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function resetAll() {
    setChecked({});
    localStorage.removeItem(STORAGE_KEY);
  }

  const allItems = PHASES.flatMap(p => p.items);
  const totalItems = allItems.length;
  const doneItems = allItems.filter(i => checked[i.id]).length;
  const progressPct = Math.round((doneItems / totalItems) * 100);

  const phaseProgress = (phase: Phase) => {
    const done = phase.items.filter(i => checked[i.id]).length;
    return { done, total: phase.items.length, pct: Math.round((done / phase.items.length) * 100) };
  };

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold">OPT Application Checklist</h1>
        </div>
        <p className="text-muted-foreground">Step-by-step guide for F-1 students applying for post-completion OPT</p>
      </div>

      {/* Overall progress */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold">Overall Progress</p>
              <p className="text-sm text-muted-foreground mt-0.5">{doneItems} of {totalItems} items completed</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-primary">{progressPct}%</span>
              <Button variant="ghost" size="sm" onClick={resetAll} className="text-muted-foreground gap-1.5 text-xs">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>
            </div>
          </div>
          <Progress value={progressPct} className="h-3" />

          {/* Phase pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {PHASES.map(phase => {
              const prog = phaseProgress(phase);
              const done = prog.done === prog.total;
              return (
                <a key={phase.id} href={`#${phase.id}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    done ? "bg-green-100 border-green-300 text-green-700" : "bg-white border-slate-200 text-slate-600"
                  }`}>
                  {done
                    ? <CheckCircle2 className="h-3 w-3" />
                    : <span className="font-bold">{prog.done}/{prog.total}</span>
                  }
                  Phase {phase.number}
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Important info banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex gap-3 mb-8">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Key Facts Before You Start</p>
          <ul className="space-y-1 text-xs text-blue-700 list-disc list-inside">
            <li>Filing window: up to <strong>90 days before</strong> graduation through <strong>60 days after</strong></li>
            <li>Filing fee: <strong>$520</strong> for Form I-765 (verify at uscis.gov — fees can change)</li>
            <li>Processing time: typically <strong>3–5 months</strong> (file early!)</li>
            <li>You can only work <strong>after</strong> receiving your EAD card AND on/after the start date</li>
            <li>Max unemployment: <strong>90 days</strong> for standard OPT, <strong>150 days</strong> for STEM OPT</li>
          </ul>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {PHASES.map(phase => {
          const prog = phaseProgress(phase);
          const Icon = phase.icon;
          const allDone = prog.done === prog.total;

          return (
            <div key={phase.id} id={phase.id}>
              <Card className={`border-2 transition-colors ${allDone ? "border-green-300 bg-green-50/30" : phase.border}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${phase.bg}`}>
                        <Icon className={`h-5 w-5 ${phase.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">Phase {phase.number}: {phase.title}</CardTitle>
                          {allDone && <Badge variant="success" className="text-xs">Done</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{phase.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{prog.done}/{prog.total}</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${prog.pct}%` }} />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-2">
                  {phase.alert && (
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 mb-3">
                      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">{phase.alert}</p>
                    </div>
                  )}

                  {phase.items.map(item => {
                    const isChecked = !!checked[item.id];
                    const typeMeta = item.type ? typeConfig[item.type] : null;

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                          isChecked ? "bg-green-50 border-green-200" : "hover:bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked
                            ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                            : <Circle className="h-5 w-5 text-slate-300" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 flex-wrap">
                            <p className={`text-sm font-medium leading-snug ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                              {item.text}
                            </p>
                            {typeMeta && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${typeMeta.color}`}>
                                {typeMeta.label}
                              </span>
                            )}
                          </div>
                          {item.note && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.note}</p>
                          )}
                          {item.link && (
                            <a
                              href={item.link.url}
                              target={item.link.url.startsWith("http") ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5 font-medium"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {item.link.label}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Bottom summary */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="font-semibold text-sm mb-3">Quick Reference</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Filing Fee",       value: "$520",       sub: "Form I-765",             icon: DollarSign, color: "text-red-600"    },
            { label: "Processing Time",  value: "3–5 mo",     sub: "varies by center",       icon: Clock,      color: "text-blue-600"   },
            { label: "File Window",      value: "90 days",    sub: "before graduation",      icon: Info,       color: "text-purple-600" },
            { label: "Max Unemployment", value: "90 days",    sub: "standard OPT",           icon: AlertCircle,color: "text-orange-600" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-lg bg-white border p-3 text-center">
                <Icon className={`h-4 w-4 mx-auto mb-1 ${s.color}`} />
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs font-medium">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

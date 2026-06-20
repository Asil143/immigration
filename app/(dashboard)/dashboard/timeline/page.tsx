"use client";

import { useState, useEffect } from "react";
import { useUser, SignUpButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Calendar, AlertCircle, Clock, CheckCircle2, Trash2, Loader2,
  Sparkles, ArrowRight, ExternalLink, UserCircle,
} from "lucide-react";
import { differenceInDays, format, parseISO, isValid } from "date-fns";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "critical" | "high" | "medium" | "low";
type Urgency  = "critical" | "high" | "medium" | "info";

interface Deadline {
  id: string; title: string; description: string | null;
  due_date: string; priority: Priority; is_completed: boolean;
}

interface KeyDate {
  label: string; date: string; icon: string;
  actionHint?: string; actionLink?: string; category: string;
}

interface SmartAction {
  title: string; description: string;
  urgency: Urgency; link?: string;
}

interface Profile {
  visa_type?: string;
  passport_expiry?: string;
  visa_stamp_expiry?: string;
  i94_expiry?: string; i94_is_ds?: boolean;
  i20_end_date?: string;
  ead_expiry?: string;
  opt_start_date?: string; opt_end_date?: string;
  stem_opt_start_date?: string; stem_opt_end_date?: string;
  h1b_start_date?: string; h1b_expiry?: string;
  advance_parole_expiry?: string;
  advance_parole_issue_date?: string;
  i140_approval_date?: string;
  h4_ead_expiry?: string;
  j1_end_date?: string;
  tn_expiry?: string;
  l1_expiry?: string;
  perm_filing_date?: string;
  priority_date?: string;
  green_card_stage?: string;
  green_card_category?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(dateStr?: string): number | null {
  if (!dateStr || !isValid(parseISO(dateStr))) return null;
  return differenceInDays(parseISO(dateStr), new Date());
}

function buildKeyDates(p: Profile): KeyDate[] {
  const out: KeyDate[] = [];
  const add = (label: string, date: string | undefined, icon: string, category: string, actionHint?: string, actionLink?: string) => {
    if (date && isValid(parseISO(date))) out.push({ label, date, icon, category, actionHint, actionLink });
  };
  add("Passport Expiry",       p.passport_expiry,         "🛂", "Document", "Renew 6–12 months before expiry — most US visas require 6 months validity beyond your stay", "/guides/travel-advisory");
  add("Visa Stamp Expiry",     p.visa_stamp_expiry,       "🏷️", "Document", "Needed to re-enter the US — get a new stamp at a consulate abroad before traveling", "/guides/travel-advisory");
  add("I-94 Expiry",           p.i94_is_ds ? undefined : p.i94_expiry, "📋", "Status", "Last day of your authorized stay — file extension or change status before this date");
  add("I-20 Program End",      p.i20_end_date,            "🎓", "F-1 Status", "Request a program extension from your DSO at least 15 days before this date — required to stay in F-1 status");
  add("EAD Expiry",            p.ead_expiry,              "💳", "Document", "File Form I-765 renewal up to 180 days (6 months) before this date to avoid a work gap", "/dashboard/tools/checklists");
  add("OPT End Date",          p.opt_end_date,            "📅", "OPT Status", "Apply for STEM OPT extension (I-765 + I-983) up to 90 days before this date if your employer is E-Verify enrolled", "/dashboard/tools/opt-tracker");
  add("STEM OPT End Date",     p.stem_opt_end_date,       "📅", "STEM OPT", "H-1B must be approved and active by this date — no grace period extensions exist after STEM OPT ends", "/dashboard/tools/opt-tracker");
  add("H-1B Start Date",       p.h1b_start_date,          "🏢", "H-1B Status", "First day you can begin working on H-1B — confirm I-797 approval notice with employer");
  add("H-1B Expiry",           p.h1b_expiry,              "🏢", "H-1B Status", "Ask your employer to file I-129 extension at least 6 months early — USCIS processing can take 3–6 months");
  add("Advance Parole Expiry", p.advance_parole_expiry,   "✈️", "Document", "File I-131 renewal 4+ months before expiry — traveling after expiration abandons a pending I-485");
  add("I-140 Approval Date",   p.i140_approval_date,      "🌿", "Filing", "Priority date is locked from this date — keep the approval notice safe");
  add("PERM Filing Date",      p.perm_filing_date,        "📝", "Filing", "Labor certification filed — employer should receive audit/decision within 6–18 months");
  add("Priority Date",         p.priority_date,           "🗓️", "Filing", "Check the DOS Visa Bulletin each month — you can file I-485 when your date becomes current", "/dashboard/tools/visa-bulletin");
  add("H-4 EAD Expiry",       p.h4_ead_expiry,           "💳", "Document", "File Form I-765 renewal concurrently with H-4 extension — tie it to your spouse's H-1B extension");
  add("J-1 Program End",       p.j1_end_date,             "🌍", "J-1 Status", "Request DS-2019 extension from your sponsor or change status before this date — 30-day grace period applies");
  add("TN Expiry",             p.tn_expiry,               "🇨🇦", "TN Status", "Renew at a US port of entry with a new offer letter, or file I-129 with USCIS 6 months early");
  add("L-1 Expiry",            p.l1_expiry,               "🏢", "L-1 Status", "Employer must file I-129 extension — L-1A max is 7 years, L-1B max is 5 years total");
  return out.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function buildSmartActions(p: Profile): SmartAction[] {
  const out: SmartAction[] = [];
  const now = new Date();

  const warn = (days: number | null, thresholds: [number, Urgency][], title: string, desc: (d: number) => string, link?: string) => {
    if (days === null) return;
    for (const [threshold, urgency] of thresholds) {
      if (days <= threshold && days > 0) {
        out.push({ title, description: desc(days), urgency, link });
        return;
      }
    }
  };

  warn(daysUntil(p.ead_expiry),
    [[60, "critical"], [120, "high"], [180, "medium"]],
    "File EAD Renewal (I-765)",
    (d) => `EAD expires in ${d} days. USCIS recommends filing 180 days (6 months) early to avoid a gap.`,
    "/dashboard/tools/checklists"
  );

  warn(daysUntil(p.passport_expiry),
    [[90, "critical"], [180, "high"], [365, "medium"]],
    "Renew Passport",
    (d) => `Passport expires in ${d} days. Most US visas require 6+ months of passport validity beyond your stay.`
  );

  warn(daysUntil(p.h1b_expiry),
    [[90, "critical"], [150, "high"], [180, "medium"]],
    "File H-1B Extension with Employer",
    (d) => `H-1B expires in ${d} days. Ask your employer to file an I-129 extension. USCIS can take 3–6 months.`
  );

  warn(daysUntil(p.opt_end_date),
    [[60, "critical"], [120, "high"]],
    "OPT Ending — Secure Next Immigration Status",
    (d) => `Standard OPT ends in ${d} days. File STEM OPT extension if eligible, or ensure H-1B or another visa is approved.`,
    "/ai-assistant"
  );

  warn(daysUntil(p.stem_opt_end_date),
    [[60, "critical"], [120, "high"], [180, "medium"]],
    "STEM OPT Ending — Last Chance for Status",
    (d) => `STEM OPT ends in ${d} days. H-1B must be approved and active, or you must depart or change status.`,
    "/ai-assistant"
  );

  if (!p.i94_is_ds) {
    warn(daysUntil(p.i94_expiry),
      [[30, "critical"], [60, "high"], [120, "medium"]],
      "I-94 Status Expiring",
      (d) => `I-94 authorized stay expires in ${d} days. File for extension or change of status before it expires.`
    );
  }

  warn(daysUntil(p.advance_parole_expiry),
    [[60, "critical"], [120, "high"]],
    "Renew Advance Parole (I-131)",
    (d) => `Advance Parole expires in ${d} days. File I-131 renewal well before expiry — traveling after expiration abandons your I-485.`
  );

  warn(daysUntil(p.i20_end_date),
    [[30, "critical"], [60, "high"]],
    "I-20 Program End Date Approaching",
    (d) => `I-20 program end date is in ${d} days. Contact your DSO immediately if you need an extension.`
  );

  // Advance Parole warning if I-485 pending and no AP
  if (p.green_card_stage?.includes("I-485") && !p.advance_parole_expiry) {
    out.push({
      title: "Get Advance Parole Before Any International Travel",
      description: "With I-485 pending, leaving the US without Advance Parole (I-131) automatically abandons your green card application.",
      urgency: "critical",
      link: "/dashboard/tools/checklists",
    });
  }

  // Visa Bulletin reminder if waiting on priority date
  if (p.green_card_stage === "Waiting for Priority Date" || p.green_card_stage === "I-140 approved") {
    out.push({
      title: "Check Monthly Visa Bulletin",
      description: "DOS publishes the Visa Bulletin on the 2nd Tuesday of each month. Priority date movement determines when you can file I-485.",
      urgency: "info",
      link: "/dashboard/tools/visa-bulletin",
    });
  }

  // H-1B cap registration window (Jan–Feb = upcoming, show as reminder)
  if (now.getMonth() <= 1) {
    out.push({
      title: "H-1B Cap Registration Opens March 1",
      description: "USCIS electronic registration runs March 1–20. Coordinate with your employer now if you need H-1B sponsorship this cycle.",
      urgency: "info",
      link: "/dashboard/tools/checklists/h1b",
    });
  }

  // Sort: critical → high → medium → info
  const order: Record<Urgency, number> = { critical: 0, high: 1, medium: 2, info: 3 };
  return out.sort((a, b) => order[a.urgency] - order[b.urgency]);
}

// ─── Config ───────────────────────────────────────────────────────────────────

const urgencyConfig: Record<Urgency, { color: string; bg: string; border: string; dot: string; label: string }> = {
  critical: { color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",   dot: "bg-red-500",    label: "Critical" },
  high:     { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200",dot: "bg-orange-500", label: "High"     },
  medium:   { color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  dot: "bg-blue-500",   label: "Medium"   },
  info:     { color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200", dot: "bg-slate-400",  label: "Info"     },
};

const priorityConfig: Record<Priority, { badgeVariant: "destructive" | "warning" | "info" | "secondary" }> = {
  critical: { badgeVariant: "destructive" },
  high:     { badgeVariant: "warning"     },
  medium:   { badgeVariant: "info"        },
  low:      { badgeVariant: "secondary"   },
};

function daysLeftBadge(days: number) {
  if (days < 0)  return <Badge variant="destructive">{Math.abs(days)}d overdue</Badge>;
  if (days === 0) return <Badge variant="destructive">Today</Badge>;
  if (days <= 30) return <Badge variant="destructive">{days}d left</Badge>;
  if (days <= 90) return <Badge variant="warning">{days}d left</Badge>;
  if (days <= 180) return <Badge variant="info">{days}d left</Badge>;
  return <Badge variant="secondary">{days}d left</Badge>;
}

// ─── Demo data for guests ─────────────────────────────────────────────────────

const DEMO_PROFILE: Profile = {
  visa_type: "STEM OPT",
  ead_expiry: new Date(Date.now() + 62 * 86400000).toISOString().split("T")[0],
  stem_opt_end_date: new Date(Date.now() + 62 * 86400000).toISOString().split("T")[0],
  passport_expiry: new Date(Date.now() + 280 * 86400000).toISOString().split("T")[0],
  i94_is_ds: true,
  i20_end_date: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
  h1b_start_date: new Date(Date.now() + 120 * 86400000).toISOString().split("T")[0],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TimelinePage() {
  const { isSignedIn } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isSignedIn === undefined) return;
    if (!isSignedIn) {
      setProfile(DEMO_PROFILE);
      setLoading(false);
      return;
    }
    Promise.all([
      fetch("/api/profile").then(r => r.ok ? r.json() : null),
      fetch("/api/deadlines").then(r => r.ok ? r.json() : []),
    ]).then(([prof, dl]) => {
      setProfile(prof ?? {});
      if (Array.isArray(dl)) setDeadlines(dl);
    }).finally(() => setLoading(false));
  }, [isSignedIn]);

  async function addDeadline() {
    if (!newTitle || !newDate) return;
    setSaving(true);
    const res = await fetch("/api/deadlines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, due_date: newDate, priority: newPriority }),
    });
    if (res.ok) {
      const d = await res.json();
      setDeadlines(prev => [d, ...prev]);
      setNewTitle(""); setNewDate(""); setShowAdd(false);
    }
    setSaving(false);
  }

  async function toggle(id: string, current: boolean) {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, is_completed: !current } : d));
    await fetch("/api/deadlines", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_completed: !current }) });
  }

  async function remove(id: string) {
    setDeadlines(prev => prev.filter(d => d.id !== id));
    await fetch("/api/deadlines", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
  }

  if (loading) return (
    <div className="p-8 flex justify-center py-24">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  const keyDates = buildKeyDates(profile ?? {});
  const smartActions = buildSmartActions(profile ?? {});
  const active = deadlines.filter(d => !d.is_completed).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  const completed = deadlines.filter(d => d.is_completed);
  const hasProfile = keyDates.length > 0;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Timeline & Deadlines</h1>
          <p className="mt-1 text-muted-foreground text-sm">All your critical immigration dates in one place</p>
        </div>
        {isSignedIn && (
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Deadline
          </Button>
        )}
      </div>

      {/* Guest banner */}
      {!isSignedIn && (
        <div className="mb-6 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Preview with sample data</p>
              <p className="text-xs text-slate-500 mt-0.5">Sign in to see your real dates and get personalized action items.</p>
            </div>
          </div>
          <SignUpButton mode="modal">
            <button className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors shrink-0">
              Get started free <ArrowRight className="h-3 w-3" />
            </button>
          </SignUpButton>
        </div>
      )}

      {/* No profile dates — prompt to fill profile */}
      {isSignedIn && !hasProfile && (
        <div className="mb-6 rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <UserCircle className="h-10 w-10 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold text-slate-700">No key dates found</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Fill in your visa dates in your profile and they'll auto-populate here.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/profile">Go to Profile →</Link>
          </Button>
        </div>
      )}

      {/* Smart Action Items */}
      {smartActions.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Smart Action Items</h2>
            <Badge variant="secondary" className="text-xs">{smartActions.length}</Badge>
          </div>
          <div className="space-y-2">
            {smartActions.map((action, i) => {
              const cfg = urgencyConfig[action.urgency];
              return (
                <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${cfg.color}`}>{action.title}</p>
                      <Badge variant={action.urgency === "critical" ? "destructive" : action.urgency === "high" ? "warning" : action.urgency === "medium" ? "info" : "secondary"} className="text-[10px]">
                        {cfg.label}
                      </Badge>
                    </div>
                    <p className="text-xs mt-1 text-slate-600">{action.description}</p>
                  </div>
                  {action.link && (
                    <Link href={action.link} className={`flex items-center gap-1 text-xs font-semibold shrink-0 ${cfg.color} hover:underline`}>
                      Take action <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Key Dates Timeline */}
      {keyDates.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-sm">Key Dates</h2>
              <Badge variant="secondary" className="text-xs">{keyDates.length} dates</Badge>
            </div>
            {isSignedIn && (
              <Link href="/dashboard/profile" className="text-xs text-primary hover:underline flex items-center gap-1">
                Edit in Profile <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-200" />

            <div className="space-y-2">
              {keyDates.map((kd, i) => {
                const days = daysUntil(kd.date);
                const isPast = days !== null && days < 0;
                const isUrgent = days !== null && days <= 90 && !isPast;
                return (
                  <div key={i} className="flex items-start gap-4">
                    {/* Dot */}
                    <div className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-base border-2 ${
                      isPast ? "bg-slate-100 border-slate-200" :
                      isUrgent ? "bg-red-50 border-red-300" :
                      "bg-white border-slate-200"
                    }`}>
                      {kd.icon}
                    </div>
                    {/* Card */}
                    <div className={`flex-1 rounded-xl border px-4 py-3 ${
                      isPast ? "bg-slate-50 border-slate-200 opacity-60" :
                      isUrgent ? "bg-red-50/50 border-red-200" :
                      "bg-white border-slate-200"
                    }`}>
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-semibold ${isPast ? "text-muted-foreground" : ""}`}>{kd.label}</p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                            kd.category.includes("Status") || kd.category === "F-1 Status" || kd.category === "OPT Status" || kd.category === "STEM OPT" || kd.category === "H-1B Status" || kd.category === "J-1 Status" || kd.category === "TN Status" || kd.category === "L-1 Status"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : kd.category === "Filing"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}>
                            {kd.category}
                          </span>
                        </div>
                        <div className="shrink-0">
                          {days !== null ? daysLeftBadge(days) : null}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {format(parseISO(kd.date), "MMMM d, yyyy")}
                      </p>
                      {kd.actionHint && (
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {kd.actionHint}
                          {kd.actionLink && (
                            <Link href={kd.actionLink} className="ml-1.5 text-blue-600 font-semibold hover:underline inline-flex items-center gap-0.5">
                              Take action <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Custom Deadlines */}
      {isSignedIn && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-sm">Custom Deadlines</h2>
              {active.length > 0 && <Badge variant="secondary" className="text-xs">{active.length} active</Badge>}
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAdd(!showAdd)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </div>

          {showAdd && (
            <Card className="mb-4 border-primary/30">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-sm">New Deadline</h3>
                <Input placeholder="Deadline title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                <div className="flex gap-3">
                  <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="flex-1" />
                  <Select value={newPriority} onValueChange={v => setNewPriority(v as Priority)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addDeadline} disabled={saving || !newTitle || !newDate}>
                    {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />} Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {active.length === 0 && !showAdd ? (
            <div className="text-center py-8 rounded-xl border border-dashed border-slate-200">
              <Calendar className="h-7 w-7 mx-auto mb-2 text-slate-300" />
              <p className="text-sm text-muted-foreground">No custom deadlines yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add filing deadlines, appointments, or personal reminders.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {active.map(d => {
                const days = differenceInDays(parseISO(d.due_date), new Date());
                const cfg = priorityConfig[d.priority];
                return (
                  <div key={d.id} className="flex items-start gap-3 rounded-xl border p-4 group bg-white">
                    <button onClick={() => toggle(d.id, d.is_completed)} className="mt-0.5 shrink-0">
                      <div className="h-5 w-5 rounded border-2 border-slate-300 hover:border-primary transition-colors" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="font-medium text-sm">{d.title}</p>
                        <div className="flex items-center gap-2">
                          {daysLeftBadge(days)}
                          <button onClick={() => remove(d.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {d.description && <p className="mt-0.5 text-xs text-muted-foreground">{d.description}</p>}
                      <p className="mt-1 text-xs text-muted-foreground">{format(parseISO(d.due_date), "MMMM d, yyyy")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {completed.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Completed ({completed.length})
              </p>
              <div className="space-y-1">
                {completed.map(d => (
                  <div key={d.id} className="flex items-center gap-3 rounded-xl border p-3 opacity-50 bg-slate-50">
                    <button onClick={() => toggle(d.id, d.is_completed)}>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </button>
                    <p className="text-sm line-through text-muted-foreground flex-1">{d.title}</p>
                    <button onClick={() => remove(d.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

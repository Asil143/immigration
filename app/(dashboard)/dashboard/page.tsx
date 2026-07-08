"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot, Calendar, FileText, FolderOpen, ArrowRight, AlertCircle,
  CheckCircle2, Clock, UserCircle, Shield, TrendingUp, Zap, ClipboardList,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { GuestPreviewBanner } from "@/components/ui/guest-preview-banner";
import { formatDateLong, formatDateShort } from "@/lib/utils/date";

function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

interface DeadlineAlert {
  label: string;
  days: number;
  date: string;
  priority: "critical" | "high" | "medium";
  action: string;
  actionHref: string;
}

interface StemDeadline {
  date: string;         // ISO yyyy-mm-dd
  label: string;
  type: "validation" | "evaluation";
  daysUntil: number;
  isPast: boolean;
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

function computeStemOptDeadlines(startDate: string): StemDeadline[] {
  const deadlines: StemDeadline[] = [];
  const schedule = [
    { months: 6,  type: "validation" as const },
    { months: 12, type: "validation" as const },
    { months: 12, type: "evaluation" as const },
    { months: 18, type: "validation" as const },
    { months: 24, type: "validation" as const },
    { months: 24, type: "evaluation" as const },
  ];
  const labels: Record<string, string> = {
    validation: "Validation report — confirm address & employer in SEVIS",
    evaluation: "Form I-983 (page 5) — Evaluation of Student Progress",
  };
  for (const s of schedule) {
    const date = addMonths(startDate, s.months);
    const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    deadlines.push({ date, label: labels[s.type], type: s.type, daysUntil: days, isPast: days < 0 });
  }
  return deadlines;
}

function computeAlerts(profile: Record<string, string>): DeadlineAlert[] {
  const alerts: DeadlineAlert[] = [];

  const checks = [
    {
      key: "eadExpiry", label: "OPT / STEM OPT End Date",
      criticalDays: 45, highDays: 90,
      action: "File STEM OPT or H-1B", actionHref: "/dashboard/tools/opt-tracker",
    },
    {
      key: "i94Expiry", label: "I-94 Authorized Stay Ends",
      criticalDays: 30, highDays: 60,
      action: "Consult attorney immediately", actionHref: "/lawyers",
    },
    {
      key: "visaStampExpiry", label: "Visa Stamp Expires",
      criticalDays: 30, highDays: 60,
      action: "Get new stamp before traveling", actionHref: "/guides/travel-advisory",
    },
    {
      key: "passportExpiry", label: "Passport Expires",
      criticalDays: 90, highDays: 180,
      action: "Renew passport at your consulate", actionHref: "/guides/travel-advisory",
    },
  ];

  for (const check of checks) {
    const days = daysUntil(profile[check.key]);
    if (days === null || days <= 0) continue;
    if (days > 365) continue;
    alerts.push({
      label: check.label,
      days,
      date: profile[check.key],
      priority: days <= check.criticalDays ? "critical" : days <= check.highDays ? "high" : "medium",
      action: check.action,
      actionHref: check.actionHref,
    });
  }

  return alerts.sort((a, b) => a.days - b.days);
}

const quickActions = [
  { title: "Ask AI Assistant", description: "Instant answers to any immigration question", href: "/ai-assistant", icon: Bot, color: "text-blue-600 bg-blue-50" },
  { title: "View Timeline", description: "Check your upcoming deadlines", href: "/dashboard/timeline", icon: Calendar, color: "text-purple-600 bg-purple-50" },
  { title: "Upload Document", description: "Analyze documents with AI", href: "/dashboard/documents", icon: FileText, color: "text-green-600 bg-green-50" },
  { title: "Manage Cases", description: "Track your visa applications", href: "/dashboard/cases", icon: FolderOpen, color: "text-orange-600 bg-orange-50" },
];

const DEMO_PROFILE: Record<string, string> = {
  visaType: "F-1 OPT",
  countryOfBirth: "India",
  employer: "Acme Corp",
  eadExpiry: new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0],
  i94Expiry: new Date(Date.now() + 120 * 86400000).toISOString().split("T")[0],
  visaStampExpiry: new Date(Date.now() + 200 * 86400000).toISOString().split("T")[0],
  passportExpiry: new Date(Date.now() + 300 * 86400000).toISOString().split("T")[0],
  greenCardStage: "",
  greenCardCategory: "",
};

export default function DashboardPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  const [alerts, setAlerts] = useState<DeadlineAlert[]>([]);
  const [stemDeadlines, setStemDeadlines] = useState<StemDeadline[]>([]);
  const [caseCount, setCaseCount] = useState(0);

  useEffect(() => {
    if (!isSignedIn) {
      Promise.resolve().then(() => {
        setProfile(DEMO_PROFILE);
        setAlerts(computeAlerts(DEMO_PROFILE));
        setCaseCount(2);
      });
      return;
    }
    Promise.all([
      fetch("/api/profile").then(r => r.ok ? r.json() : null),
      fetch("/api/cases").then(r => r.ok ? r.json() : []),
    ]).then(([profileData, casesData]) => {
      if (profileData && !profileData.error) {
        // Redirect new users to onboarding only when explicitly false (column must exist)
        if (profileData.onboarding_complete === false) {
          router.push("/onboarding");
          return;
        }
        const p: Record<string, string> = {
          visaType: profileData.visa_type ?? "",
          countryOfBirth: profileData.country_of_birth ?? "",
          employer: profileData.employer ?? "",
          eadExpiry: profileData.ead_expiry ?? "",
          i94Expiry: profileData.i94_expiry ?? "",
          visaStampExpiry: profileData.visa_stamp_expiry ?? "",
          passportExpiry: profileData.passport_expiry ?? "",
          greenCardStage: profileData.green_card_stage ?? "",
          greenCardCategory: profileData.green_card_category ?? "",
          stemOptStartDate: profileData.stem_opt_start_date ?? "",
        };
        setProfile(p);
        setAlerts(computeAlerts(p));
        if (p.stemOptStartDate) setStemDeadlines(computeStemOptDeadlines(p.stemOptStartDate));
      } else {
        setProfile({});
      }
      if (Array.isArray(casesData)) setCaseCount(casesData.length);
    }).catch(() => setProfile({}));
  }, [isSignedIn, router]);

  const profileSetUp = !!(profile?.visaType);
  const criticalCount = alerts.filter(a => a.priority === "critical").length;

  return (
    <div className="p-8 max-w-6xl">
      {!isSignedIn && (
        <GuestPreviewBanner
          title="Sign in to see your real dashboard"
          description="This is a preview with sample data. Create a free account to track your own visa status, deadlines, and cases."
        />
      )}
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">
            {profileSetUp ? `Welcome back` : "Welcome to VisaPilot"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profileSetUp
              ? [profile?.visaType, profile?.employer, profile?.countryOfBirth].filter(Boolean).join(" · ")
              : "Set up your profile for personalized alerts and advice"}
          </p>
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-bold text-red-700">{criticalCount} urgent deadline{criticalCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Profile setup nudge */}
      {!profileSetUp && profile !== null && (
        <div className="mb-6 p-5 rounded-2xl flex items-center justify-between gap-4"
          style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)", border: "1px solid #bfdbfe" }}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#2563eb" }}>
              <UserCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-blue-900">Set up your immigration profile</p>
              <p className="text-sm text-blue-700 mt-0.5">Tell us your visa type and key dates — we&apos;ll alert you before anything expires.</p>
            </div>
          </div>
          <Link href="/dashboard/profile">
            <Button style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
              Set Up Profile <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className={`inline-flex rounded-lg p-2.5 ${action.color} mb-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Deadline Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                {profileSetUp ? "Your Deadline Alerts" : "Upcoming Deadlines"}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/timeline">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map(alert => (
                  <div key={alert.label} className="flex items-start gap-3 rounded-xl border p-3"
                    style={{
                      backgroundColor: alert.priority === "critical" ? "#fef2f2" : alert.priority === "high" ? "#fff7ed" : "#f0fdf4",
                      borderColor: alert.priority === "critical" ? "#fecaca" : alert.priority === "high" ? "#fed7aa" : "#bbf7d0",
                    }}>
                    {alert.priority === "critical"
                      ? <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      : alert.priority === "high"
                      ? <Clock className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      : <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm">{alert.label}</p>
                        <Badge
                          variant={alert.priority === "critical" ? "destructive" : alert.priority === "high" ? "warning" : "success"}
                          className="shrink-0 text-xs"
                        >
                          {alert.days}d
                        </Badge>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                        {formatDateLong(alert.date)}
                      </p>
                      <Link href={alert.actionHref} className="text-xs font-medium mt-1 inline-flex items-center gap-1" style={{ color: "#2563eb" }}>
                        {alert.action} <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : profileSetUp ? (
                <div className="text-center py-6 rounded-xl" style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-800 text-sm">No urgent deadlines</p>
                  <p className="text-xs text-green-700 mt-0.5">Add more key dates in your profile to stay ahead.</p>
                </div>
              ) : (
                <div className="text-center py-8 rounded-xl" style={{ backgroundColor: "#f8fafc", border: "1px dashed #e2e8f0" }}>
                  <Shield className="h-8 w-8 mx-auto mb-2" style={{ color: "#cbd5e1" }} />
                  <p className="font-medium text-sm" style={{ color: "#64748b" }}>No deadlines yet</p>
                  <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>Set up your profile to see personalized deadline alerts.</p>
                </div>
              )}
              {!profileSetUp && (
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full mt-1">Set up personalized deadlines</Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* STEM OPT Reporting Deadlines */}
          {stemDeadlines.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/40">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-amber-600" />
                  STEM OPT Reporting Deadlines
                </CardTitle>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5">
                  Required by SEVP
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-amber-800 mb-3 leading-relaxed">
                  Missing these deadlines can affect your SEVIS record. Report every 6 months to your DSO even if nothing changed.
                </p>
                <div className="space-y-2">
                  {stemDeadlines.map((dl, i) => {
                    const isPast = dl.isPast;
                    const isSoon = !isPast && dl.daysUntil <= 30;
                    const isWarning = !isPast && dl.daysUntil <= 60;
                    return (
                      <div key={i} className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${
                        isPast
                          ? "bg-slate-50 border-slate-200 opacity-60"
                          : isSoon
                          ? "bg-red-50 border-red-200"
                          : isWarning
                          ? "bg-orange-50 border-orange-200"
                          : "bg-white border-slate-200"
                      }`}>
                        <div className="shrink-0 mt-0.5">
                          {isPast
                            ? <CheckCircle2 className="h-4 w-4 text-slate-400" />
                            : isSoon
                            ? <AlertCircle className="h-4 w-4 text-red-500" />
                            : <Clock className="h-4 w-4 text-amber-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-semibold ${dl.type === "evaluation" ? "text-purple-800" : "text-slate-700"}`}>
                              {dl.type === "validation" ? "Validation Report" : "Form I-983 Evaluation"}
                            </p>
                            <span className={`text-[10px] font-bold shrink-0 ${
                              isPast ? "text-slate-400"
                              : isSoon ? "text-red-600"
                              : isWarning ? "text-orange-600"
                              : "text-slate-500"
                            }`}>
                              {isPast ? "Past" : `${dl.daysUntil}d`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{dl.label}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                            {formatDateShort(dl.date)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-amber-700 mt-3 pt-2 border-t border-amber-100">
                  If you stop working for your STEM employer early, submit Form I-983 to your DSO within 10 days.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Stats row */}
          {profileSetUp && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Days Tracked", value: alerts.length > 0 ? `${alerts[0]?.days}d` : "—", sub: "Until next deadline", color: "#2563eb" },
                { label: "Cases Monitored", value: String(caseCount), sub: "USCIS receipt numbers", color: "#7c3aed" },
                { label: "Status", value: profile?.greenCardStage || "Active", sub: profile?.greenCardStage ? "Green card stage" : "No GC process", color: "#16a34a" },
              ].map(stat => (
                <Card key={stat.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs font-semibold mt-0.5">{stat.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#94a3b8" }}>{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* AI Assistant promo */}
          <Card style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)", border: "none" }}>
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg mb-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-white">AI Assistant</h3>
              <p className="mt-2 text-sm text-white/80">
                {profileSetUp
                  ? `Get personalized answers for your ${profile?.visaType} situation — with USCIS citations.`
                  : "Ask any immigration question and get an instant answer with USCIS citations."}
              </p>
              <Button variant="secondary" className="mt-4 w-full" asChild>
                <Link href="/ai-assistant">Ask a Question <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          {/* Profile card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#eff6ff" }}>
                  <UserCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Immigration Profile</p>
                  {profileSetUp ? (
                    <>
                      <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{profile?.visaType} · {profile?.countryOfBirth}</p>
                      <Link href="/dashboard/profile" className="text-xs font-medium mt-1 inline-flex items-center gap-1" style={{ color: "#2563eb" }}>
                        Update profile <ArrowRight className="h-3 w-3" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>Not set up yet</p>
                      <Link href="/dashboard/profile" className="text-xs font-semibold mt-1 inline-flex items-center gap-1 text-blue-600">
                        Set up now → <ArrowRight className="h-3 w-3" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy alert */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#fff7ed" }}>
                  <Zap className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Policy Update</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>USCIS updated H-1B lottery selection process for FY2026. Registration opens March 2026.</p>
                  <Link href="/guides/h1b-visa" className="text-xs font-medium mt-1 inline-block" style={{ color: "#2563eb" }}>Read more →</Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Green card tracker shortcut */}
          {profileSetUp && profile?.greenCardStage && profile.greenCardStage !== "Not started" && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0fdf4" }}>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Green Card Journey</p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{profile?.greenCardStage} · {profile?.greenCardCategory?.split(" ")[0] || ""}</p>
                    <Link href="/dashboard/profile?tab=greencard" className="text-xs font-medium mt-1 inline-block" style={{ color: "#2563eb" }}>View details →</Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  User, Calendar, FileSearch, TrendingUp, Save, Plus, Trash2,
  CheckCircle2, AlertCircle, Clock, ShieldCheck, ChevronRight,
} from "lucide-react";

const STORAGE_KEY = "visapilot_profile";

const VISA_TYPES = [
  "F-1 Student", "OPT", "STEM OPT", "H-1B", "H-4", "J-1", "J-2",
  "L-1A", "L-1B", "L-2", "O-1A", "O-1B", "TN", "E-3",
  "Green Card (Pending I-485)", "Green Card (LPR)", "Other",
];

const COUNTRIES = [
  "India", "China", "Mexico", "Philippines", "Brazil", "Nigeria",
  "South Korea", "Pakistan", "Canada", "United Kingdom", "Other",
];

const GC_STAGES = ["Not started", "PERM in progress", "I-140 pending", "I-140 approved", "Waiting for Priority Date", "I-485 pending", "Approved"];
const GC_CATEGORIES = ["EB-1A (Extraordinary Ability)", "EB-1B (Outstanding Researcher)", "EB-1C (Multinational Manager)", "EB-2 (Advanced Degree)", "EB-2 NIW (National Interest Waiver)", "EB-3 (Skilled Worker)", "Family-based"];
const FORM_TYPES = ["I-765 (EAD)", "I-129 (H-1B/O-1/L-1)", "I-140 (Immigrant Petition)", "I-485 (Adjustment of Status)", "I-131 (Advance Parole)", "I-539 (Extension)", "DS-160 (Visa)", "Other"];

interface CaseEntry { id: string; receipt: string; form: string; label: string; }

interface Profile {
  visaType: string;
  countryOfBirth: string;
  employer: string;
  i94Expiry: string;
  eadExpiry: string;
  visaStampExpiry: string;
  passportExpiry: string;
  h1bStartDate: string;
  optStartDate: string;
  stemOptStartDate: string;
  priorityDate: string;
  greenCardStage: string;
  greenCardCategory: string;
  cases: CaseEntry[];
}

const empty: Profile = {
  visaType: "", countryOfBirth: "", employer: "",
  i94Expiry: "", eadExpiry: "", visaStampExpiry: "", passportExpiry: "",
  h1bStartDate: "", optStartDate: "", stemOptStartDate: "", priorityDate: "",
  greenCardStage: "", greenCardCategory: "", cases: [],
};

function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function urgencyColor(days: number, threshold: number) {
  if (days <= threshold * 0.33) return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", label: "Critical" };
  if (days <= threshold * 0.66) return { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa", label: "Warning" };
  return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", label: "OK" };
}

const tabs = [
  { id: "status", label: "Visa Status", icon: User },
  { id: "dates", label: "Key Dates", icon: Calendar },
  { id: "cases", label: "USCIS Cases", icon: FileSearch },
  { id: "greencard", label: "Green Card", icon: TrendingUp },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(empty);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("status");
  const [newCase, setNewCase] = useState({ receipt: "", form: "", label: "" });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProfile(JSON.parse(stored));
    } catch {}
  }, []);

  function set(field: keyof Profile, value: string) {
    setProfile(p => ({ ...p, [field]: value }));
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function addCase() {
    if (!newCase.receipt || !newCase.form) return;
    setProfile(p => ({
      ...p,
      cases: [...p.cases, { ...newCase, id: Date.now().toString() }],
    }));
    setNewCase({ receipt: "", form: "", label: "" });
  }

  function removeCase(id: string) {
    setProfile(p => ({ ...p, cases: p.cases.filter(c => c.id !== id) }));
  }

  // Compute live alerts
  const dateAlerts = [
    { label: "I-94 Expiry", date: profile.i94Expiry, threshold: 60 },
    { label: "EAD / OPT Expiry", date: profile.eadExpiry, threshold: 90 },
    { label: "Visa Stamp Expiry", date: profile.visaStampExpiry, threshold: 60 },
    { label: "Passport Expiry", date: profile.passportExpiry, threshold: 180 },
  ]
    .filter(a => a.date)
    .map(a => ({ ...a, days: daysUntil(a.date)! }))
    .filter(a => a.days > 0)
    .sort((a, b) => a.days - b.days);

  const profileComplete = !!(profile.visaType && profile.countryOfBirth);

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Immigration Profile</h1>
          <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
            Your personal immigration dashboard — we use this to give you personalized alerts and accurate answers.
          </p>
        </div>
        <button
          onClick={save}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: saved ? "#16a34a" : "#2563eb" }}
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ backgroundColor: "#f1f5f9" }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeTab === tab.id ? "#ffffff" : "transparent",
                    color: activeTab === tab.id ? "#1d4ed8" : "#64748b",
                    boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab: Visa Status */}
          {activeTab === "status" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0f172a" }}>Current Immigration Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Current Visa / Status</label>
                    <select
                      value={profile.visaType}
                      onChange={e => set("visaType", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <option value="">Select visa type...</option>
                      {VISA_TYPES.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Country of Birth</label>
                    <select
                      value={profile.countryOfBirth}
                      onChange={e => set("countryOfBirth", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <option value="">Select country...</option>
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Current Employer / University</label>
                    <input
                      type="text"
                      value={profile.employer}
                      onChange={e => set("employer", e.target.value)}
                      placeholder="e.g. Google LLC / MIT"
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    />
                  </div>
                </div>
              </div>

              {profile.visaType && (
                <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Profile detected: {profile.visaType}</p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      {profile.visaType === "STEM OPT"
                        ? "STEM OPT holders: make sure to fill in your EAD expiry and start STEM OPT date. Your I-983 training plan deadlines are critical."
                        : profile.visaType === "H-1B"
                        ? "H-1B holders: add your I-94 expiry and H-1B start date. If your employer sponsored a green card, add your priority date too."
                        : profile.visaType.includes("I-485")
                        ? "I-485 pending: Do NOT travel without Advance Parole. Add your priority date so we can monitor the visa bulletin for you."
                        : "Fill in your key dates so we can alert you before deadlines."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Key Dates */}
          {activeTab === "dates" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0f172a" }}>Document & Status Expiry Dates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "i94Expiry", label: "I-94 Expiry Date", hint: "From i94.cbp.dhs.gov — your authorized stay" },
                    { key: "eadExpiry", label: "EAD Expiry Date", hint: "Employment Authorization Document (OPT / STEM OPT)" },
                    { key: "visaStampExpiry", label: "Visa Stamp Expiry", hint: "From your passport — needed for re-entry" },
                    { key: "passportExpiry", label: "Passport Expiry", hint: "Must be valid 6+ months for most re-entries" },
                    { key: "optStartDate", label: "OPT Start Date", hint: "First day of authorized OPT work" },
                    { key: "stemOptStartDate", label: "STEM OPT Start Date", hint: "First day of 24-month STEM extension" },
                    { key: "h1bStartDate", label: "H-1B Start Date", hint: "October 1 (or approved start date)" },
                    { key: "priorityDate", label: "Priority Date", hint: "Date PERM or I-140 was filed — for green card queue" },
                  ].map(({ key, label, hint }) => {
                    const days = daysUntil(profile[key as keyof Profile] as string);
                    return (
                      <div key={key}>
                        <label className="text-xs font-semibold mb-1 block" style={{ color: "#475569" }}>{label}</label>
                        <input
                          type="date"
                          value={profile[key as keyof Profile] as string}
                          onChange={e => set(key as keyof Profile, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                          style={{ borderColor: "#e2e8f0" }}
                        />
                        <p className="text-[10px] mt-1" style={{ color: "#94a3b8" }}>{hint}</p>
                        {days !== null && days > 0 && (
                          <p className="text-[10px] font-semibold mt-0.5" style={{ color: days < 60 ? "#dc2626" : days < 180 ? "#ea580c" : "#16a34a" }}>
                            {days} days remaining
                          </p>
                        )}
                        {days !== null && days <= 0 && (
                          <p className="text-[10px] font-bold mt-0.5 text-red-600">EXPIRED</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab: USCIS Cases */}
          {activeTab === "cases" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-1 text-sm" style={{ color: "#0f172a" }}>Pending USCIS Cases</h3>
                <p className="text-xs mb-4" style={{ color: "#64748b" }}>Add your receipt numbers — VisaPilot will monitor status changes and alert you.</p>

                <div className="space-y-3 mb-5">
                  {profile.cases.length === 0 && (
                    <div className="text-center py-6 rounded-xl" style={{ backgroundColor: "#f8fafc", border: "1px dashed #e2e8f0" }}>
                      <FileSearch className="h-8 w-8 mx-auto mb-2" style={{ color: "#cbd5e1" }} />
                      <p className="text-sm font-medium" style={{ color: "#94a3b8" }}>No cases added yet</p>
                    </div>
                  )}
                  {profile.cases.map(c => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "#e2e8f0" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono font-medium">{c.receipt}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{c.form}{c.label ? ` · ${c.label}` : ""}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>Monitoring</span>
                      <button onClick={() => removeCase(c.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border rounded-xl p-4" style={{ borderColor: "#e2e8f0", backgroundColor: "#f8fafc" }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: "#475569" }}>Add New Case</p>
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <input
                      type="text"
                      value={newCase.receipt}
                      onChange={e => setNewCase(n => ({ ...n, receipt: e.target.value.toUpperCase() }))}
                      placeholder="Receipt number (e.g. IOE0912345678)"
                      className="w-full px-3 py-2 rounded-lg border text-sm font-mono focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    />
                    <div className="flex gap-2">
                      <select
                        value={newCase.form}
                        onChange={e => setNewCase(n => ({ ...n, form: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: "#e2e8f0" }}
                      >
                        <option value="">Form type...</option>
                        {FORM_TYPES.map(f => <option key={f}>{f}</option>)}
                      </select>
                      <input
                        type="text"
                        value={newCase.label}
                        onChange={e => setNewCase(n => ({ ...n, label: e.target.value }))}
                        placeholder="Label (optional)"
                        className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: "#e2e8f0" }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addCase}
                    disabled={!newCase.receipt || !newCase.form}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                    style={{ backgroundColor: "#2563eb" }}
                  >
                    <Plus className="h-4 w-4" /> Add Case
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Green Card */}
          {activeTab === "greencard" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0f172a" }}>Green Card Journey</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Current Stage</label>
                    <select
                      value={profile.greenCardStage}
                      onChange={e => set("greenCardStage", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <option value="">Select stage...</option>
                      {GC_STAGES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Green Card Category</label>
                    <select
                      value={profile.greenCardCategory}
                      onChange={e => set("greenCardCategory", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <option value="">Select category...</option>
                      {GC_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {profile.greenCardStage && profile.greenCardStage !== "Not started" && (
                  <div className="mt-6">
                    <p className="text-xs font-semibold mb-3" style={{ color: "#475569" }}>Journey Progress</p>
                    <div className="flex items-center gap-0">
                      {GC_STAGES.filter(s => s !== "Not started").map((stage, i, arr) => {
                        const currentIndex = arr.indexOf(profile.greenCardStage);
                        const isCompleted = i < currentIndex;
                        const isCurrent = i === currentIndex;
                        return (
                          <div key={stage} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div
                                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                                style={{
                                  backgroundColor: isCompleted ? "#16a34a" : isCurrent ? "#2563eb" : "#e2e8f0",
                                  color: isCompleted || isCurrent ? "#ffffff" : "#94a3b8",
                                }}
                              >
                                {isCompleted ? "✓" : i + 1}
                              </div>
                              <p className="text-[9px] text-center mt-1 max-w-12 leading-tight" style={{ color: isCurrent ? "#2563eb" : "#94a3b8" }}>
                                {stage.replace(" in progress", "").replace(" pending", "").replace(" approved", "")}
                              </p>
                            </div>
                            {i < arr.length - 1 && (
                              <div className="flex-1 h-0.5 mx-1" style={{ backgroundColor: isCompleted ? "#16a34a" : "#e2e8f0" }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {profile.countryOfBirth === "India" && profile.greenCardCategory?.includes("EB-2") && (
                  <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-900">India EB-2 Backlog Alert</p>
                        <p className="text-xs text-orange-700 mt-1">The India EB-2 queue has an estimated wait of 50+ years at current rates. Consider exploring EB-1A or EB-1C paths which have no per-country backlog.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live preview */}
        <div className="space-y-4">
          {/* Completion status */}
          <div className="p-4 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "#475569" }}>Profile Completeness</p>
            {[
              { label: "Visa type set", done: !!profile.visaType },
              { label: "Country of birth", done: !!profile.countryOfBirth },
              { label: "At least one key date", done: !!(profile.i94Expiry || profile.eadExpiry || profile.passportExpiry) },
              { label: "Employer/school", done: !!profile.employer },
              { label: "Case number added", done: profile.cases.length > 0 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 mb-2">
                {item.done
                  ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  : <div className="h-4 w-4 rounded-full border-2 shrink-0" style={{ borderColor: "#e2e8f0" }} />}
                <span className="text-xs" style={{ color: item.done ? "#0f172a" : "#94a3b8" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Live deadline alerts */}
          <div className="p-4 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "#475569" }}>Your Active Alerts</p>
            {dateAlerts.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: "#94a3b8" }}>Add key dates to see alerts here</p>
            ) : (
              <div className="space-y-2">
                {dateAlerts.map(alert => {
                  const style = urgencyColor(alert.days, alert.threshold);
                  return (
                    <div key={alert.label} className="p-3 rounded-xl" style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold" style={{ color: style.text }}>{alert.label}</p>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: style.text + "20", color: style.text }}>
                          {alert.days}d
                        </span>
                      </div>
                      <p className="text-[10px] mt-0.5" style={{ color: style.text + "cc" }}>{style.label} — {new Date(alert.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cases being monitored */}
          {profile.cases.length > 0 && (
            <div className="p-4 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "#475569" }}>Monitored Cases ({profile.cases.length})</p>
              {profile.cases.map(c => (
                <div key={c.id} className="flex items-center gap-2 mb-2">
                  <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: "#2563eb" }} />
                  <div>
                    <p className="text-xs font-mono">{c.receipt}</p>
                    <p className="text-[10px]" style={{ color: "#94a3b8" }}>{c.form}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI tip based on visa */}
          {profile.visaType && (
            <div className="p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}>
              <p className="text-xs font-bold text-white mb-1">AI Insight for {profile.visaType}</p>
              <p className="text-xs text-white/80 leading-relaxed">
                {profile.visaType === "STEM OPT"
                  ? "STEM OPT holders must submit I-983 training plan within 10 days of job start and every 6 months. File H-1B lottery in March — this may be your last chance."
                  : profile.visaType === "OPT"
                  ? "OPT has a 90-day unemployment limit. Track every gap. Apply for STEM OPT extension before OPT expires if your degree qualifies."
                  : profile.visaType === "H-1B"
                  ? "H-1B can be extended beyond 6 years if your I-140 was approved 365+ days ago (AC21). Ask your employer about starting the green card process early."
                  : profile.visaType.includes("I-485")
                  ? "Never leave the US without Advance Parole while I-485 is pending. File I-131 now if you haven't. Check the visa bulletin monthly — your priority date matters."
                  : "Keep all immigration documents stored in your Document Vault. Set up alerts for expiring documents at least 90 days in advance."}
              </p>
              <a href="/ai-assistant" className="mt-3 flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-white">
                Ask AI a question <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

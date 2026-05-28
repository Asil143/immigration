"use client";

import { useState, useRef } from "react";
import {
  Upload, FileText, CheckCircle2, Sparkles, ArrowRight,
  RefreshCw, AlertCircle, Save, Eye, ChevronDown,
} from "lucide-react";

const STORAGE_KEY = "visapilot_profile";

type DocType = "I-797" | "I-20" | "EAD" | "Passport" | "I-485 Receipt" | "I-140 Approval";

const DOC_MOCKS: Record<DocType, {
  title: string; icon: string; color: string; textColor: string; border: string;
  fields: Record<string, string>; profileUpdates: Record<string, string>;
  summary: string; alerts: string[];
}> = {
  "I-797": {
    title: "H-1B Approval Notice (I-797)",
    icon: "🏢", color: "#f0fdf4", textColor: "#15803d", border: "#86efac",
    fields: {
      "Receipt Number": "WAC-25-123-45678",
      "Petitioner": "Google LLC",
      "Beneficiary": "Detected from upload",
      "Visa Classification": "H-1B",
      "Validity Period Start": "October 1, 2025",
      "Validity Period End": "September 30, 2028",
      "Service Center": "California Service Center",
      "Notice Date": "June 15, 2025",
    },
    profileUpdates: { visaType: "H-1B", employer: "Google LLC", h1bStartDate: "2025-10-01", i94Expiry: "2028-09-30" },
    summary: "H-1B approval for Google LLC, valid Oct 2025 – Sep 2028. Receipt number saved for case monitoring.",
    alerts: ["H-1B expires Sep 30, 2028 — set a renewal reminder for Jun 2028", "Start green card PERM process as early as possible with your employer"],
  },
  "I-20": {
    title: "Certificate of Eligibility (I-20)",
    icon: "🎓", color: "#eff6ff", textColor: "#1d4ed8", border: "#bfdbfe",
    fields: {
      "SEVIS ID": "N001234567",
      "Student Name": "Detected from upload",
      "School": "University of Texas Austin",
      "Program": "Master of Science – Computer Science",
      "Program Start Date": "August 22, 2023",
      "Program End Date": "May 15, 2025",
      "OPT Authorization": "Pending DSO signature",
      "Issued By": "Designated School Official",
    },
    profileUpdates: { visaType: "F-1 Student", employer: "University of Texas Austin" },
    summary: "F-1 I-20 for UT Austin MS Computer Science. Program ends May 2025 — OPT application window is now open.",
    alerts: ["Apply for OPT within 90 days of program end (May 2025)", "OPT application window is open — file I-765 now", "Consider STEM OPT if your degree qualifies"],
  },
  "EAD": {
    title: "Employment Authorization Card (EAD)",
    icon: "💼", color: "#faf5ff", textColor: "#6d28d9", border: "#d8b4fe",
    fields: {
      "Card Number": "SRC25901234567",
      "Category": "C(3)(C) — STEM OPT",
      "Card Expires": "May 15, 2027",
      "USCIS Online Account": "Detected from upload",
      "Employment Authorization": "Full — any employer",
      "Issuing Authority": "USCIS Nebraska Service Center",
    },
    profileUpdates: { visaType: "STEM OPT", eadExpiry: "2027-05-15" },
    summary: "STEM OPT EAD valid until May 15, 2027. Full work authorization for any employer in the US.",
    alerts: ["EAD expires May 15, 2027 — file H-1B in March 2026 or March 2027 lottery", "Cap-gap protection applies if H-1B filed before OPT expiry", "I-983 training plan must be updated every 6 months"],
  },
  "Passport": {
    title: "Passport",
    icon: "🛂", color: "#fff7ed", textColor: "#c2410c", border: "#fed7aa",
    fields: {
      "Passport Number": "Detected from upload",
      "Country of Issue": "India",
      "Date of Birth": "Detected from upload",
      "Issue Date": "June 10, 2021",
      "Expiry Date": "June 9, 2031",
      "Nationality": "Indian",
    },
    profileUpdates: { countryOfBirth: "India", passportExpiry: "2031-06-09" },
    summary: "Indian passport valid until June 2031. No action needed for 5+ years.",
    alerts: ["Passport valid until 2031 — renew at Indian consulate 1 year before expiry", "For H-1B visa stamping: bring this passport + I-797 + offer letter"],
  },
  "I-485 Receipt": {
    title: "I-485 Receipt Notice",
    icon: "🌿", color: "#f0fdf4", textColor: "#15803d", border: "#86efac",
    fields: {
      "Receipt Number": "MSC-25-901-23456",
      "Form": "I-485 — Application to Register Permanent Residence",
      "Priority Date": "June 15, 2022",
      "Category": "EB-2",
      "Country of Birth": "India",
      "Receipt Date": "January 10, 2025",
      "Service Center": "National Benefits Center",
    },
    profileUpdates: { visaType: "Green Card (Pending I-485)", greenCardStage: "I-485 pending", greenCardCategory: "EB-2 (Advanced Degree)", priorityDate: "2022-06-15" },
    summary: "I-485 pending for India EB-2. Priority date June 2022. Monitor visa bulletin monthly for movement.",
    alerts: ["DO NOT travel without Advance Parole — file I-131 immediately if you plan to travel", "Monitor visa bulletin monthly — alert when Jun 2022 India EB-2 becomes current", "Any job change must be in same or similar occupation (AC21 portability)"],
  },
  "I-140 Approval": {
    title: "I-140 Approval Notice",
    icon: "📋", color: "#ecfeff", textColor: "#0891b2", border: "#a5f3fc",
    fields: {
      "Receipt Number": "LIN-24-801-23456",
      "Form": "I-140 — Immigrant Petition for Alien Workers",
      "Classification": "EB-2 — Advanced Degree",
      "Petitioner/Company": "Microsoft Corporation",
      "Priority Date": "March 3, 2023",
      "Approval Date": "November 20, 2024",
      "Service Center": "Nebraska Service Center",
    },
    profileUpdates: { greenCardStage: "I-140 approved", greenCardCategory: "EB-2 (Advanced Degree)", priorityDate: "2023-03-03" },
    summary: "I-140 approved for EB-2. Priority date March 2023. You can now change employers with AC21 portability if needed.",
    alerts: ["I-140 approval gives you AC21 portability — you can change jobs to same occupation", "You are now eligible for H-1B extensions beyond 6 years", "File I-485 when India EB-2 March 2023 priority date becomes current"],
  },
};

const DOC_OPTIONS: { type: DocType; label: string; icon: string; desc: string }[] = [
  { type: "I-797", label: "I-797 Approval Notice", icon: "🏢", desc: "H-1B, O-1, L-1, or other nonimmigrant approvals" },
  { type: "I-20", label: "I-20 (F-1 Students)", icon: "🎓", desc: "Certificate of Eligibility from your school" },
  { type: "EAD", label: "EAD Card", icon: "💼", desc: "Employment Authorization Document (OPT/STEM OPT)" },
  { type: "Passport", label: "Passport", icon: "🛂", desc: "Extract expiry date and nationality" },
  { type: "I-485 Receipt", label: "I-485 Receipt", icon: "🌿", desc: "Adjustment of Status receipt notice" },
  { type: "I-140 Approval", label: "I-140 Approval", icon: "📋", desc: "Immigrant petition approval" },
];

type Stage = "select" | "upload" | "analyzing" | "result";

export default function SmartImportPage() {
  const [stage, setStage] = useState<Stage>("select");
  const [docType, setDocType] = useState<DocType | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const result = docType ? DOC_MOCKS[docType] : null;

  function selectDoc(type: DocType) {
    setDocType(type);
    setStage("upload");
  }

  function handleFile(file: File) {
    setFileName(file.name);
    setStage("analyzing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setStage("result"); return 100; }
        return p + Math.random() * 18 + 5;
      });
    }, 250);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function simulateUpload() {
    handleFile(new File([""], `${docType?.replace(" ", "_")}_sample.pdf`, { type: "application/pdf" }));
  }

  function saveToProfile() {
    if (!result) return;
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...result.profileUpdates }));
      setSaved(true);
    } catch {}
  }

  function reset() {
    setStage("select");
    setDocType(null);
    setFileName("");
    setProgress(0);
    setSaved(false);
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#2563eb" }}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Document Smart Import</h1>
        </div>
        <p className="text-sm" style={{ color: "#64748b" }}>
          Upload your I-797, EAD, I-20, or passport — AI extracts all key dates and auto-fills your profile.
        </p>
      </div>

      {/* Step 1: Select doc type */}
      {stage === "select" && (
        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: "#475569" }}>What document do you want to import?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOC_OPTIONS.map(opt => (
              <button
                key={opt.type}
                onClick={() => selectDoc(opt.type)}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all hover:shadow-sm"
                style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2563eb"; (e.currentTarget as HTMLElement).style.backgroundColor = "#eff6ff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff"; }}
              >
                <span className="text-3xl shrink-0">{opt.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{opt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{opt.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto shrink-0" style={{ color: "#cbd5e1" }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Upload */}
      {stage === "upload" && result && (
        <div>
          <button onClick={reset} className="text-xs font-medium mb-5 flex items-center gap-1" style={{ color: "#64748b" }}>
            ← Change document type
          </button>
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className="border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer"
            style={{ borderColor: dragOver ? "#2563eb" : "#e2e8f0", backgroundColor: dragOver ? "#eff6ff" : "#fafafa" }}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: result.color }}>
              <span className="text-3xl">{result.icon}</span>
            </div>
            <p className="font-bold text-lg mb-1">Drop your {docType} here</p>
            <p className="text-sm mb-4" style={{ color: "#64748b" }}>or click to browse — PDF, JPG, or PNG</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
              <Upload className="h-4 w-4" /> Choose file
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <Eye className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900">What AI will extract from your {docType}</p>
              <p className="text-xs text-blue-700 mt-0.5">{Object.keys(DOC_MOCKS[docType!].fields).join(" · ")}</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs mb-2" style={{ color: "#94a3b8" }}>Don't have the file handy? Try a demo extract:</p>
            <button onClick={simulateUpload} className="text-xs font-semibold px-4 py-2 rounded-xl border" style={{ borderColor: "#e2e8f0", color: "#2563eb" }}>
              ✨ Run Demo Extract for {docType}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Analyzing */}
      {stage === "analyzing" && (
        <div className="text-center py-12">
          <div className="relative h-24 w-24 mx-auto mb-6">
            <div className="h-24 w-24 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">AI is reading your document...</h2>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>{fileName || "Processing document"}</p>

          <div className="max-w-sm mx-auto">
            <div className="h-2 rounded-full" style={{ backgroundColor: "#e2e8f0" }}>
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: "#2563eb" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs" style={{ color: "#94a3b8" }}>
              <span>
                {progress < 30 ? "Detecting document type..." :
                 progress < 60 ? "Extracting key fields..." :
                 progress < 85 ? "Computing deadline dates..." : "Generating insights..."}
              </span>
              <span>{Math.min(Math.round(progress), 100)}%</span>
            </div>
          </div>

          <div className="mt-6 space-y-2 max-w-sm mx-auto text-left">
            {[
              { label: "Document type", done: progress > 20 },
              { label: "Key dates extracted", done: progress > 50 },
              { label: "Profile fields mapped", done: progress > 75 },
              { label: "Alerts generated", done: progress >= 100 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.done
                  ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                  : <div className="h-4 w-4 rounded-full border-2 border-gray-200" />}
                <span style={{ color: item.done ? "#0f172a" : "#94a3b8" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {stage === "result" && result && (
        <div>
          <div className="flex items-center gap-3 p-4 rounded-2xl mb-6" style={{ backgroundColor: result.color, border: `1px solid ${result.border}` }}>
            <span className="text-3xl">{result.icon}</span>
            <div className="flex-1">
              <p className="font-bold" style={{ color: result.textColor }}>{result.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{result.summary}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 shrink-0" style={{ color: result.textColor }} />
          </div>

          {/* Extracted fields */}
          <div className="rounded-2xl border overflow-hidden mb-5" style={{ borderColor: "#e2e8f0" }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: "#e2e8f0", backgroundColor: "#f8fafc" }}>
              <p className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" /> Extracted Fields
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: "#e2e8f0" }}>
              {Object.entries(result.fields).map(([key, value]) => (
                <div key={key} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: "#64748b" }}>{key}</span>
                  <span className="text-xs font-semibold text-right" style={{ color: "#0f172a" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart alerts */}
          <div className="mb-5">
            <p className="text-sm font-bold mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" /> Smart Alerts from This Document
            </p>
            <div className="space-y-2">
              {result.alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>
                  <span className="text-orange-500 shrink-0 mt-0.5">⚠</span>
                  <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>{alert}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile updates preview */}
          <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}>
            <p className="text-sm font-bold text-green-900 mb-2">Profile will be updated with:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(result.profileUpdates).map(([key, value]) => (
                <span key={key} className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={saveToProfile}
              disabled={saved}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all"
              style={{ backgroundColor: saved ? "#16a34a" : "#2563eb" }}
            >
              {saved ? <><CheckCircle2 className="h-4 w-4" /> Saved to Profile!</> : <><Save className="h-4 w-4" /> Save to My Profile</>}
            </button>
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border"
              style={{ borderColor: "#e2e8f0", color: "#475569" }}
            >
              <RefreshCw className="h-4 w-4" /> Import Another Document
            </button>
          </div>

          {saved && (
            <div className="mt-4 text-center">
              <a href="/dashboard/profile" className="text-sm font-semibold" style={{ color: "#2563eb" }}>
                View your updated profile →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

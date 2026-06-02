"use client";

import { useState, useRef } from "react";
import {
  Upload, FileText, CheckCircle2, Sparkles, ArrowRight,
  RefreshCw, AlertCircle, Save, Eye,
} from "lucide-react";

type DocType = "I-797" | "I-20" | "EAD" | "Passport" | "I-485 Receipt" | "I-140 Approval";

const DOC_OPTIONS: { type: DocType; label: string; icon: string; desc: string }[] = [
  { type: "I-797", label: "I-797 Approval Notice", icon: "🏢", desc: "H-1B, O-1, L-1, or other nonimmigrant approvals" },
  { type: "I-20", label: "I-20 (F-1 Students)", icon: "🎓", desc: "Certificate of Eligibility from your school" },
  { type: "EAD", label: "EAD Card", icon: "💼", desc: "Employment Authorization Document (OPT/STEM OPT)" },
  { type: "Passport", label: "Passport", icon: "🛂", desc: "Extract name, DOB, expiry and nationality" },
  { type: "I-485 Receipt", label: "I-485 Receipt", icon: "🌿", desc: "Adjustment of Status receipt notice" },
  { type: "I-140 Approval", label: "I-140 Approval", icon: "📋", desc: "Immigrant petition approval" },
];

const DOC_ICON: Record<string, string> = {
  "I-797": "🏢", "I-20": "🎓", "EAD": "💼", "Passport": "🛂",
  "I-485 Receipt": "🌿", "I-140 Approval": "📋",
};

const FIELD_LABELS: Record<string, string> = {
  first_name: "First Name", last_name: "Last Name", middle_name: "Middle Name",
  date_of_birth: "Date of Birth", country_of_birth: "Country of Birth",
  nationality: "Nationality", a_number: "A-Number",
  passport_number: "Passport Number", passport_expiry: "Passport Expiry",
  employer_name: "Employer / Company", visa_type: "Visa Classification",
  receipt_number: "Receipt Number", sevis_id: "SEVIS ID", school_name: "School / University",
  h1b_start_date: "H-1B Start Date", h1b_expiry: "H-1B Expiry",
  ead_expiry: "EAD Expiry", i20_end_date: "I-20 Program End Date",
  priority_date: "Priority Date",
};

// Map extracted_fields → Supabase profile column names
function buildProfileUpdates(fields: Record<string, string | null>): Record<string, string> {
  const out: Record<string, string> = {};
  const m: Record<string, string> = {
    first_name: "first_name", last_name: "last_name", middle_name: "middle_name",
    date_of_birth: "date_of_birth", country_of_birth: "country_of_birth",
    a_number: "a_number", employer_name: "employer",
    passport_expiry: "passport_expiry", h1b_start_date: "h1b_start_date",
    h1b_expiry: "h1b_expiry", ead_expiry: "ead_expiry",
    i20_end_date: "i20_end_date", priority_date: "priority_date",
  };
  for (const [k, col] of Object.entries(m)) {
    const v = fields[k];
    if (v) out[col] = v;
  }
  return out;
}

interface ExtractionResult {
  summary: string;
  extracted_fields: Record<string, string | null>;
  expiry_date: string | null;
  issues: string[];
  recommendations: string[];
}

type Stage = "select" | "upload" | "analyzing" | "result" | "error";

export default function SmartImportPage() {
  const [stage, setStage] = useState<Stage>("select");
  const [docType, setDocType] = useState<DocType | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function selectDoc(type: DocType) {
    setDocType(type);
    setStage("upload");
  }

  async function handleFile(file: File) {
    if (!docType) return;
    setFileName(file.name);
    setStage("analyzing");
    setProgress(0);
    setExtraction(null);
    setSaved(false);

    const interval = setInterval(() => {
      setProgress(p => p >= 88 ? 88 : p + Math.random() * 14 + 4);
    }, 400);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("docType", docType);

      const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
      clearInterval(interval);

      if (!res.ok) {
        const { error } = await res.json();
        setErrorMsg(error ?? "Upload failed");
        setStage("error");
        return;
      }

      const data = await res.json();
      setExtraction(data.extraction);
      setProgress(100);
      setStage("result");
    } catch {
      clearInterval(interval);
      setErrorMsg("Network error — please try again.");
      setStage("error");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function saveToProfile() {
    if (!extraction) return;
    const updates = buildProfileUpdates(extraction.extracted_fields);
    if (Object.keys(updates).length === 0) return;

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) setSaved(true);
  }

  function reset() {
    setStage("select");
    setDocType(null);
    setFileName("");
    setProgress(0);
    setSaved(false);
    setExtraction(null);
    setErrorMsg("");
  }

  const visibleFields = extraction
    ? Object.entries(extraction.extracted_fields).filter(([, v]) => v !== null && v !== "")
    : [];

  const profileUpdates = extraction ? buildProfileUpdates(extraction.extracted_fields) : {};

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
          Upload your I-797, EAD, I-20, or passport — AI extracts all key dates and auto-fills your profile and forms.
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
      {stage === "upload" && docType && (
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
            <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#eff6ff" }}>
              <span className="text-3xl">{DOC_ICON[docType] ?? "📄"}</span>
            </div>
            <p className="font-bold text-lg mb-1">Drop your {docType} here</p>
            <p className="text-sm mb-4" style={{ color: "#64748b" }}>or click to browse — PDF, JPG, PNG, or WebP · max 10 MB</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
              <Upload className="h-4 w-4" /> Choose file
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <Eye className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-900">What AI will extract from your {docType}</p>
              <p className="text-xs text-blue-700 mt-0.5">
                {Object.values(FIELD_LABELS).join(" · ")}
              </p>
            </div>
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
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>{fileName}</p>

          <div className="max-w-sm mx-auto">
            <div className="h-2 rounded-full" style={{ backgroundColor: "#e2e8f0" }}>
              <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: "#2563eb" }} />
            </div>
            <div className="flex justify-between mt-2 text-xs" style={{ color: "#94a3b8" }}>
              <span>
                {progress < 30 ? "Detecting document type..." :
                 progress < 60 ? "Extracting key fields..." :
                 progress < 85 ? "Mapping to your profile..." : "Finishing up..."}
              </span>
              <span>{Math.min(Math.round(progress), 100)}%</span>
            </div>
          </div>

          <div className="mt-6 space-y-2 max-w-sm mx-auto text-left">
            {[
              { label: "Document type detected", done: progress > 20 },
              { label: "Key fields extracted", done: progress > 55 },
              { label: "Profile fields mapped", done: progress > 78 },
              { label: "Insights generated", done: progress >= 100 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.done ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2 border-gray-200" />}
                <span style={{ color: item.done ? "#0f172a" : "#94a3b8" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {stage === "result" && extraction && (
        <div>
          <div className="flex items-center gap-3 p-4 rounded-2xl mb-6" style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}>
            <span className="text-3xl">{DOC_ICON[docType ?? ""] ?? "📄"}</span>
            <div className="flex-1">
              <p className="font-bold text-green-900">{docType}</p>
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{extraction.summary}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />
          </div>

          {/* Extracted fields */}
          {visibleFields.length > 0 ? (
            <div className="rounded-2xl border overflow-hidden mb-5" style={{ borderColor: "#e2e8f0" }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: "#e2e8f0", backgroundColor: "#f8fafc" }}>
                <p className="text-sm font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" /> Extracted Fields ({visibleFields.length})
                </p>
              </div>
              <div className="divide-y" style={{ borderColor: "#e2e8f0" }}>
                {visibleFields.map(([key, value]) => (
                  <div key={key} className="px-5 py-3 flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: "#64748b" }}>{FIELD_LABELS[key] ?? key}</span>
                    <span className="text-xs font-semibold text-right" style={{ color: "#0f172a" }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl mb-5 text-center" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>
              <p className="text-sm text-orange-700">No fields could be extracted — try a clearer scan or different format.</p>
            </div>
          )}

          {/* Issues */}
          {extraction.issues.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" /> Notes
              </p>
              <div className="space-y-2">
                {extraction.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>
                    <span className="text-orange-500 shrink-0 mt-0.5">⚠</span>
                    <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>{issue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile updates preview */}
          {Object.keys(profileUpdates).length > 0 && (
            <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}>
              <p className="text-sm font-bold text-green-900 mb-2">Will be saved to your profile:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(profileUpdates).map(([key, value]) => (
                  <span key={key} className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
                    {FIELD_LABELS[key] ?? key}: {value}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={saveToProfile}
              disabled={saved || Object.keys(profileUpdates).length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40"
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

      {/* Error state */}
      {stage === "error" && (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#fef2f2" }}>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-red-700">Upload Failed</h2>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>{errorMsg}</p>
          <button onClick={() => setStage("upload")} className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white" style={{ backgroundColor: "#2563eb" }}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

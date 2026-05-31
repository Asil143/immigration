"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuestPreviewBanner } from "@/components/ui/guest-preview-banner";
import { Upload, FileText, Shield, FolderOpen, Plus, ChevronDown, ChevronRight } from "lucide-react";

interface DocItem {
  name: string;
  hint: string;
  required?: boolean;
}

interface DocCategory {
  id: string;
  label: string;
  icon: string;
  items: DocItem[];
}

const docCategories: DocCategory[] = [
  {
    id: "identity",
    label: "Identity & Travel",
    icon: "🛂",
    items: [
      { name: "Passport (photo page)", hint: "Must be valid for 6+ months beyond stay", required: true },
      { name: "Passport (all entry stamps)", hint: "Scan all pages with stamps or visas" },
      { name: "Birth Certificate", hint: "Original or certified translation if non-English" },
      { name: "National ID Card", hint: "Home country government-issued ID" },
    ],
  },
  {
    id: "f1-student",
    label: "F-1 / Student Status",
    icon: "🎓",
    items: [
      { name: "I-20 (current, active)", hint: "Must have valid travel signature within 12 months", required: true },
      { name: "All prior I-20s", hint: "Keep all historical I-20s — may be requested at port of entry" },
      { name: "SEVIS Fee Receipt (I-901)", hint: "Proof you paid the SEVIS fee" },
      { name: "DS-160 Confirmation Page", hint: "Visa application confirmation barcode page" },
      { name: "Enrollment Verification Letter", hint: "From DSO / Registrar confirming full-time enrollment" },
    ],
  },
  {
    id: "entry",
    label: "Entry & Admission",
    icon: "✈️",
    items: [
      { name: "US Visa Stamp (all categories)", hint: "Photo page in passport showing visa label", required: true },
      { name: "I-94 Arrival/Departure Record", hint: "Download from i94.cbp.dhs.gov — check class of admission", required: true },
      { name: "CBP Admission Stamp", hint: "Passport page showing port-of-entry stamp & admit-until date" },
    ],
  },
  {
    id: "work-auth",
    label: "Work Authorization",
    icon: "💳",
    items: [
      { name: "EAD Card — OPT / STEM OPT", hint: "Employment Authorization Document (front & back)", required: false },
      { name: "EAD Card — Pending AOS (I-765)", hint: "EAD based on pending adjustment of status" },
      { name: "I-797 Approval Notice", hint: "For H-1B, L-1, O-1, TN approval — keep originals" },
      { name: "I-131A Carrier Documentation", hint: "If EAD was lost abroad — required to reboard" },
      { name: "Advance Parole (I-131)", hint: "Travel document while I-485 is pending — never leave without it" },
    ],
  },
  {
    id: "employment",
    label: "Employment",
    icon: "📝",
    items: [
      { name: "Offer Letter (current employer)", hint: "Signed offer letter with salary and job title" },
      { name: "I-9 Form", hint: "Employment eligibility verification — employer keeps original" },
      { name: "LCA (Labor Condition Application)", hint: "Certified by DOL — required for H-1B" },
      { name: "Employer Verification / Support Letter", hint: "Letter confirming employment status for visa applications" },
      { name: "Pay Stubs (last 3 months)", hint: "Proof of employment and income" },
    ],
  },
  {
    id: "education",
    label: "Education",
    icon: "📚",
    items: [
      { name: "College / University Transcripts", hint: "Official sealed transcripts from all US institutions" },
      { name: "Diploma / Degree Certificate", hint: "Awarded degree in English" },
      { name: "Foreign Credential Evaluation", hint: "Required if degree is from outside the US (e.g., WES, ECE)" },
      { name: "CPT Authorization Letters", hint: "All CPT approval letters from DSO" },
    ],
  },
  {
    id: "tax-financial",
    label: "Tax & Financial",
    icon: "💰",
    items: [
      { name: "Federal Tax Returns (last 3 years)", hint: "Form 1040 — critical for AOS, naturalization, and more" },
      { name: "W-2 / 1099 Forms", hint: "All income forms matching tax returns" },
      { name: "Social Security Card", hint: "Keep a scan — do not carry original daily" },
      { name: "Bank Statements (last 3 months)", hint: "Required for AOS I-864 financial support evidence" },
    ],
  },
  {
    id: "h1b",
    label: "H-1B / Work Visa Petitions",
    icon: "🏢",
    items: [
      { name: "I-129 Petition (H-1B)", hint: "Full petition package filed by employer" },
      { name: "I-797 H-1B Approval Notice", hint: "Keep original; carry copy when traveling" },
      { name: "LCA (DOL Certified)", hint: "DOL-certified Labor Condition Application" },
      { name: "H-4 EAD (if applicable)", hint: "Spouse work authorization based on pending I-140" },
    ],
  },
  {
    id: "green-card",
    label: "Green Card Process",
    icon: "🌿",
    items: [
      { name: "PERM / ETA-9089", hint: "Approved labor certification for EB-2 / EB-3 (if applicable)" },
      { name: "I-140 Approval Notice", hint: "Immigrant Petition for Alien Workers — priority date proof", required: false },
      { name: "I-485 Receipt Notice", hint: "Confirmation that AOS application was received by USCIS" },
      { name: "I-693 Medical Examination", hint: "Sealed envelope from USCIS-designated civil surgeon" },
      { name: "I-864 Affidavit of Support", hint: "Financial sponsor form — required for family-based and some EB cases" },
      { name: "I-797 Biometrics Appointment", hint: "ASC appointment notice for fingerprints & photo" },
      { name: "NIW Petition (I-140 self-petition)", hint: "EB-2 National Interest Waiver petition package" },
    ],
  },
  {
    id: "green-card-issued",
    label: "Permanent Residence (Issued)",
    icon: "🟢",
    items: [
      { name: "Permanent Resident Card — Front", hint: "Green Card with photo — keep digital backup" },
      { name: "Permanent Resident Card — Back", hint: "Back side with machine-readable zone" },
      { name: "I-551 Stamp (if card pending)", hint: "Temporary evidence of PR status stamped in passport" },
      { name: "Naturalization Certificate (N-400)", hint: "Certificate of Citizenship after naturalization (if applicable)" },
    ],
  },
  {
    id: "family",
    label: "Family & Dependents",
    icon: "👨‍👩‍👧",
    items: [
      { name: "Marriage Certificate", hint: "Official certificate — translated if non-English" },
      { name: "Spouse Visa / Status Documents", hint: "H-4, F-2, L-2, or other dependent visa docs" },
      { name: "Children's Birth Certificates", hint: "For each dependent child — translated if needed" },
      { name: "Dependent I-20 or I-94", hint: "For each dependent F-2 or other status holder" },
    ],
  },
];

const allDocSlots = docCategories.flatMap((cat) => cat.items.map((item) => item.name));

export default function DocumentVaultPage() {
  const { isSignedIn } = useUser();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["identity", "entry", "work-auth"]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const totalDocs = docCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Document Vault</h1>
          <p className="text-sm mt-1 text-muted-foreground">Securely store and organize all your immigration documents</p>
        </div>
        {isSignedIn ? (
          <Button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Upload Document
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Upload Document
            </Button>
          </SignInButton>
        )}
      </div>

      {!isSignedIn && (
        <GuestPreviewBanner
          title="Sign in to upload and store your documents"
          description="Create a free account to securely upload and access your immigration documents from anywhere."
        />
      )}

      <div className="flex items-start gap-3 p-4 rounded-xl mb-6 bg-green-50 border border-green-200">
        <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800 text-sm">Bank-grade encryption</p>
          <p className="text-sm text-green-700">All documents are encrypted at rest and in transit. Only you can access them.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Master Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-slate-700">Master Document Checklist</p>
            <Badge variant="secondary" className="text-xs">{totalDocs} documents</Badge>
          </div>

          {docCategories.map((cat) => {
            const isOpen = expandedCategories.includes(cat.id);
            return (
              <Card key={cat.id} className="overflow-hidden">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className="text-xs text-muted-foreground font-normal">({cat.items.length})</span>
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <CardContent className="pt-0 pb-3 px-4 space-y-2.5">
                    <div className="border-t pt-3 space-y-2.5">
                      {cat.items.map((item) => (
                        <div key={item.name} className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-slate-100 border border-slate-200">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium leading-snug">{item.name}</p>
                            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{item.hint}</p>
                          </div>
                          {item.required && (
                            <Badge variant="destructive" className="text-[9px] px-1 shrink-0 mt-0.5">Key</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Right — Upload area */}
        <div className="lg:col-span-2">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 text-center" style={{ borderColor: "#e2e8f0" }}>
            <FolderOpen className="h-12 w-12 text-slate-300 mb-3" />
            <p className="font-medium text-muted-foreground">No documents uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Upload your immigration documents to keep them organized and secure.</p>
            {isSignedIn ? (
              <Button variant="outline" onClick={() => setShowUploadModal(true)}>
                <Upload className="h-4 w-4 mr-2" /> Upload Your First Document
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" /> Sign in to Upload
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl p-6 bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-lg">Upload Document</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm border-slate-200">
                  {docCategories.map((cat) => (
                    <optgroup key={cat.id} label={`${cat.icon} ${cat.label}`}>
                      {cat.items.map((item) => (
                        <option key={item.name}>{item.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Expiry Date (optional)</label>
                <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm border-slate-200" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Notes (optional)</label>
                <input type="text" placeholder="e.g. Renewed May 2026" className="w-full border rounded-lg px-3 py-2 text-sm border-slate-200" />
              </div>
              <div className="border-2 border-dashed rounded-xl p-6 text-center border-slate-200">
                <Upload className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-medium">Click to select file</p>
                <p className="text-xs mt-1 text-muted-foreground">PDF, JPG, PNG · Max 10 MB</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowUploadModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => setShowUploadModal(false)}>Upload</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

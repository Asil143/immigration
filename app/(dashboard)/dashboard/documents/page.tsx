"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GuestPreviewBanner } from "@/components/ui/guest-preview-banner";
import {
  FileText, Upload, AlertCircle, CheckCircle2, Eye,
  Download, Trash2, Bot, Clock, Shield, ChevronDown, ChevronRight,
} from "lucide-react";
import type { Document, DocumentType } from "@/types";

type UploadedDoc = Document & { analyzed: boolean };

interface DocItem { name: string; hint: string; required?: boolean; }
interface DocCategory { id: string; label: string; icon: string; items: DocItem[]; }

const docCategories: DocCategory[] = [
  {
    id: "identity", label: "Identity & Travel", icon: "🛂",
    items: [
      { name: "Passport (photo page)", hint: "Valid for 6+ months beyond stay", required: true },
      { name: "Passport (all entry stamps)", hint: "Scan all pages with stamps or visas" },
      { name: "Birth Certificate", hint: "Original or certified translation if non-English" },
      { name: "National ID Card", hint: "Home country government-issued ID" },
    ],
  },
  {
    id: "f1-student", label: "F-1 / Student Status", icon: "🎓",
    items: [
      { name: "I-20 (current, active)", hint: "Valid travel signature within 12 months", required: true },
      { name: "All prior I-20s", hint: "Keep all historical I-20s" },
      { name: "SEVIS Fee Receipt (I-901)", hint: "Proof of SEVIS fee payment" },
      { name: "DS-160 Confirmation Page", hint: "Visa application barcode page" },
      { name: "Enrollment Verification Letter", hint: "From DSO / Registrar confirming enrollment" },
    ],
  },
  {
    id: "entry", label: "Entry & Admission", icon: "✈️",
    items: [
      { name: "US Visa Stamp", hint: "Passport page showing visa label", required: true },
      { name: "I-94 Arrival/Departure Record", hint: "Download from i94.cbp.dhs.gov", required: true },
      { name: "CBP Admission Stamp", hint: "Port-of-entry stamp & admit-until date" },
    ],
  },
  {
    id: "work-auth", label: "Work Authorization", icon: "💳",
    items: [
      { name: "EAD Card — OPT / STEM OPT", hint: "Front and back" },
      { name: "EAD Card — Pending AOS (I-765)", hint: "Based on pending adjustment of status" },
      { name: "I-797 Approval Notice", hint: "For H-1B, L-1, O-1 — keep originals" },
      { name: "Advance Parole (I-131)", hint: "Travel doc while I-485 pending — never leave without it" },
    ],
  },
  {
    id: "employment", label: "Employment", icon: "📝",
    items: [
      { name: "Offer Letter (current employer)", hint: "Signed offer with salary and title" },
      { name: "LCA (Labor Condition Application)", hint: "DOL-certified — required for H-1B" },
      { name: "Employer Verification Letter", hint: "Confirms employment status for visa apps" },
      { name: "Pay Stubs (last 3 months)", hint: "Proof of employment and income" },
    ],
  },
  {
    id: "education", label: "Education", icon: "📚",
    items: [
      { name: "College Transcripts (official)", hint: "Sealed transcripts from all US institutions" },
      { name: "Diploma / Degree Certificate", hint: "Awarded degree in English" },
      { name: "Foreign Credential Evaluation", hint: "e.g. WES, ECE — if degree is from outside the US" },
      { name: "CPT Authorization Letters", hint: "All CPT approval letters from DSO" },
    ],
  },
  {
    id: "tax-financial", label: "Tax & Financial", icon: "💰",
    items: [
      { name: "Federal Tax Returns (last 3 years)", hint: "Form 1040 — critical for AOS and more" },
      { name: "W-2 / 1099 Forms", hint: "All income forms matching tax returns" },
      { name: "Social Security Card", hint: "Keep a scan — do not carry original daily" },
      { name: "Bank Statements (last 3 months)", hint: "Required for I-864 financial support" },
    ],
  },
  {
    id: "green-card", label: "Green Card Process", icon: "🌿",
    items: [
      { name: "PERM / ETA-9089", hint: "Approved labor cert for EB-2 / EB-3" },
      { name: "I-140 Approval Notice", hint: "Immigrant Petition — priority date proof" },
      { name: "I-485 Receipt Notice", hint: "USCIS confirmation of AOS application" },
      { name: "I-693 Medical Examination", hint: "Sealed envelope from civil surgeon" },
      { name: "I-864 Affidavit of Support", hint: "Financial sponsor form" },
      { name: "NIW Petition (self-petition I-140)", hint: "EB-2 National Interest Waiver package" },
    ],
  },
  {
    id: "green-card-issued", label: "Permanent Residence", icon: "🟢",
    items: [
      { name: "Permanent Resident Card — Front", hint: "Green Card with photo" },
      { name: "Permanent Resident Card — Back", hint: "Back side with machine-readable zone" },
      { name: "I-551 Stamp (if card pending)", hint: "Temporary evidence of PR status" },
      { name: "Naturalization Certificate (N-400)", hint: "Certificate of Citizenship if naturalized" },
    ],
  },
  {
    id: "family", label: "Family & Dependents", icon: "👨‍👩‍👧",
    items: [
      { name: "Marriage Certificate", hint: "Official — translated if non-English" },
      { name: "Spouse Visa / Status Documents", hint: "H-4, F-2, L-2 or other dependent docs" },
      { name: "Children's Birth Certificates", hint: "For each dependent child" },
      { name: "Dependent I-20 or I-94", hint: "For each F-2 or other status dependent" },
    ],
  },
];

const docTypeIcon: Record<DocumentType, string> = {
  "I-20": "📄", "I-94": "📋", "I-797": "📜", "I-765": "📑",
  "I-131": "📃", "Passport": "🛂", "Visa Stamp": "🏷️",
  "EAD": "💳", "Other": "📁",
};

const docTypeColor: Record<DocumentType, string> = {
  "I-20": "bg-blue-50 text-blue-700",
  "I-94": "bg-purple-50 text-purple-700",
  "I-797": "bg-green-50 text-green-700",
  "I-765": "bg-orange-50 text-orange-700",
  "I-131": "bg-pink-50 text-pink-700",
  "Passport": "bg-red-50 text-red-700",
  "Visa Stamp": "bg-yellow-50 text-yellow-700",
  "EAD": "bg-teal-50 text-teal-700",
  "Other": "bg-slate-50 text-slate-700",
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { isSignedIn } = useUser();
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [selected, setSelected] = useState<UploadedDoc | null>(null);
  const [dragging, setDragging] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["identity", "entry", "work-auth"]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function deleteDoc(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  const analyzed = docs.filter((d) => d.analyzed);
  const pending = docs.filter((d) => !d.analyzed);
  const totalDocs = docCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="mt-1 text-muted-foreground text-sm">Upload immigration documents for AI analysis and secure storage</p>
        </div>
      </div>

      {!isSignedIn && (
        <GuestPreviewBanner
          title="Sign in to upload and store your documents"
          description="Create a free account to securely upload, analyze, and access your immigration documents from anywhere."
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Master Checklist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">Document Checklist</p>
            <Badge variant="secondary" className="text-xs">{totalDocs} docs</Badge>
          </div>

          {docCategories.map((cat) => {
            const isOpen = expandedCategories.includes(cat.id);
            return (
              <Card key={cat.id} className="overflow-hidden">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-xs font-medium">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className="text-muted-foreground font-normal">({cat.items.length})</span>
                  </span>
                  {isOpen
                    ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  }
                </button>
                {isOpen && (
                  <CardContent className="pt-0 pb-3 px-3">
                    <div className="border-t pt-2.5 space-y-2">
                      {cat.items.map((item) => (
                        <div key={item.name} className="flex items-start gap-2">
                          <div className="h-3.5 w-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-slate-100 border border-slate-200">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium leading-snug">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{item.hint}</p>
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

        {/* Right — Upload + Documents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
            <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-green-700">All documents encrypted at rest and in transit. Only you can access them.</p>
          </div>

          {/* Upload zone */}
          {isSignedIn ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-slate-50"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Drop your immigration documents here</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    I-20, passport, I-797, I-94, EAD, visa stamp — PDF, JPG, PNG up to 10 MB
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" /> Browse Files
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed p-8 text-center border-slate-200">
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-slate-100 p-3">
                  <Upload className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">Upload your immigration documents</p>
                  <p className="text-xs text-muted-foreground mt-1">Sign in to upload and get AI-powered analysis</p>
                </div>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm">Sign in to Upload</Button>
                </SignInButton>
              </div>
            </div>
          )}

          {/* Document list */}
          {docs.length === 0 ? (
            <div className="text-center py-10 rounded-xl border border-dashed">
              <FileText className="h-8 w-8 mx-auto mb-3 text-slate-300" />
              <p className="font-medium text-muted-foreground text-sm">No documents uploaded yet</p>
              <p className="text-xs text-muted-foreground mt-1">Upload documents above — AI will extract key fields and flag issues.</p>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All ({docs.length})</TabsTrigger>
                <TabsTrigger value="analyzed" className="gap-1.5">
                  <Bot className="h-3.5 w-3.5" /> Analyzed ({analyzed.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  <Clock className="mr-1.5 h-3.5 w-3.5" /> Pending ({pending.length})
                </TabsTrigger>
              </TabsList>

              {(["all", "analyzed", "pending"] as const).map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {(tab === "all" ? docs : tab === "analyzed" ? analyzed : pending).map((doc) => (
                      <Card key={doc.id} className="group hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className={`rounded-lg p-2.5 text-xl ${docTypeColor[doc.document_type]}`}>
                              {docTypeIcon[doc.document_type]}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setSelected(doc)} className="rounded p-1.5 hover:bg-accent" title="View analysis">
                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                              <button className="rounded p-1.5 hover:bg-accent" title="Download">
                                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                              <button onClick={() => deleteDoc(doc.id)} className="rounded p-1.5 hover:bg-accent" title="Delete">
                                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                              </button>
                            </div>
                          </div>

                          <h3 className="mt-3 font-medium text-sm truncate">{doc.name}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">{doc.document_type}</Badge>
                            <span className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)}</span>
                          </div>

                          {doc.analyzed && doc.ai_analysis ? (
                            <div className="mt-3 space-y-2">
                              {doc.ai_analysis.issues.length > 0 ? (
                                <div className="flex items-start gap-1.5 text-xs text-red-600 bg-red-50 rounded p-2">
                                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                  {doc.ai_analysis.issues[0]}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 rounded p-2">
                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                  No issues detected
                                </div>
                              )}
                              {doc.ai_analysis.expiry_date && (
                                <p className="text-xs text-muted-foreground">
                                  Expires: {new Date(doc.ai_analysis.expiry_date).toLocaleDateString()}
                                </p>
                              )}
                              <Button variant="ghost" size="sm" className="w-full h-7 text-xs" onClick={() => setSelected(doc)}>
                                <Bot className="mr-1.5 h-3.5 w-3.5" /> View AI Analysis
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-3">
                              <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                                <Bot className="mr-1.5 h-3.5 w-3.5" /> Analyze with AI
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>

      {/* AI Analysis modal */}
      {selected?.ai_analysis && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Analysis — {selected.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-900 mb-1">Summary</p>
                <p className="text-sm text-blue-800">{selected.ai_analysis.summary}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Extracted Fields</p>
                <div className="rounded-lg border divide-y text-sm">
                  {Object.entries(selected.ai_analysis.extracted_fields).map(([k, v]) => (
                    <div key={k} className="flex px-3 py-2">
                      <span className="w-40 shrink-0 text-muted-foreground">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selected.ai_analysis.issues.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2 text-red-600">Issues Found</p>
                  {selected.ai_analysis.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded p-3 mb-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      {issue}
                    </div>
                  ))}
                </div>
              )}
              {selected.ai_analysis.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Recommendations</p>
                  {selected.ai_analysis.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm bg-green-50 rounded p-3 mb-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                      <span className="text-green-800">{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

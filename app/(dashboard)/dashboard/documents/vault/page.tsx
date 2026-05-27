"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Eye, Download, Trash2, Shield, AlertCircle, CheckCircle2, FolderOpen, Plus } from "lucide-react";

interface VaultDoc {
  id: string;
  name: string;
  category: string;
  uploadedAt: string;
  expiresAt?: string;
  size: string;
  status: "valid" | "expiring" | "expired";
  type: string;
}

const mockDocs: VaultDoc[] = [
  { id: "1", name: "Passport (India) — Expires 2027", category: "Passport", uploadedAt: "Jan 15, 2025", expiresAt: "Mar 5, 2027", size: "2.4 MB", status: "valid", type: "PDF" },
  { id: "2", name: "I-20 — Spring 2025 (Travel Endorsed)", category: "I-20", uploadedAt: "Jan 8, 2025", expiresAt: "May 31, 2025", size: "0.8 MB", status: "expiring", type: "PDF" },
  { id: "3", name: "EAD Card — OPT", category: "EAD", uploadedAt: "Feb 1, 2025", expiresAt: "Feb 28, 2026", size: "0.5 MB", status: "valid", type: "JPG" },
  { id: "4", name: "I-797 H-1B Approval (FY2024)", category: "I-797", uploadedAt: "Oct 3, 2024", size: "1.2 MB", status: "valid", type: "PDF" },
  { id: "5", name: "I-94 Printout — Most Recent Entry", category: "I-94", uploadedAt: "Aug 22, 2024", size: "0.2 MB", status: "valid", type: "PDF" },
  { id: "6", name: "Social Security Card", category: "SSN", uploadedAt: "Mar 10, 2023", size: "0.3 MB", status: "valid", type: "JPG" },
  { id: "7", name: "Degree Certificate — MS Computer Science", category: "Education", uploadedAt: "Dec 15, 2023", size: "1.8 MB", status: "valid", type: "PDF" },
  { id: "8", name: "SEVIS Fee Receipt (I-901)", category: "SEVIS", uploadedAt: "Aug 1, 2022", size: "0.4 MB", status: "expired", type: "PDF" },
];

const categories = ["All", "Passport", "I-20", "EAD", "I-797", "I-94", "SSN", "Education", "SEVIS"];

const docSlots = [
  { name: "Passport", icon: "🛂", required: true, hint: "Upload photo page" },
  { name: "F-1 I-20", icon: "🎓", required: true, hint: "Must have current travel signature" },
  { name: "EAD Card", icon: "💳", required: false, hint: "Front and back" },
  { name: "I-797 Approval", icon: "📋", required: false, hint: "For H-1B, L-1, O-1" },
  { name: "I-94 Record", icon: "📄", required: true, hint: "Download from i94.cbp.dhs.gov" },
  { name: "Offer Letter", icon: "📝", required: false, hint: "From employer" },
  { name: "Advance Parole", icon: "✈️", required: false, hint: "I-131 approval (if I-485 pending)" },
  { name: "Tax Returns", icon: "💼", required: false, hint: "Last 2 years W-2s" },
];

export default function DocumentVaultPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filtered = mockDocs.filter((d) => activeCategory === "All" || d.category === activeCategory);
  const expiring = mockDocs.filter((d) => d.status === "expiring").length;
  const expired = mockDocs.filter((d) => d.status === "expired").length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Document Vault</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>Securely store and organize all your immigration documents</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Upload Document
        </Button>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl mb-6" style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}>
        <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800 text-sm">Bank-grade encryption</p>
          <p className="text-sm text-green-700">All documents are encrypted at rest and in transit. Only you can access them. We never share your documents with third parties.</p>
        </div>
      </div>

      {/* Alert banners */}
      {(expiring > 0 || expired > 0) && (
        <div className="space-y-2 mb-6">
          {expiring > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: "#fef9c3", border: "1px solid #fde047" }}>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">{expiring} document{expiring > 1 ? "s are" : " is"} expiring soon — renew before travel</p>
            </div>
          )}
          {expired > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700">{expired} document{expired > 1 ? "s have" : " has"} expired</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document checklist */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Document Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {docSlots.map((slot) => {
                const uploaded = mockDocs.some((d) => d.category.toLowerCase().includes(slot.name.toLowerCase().split(" ")[0].toLowerCase()));
                return (
                  <div key={slot.name} className="flex items-center gap-2">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0`} style={{ backgroundColor: uploaded ? "#dcfce7" : "#f1f5f9" }}>
                      {uploaded ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#cbd5e1" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{slot.icon} {slot.name}</p>
                      <p className="text-[11px]" style={{ color: "#94a3b8" }}>{slot.hint}</p>
                    </div>
                    {slot.required && !uploaded && <Badge variant="destructive" className="text-[10px] px-1">Missing</Badge>}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Documents list */}
        <div className="lg:col-span-2">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                style={{
                  backgroundColor: activeCategory === cat ? "#2563eb" : "#f1f5f9",
                  color: activeCategory === cat ? "#ffffff" : "#64748b",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border flex items-center gap-3" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#f1f5f9" }}>
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs" style={{ color: "#94a3b8" }}>{doc.type} · {doc.size} · Uploaded {doc.uploadedAt}</span>
                    {doc.expiresAt && (
                      <span className="text-xs" style={{ color: doc.status === "valid" ? "#64748b" : doc.status === "expiring" ? "#ca8a04" : "#dc2626" }}>
                        · Expires {doc.expiresAt}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant={doc.status === "valid" ? "success" : doc.status === "expiring" ? "warning" : "destructive"} className="text-[10px] px-1.5 capitalize">
                    {doc.status}
                  </Badge>
                  <button className="p-1.5 rounded-md hover:bg-slate-100 transition-colors">
                    <Eye className="h-3.5 w-3.5" style={{ color: "#64748b" }} />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-slate-100 transition-colors">
                    <Download className="h-3.5 w-3.5" style={{ color: "#64748b" }} />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-red-50 transition-colors">
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload drop zone */}
          <div
            className="mt-4 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
            style={{ borderColor: "#cbd5e1" }}
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: "#94a3b8" }} />
            <p className="font-medium text-sm">Drop files here or click to upload</p>
            <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>PDF, JPG, PNG up to 10 MB · Encrypted before storage</p>
          </div>
        </div>
      </div>

      {/* Upload modal placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ backgroundColor: "#ffffff" }}>
            <div className="flex items-center gap-3 mb-4">
              <FolderOpen className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-lg">Upload Document</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Document Type</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" style={{ borderColor: "#e2e8f0" }}>
                  {docSlots.map((s) => <option key={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Expiry Date (optional)</label>
                <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" style={{ borderColor: "#e2e8f0" }} />
              </div>
              <div className="border-2 border-dashed rounded-xl p-6 text-center" style={{ borderColor: "#e2e8f0" }}>
                <Upload className="h-6 w-6 mx-auto mb-2" style={{ color: "#94a3b8" }} />
                <p className="text-sm font-medium">Click to select file</p>
                <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>PDF, JPG, PNG · Max 10 MB</p>
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

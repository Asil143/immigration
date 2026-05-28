"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Shield, FolderOpen, Plus, CheckCircle2 } from "lucide-react";

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
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Document Vault</h1>
          <p className="text-sm mt-1 text-muted-foreground">Securely store and organize all your immigration documents</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Upload Document
        </Button>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl mb-6 bg-green-50 border border-green-200">
        <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800 text-sm">Bank-grade encryption</p>
          <p className="text-sm text-green-700">All documents are encrypted at rest and in transit. Only you can access them.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Document Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {docSlots.map((slot) => (
                <div key={slot.name} className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 bg-slate-100">
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{slot.icon} {slot.name}</p>
                    <p className="text-[11px] text-muted-foreground">{slot.hint}</p>
                  </div>
                  {slot.required && <Badge variant="destructive" className="text-[10px] px-1">Missing</Badge>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 text-center" style={{ borderColor: "#e2e8f0" }}>
            <FolderOpen className="h-12 w-12 text-slate-300 mb-3" />
            <p className="font-medium text-muted-foreground">No documents uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Upload your immigration documents to keep them organized and secure.</p>
            <Button variant="outline" onClick={() => setShowUploadModal(true)}>
              <Upload className="h-4 w-4 mr-2" /> Upload Your First Document
            </Button>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl p-6 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-lg">Upload Document</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Document Type</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm border-slate-200">
                  {docSlots.map((s) => <option key={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Expiry Date (optional)</label>
                <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm border-slate-200" />
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

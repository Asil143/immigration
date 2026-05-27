"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText, Upload, AlertCircle, CheckCircle2, Eye,
  Download, Trash2, Bot, Clock, Shield,
} from "lucide-react";
import type { Document, DocumentType } from "@/types";

type MockDoc = Document & { analyzed: boolean };

const MOCK_DOCS: MockDoc[] = [
  {
    id: "1", user_id: "u1", case_id: "1",
    name: "I-20 Spring 2025.pdf", document_type: "I-20",
    storage_path: "/docs/i20.pdf", file_size: 248320, analyzed: true,
    ai_analysis: {
      summary: "Valid I-20 for Spring 2025 semester. Program end date May 15, 2025.",
      extracted_fields: {
        "Student Name": "Asil K.",
        "SEVIS ID": "N0012345678",
        "Program Start": "2022-08-20",
        "Program End": "2025-05-15",
        "School": "University of Texas Austin",
        "Major": "Computer Science",
      },
      issues: [],
      recommendations: ["Apply for OPT at least 90 days before program end date (by Feb 14)."],
      expiry_date: "2025-05-15",
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "2", user_id: "u1", case_id: "1",
    name: "Passport Bio Page.jpg", document_type: "Passport",
    storage_path: "/docs/passport.jpg", file_size: 1048576, analyzed: true,
    ai_analysis: {
      summary: "Indian passport valid until March 2027.",
      extracted_fields: {
        "Name": "ASIL KAMEPALLI",
        "Nationality": "Indian",
        "Passport No": "P1234567",
        "Date of Birth": "1999-04-15",
        "Expiry Date": "2027-03-22",
      },
      issues: [],
      recommendations: ["Passport is valid. Renew when less than 6 months remain before expiry."],
      expiry_date: "2027-03-22",
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "3", user_id: "u1", case_id: "1",
    name: "I-797 Receipt Notice.pdf", document_type: "I-797",
    storage_path: "/docs/i797.pdf", file_size: 312000, analyzed: true,
    ai_analysis: {
      summary: "USCIS receipt notice for I-765 OPT application. Receipt number IOE0912345678.",
      extracted_fields: {
        "Receipt Number": "IOE0912345678",
        "Form Type": "I-765",
        "Priority Date": "2025-02-15",
        "Estimated Completion": "150 days",
      },
      issues: [],
      recommendations: ["Track your case at egov.uscis.gov with receipt number IOE0912345678."],
      expiry_date: null,
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "4", user_id: "u1", case_id: null,
    name: "I-94 Arrival Record.pdf", document_type: "I-94",
    storage_path: "/docs/i94.pdf", file_size: 98304, analyzed: false,
    ai_analysis: null,
    created_at: new Date().toISOString(),
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
  const [docs, setDocs] = useState<MockDoc[]>(MOCK_DOCS);
  const [selected, setSelected] = useState<MockDoc | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    // UI only — no real upload
  }

  function deleteDoc(id: string) {
    setDocs(prev => prev.filter(d => d.id !== id));
  }

  const analyzed = docs.filter(d => d.analyzed);
  const pending = docs.filter(d => !d.analyzed);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="mt-1 text-muted-foreground">Upload immigration documents for AI-powered analysis</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mb-8 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-slate-50"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Drop your immigration documents here</p>
            <p className="text-sm text-muted-foreground mt-1">
              I-20, passport, I-797, I-94, EAD, visa stamp — PDF, JPG, PNG up to 10MB
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" /> Browse Files
          </Button>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-green-500" />
            Encrypted & private — we never train AI on your documents
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All ({docs.length})</TabsTrigger>
          <TabsTrigger value="analyzed" className="gap-1.5">
            <Bot className="h-3.5 w-3.5" /> Analyzed ({analyzed.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Clock className="mr-1.5 h-3.5 w-3.5" /> Pending ({pending.length})
          </TabsTrigger>
        </TabsList>

        {(["all", "analyzed", "pending"] as const).map(tab => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {(tab === "all" ? docs : tab === "analyzed" ? analyzed : pending).map(doc => (
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

      {/* AI Analysis dialog */}
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

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FilePlus2, ChevronRight, ChevronLeft, CheckCircle2, Copy, Download, Sparkles, FileText, User, Building2 } from "lucide-react";

const DOC_TYPES = [
  {
    id: "i765-cover",
    icon: FileText,
    title: "I-765 Cover Letter",
    description: "Professional cover letter for your Employment Authorization Document application",
    badge: null,
    fields: ["fullName", "dateOfBirth", "alienNumber", "visaStatus", "ssn", "employer", "jobTitle", "optStartDate"],
  },
  {
    id: "stem-opt-letter",
    icon: Building2,
    title: "STEM OPT Training Plan Letter",
    description: "Employer training plan letter required for STEM OPT extension (Form I-983)",
    badge: null,
    fields: ["fullName", "employer", "jobTitle", "supervisor", "salary", "startDate", "degree", "fieldOfStudy"],
  },
  {
    id: "employer-support",
    icon: Building2,
    title: "H-1B Employer Support Letter",
    description: "Support letter from employer confirming specialty occupation and salary",
    badge: null,
    fields: ["fullName", "employer", "jobTitle", "salary", "startDate", "degree", "hrName", "hrTitle"],
  },
  {
    id: "rfe-response",
    icon: FileText,
    title: "RFE Response Draft",
    description: "AI-drafted response to a Request for Evidence based on your case details",
    badge: "Pro",
    fields: ["fullName", "receiptNumber", "rfeType", "rfeText", "employer", "jobTitle"],
  },
  {
    id: "niw-petition",
    icon: User,
    title: "EB-2 NIW Petition Letter",
    description: "National Interest Waiver self-petition cover letter highlighting your qualifications",
    badge: "Pro",
    fields: ["fullName", "degree", "fieldOfStudy", "employer", "jobTitle", "publications", "achievements"],
  },
];

const FIELD_META: Record<string, { label: string; type: string; placeholder: string }> = {
  fullName: { label: "Full Legal Name", type: "text", placeholder: "As on passport" },
  dateOfBirth: { label: "Date of Birth", type: "date", placeholder: "" },
  alienNumber: { label: "Alien/USCIS Number (A-Number)", type: "text", placeholder: "A-000000000 (if applicable)" },
  visaStatus: { label: "Current Visa Status", type: "text", placeholder: "F-1 OPT, H-4, etc." },
  ssn: { label: "Social Security Number", type: "text", placeholder: "XXX-XX-XXXX (if applicable)" },
  employer: { label: "Employer / Company Name", type: "text", placeholder: "" },
  jobTitle: { label: "Job Title", type: "text", placeholder: "" },
  optStartDate: { label: "OPT Start Date", type: "date", placeholder: "" },
  supervisor: { label: "Supervisor Name", type: "text", placeholder: "" },
  salary: { label: "Annual Salary (USD)", type: "text", placeholder: "e.g. $100,000" },
  startDate: { label: "Employment Start Date", type: "date", placeholder: "" },
  degree: { label: "Degree", type: "text", placeholder: "e.g. M.S. Computer Science" },
  fieldOfStudy: { label: "Field of Study (STEM)", type: "text", placeholder: "e.g. Computer Science, CIP 11.0101" },
  hrName: { label: "HR / Signing Officer Name", type: "text", placeholder: "" },
  hrTitle: { label: "HR / Signing Officer Title", type: "text", placeholder: "e.g. HR Director" },
  receiptNumber: { label: "USCIS Receipt Number", type: "text", placeholder: "e.g. WAC2512345678" },
  rfeType: { label: "Type of RFE", type: "text", placeholder: "e.g. Specialty occupation, Employer-employee relationship" },
  rfeText: { label: "Paste Your RFE Notice Text", type: "textarea", placeholder: "Paste the full text from your RFE notice..." },
  publications: { label: "Publications & Citations", type: "textarea", placeholder: "List key publications, patents, or citations..." },
  achievements: { label: "Notable Achievements", type: "textarea", placeholder: "Awards, recognition, contributions to your field..." },
};

const MOCK_OUTPUT = `[GENERATED DOCUMENT]

RE: Application for Employment Authorization Document — Form I-765

Dear USCIS Officer,

I, [Full Name], am writing in support of my enclosed Form I-765, Application for Employment Authorization. I am currently in valid F-1 status at [University Name] and am applying for Optional Practical Training (OPT) effective [OPT Start Date].

I am eligible for OPT under 8 C.F.R. §274a.12(c)(3)(i)(B) as a full-time F-1 student who has been enrolled for at least one full academic year and whose program of study relates directly to the employment I am seeking.

The following documents are enclosed with this application:
• Form I-765 (signed and dated)
• Copy of Form I-20 with OPT recommendation (signed by DSO)
• Copy of passport (biographical page)
• Two passport-style photographs
• Copy of all previous EAD cards (if applicable)
• Filing fee payment

Please do not hesitate to contact me at [email] or [phone] if additional information is required.

Respectfully submitted,

[Full Name]
Date: [Today's Date]
USCIS Receipt: [Alien Number if applicable]`;

export default function GeneratePage() {
  const [step, setStep] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const docType = DOC_TYPES.find(d => d.id === selectedDoc);

  function handleField(key: string, val: string) {
    setFields(f => ({ ...f, [key]: val }));
  }

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setStep(3);
    }, 2000);
  }

  function handleCopy() {
    navigator.clipboard.writeText(MOCK_OUTPUT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <FilePlus2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Document Generator</h1>
        </div>
        <p className="text-muted-foreground">AI-powered immigration document drafting</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: "Choose Document" },
          { n: 2, label: "Fill Details" },
          { n: 3, label: "Review & Export" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step > s.n ? "bg-green-500 text-white" : step === s.n ? "bg-primary text-white" : "bg-slate-100 text-muted-foreground"
              }`}>
                {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === s.n ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px mx-2 ${step > s.n ? "bg-green-500" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Choose document type */}
      {step === 1 && (
        <div className="space-y-3">
          {DOC_TYPES.map(doc => {
            const Icon = doc.icon;
            const isSelected = selectedDoc === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc.id)}
                className={`w-full text-left rounded-xl border p-4 transition-all flex items-center gap-4 ${
                  isSelected ? "border-primary bg-primary/5 shadow-sm" : "hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
                <div className={`rounded-lg p-2.5 ${isSelected ? "bg-primary text-white" : "bg-slate-100 text-muted-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{doc.title}</p>
                    {doc.badge && <Badge variant="secondary" className="text-[10px] px-1.5">{doc.badge}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-4">{doc.description}</p>
                </div>
                {isSelected && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
              </button>
            );
          })}

          <div className="flex justify-end pt-2">
            <Button onClick={() => setStep(2)} disabled={!selectedDoc}>
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 — Fill fields */}
      {step === 2 && docType && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{docType.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {docType.fields.map(key => {
                const meta = FIELD_META[key];
                if (!meta) return null;
                return (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={key}>{meta.label}</Label>
                    {meta.type === "textarea" ? (
                      <Textarea
                        id={key}
                        value={fields[key] || ""}
                        onChange={e => handleField(key, e.target.value)}
                        placeholder={meta.placeholder}
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={key}
                        type={meta.type}
                        value={fields[key] || ""}
                        onChange={e => handleField(key, e.target.value)}
                        placeholder={meta.placeholder}
                      />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Document
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — Review & Export */}
      {step === 3 && (
        <div>
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Document Generated
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" /> Download .docx
                  </Button>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-5">
              <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground leading-5 bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {MOCK_OUTPUT}
              </pre>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            <p className="font-semibold">Important Disclaimer</p>
            <p className="mt-1 text-xs text-yellow-700">This is an AI-generated draft for reference only. Review all content carefully with a qualified immigration attorney before filing. VisaPilot is not a law firm and this is not legal advice.</p>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => { setStep(1); setSelectedDoc(null); setFields({}); }}>
              Generate Another
            </Button>
            <Button variant="outline" onClick={() => setStep(2)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Edit Fields
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

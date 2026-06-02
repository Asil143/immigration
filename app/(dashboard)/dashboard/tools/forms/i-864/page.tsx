"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Download, CheckCircle2, FileText } from "lucide-react";
import { I864_QUESTIONS, I864_PARTS, type I864Question } from "@/lib/forms/i864";
import I864FormFull from "@/components/forms/I864FormFull";
import jsPDF from "jspdf";

// Basic client-side normalization — no API needed
function normalize(fieldId: string, raw: string): string {
  const v = raw.trim();
  if (!v || v.toLowerCase() === "n/a" || v.toLowerCase() === "none") return "N/A";

  if (fieldId.includes("dob") || fieldId.includes("date")) {
    // Try to parse any date format to MM/DD/YYYY
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${mm}/${dd}/${d.getFullYear()}`;
    }
    return v;
  }
  if (fieldId === "sponsor_ssn") {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 9) return `${digits.slice(0,3)}-${digits.slice(3,5)}-${digits.slice(5)}`;
  }
  if (fieldId.includes("phone") || fieldId.includes("phone")) {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  if (fieldId.includes("state") && v.length <= 3) return v.toUpperCase();
  if (fieldId.includes("zip")) return v;
  if (fieldId.includes("income") || fieldId.includes("annual")) {
    const digits = v.replace(/[^0-9.]/g, "");
    if (digits) return `$${Number(digits).toLocaleString()}`;
  }
  if (fieldId.includes("same_physical") || fieldId.includes("military") || fieldId.includes("sponsoring_principal")) {
    const lower = v.toLowerCase();
    if (lower.startsWith("y")) return "Yes";
    if (lower.startsWith("n")) return "No";
  }
  // Title case for names
  if (fieldId.includes("name") || fieldId.includes("city") || fieldId.includes("country") || fieldId.includes("employer") || fieldId.includes("occupation") || fieldId.includes("citizenship") || fieldId.includes("employment") || fieldId.includes("domicile")) {
    return v.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
  }
  return v;
}

interface Message { role: "assistant" | "user"; content: string; }
type Fields = Record<string, string>;

// ─── PDF Generation ───────────────────────────────────────────────────────────

function generatePDF(fields: Fields) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  let y = 50;

  const heading = (text: string) => {
    doc.setFillColor(51, 65, 85);
    doc.rect(40, y - 11, W - 80, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text(text, 44, y);
    doc.setTextColor(0, 0, 0);
    y += 16;
  };
  const row = (label: string, val: string) => {
    if (y > 720) { doc.addPage(); y = 50; }
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.text(label, 44, y);
    doc.setFont("helvetica", "normal"); doc.text(val || "—", 230, y);
    doc.setDrawColor(220); doc.line(44, y + 2, W - 44, y + 2);
    y += 14;
  };

  // Cover
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, W, 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16); doc.setFont("helvetica", "bold");
  doc.text("Form I-864 — Affidavit of Support", 40, 26);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Prepared with VisaPilot · visapilot-one.vercel.app", 40, 42);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, W - 40, 42, { align: "right" });
  doc.setTextColor(0, 0, 0);
  y = 80;

  heading("Part 1. Basis for Filing");
  row("Sponsor Type / Basis", fields.basis);
  y += 4;

  heading("Part 2. Information About You (Sponsor)");
  row("Family Name (Last Name)", fields.sponsor_family_name);
  row("Given Name (First Name)", fields.sponsor_given_name);
  row("Middle Name", fields.sponsor_middle_name);
  row("Mailing Street Address", fields.sponsor_mailing_street);
  row("City", fields.sponsor_mailing_city);
  row("State", fields.sponsor_mailing_state);
  row("ZIP Code", fields.sponsor_mailing_zip);
  row("Mailing = Physical?", fields.sponsor_same_physical);
  row("Country of Domicile", fields.sponsor_domicile_country);
  row("Date of Birth", fields.sponsor_dob);
  row("Country of Birth", fields.sponsor_country_of_birth);
  row("U.S. Social Security Number", fields.sponsor_ssn);
  row("Immigration Status", fields.sponsor_citizenship);
  row("A-Number (if any)", fields.sponsor_a_number);
  row("Active Military Duty", fields.sponsor_military);
  y += 4;

  heading("Part 3. Information About the Principal Immigrant");
  row("Family Name (Last Name)", fields.immigrant_family_name);
  row("Given Name (First Name)", fields.immigrant_given_name);
  row("Middle Name", fields.immigrant_middle_name);
  row("Country of Citizenship/Nationality", fields.immigrant_country_of_citizenship);
  row("Date of Birth", fields.immigrant_dob);
  row("A-Number (if any)", fields.immigrant_a_number);
  row("Daytime Telephone", fields.immigrant_phone);
  y += 4;

  heading("Part 4. Immigrants You Are Sponsoring");
  row("Sponsoring principal immigrant?", fields.sponsoring_principal);
  row("Additional family members", fields.additional_family_members);
  y += 4;

  heading("Part 5. Sponsor's Household Size");
  row("Immigrants sponsored (this affidavit)", fields.household_immigrants_sponsored);
  row("Yourself", "1");
  row("Spouse (if not counted above)", fields.household_spouse);
  row("Dependent children (if not counted)", fields.household_dependent_children);
  row("Other dependents", fields.household_other_dependents);
  const total = (parseInt(fields.household_immigrants_sponsored || "0") || 0) + 1 +
    (parseInt(fields.household_spouse || "0") || 0) +
    (parseInt(fields.household_dependent_children || "0") || 0) +
    (parseInt(fields.household_other_dependents || "0") || 0);
  row("TOTAL Household Size", String(total));
  y += 4;

  heading("Part 6. Sponsor's Employment and Income");
  row("Employment Status", fields.employment_status);
  row("Name of Employer 1", fields.employer_name_1);
  row("Occupation / Job Title", fields.occupation);
  row("Current Individual Annual Income", fields.annual_income);
  row("Most Recent Tax Year & Income (16.a)", fields.tax_year_1);
  row("2nd Most Recent Tax Year (16.b)", fields.tax_year_2);
  row("3rd Most Recent Tax Year (16.c)", fields.tax_year_3);
  y += 4;

  heading("Part 8. Contact Information");
  row("Daytime Telephone Number", fields.sponsor_daytime_phone);
  row("Mobile Telephone Number", fields.sponsor_mobile_phone);
  row("Email Address", fields.sponsor_email);
  y += 12;

  doc.setFontSize(8); doc.setTextColor(120);
  doc.text(
    "NOTE: This is a data summary only. Transfer all values to the official USCIS Form I-864 (Edition 10/17/24) before submission. You must sign the actual form.",
    40, y, { maxWidth: W - 80 }
  );

  doc.save("I-864-VisaPilot.pdf");
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function I864Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [fields, setFields] = useState<Fields>({});
  const [currentQuestion, setCurrentQuestion] = useState<I864Question | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startForm() {
    setStarted(true);
    const first = I864_QUESTIONS[0];
    setCurrentQuestion(first);
    setActiveFieldId(first.id);
    setMessages([{ role: "assistant", content: first.question }]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function sendAnswer() {
    if (!input.trim() || !currentQuestion) return;
    const userAnswer = input.trim();
    const normalized = normalize(currentQuestion.id, userAnswer);
    setInput("");

    // Fill field instantly
    setFields(prev => ({ ...prev, [currentQuestion.id]: normalized }));

    const currentIdx = I864_QUESTIONS.findIndex(q => q.id === currentQuestion.id);
    const nextQ = I864_QUESTIONS[currentIdx + 1] ?? null;
    const newProgress = Math.round(((currentIdx + 1) / I864_QUESTIONS.length) * 100);
    setProgress(newProgress);

    setMessages(prev => [...prev, { role: "user", content: userAnswer }]);

    if (nextQ) {
      // If moving to a new Part, announce it
      const partChanged = nextQ.part !== currentQuestion.part;
      const reply = partChanged
        ? `✓ Saved.\n\n**${nextQ.part}: ${nextQ.partTitle}**\n\n${nextQ.question}`
        : `✓ Saved.\n\n${nextQ.question}`;
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setCurrentQuestion(nextQ);
      setActiveFieldId(nextQ.id);
    } else {
      setIsComplete(true);
      setCurrentQuestion(null);
      setActiveFieldId(null);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "✅ All done! Every section is filled in.\n\nClick **Download PDF** above to save your completed data sheet.",
      }]);
    }

    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const currentPart = currentQuestion
    ? I864_PARTS.find(p => p.id === currentQuestion.part)
    : null;

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
          <FileText className="h-7 w-7 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">I-864 Affidavit of Support — Guided Filler</h1>
        <p className="text-muted-foreground text-sm max-w-md mb-2">
          Answer questions in plain English. Watch the official form fill in real time on the right. Download a completed PDF when done.
        </p>
        <p className="text-xs text-slate-500 max-w-sm mb-6">Covers Parts 1–6 and Part 8 of the official USCIS Form I-864 (Edition 10/17/24).</p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {I864_PARTS.map(p => (
            <span key={p.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{p.id}</span>
          ))}
        </div>
        <Button size="lg" onClick={startForm} className="px-8">Start Filling I-864 →</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top bar */}
      <div className="border-b bg-white px-6 py-2.5 flex items-center gap-4 shrink-0">
        <FileText className="h-5 w-5 text-blue-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Form I-864 — Affidavit of Support</p>
          {currentPart && (
            <p className="text-xs text-muted-foreground truncate">{currentPart.id} · {currentPart.title}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">{progress}%</span>
        </div>
        {isComplete && (
          <Button size="sm" onClick={() => generatePDF(fields)} className="gap-1.5 shrink-0">
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
        )}

      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="w-[40%] flex flex-col border-r bg-slate-50 shrink-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mr-2 shrink-0 mt-0.5">VP</div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isComplete && (
              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-700 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Form complete — download your PDF above
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!isComplete && (
            <div className="border-t bg-white p-3 flex gap-2 items-center">
              {currentQuestion && (
                <span className="text-[10px] text-slate-400 shrink-0 hidden sm:block max-w-[90px] truncate">{currentQuestion.hint}</span>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAnswer()}
                placeholder="Type your answer…"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
                disabled={false}
              />
              <Button size="sm" onClick={sendAnswer} disabled={!input.trim()} className="h-9 w-9 p-0 rounded-xl shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Form preview — full 12-page I-864 */}
        <div className="flex-1 overflow-y-auto bg-slate-300 p-4">
          <p className="text-[10px] text-slate-500 font-semibold mb-3 text-center tracking-widest uppercase">Live Preview — Form I-864 (All 12 Pages)</p>
          <I864FormFull fields={fields} activeFieldId={activeFieldId} />
          {isComplete && (
            <div className="mt-4 flex justify-center">
              <Button onClick={() => generatePDF(fields)} className="gap-2">
                <Download className="h-4 w-4" /> Download Reference PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

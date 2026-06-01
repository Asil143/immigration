"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Download, Loader2, CheckCircle2, FileText } from "lucide-react";
import { I864_QUESTIONS, I864_SECTIONS, type I864Question } from "@/lib/forms/i864";
import jsPDF from "jspdf";

interface Message {
  role: "assistant" | "user";
  content: string;
}

type Fields = Record<string, string>;

// ─── Form Preview ────────────────────────────────────────────────────────────

function FieldBox({ label, value, active }: { label: string; value?: string; active?: boolean }) {
  return (
    <div className={`mb-2 transition-all ${active ? "ring-2 ring-blue-400 ring-offset-1 rounded" : ""}`}>
      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-0.5">{label}</p>
      <div className={`min-h-[22px] border-b border-slate-300 px-1 py-0.5 text-[11px] font-medium transition-colors ${value ? "text-slate-900 bg-blue-50/60" : "text-transparent"}`}>
        {value || "."}
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 mt-3 mb-2 first:mt-0">
      {title}
    </div>
  );
}

function I864FormPreview({ fields, activeFieldId }: { fields: Fields; activeFieldId: string | null }) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm text-xs font-['Arial',sans-serif] overflow-hidden">
      {/* Form header */}
      <div className="bg-slate-100 border-b border-slate-300 px-3 py-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[9px] text-slate-500">Department of Homeland Security</p>
            <p className="text-[9px] text-slate-500">U.S. Citizenship and Immigration Services</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold">Form I-864</p>
            <p className="text-[9px] text-slate-500">OMB No. 1615-0075</p>
          </div>
        </div>
        <p className="text-[11px] font-bold text-center mt-1 text-slate-800">Affidavit of Support Under Section 213A of the INA</p>
      </div>

      <div className="px-3 pb-3">
        {/* Part 1 */}
        <SectionHeader title="Part 1. Basis for Filing" />
        <FieldBox label="Relationship to Immigrant" value={fields.basis} active={activeFieldId === "basis"} />

        {/* Part 2 */}
        <SectionHeader title="Part 2. Information About You (Sponsor)" />
        <div className="grid grid-cols-3 gap-x-2">
          <FieldBox label="Family Name (Last)" value={fields.sponsor_family_name} active={activeFieldId === "sponsor_family_name"} />
          <FieldBox label="Given Name (First)" value={fields.sponsor_given_name} active={activeFieldId === "sponsor_given_name"} />
          <FieldBox label="Middle Name" value={fields.sponsor_middle_name} active={activeFieldId === "sponsor_middle_name"} />
        </div>
        <FieldBox label="Street Address (Number, Street, Apt)" value={fields.sponsor_address_street} active={activeFieldId === "sponsor_address_street"} />
        <div className="grid grid-cols-3 gap-x-2">
          <FieldBox label="City" value={fields.sponsor_address_city} active={activeFieldId === "sponsor_address_city"} />
          <FieldBox label="State" value={fields.sponsor_address_state} active={activeFieldId === "sponsor_address_state"} />
          <FieldBox label="ZIP Code" value={fields.sponsor_address_zip} active={activeFieldId === "sponsor_address_zip"} />
        </div>
        <div className="grid grid-cols-3 gap-x-2">
          <FieldBox label="Date of Birth" value={fields.sponsor_dob} active={activeFieldId === "sponsor_dob"} />
          <FieldBox label="U.S. Social Security No." value={fields.sponsor_ssn} active={activeFieldId === "sponsor_ssn"} />
          <FieldBox label="Daytime Phone" value={fields.sponsor_phone} active={activeFieldId === "sponsor_phone"} />
        </div>
        <FieldBox label="Citizenship / Immigration Status" value={fields.sponsor_citizenship} active={activeFieldId === "sponsor_citizenship"} />

        {/* Part 3 */}
        <SectionHeader title="Part 3. Household Size" />
        <div className="grid grid-cols-2 gap-x-2">
          <FieldBox label="Total Household Members" value={fields.household_size} active={activeFieldId === "household_size"} />
        </div>

        {/* Part 4 */}
        <SectionHeader title="Part 4. Employment and Income" />
        <div className="grid grid-cols-2 gap-x-2">
          <FieldBox label="Employment Status" value={fields.employment_status} active={activeFieldId === "employment_status"} />
          <FieldBox label="Current Annual Income" value={fields.annual_income} active={activeFieldId === "annual_income"} />
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <FieldBox label="Employer / Business Name" value={fields.employer_name} active={activeFieldId === "employer_name"} />
          <FieldBox label="Occupation / Job Title" value={fields.occupation} active={activeFieldId === "occupation"} />
        </div>

        {/* Part 7 */}
        <SectionHeader title="Part 7. Immigrant's Information" />
        <div className="grid grid-cols-2 gap-x-2">
          <FieldBox label="Family Name (Last)" value={fields.immigrant_family_name} active={activeFieldId === "immigrant_family_name"} />
          <FieldBox label="Given Name (First)" value={fields.immigrant_given_name} active={activeFieldId === "immigrant_given_name"} />
        </div>
        <div className="grid grid-cols-3 gap-x-2">
          <FieldBox label="Date of Birth" value={fields.immigrant_dob} active={activeFieldId === "immigrant_dob"} />
          <FieldBox label="Country of Birth" value={fields.immigrant_country_of_birth} active={activeFieldId === "immigrant_country_of_birth"} />
          <FieldBox label="Visa Category" value={fields.immigrant_visa_category} active={activeFieldId === "immigrant_visa_category"} />
        </div>
      </div>
    </div>
  );
}

// ─── PDF generation ──────────────────────────────────────────────────────────

function generatePDF(fields: Fields) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  let y = 50;

  const line = (text: string, x: number, size = 10, bold = false) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(text, x, y);
  };
  const nl = (n = 14) => { y += n; };
  const rule = () => { doc.setDrawColor(180); doc.line(40, y, W - 40, y); nl(12); };

  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, W, 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16); doc.setFont("helvetica", "bold");
  doc.text("Form I-864 — Affidavit of Support", 40, 28);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Prepared with VisaPilot · visapilot-one.vercel.app", 40, 44);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, W - 40, 44, { align: "right" });
  doc.setTextColor(0, 0, 0);
  y = 80;

  const printSection = (title: string, rows: [string, string][]) => {
    doc.setFillColor(241, 245, 249);
    doc.rect(40, y - 10, W - 80, 20, "F");
    line(title, 44, 11, true);
    nl(18);
    rule();
    for (const [label, val] of rows) {
      line(label, 44, 9, true);
      line(val || "—", 200, 9);
      nl(16);
    }
    nl(6);
  };

  printSection("Part 1 · Basis for Filing", [
    ["Relationship to Immigrant", fields.basis],
  ]);

  printSection("Part 2 · Information About You (Sponsor)", [
    ["Family Name (Last)", fields.sponsor_family_name],
    ["Given Name (First)", fields.sponsor_given_name],
    ["Middle Name", fields.sponsor_middle_name],
    ["Street Address", fields.sponsor_address_street],
    ["City", fields.sponsor_address_city],
    ["State", fields.sponsor_address_state],
    ["ZIP Code", fields.sponsor_address_zip],
    ["Date of Birth", fields.sponsor_dob],
    ["U.S. Social Security Number", fields.sponsor_ssn],
    ["Daytime Phone", fields.sponsor_phone],
    ["Citizenship / Immigration Status", fields.sponsor_citizenship],
  ]);

  printSection("Part 3 · Household Size", [
    ["Total Household Members", fields.household_size],
  ]);

  printSection("Part 4 · Employment and Income", [
    ["Employment Status", fields.employment_status],
    ["Employer / Business Name", fields.employer_name],
    ["Occupation / Job Title", fields.occupation],
    ["Current Annual Income", fields.annual_income],
  ]);

  printSection("Part 7 · Immigrant's Information", [
    ["Family Name (Last)", fields.immigrant_family_name],
    ["Given Name (First)", fields.immigrant_given_name],
    ["Date of Birth", fields.immigrant_dob],
    ["Country of Birth", fields.immigrant_country_of_birth],
    ["Visa Category", fields.immigrant_visa_category],
  ]);

  // Footer note
  doc.setFontSize(8); doc.setTextColor(120, 120, 120);
  doc.text(
    "This document is a data summary for reference only. Transfer values to the official USCIS Form I-864 before submission.",
    40, y + 10, { maxWidth: W - 80 }
  );

  doc.save("I-864-VisaPilot.pdf");
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function I864Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [fields, setFields] = useState<Fields>({});
  const [currentQuestion, setCurrentQuestion] = useState<I864Question | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Scroll preview to show active field
  useEffect(() => {
    if (activeFieldId && previewRef.current) {
      const el = previewRef.current.querySelector(`[data-field="${activeFieldId}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeFieldId]);

  function startForm() {
    setStarted(true);
    const first = I864_QUESTIONS[0];
    setCurrentQuestion(first);
    setActiveFieldId(first.id);
    setMessages([{ role: "assistant", content: first.question }]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function sendAnswer() {
    if (!input.trim() || loading || !currentQuestion) return;

    const userAnswer = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userAnswer }]);
    setLoading(true);

    try {
      const res = await fetch("/api/forms/i864", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: userAnswer, currentFieldId: currentQuestion.id }),
      });
      const data = await res.json();

      // Update field in live preview
      setFields((prev) => ({ ...prev, [currentQuestion.id]: data.extractedValue }));
      setProgress(data.progress);

      if (data.isComplete) {
        setIsComplete(true);
        setCurrentQuestion(null);
        setActiveFieldId(null);
      } else {
        setCurrentQuestion(data.nextQuestion);
        setActiveFieldId(data.nextQuestion.id);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.assistantMessage }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  const currentSection = currentQuestion
    ? I864_SECTIONS.find((s) => s.id === currentQuestion.section)
    : null;

  // ── Pre-start landing ──
  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
          <FileText className="h-7 w-7 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">I-864 Guided Form Filler</h1>
        <p className="text-muted-foreground text-sm max-w-md mb-1">
          Answer simple questions one by one. Watch the form fill itself on the right in real time.
          Download a completed PDF summary when you're done.
        </p>
        <p className="text-xs text-muted-foreground mb-8 max-w-sm">
          Covers all major sections: sponsor info, household size, income, and immigrant details.
        </p>
        <div className="flex gap-3 mb-8">
          {I864_SECTIONS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-xs text-slate-600 hidden sm:block">{s.title}</span>
            </div>
          ))}
        </div>
        <Button size="lg" onClick={startForm} className="px-8">
          Start Filling I-864 →
        </Button>
      </div>
    );
  }

  // ── Split screen ──
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top bar */}
      <div className="border-b bg-white px-6 py-3 flex items-center gap-4 shrink-0">
        <FileText className="h-5 w-5 text-blue-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold">I-864 Affidavit of Support</p>
          {currentSection && (
            <p className="text-xs text-muted-foreground">{currentSection.id} · {currentSection.title}</p>
          )}
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">{progress}%</span>
        </div>
        {isComplete && (
          <Button size="sm" onClick={() => generatePDF(fields)} className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
        )}
      </div>

      {/* Body: chat | form */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Chat panel (left) ── */}
        <div className="w-[42%] flex flex-col border-r bg-slate-50">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mr-2 shrink-0 mt-0.5">VP</div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mr-2 shrink-0">
                  <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            {isComplete && (
              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-700 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Form complete — download your PDF above
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {!isComplete && (
            <div className="border-t bg-white p-3 flex gap-2 items-center">
              {currentQuestion && (
                <span className="text-[10px] text-slate-400 shrink-0 hidden sm:block">{currentQuestion.hint}</span>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendAnswer()}
                placeholder="Type your answer…"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
                disabled={loading}
              />
              <Button
                size="sm"
                onClick={sendAnswer}
                disabled={!input.trim() || loading}
                className="h-9 w-9 p-0 rounded-xl"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        {/* ── Form preview (right) ── */}
        <div ref={previewRef} className="flex-1 overflow-y-auto bg-slate-100 p-5">
          <p className="text-xs text-slate-400 font-medium mb-3 text-center tracking-wide uppercase">Live Preview</p>
          <I864FormPreview fields={fields} activeFieldId={activeFieldId} />
          {isComplete && (
            <div className="mt-4 flex justify-center">
              <Button onClick={() => generatePDF(fields)} className="gap-2">
                <Download className="h-4 w-4" /> Download Filled PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

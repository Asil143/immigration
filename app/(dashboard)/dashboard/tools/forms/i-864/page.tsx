"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Download, Loader2, CheckCircle2, FileText } from "lucide-react";
import { I864_QUESTIONS, I864_PARTS, type I864Question } from "@/lib/forms/i864";
import jsPDF from "jspdf";

interface Message { role: "assistant" | "user"; content: string; }
type Fields = Record<string, string>;

// ─── Field primitives ─────────────────────────────────────────────────────────

function Cell({ label, value, active, wide }: { label: string; value?: string; active?: boolean; wide?: boolean }) {
  return (
    <div className={`${wide ? "col-span-2" : ""} mb-1`}>
      <p className="text-[8px] text-slate-500 leading-none mb-0.5">{label}</p>
      <div className={`border-b border-slate-400 min-h-[18px] px-0.5 py-0.5 text-[10px] transition-all ${
        active ? "bg-yellow-100 border-blue-500 border-b-2" : value ? "bg-blue-50/50" : ""
      } ${value ? "text-slate-900 font-medium" : "text-transparent"}`}>
        {value || "."}
      </div>
    </div>
  );
}

function PartHeader({ part, title }: { part: string; title: string }) {
  return (
    <div className="bg-slate-700 text-white px-2 py-1 mt-3 mb-1.5 first:mt-0 text-[10px] font-bold">
      {part}. {title}
    </div>
  );
}

function Checkbox({ checked, label }: { checked?: boolean; label: string }) {
  return (
    <div className="flex items-start gap-1 mb-0.5">
      <span className={`mt-0.5 w-2.5 h-2.5 border border-slate-500 shrink-0 flex items-center justify-center text-[7px] ${checked ? "bg-blue-500 border-blue-500 text-white" : ""}`}>
        {checked ? "✓" : ""}
      </span>
      <span className="text-[9px] text-slate-700 leading-tight">{label}</span>
    </div>
  );
}

// ─── Real I-864 Preview ───────────────────────────────────────────────────────

function I864Preview({ fields, activeFieldId }: { fields: Fields; activeFieldId: string | null }) {
  const basis = fields.basis?.toLowerCase() ?? "";

  return (
    <div className="bg-white border border-slate-400 shadow text-[10px]" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* USCIS Header */}
      <div className="border-b-2 border-slate-700 px-3 py-2 flex justify-between items-start">
        <div>
          <p className="text-[9px] font-bold">Department of Homeland Security</p>
          <p className="text-[8px] text-slate-600">U.S. Citizenship and Immigration Services</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold">USCIS Form I-864</p>
          <p className="text-[8px] text-slate-600">OMB No. 1615-0075</p>
          <p className="text-[8px] text-slate-600">Expires 10/31/2027</p>
        </div>
      </div>
      <div className="bg-slate-100 px-3 py-1 text-center">
        <p className="text-[11px] font-bold">Affidavit of Support Under Section 213A of the INA</p>
      </div>

      <div className="px-3 pb-4">

        {/* Part 1 */}
        <PartHeader part="Part 1" title="Basis For Filing Affidavit of Support" />
        <p className="text-[8px] text-slate-600 mb-1">I am the sponsor submitting this affidavit of support because (Select only one box).</p>
        <Checkbox checked={basis.includes("1a") || basis.includes("petitioner")} label="1.a. I am the petitioner. I filed or am filing for the immigration of my relative." />
        <Checkbox checked={basis.includes("1b")} label="1.b. I filed an alien worker petition on behalf of the intending immigrant, who is related to me." />
        <Checkbox checked={basis.includes("1c") || basis.includes("5%") || basis.includes("ownership")} label="1.c. I have an ownership interest of at least 5 percent in a company that filed an alien worker petition." />
        <Checkbox checked={basis.includes("1d") || basis.includes("only joint")} label="1.d. I am the only joint sponsor." />
        <Checkbox checked={basis.includes("1e") || basis.includes("first") || basis.includes("second")} label="1.e. I am the first / second of two joint sponsors." />
        <Checkbox checked={basis.includes("1f") || basis.includes("substitute") || basis.includes("deceased")} label="1.f. The original petitioner is deceased. I am the substitute sponsor." />

        {/* Part 2 */}
        <PartHeader part="Part 2" title="Information About You (Sponsor)" />
        <p className="text-[8px] font-semibold text-slate-600 mb-0.5">1. Sponsor's Full Legal Name</p>
        <div className="grid grid-cols-3 gap-x-2 mb-2">
          <Cell label="Family Name (Last Name)" value={fields.sponsor_family_name} active={activeFieldId === "sponsor_family_name"} />
          <Cell label="Given Name (First Name)" value={fields.sponsor_given_name} active={activeFieldId === "sponsor_given_name"} />
          <Cell label="Middle Name (if applicable)" value={fields.sponsor_middle_name} active={activeFieldId === "sponsor_middle_name"} />
        </div>

        <p className="text-[8px] font-semibold text-slate-600 mb-0.5">2. Sponsor's Current Mailing Address</p>
        <div className="mb-1">
          <Cell label="Street Number and Name" value={fields.sponsor_mailing_street} active={activeFieldId === "sponsor_mailing_street"} wide />
        </div>
        <div className="grid grid-cols-3 gap-x-2 mb-2">
          <Cell label="City or Town" value={fields.sponsor_mailing_city} active={activeFieldId === "sponsor_mailing_city"} />
          <Cell label="State" value={fields.sponsor_mailing_state} active={activeFieldId === "sponsor_mailing_state"} />
          <Cell label="ZIP Code" value={fields.sponsor_mailing_zip} active={activeFieldId === "sponsor_mailing_zip"} />
        </div>

        <div className="flex items-center gap-1 mb-2 text-[8px]">
          <span className="font-semibold text-slate-600">3. Mailing same as physical address?</span>
          <span className={`px-1 rounded text-[8px] font-bold ${fields.sponsor_same_physical?.toLowerCase().startsWith("y") ? "bg-blue-100 text-blue-700" : fields.sponsor_same_physical ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-400"}`}>
            {fields.sponsor_same_physical || "—"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-x-2 mb-2">
          <Cell label="5. Country of Domicile" value={fields.sponsor_domicile_country} active={activeFieldId === "sponsor_domicile_country"} />
          <Cell label="6. Date of Birth (mm/dd/yyyy)" value={fields.sponsor_dob} active={activeFieldId === "sponsor_dob"} />
          <Cell label="7. Country of Birth" value={fields.sponsor_country_of_birth} active={activeFieldId === "sponsor_country_of_birth"} />
        </div>

        <div className="grid grid-cols-2 gap-x-2 mb-2">
          <Cell label="8. U.S. Social Security Number (Required)" value={fields.sponsor_ssn} active={activeFieldId === "sponsor_ssn"} />
          <Cell label="10. Sponsor's A-Number (if any)" value={fields.sponsor_a_number} active={activeFieldId === "sponsor_a_number"} />
        </div>

        <p className="text-[8px] font-semibold text-slate-600 mb-0.5">9. Immigration Status</p>
        <div className="mb-2">
          <Checkbox checked={fields.sponsor_citizenship?.toLowerCase().includes("citizen") && !fields.sponsor_citizenship?.toLowerCase().includes("national")} label="I am a U.S. citizen." />
          <Checkbox checked={fields.sponsor_citizenship?.toLowerCase().includes("national")} label="I am a U.S. national." />
          <Checkbox checked={fields.sponsor_citizenship?.toLowerCase().includes("permanent") || fields.sponsor_citizenship?.toLowerCase().includes("lpr") || fields.sponsor_citizenship?.toLowerCase().includes("green card")} label="I am a lawful permanent resident." />
        </div>

        <div className="flex items-center gap-1 mb-1 text-[8px]">
          <span className="font-semibold text-slate-600">12. Active Military Duty?</span>
          <span className={`px-1 rounded text-[8px] font-bold ${fields.sponsor_military?.toLowerCase().startsWith("y") ? "bg-blue-100 text-blue-700" : fields.sponsor_military ? "bg-slate-100 text-slate-600" : "bg-slate-100 text-slate-400"}`}>
            {fields.sponsor_military || "—"}
          </span>
        </div>

        {/* Part 3 */}
        <PartHeader part="Part 3" title="Information About the Principal Immigrant" />
        <p className="text-[8px] font-semibold text-slate-600 mb-0.5">1. Principal Immigrant's Full Legal Name</p>
        <div className="grid grid-cols-3 gap-x-2 mb-2">
          <Cell label="Family Name (Last Name)" value={fields.immigrant_family_name} active={activeFieldId === "immigrant_family_name"} />
          <Cell label="Given Name (First Name)" value={fields.immigrant_given_name} active={activeFieldId === "immigrant_given_name"} />
          <Cell label="Middle Name (if applicable)" value={fields.immigrant_middle_name} active={activeFieldId === "immigrant_middle_name"} />
        </div>
        <div className="grid grid-cols-3 gap-x-2 mb-2">
          <Cell label="3. Country of Citizenship/Nationality" value={fields.immigrant_country_of_citizenship} active={activeFieldId === "immigrant_country_of_citizenship"} />
          <Cell label="4. Date of Birth (mm/dd/yyyy)" value={fields.immigrant_dob} active={activeFieldId === "immigrant_dob"} />
          <Cell label="5. A-Number (if any)" value={fields.immigrant_a_number} active={activeFieldId === "immigrant_a_number"} />
        </div>
        <div className="grid grid-cols-2 gap-x-2 mb-2">
          <Cell label="7. Daytime Telephone Number" value={fields.immigrant_phone} active={activeFieldId === "immigrant_phone"} />
        </div>

        {/* Part 4 */}
        <PartHeader part="Part 4" title="Information About the Immigrants You Are Sponsoring" />
        <div className="flex items-center gap-1 mb-1 text-[8px]">
          <span className="font-semibold text-slate-600">1. Sponsoring principal immigrant named in Part 3?</span>
          <span className={`px-1 rounded text-[8px] font-bold ${fields.sponsoring_principal?.toLowerCase().startsWith("y") ? "bg-blue-100 text-blue-700" : fields.sponsoring_principal ? "bg-slate-100 text-slate-600" : "bg-slate-100 text-slate-400"}`}>
            {fields.sponsoring_principal || "—"}
          </span>
        </div>
        {fields.additional_family_members && fields.additional_family_members.toLowerCase() !== "none" && (
          <div className="mb-1">
            <p className="text-[8px] font-semibold text-slate-600 mb-0.5">Additional family members:</p>
            <p className="text-[9px] text-slate-800 bg-blue-50 px-1 py-0.5 rounded">{fields.additional_family_members}</p>
          </div>
        )}

        {/* Part 5 */}
        <PartHeader part="Part 5" title="Sponsor's Household Size" />
        <div className="grid grid-cols-4 gap-x-2 mb-1">
          <Cell label="Immigrants sponsored (this affidavit)" value={fields.household_immigrants_sponsored} active={activeFieldId === "household_immigrants_sponsored"} />
          <Cell label="Yourself" value="1" />
          <Cell label="Spouse (if not counted)" value={fields.household_spouse} active={activeFieldId === "household_spouse"} />
          <Cell label="Dependent children" value={fields.household_dependent_children} active={activeFieldId === "household_dependent_children"} />
        </div>
        {(fields.household_immigrants_sponsored || fields.household_spouse || fields.household_dependent_children) && (
          <div className="flex justify-end mb-1">
            <div className="text-[9px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Household Size: {
                (parseInt(fields.household_immigrants_sponsored || "0") || 0) +
                1 +
                (parseInt(fields.household_spouse || "0") || 0) +
                (parseInt(fields.household_dependent_children || "0") || 0) +
                (parseInt(fields.household_other_dependents || "0") || 0)
              }
            </div>
          </div>
        )}

        {/* Part 6 */}
        <PartHeader part="Part 6" title="Sponsor's Employment and Income" />
        <div className="mb-1">
          <Checkbox checked={fields.employment_status?.toLowerCase().includes("employ") && !fields.employment_status?.toLowerCase().includes("self")} label="Employed as a/an" />
          <Checkbox checked={fields.employment_status?.toLowerCase().includes("self")} label="Self-Employed" />
          <Checkbox checked={fields.employment_status?.toLowerCase().includes("retire")} label="Retired" />
          <Checkbox checked={fields.employment_status?.toLowerCase().includes("unemploy")} label="Unemployed" />
        </div>
        <div className="grid grid-cols-2 gap-x-2 mb-2">
          <Cell label="Name of Employer 1" value={fields.employer_name_1} active={activeFieldId === "employer_name_1"} />
          <Cell label="Occupation / Job Title" value={fields.occupation} active={activeFieldId === "occupation"} />
        </div>
        <div className="grid grid-cols-3 gap-x-2 mb-2">
          <Cell label="7. Current Individual Annual Income" value={fields.annual_income} active={activeFieldId === "annual_income"} />
          <Cell label="16.a. Most Recent Tax Year & Income" value={fields.tax_year_1} active={activeFieldId === "tax_year_1"} />
          <Cell label="16.b. 2nd Most Recent Tax Year" value={fields.tax_year_2} active={activeFieldId === "tax_year_2"} />
        </div>
        <div className="grid grid-cols-2 gap-x-2 mb-1">
          <Cell label="16.c. 3rd Most Recent Tax Year" value={fields.tax_year_3} active={activeFieldId === "tax_year_3"} />
        </div>

        {/* Part 8 */}
        <PartHeader part="Part 8" title="Sponsor's Contract, Contact Information, and Signature" />
        <div className="grid grid-cols-3 gap-x-2 mb-2">
          <Cell label="3. Daytime Telephone Number" value={fields.sponsor_daytime_phone} active={activeFieldId === "sponsor_daytime_phone"} />
          <Cell label="4. Mobile Telephone Number (if any)" value={fields.sponsor_mobile_phone} active={activeFieldId === "sponsor_mobile_phone"} />
          <Cell label="5. Email Address (if any)" value={fields.sponsor_email} active={activeFieldId === "sponsor_email"} />
        </div>
        <div className="border-t border-slate-300 pt-1 mt-1">
          <Cell label="6. Sponsor's Signature" value="" />
          <Cell label="Date of Signature (mm/dd/yyyy)" value="" />
        </div>
      </div>
    </div>
  );
}

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
  const [loading, setLoading] = useState(false);
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

  async function sendAnswer() {
    if (!input.trim() || loading || !currentQuestion) return;
    const userAnswer = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userAnswer }]);
    setLoading(true);

    try {
      const res = await fetch("/api/forms/i864", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: userAnswer, currentFieldId: currentQuestion.id }),
      });
      const data = await res.json();

      setFields(prev => ({ ...prev, [currentQuestion.id]: data.extractedValue }));
      setProgress(data.progress);

      if (data.isComplete) {
        setIsComplete(true);
        setCurrentQuestion(null);
        setActiveFieldId(null);
      } else {
        setCurrentQuestion(data.nextQuestion);
        setActiveFieldId(data.nextQuestion.id);
      }
      setMessages(prev => [...prev, { role: "assistant", content: data.assistantMessage }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
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
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mr-2 shrink-0">
                  <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
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
                disabled={loading}
              />
              <Button size="sm" onClick={sendAnswer} disabled={!input.trim() || loading} className="h-9 w-9 p-0 rounded-xl shrink-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        {/* Form preview */}
        <div className="flex-1 overflow-y-auto bg-slate-200 p-4">
          <p className="text-[10px] text-slate-500 font-semibold mb-2 text-center tracking-widest uppercase">Live Preview — Form I-864</p>
          <I864Preview fields={fields} activeFieldId={activeFieldId} />
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

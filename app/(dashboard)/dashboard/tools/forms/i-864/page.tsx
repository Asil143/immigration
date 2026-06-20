"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, FileText } from "lucide-react";
import { I864_QUESTIONS, I864_PARTS, type I864Question } from "@/lib/forms/i864";

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

// ─── Profile / Document Pre-fill ──────────────────────────────────────────────

function isoToMDY(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}

function fmtSSN(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 9 ? `${d.slice(0,3)}-${d.slice(3,5)}-${d.slice(5)}` : raw;
}

function fmtPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : raw;
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prefillFromProfile(p: Record<string, any>): Fields {
  const f: Fields = {};
  if (p.first_name) f.sponsor_given_name = titleCase(String(p.first_name));
  if (p.last_name) f.sponsor_family_name = titleCase(String(p.last_name));
  if (p.middle_name) f.sponsor_middle_name = titleCase(String(p.middle_name));
  if (p.date_of_birth) f.sponsor_dob = isoToMDY(String(p.date_of_birth));
  if (p.country_of_birth) f.sponsor_country_of_birth = titleCase(String(p.country_of_birth));
  if (p.ssn) f.sponsor_ssn = fmtSSN(String(p.ssn));
  if (p.mailing_street) f.sponsor_mailing_street = String(p.mailing_street);
  if (p.mailing_city) f.sponsor_mailing_city = titleCase(String(p.mailing_city));
  if (p.mailing_state) f.sponsor_mailing_state = String(p.mailing_state).toUpperCase();
  if (p.mailing_zip) f.sponsor_mailing_zip = String(p.mailing_zip);
  if (p.phone) f.sponsor_daytime_phone = fmtPhone(String(p.phone));
  if (p.a_number) f.sponsor_a_number = String(p.a_number);
  if (p.employer) f.employer_name_1 = titleCase(String(p.employer));
  if (p.visa_type) {
    const vt = String(p.visa_type);
    if (vt.includes("LPR") || vt.toLowerCase().includes("green card") || vt.includes("Permanent Resident"))
      f.sponsor_citizenship = "Lawful Permanent Resident";
  }
  return f;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prefillFromDocuments(docs: Array<Record<string, any>>): Fields {
  const f: Fields = {};
  for (const doc of docs) {
    const ef = doc.extracted_data?.extracted_fields as Record<string, string | null> | undefined;
    if (!ef) continue;
    if (ef.first_name && !f.sponsor_given_name) f.sponsor_given_name = titleCase(ef.first_name);
    if (ef.last_name && !f.sponsor_family_name) f.sponsor_family_name = titleCase(ef.last_name);
    if (ef.middle_name && !f.sponsor_middle_name) f.sponsor_middle_name = titleCase(ef.middle_name);
    if (ef.date_of_birth && !f.sponsor_dob) f.sponsor_dob = isoToMDY(ef.date_of_birth);
    if (ef.country_of_birth && !f.sponsor_country_of_birth) f.sponsor_country_of_birth = titleCase(ef.country_of_birth);
    if (ef.a_number && !f.sponsor_a_number) f.sponsor_a_number = ef.a_number;
    if (ef.employer_name && !f.employer_name_1) f.employer_name_1 = titleCase(ef.employer_name);
  }
  return f;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function I864Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [fields, setFields] = useState<Fields>({});
  const [currentQuestion, setCurrentQuestion] = useState<I864Question | null>(null);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const [prefillCount, setPrefillCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load profile + documents and pre-fill matching I-864 fields
  useEffect(() => {
    async function load() {
      const [profileRes, docsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/documents"),
      ]);

      let combined: Fields = {};

      if (docsRes.ok) {
        const docs = await docsRes.json();
        if (Array.isArray(docs)) combined = { ...combined, ...prefillFromDocuments(docs) };
      }
      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile && !profile.error) combined = { ...combined, ...prefillFromProfile(profile) };
      }

      const count = Object.keys(combined).length;
      if (count > 0) {
        setFields(combined);
        setPrefillCount(count);
      }
    }
    load();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startForm() {
    setStarted(true);
    // Jump to first unanswered question
    const first = I864_QUESTIONS.find(q => !fields[q.id]) ?? I864_QUESTIONS[0];
    setCurrentQuestion(first);

    const openingMsg: Message = prefillCount > 0
      ? {
          role: "assistant",
          content: `✓ Pre-filled ${prefillCount} field${prefillCount > 1 ? "s" : ""} from your profile and uploaded documents.\n\nLet's fill in the remaining questions, starting here:\n\n${first.part !== I864_QUESTIONS[0].part ? `**${first.part}: ${first.partTitle}**\n\n` : ""}${first.question}`,
        }
      : { role: "assistant", content: first.question };

    setMessages([openingMsg]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function advanceQuestion(currentQ: I864Question, userAnswer: string, normalized: string) {
    const updatedFields = { ...fields, [currentQ.id]: normalized };
    setFields(updatedFields);

    const currentIdx = I864_QUESTIONS.findIndex(q => q.id === currentQ.id);
    const nextQ = I864_QUESTIONS[currentIdx + 1] ?? null;
    const newProgress = Math.round(((currentIdx + 1) / I864_QUESTIONS.length) * 100);
    setProgress(newProgress);

    setMessages(prev => [...prev, { role: "user", content: userAnswer }]);

    if (nextQ) {
      const partChanged = nextQ.part !== currentQ.part;
      const reply = partChanged
        ? `✓ Saved.\n\n**${nextQ.part}: ${nextQ.partTitle}**\n\n${nextQ.question}`
        : `✓ Saved.\n\n${nextQ.question}`;
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setCurrentQuestion(nextQ);
    } else {
      setIsComplete(true);
      setCurrentQuestion(null);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "✅ All done! Every section is filled in.\n\nYour answers have been saved and sent to the VisaPilot team — we'll prepare your I-864 and reach out shortly.",
      }]);
      // Auto-save completed submission
      fetch("/api/forms/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_type: "I-864", fields: updatedFields }),
      }).catch(console.error);
    }

    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function sendAnswer() {
    if (!input.trim() || !currentQuestion) return;
    const userAnswer = input.trim();
    const normalized = normalize(currentQuestion.id, userAnswer);
    setInput("");
    advanceQuestion(currentQuestion, userAnswer, normalized);
  }

  function skipQuestion() {
    if (!currentQuestion) return;
    advanceQuestion(currentQuestion, "Skip", "");
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
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {I864_PARTS.map(p => (
            <span key={p.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{p.id}</span>
          ))}
        </div>
        {prefillCount > 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-green-800 max-w-md">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            <span><strong>{prefillCount} field{prefillCount > 1 ? "s" : ""}</strong> pre-filled from your profile &amp; uploaded documents — we&apos;ll skip straight to unanswered questions.</span>
          </div>
        )}
        <Button size="lg" onClick={startForm} className="px-8">
          {prefillCount > 0 ? `Continue Filling I-864 (${I864_QUESTIONS.length - prefillCount} questions left) →` : "Start Filling I-864 →"}
        </Button>
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

      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col bg-slate-50">
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
            <div className="border-t bg-white p-3 space-y-2">
              {currentQuestion?.optional && (
                <div className="flex justify-end">
                  <button
                    onClick={skipQuestion}
                    className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
                  >
                    Skip (not applicable)
                  </button>
                </div>
              )}
              {currentQuestion?.options ? (
                <div className="flex flex-col gap-1.5">
                  {currentQuestion.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        const normalized = normalize(currentQuestion.id, opt);
                        advanceQuestion(currentQuestion, opt, normalized);
                      }}
                      className="w-full text-left rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 items-center">
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
          )}
        </div>

      </div>
    </div>
  );
}

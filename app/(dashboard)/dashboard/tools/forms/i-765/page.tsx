"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, FileText } from "lucide-react";
import { I765_QUESTIONS, I765_PARTS, type I765Question } from "@/lib/forms/i765";

function normalize(fieldId: string, raw: string): string {
  const v = raw.trim();
  if (!v || v.toLowerCase() === "n/a" || v.toLowerCase() === "none") return "N/A";

  if (fieldId.includes("date") || fieldId === "graduation_date" || fieldId === "i20_expiry") {
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${mm}/${dd}/${d.getFullYear()}`;
    }
    return v;
  }
  if (fieldId === "ssn") {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 9) return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }
  if (fieldId === "daytime_phone") {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (fieldId === "mailing_state") return v.toUpperCase().slice(0, 2);
  if (["family_name", "given_name", "middle_name", "city_of_birth", "country_of_birth",
       "country_of_citizenship", "school_name", "school_city", "major_field",
       "mailing_city", "employer_name"].includes(fieldId)) {
    return v.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
  }
  return v;
}

interface Message { role: "assistant" | "user"; content: string; }
type Fields = Record<string, string>;

function isoToMDY(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}

function fmtSSN(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 9 ? `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}` : raw;
}

function fmtPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : raw;
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prefillFromProfile(p: Record<string, any>): Fields {
  const f: Fields = {};
  if (p.first_name)      f.given_name       = titleCase(String(p.first_name));
  if (p.last_name)       f.family_name      = titleCase(String(p.last_name));
  if (p.middle_name)     f.middle_name      = titleCase(String(p.middle_name));
  if (p.date_of_birth)   f.date_of_birth    = isoToMDY(String(p.date_of_birth));
  if (p.country_of_birth) f.country_of_birth = titleCase(String(p.country_of_birth));
  if (p.ssn)             f.ssn              = fmtSSN(String(p.ssn));
  if (p.mailing_street)  f.mailing_street   = String(p.mailing_street);
  if (p.mailing_city)    f.mailing_city     = titleCase(String(p.mailing_city));
  if (p.mailing_state)   f.mailing_state    = String(p.mailing_state).toUpperCase();
  if (p.mailing_zip)     f.mailing_zip      = String(p.mailing_zip);
  if (p.phone)           f.daytime_phone    = fmtPhone(String(p.phone));
  if (p.a_number)        f.a_number         = String(p.a_number);
  if (p.email)           f.email            = String(p.email);
  if (p.employer)        f.employer_name    = titleCase(String(p.employer));
  if (p.opt_start_date)  f.opt_start_date   = isoToMDY(String(p.opt_start_date));
  if (p.opt_end_date)    f.opt_end_date     = isoToMDY(String(p.opt_end_date));
  if (p.i20_end_date)    f.i20_expiry       = isoToMDY(String(p.i20_end_date));
  if (p.i20_start_date)  f.graduation_date  = isoToMDY(String(p.i20_start_date));
  return f;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prefillFromDocuments(docs: Array<Record<string, any>>): Fields {
  const f: Fields = {};
  for (const doc of docs) {
    const ef = doc.extracted_data?.extracted_fields as Record<string, string | null> | undefined;
    if (!ef) continue;
    if (ef.first_name && !f.given_name)         f.given_name        = titleCase(ef.first_name);
    if (ef.last_name && !f.family_name)         f.family_name       = titleCase(ef.last_name);
    if (ef.middle_name && !f.middle_name)       f.middle_name       = titleCase(ef.middle_name);
    if (ef.date_of_birth && !f.date_of_birth)   f.date_of_birth     = isoToMDY(ef.date_of_birth);
    if (ef.country_of_birth && !f.country_of_birth) f.country_of_birth = titleCase(ef.country_of_birth);
    if (ef.a_number && !f.a_number)             f.a_number          = ef.a_number;
    if (ef.sevis_id && !f.sevis_id)             f.sevis_id          = ef.sevis_id;
    if (ef.employer_name && !f.employer_name)   f.employer_name     = titleCase(ef.employer_name);
  }
  return f;
}

export default function I765Page() {
  const [messages, setMessages]           = useState<Message[]>([]);
  const [fields, setFields]               = useState<Fields>({});
  const [currentQuestion, setCurrentQuestion] = useState<I765Question | null>(null);
  const [input, setInput]                 = useState("");
  const [progress, setProgress]           = useState(0);
  const [isComplete, setIsComplete]       = useState(false);
  const [started, setStarted]             = useState(false);
  const [prefillCount, setPrefillCount]   = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

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
      if (count > 0) { setFields(combined); setPrefillCount(count); }
    }
    load();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startForm() {
    setStarted(true);
    const first = I765_QUESTIONS.find((q) => !fields[q.id]) ?? I765_QUESTIONS[0];
    setCurrentQuestion(first);
    const openingMsg: Message = prefillCount > 0
      ? {
          role: "assistant",
          content: `✓ Pre-filled ${prefillCount} field${prefillCount > 1 ? "s" : ""} from your profile and uploaded documents.\n\nLet's fill in the remaining questions:\n\n${first.question}`,
        }
      : { role: "assistant", content: first.question };
    setMessages([openingMsg]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function advanceQuestion(currentQ: I765Question, userAnswer: string, normalized: string) {
    const updatedFields = { ...fields, [currentQ.id]: normalized };
    setFields(updatedFields);

    const currentIdx = I765_QUESTIONS.findIndex((q) => q.id === currentQ.id);
    const nextQ      = I765_QUESTIONS[currentIdx + 1] ?? null;
    const newProgress = Math.round(((currentIdx + 1) / I765_QUESTIONS.length) * 100);
    setProgress(newProgress);
    setMessages((prev) => [...prev, { role: "user", content: userAnswer }]);

    if (nextQ) {
      const partChanged = nextQ.part !== currentQ.part;
      const reply = partChanged
        ? `✓ Saved.\n\n**${nextQ.part}: ${nextQ.partTitle}**\n\n${nextQ.question}`
        : `✓ Saved.\n\n${nextQ.question}`;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setCurrentQuestion(nextQ);
    } else {
      setIsComplete(true);
      setCurrentQuestion(null);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "✅ All done! Every section of Form I-765 is filled in.\n\nYour answers have been saved and sent to the VisaPilot team — we'll prepare your I-765 and reach out shortly.",
        },
      ]);
      fetch("/api/forms/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_type: "I-765", fields: updatedFields }),
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
    advanceQuestion(currentQuestion, "Skip", "N/A");
  }

  const currentPart = currentQuestion
    ? I765_PARTS.find((p) => p.id === currentQuestion.part)
    : null;

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-5">
          <FileText className="h-7 w-7 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">I-765 Application for Employment Authorization</h1>
        <p className="text-muted-foreground text-sm max-w-md mb-2">
          For F-1 students applying for OPT or STEM OPT extension. Answer questions in plain English — we&apos;ll fill the official form and send it to you.
        </p>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          Covers all sections of the official USCIS Form I-765 relevant to OPT and STEM OPT applicants.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {I765_PARTS.map((p) => (
            <span key={p.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
              {p.id}
            </span>
          ))}
        </div>
        {prefillCount > 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-green-800 max-w-md">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            <span>
              <strong>{prefillCount} field{prefillCount > 1 ? "s" : ""}</strong> pre-filled from your profile &amp; uploaded documents — we&apos;ll skip straight to unanswered questions.
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800 max-w-md">
          <span className="text-base">⏱</span>
          <span>File at least <strong>90 days before</strong> your OPT start date. USCIS currently takes 3–5 months to process.</span>
        </div>
        <Button size="lg" onClick={startForm} className="px-8 bg-purple-600 hover:bg-purple-700">
          {prefillCount > 0
            ? `Continue I-765 (${I765_QUESTIONS.length - prefillCount} questions left) →`
            : "Start Filling I-765 →"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top bar */}
      <div className="border-b bg-white px-6 py-2.5 flex items-center gap-4 shrink-0">
        <FileText className="h-5 w-5 text-purple-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Form I-765 — Application for Employment Authorization</p>
          {currentPart && (
            <p className="text-xs text-muted-foreground truncate">
              {currentPart.id} · {currentPart.title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">{progress}%</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center mr-2 shrink-0 mt-0.5">
                    VP
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-purple-600 text-white rounded-br-sm"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isComplete && (
              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-700 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Form complete — we&apos;ll be in touch shortly
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
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        const normalized = normalize(currentQuestion.id, opt);
                        advanceQuestion(currentQuestion, opt, normalized);
                      }}
                      className="w-full text-left rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  {currentQuestion && (
                    <span className="text-[10px] text-slate-400 shrink-0 hidden sm:block max-w-[90px] truncate">
                      {currentQuestion.hint}
                    </span>
                  )}
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendAnswer()}
                    placeholder="Type your answer…"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors"
                  />
                  <Button
                    size="sm"
                    onClick={sendAnswer}
                    disabled={!input.trim()}
                    className="h-9 w-9 p-0 rounded-xl shrink-0 bg-purple-600 hover:bg-purple-700"
                  >
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

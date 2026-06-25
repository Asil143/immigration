"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, Plane } from "lucide-react";
import { I131_QUESTIONS, I131_PARTS, type I131Question } from "@/lib/forms/i131";

function normalize(fieldId: string, raw: string): string {
  const v = raw.trim();
  if (!v || v.toLowerCase() === "n/a" || v.toLowerCase() === "none") return "N/A";

  if (fieldId.includes("date") || fieldId === "departure_date" || fieldId === "return_date" || fieldId === "i485_filed_date") {
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
  if (["family_name", "given_name", "middle_name", "country_of_birth", "country_of_citizenship",
       "mailing_city", "countries_to_visit"].includes(fieldId)) {
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
  if (p.first_name)       f.given_name            = titleCase(String(p.first_name));
  if (p.last_name)        f.family_name           = titleCase(String(p.last_name));
  if (p.middle_name)      f.middle_name           = titleCase(String(p.middle_name));
  if (p.date_of_birth)    f.date_of_birth         = isoToMDY(String(p.date_of_birth));
  if (p.country_of_birth) f.country_of_birth      = titleCase(String(p.country_of_birth));
  if (p.ssn)              f.ssn                   = fmtSSN(String(p.ssn));
  if (p.a_number)         f.a_number              = String(p.a_number);
  if (p.mailing_street)   f.mailing_street        = String(p.mailing_street);
  if (p.mailing_city)     f.mailing_city          = titleCase(String(p.mailing_city));
  if (p.mailing_state)    f.mailing_state         = String(p.mailing_state).toUpperCase();
  if (p.mailing_zip)      f.mailing_zip           = String(p.mailing_zip);
  if (p.phone)            f.daytime_phone         = fmtPhone(String(p.phone));
  if (p.email)            f.email                 = String(p.email);
  if (p.visa_type)        f.current_status        = String(p.visa_type);
  return f;
}

export default function I131Page() {
  const [messages, setMessages]               = useState<Message[]>([]);
  const [fields, setFields]                   = useState<Fields>({});
  const [currentQuestion, setCurrentQuestion] = useState<I131Question | null>(null);
  const [input, setInput]                     = useState("");
  const [progress, setProgress]               = useState(0);
  const [isComplete, setIsComplete]           = useState(false);
  const [started, setStarted]                 = useState(false);
  const [prefillCount, setPrefillCount]       = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((profile) => {
        if (profile && !profile.error) {
          const pre = prefillFromProfile(profile);
          const count = Object.keys(pre).length;
          if (count > 0) { setFields(pre); setPrefillCount(count); }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function startForm() {
    setStarted(true);
    const first = I131_QUESTIONS.find((q) => !fields[q.id]) ?? I131_QUESTIONS[0];
    setCurrentQuestion(first);
    const openingMsg: Message = prefillCount > 0
      ? { role: "assistant", content: `✓ Pre-filled ${prefillCount} field${prefillCount > 1 ? "s" : ""} from your profile.\n\nLet's fill in the remaining questions:\n\n${first.question}` }
      : { role: "assistant", content: first.question };
    setMessages([openingMsg]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function advanceQuestion(currentQ: I131Question, userAnswer: string, normalized: string) {
    const updatedFields = { ...fields, [currentQ.id]: normalized };
    setFields(updatedFields);

    const currentIdx = I131_QUESTIONS.findIndex((q) => q.id === currentQ.id);
    const nextQ      = I131_QUESTIONS[currentIdx + 1] ?? null;
    setProgress(Math.round(((currentIdx + 1) / I131_QUESTIONS.length) * 100));
    setMessages((prev) => [...prev, { role: "user", content: userAnswer }]);

    if (nextQ) {
      const partChanged = nextQ.part !== currentQ.part;
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: partChanged
          ? `✓ Saved.\n\n**${nextQ.part}: ${nextQ.partTitle}**\n\n${nextQ.question}`
          : `✓ Saved.\n\n${nextQ.question}`,
      }]);
      setCurrentQuestion(nextQ);
    } else {
      setIsComplete(true);
      setCurrentQuestion(null);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "✅ All done! Form I-131 is fully filled in.\n\nYour answers have been saved and sent to the VisaPilot team — we'll prepare your travel document application and reach out shortly.",
      }]);
      fetch("/api/forms/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_type: "I-131", fields: updatedFields }),
      }).catch(console.error);
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function sendAnswer() {
    if (!input.trim() || !currentQuestion) return;
    const userAnswer = input.trim();
    setInput("");
    advanceQuestion(currentQuestion, userAnswer, normalize(currentQuestion.id, userAnswer));
  }

  function skipQuestion() {
    if (!currentQuestion) return;
    advanceQuestion(currentQuestion, "Skip", "N/A");
  }

  const currentPart = currentQuestion ? I131_PARTS.find((p) => p.id === currentQuestion.part) : null;

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-5">
          <Plane className="h-7 w-7 text-sky-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">I-131 Application for Travel Document</h1>
        <p className="text-muted-foreground text-sm max-w-md mb-2">
          For Advance Parole, Refugee Travel Documents, and Re-entry Permits. Answer questions in plain English — we'll prepare your official form.
        </p>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          Most commonly used by I-485 applicants who need to travel while their green card is pending.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {I131_PARTS.map((p) => (
            <span key={p.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{p.id}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800 max-w-md">
          <span className="text-base">⚠️</span>
          <span><strong>Important:</strong> Do NOT travel outside the U.S. while your I-485 is pending without an approved Advance Parole. Doing so may abandon your green card application.</span>
        </div>
        {prefillCount > 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-green-800 max-w-md">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            <span><strong>{prefillCount} field{prefillCount > 1 ? "s" : ""}</strong> pre-filled from your profile — we'll skip to unanswered questions.</span>
          </div>
        )}
        <Button size="lg" onClick={startForm} className="px-8 bg-sky-600 hover:bg-sky-700">
          {prefillCount > 0
            ? `Continue I-131 (${I131_QUESTIONS.length - prefillCount} questions left) →`
            : "Start Filling I-131 →"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="border-b bg-white px-6 py-2.5 flex items-center gap-4 shrink-0">
        <Plane className="h-5 w-5 text-sky-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Form I-131 — Application for Travel Document</p>
          {currentPart && <p className="text-xs text-muted-foreground truncate">{currentPart.id} · {currentPart.title}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
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
                  <div className="w-7 h-7 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center mr-2 shrink-0 mt-0.5">VP</div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-sky-600 text-white rounded-br-sm"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isComplete && (
              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-700 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Form complete — we'll be in touch shortly
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!isComplete && (
            <div className="border-t bg-white p-3 space-y-2">
              {currentQuestion?.optional && (
                <div className="flex justify-end">
                  <button onClick={skipQuestion} className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors">
                    Skip (not applicable)
                  </button>
                </div>
              )}
              {currentQuestion?.options ? (
                <div className="flex flex-col gap-1.5">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => advanceQuestion(currentQuestion, opt, normalize(currentQuestion.id, opt))}
                      className="w-full text-left rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 transition-colors"
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
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendAnswer()}
                    placeholder="Type your answer…"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:bg-white transition-colors"
                  />
                  <Button size="sm" onClick={sendAnswer} disabled={!input.trim()} className="h-9 w-9 p-0 rounded-xl shrink-0 bg-sky-600 hover:bg-sky-700">
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

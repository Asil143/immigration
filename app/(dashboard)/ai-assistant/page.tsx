"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Loader2, Plus, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types";

// ── Visa-type-specific suggested questions ────────────────────────────────────
const QUESTIONS_BY_VISA: Record<string, string[]> = {
  "F-1 (OPT)": [
    "How many unemployment days do I have left on OPT?",
    "What happens if my OPT EAD expires before STEM OPT is approved?",
    "Can I change employers on OPT?",
    "What is cap-gap and does it apply to me?",
  ],
  "F-1 (STEM OPT)": [
    "What are my reporting requirements on STEM OPT?",
    "Can I change employers on STEM OPT?",
    "What happens if my employer loses E-Verify status?",
    "How do I count STEM OPT unemployment days?",
  ],
  "H-1B": [
    "Can I start working at my new employer before my H-1B transfer is approved?",
    "What is H-1B portability and how does it work?",
    "Can I travel outside the US while my H-1B extension is pending?",
    "How does the H-1B lottery work and when is it?",
  ],
  "F-1": [
    "When should I apply for OPT?",
    "Can I work off-campus on F-1?",
    "What is CPT and how is it different from OPT?",
    "What happens if my I-20 expires?",
  ],
  "Green Card (Pending I-485)": [
    "Can I travel while my I-485 is pending?",
    "Can I change jobs while my green card is pending?",
    "What is AC21 job portability?",
    "How do I check my priority date?",
  ],
  "Green Card (LPR)": [
    "When can I apply for naturalization?",
    "How long can I travel outside the US as a green card holder?",
    "How do I renew my green card?",
    "Can I sponsor a family member for a green card?",
  ],
  default: [
    "What are the OPT unemployment day limits?",
    "Can I travel during H-1B transfer?",
    "What is EB-2 NIW and how do I qualify?",
    "How does cap-gap work after H-1B lottery?",
    "What documents do I need for STEM OPT extension?",
    "Can I work on campus with F-1 visa?",
  ],
};

// ── Markdown renderer ─────────────────────────────────────────────────────────
function renderMarkdown(text: string): string {
  const lines = text.split("\n");
  const output: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;
  let inCodeBlock = false;
  let codeLines: string[] = [];

  const flushList = () => {
    if (inList) {
      output.push(listType === "ol" ? "</ol>" : "</ul>");
      inList = false;
      listType = null;
    }
  };

  const inlineFormat = (s: string) =>
    s
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code fences
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        flushList();
        inCodeBlock = true;
        codeLines = [];
      } else {
        output.push(`<pre class="code-block"><code>${codeLines.map(l => escHtml(l)).join("\n")}</code></pre>`);
        inCodeBlock = false;
        codeLines = [];
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(line); continue; }

    // Headings
    if (line.startsWith("### ")) { flushList(); output.push(`<h3 class="md-h3">${inlineFormat(line.slice(4))}</h3>`); continue; }
    if (line.startsWith("## ")) { flushList(); output.push(`<h2 class="md-h2">${inlineFormat(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("# ")) { flushList(); output.push(`<h1 class="md-h1">${inlineFormat(line.slice(2))}</h1>`); continue; }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) { flushList(); output.push('<hr class="md-hr" />'); continue; }

    // Ordered list
    const olMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (!inList || listType !== "ol") { flushList(); output.push('<ol class="md-ol">'); inList = true; listType = "ol"; }
      output.push(`<li>${inlineFormat(olMatch[2])}</li>`);
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[-*•]\s+(.+)/);
    if (ulMatch) {
      if (!inList || listType !== "ul") { flushList(); output.push('<ul class="md-ul">'); inList = true; listType = "ul"; }
      output.push(`<li>${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    // Blank line
    if (line.trim() === "") { flushList(); output.push("<br/>"); continue; }

    // Normal paragraph line
    flushList();
    output.push(`<p class="md-p">${inlineFormat(line)}</p>`);
  }

  flushList();
  return output.join("");
}

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your VisaPilot AI assistant — personalized to your visa status and key dates.\n\nI can help with F-1, OPT, STEM OPT, H-1B, green cards, and more.\n\n**Remember:** I provide general information, not legal advice. For your specific case, consult a licensed immigration attorney.\n\nWhat would you like to know?",
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [visaType, setVisaType] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.visa_type) setVisaType(data.visa_type);
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestedQuestions =
    (visaType && QUESTIONS_BY_VISA[visaType]) ?? QUESTIONS_BY_VISA.default;

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: assistantMsgId, role: "assistant", content: "", created_at: new Date().toISOString() },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg]
            .filter(m => m.id !== "welcome")
            .map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulated } : m)
        );
      }
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: "I'm having trouble connecting right now. Please try again in a moment." }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  const showSuggestions = messages.length === 1 && profileLoaded;

  return (
    <>
      {/* Markdown styles */}
      <style>{`
        .md-h1 { font-size: 1.2rem; font-weight: 700; margin: 0.75rem 0 0.4rem; }
        .md-h2 { font-size: 1.05rem; font-weight: 700; margin: 0.75rem 0 0.35rem; }
        .md-h3 { font-size: 0.95rem; font-weight: 600; margin: 0.6rem 0 0.3rem; }
        .md-p  { margin: 0.25rem 0; line-height: 1.6; }
        .md-ul, .md-ol { padding-left: 1.4rem; margin: 0.35rem 0; }
        .md-ul { list-style-type: disc; }
        .md-ol { list-style-type: decimal; }
        .md-ul li, .md-ol li { margin: 0.2rem 0; line-height: 1.55; }
        .md-hr { border: none; border-top: 1px solid #e2e8f0; margin: 0.75rem 0; }
        .inline-code { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.1em 0.35em; font-size: 0.85em; font-family: monospace; }
        .code-block { background: #1e293b; color: #e2e8f0; border-radius: 8px; padding: 0.9rem 1rem; overflow-x: auto; font-size: 0.82rem; margin: 0.5rem 0; font-family: monospace; line-height: 1.5; }
      `}</style>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">AI Immigration Assistant</h1>
                {visaType && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                    <Sparkles className="h-3 w-3" />
                    Personalized · {visaType}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Powered by Claude · Knows your visa status, dates &amp; cases
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMessages([{
                id: "welcome",
                role: "assistant",
                content: "Hi! I'm your VisaPilot AI assistant — personalized to your visa status and key dates.\n\nWhat would you like to know?",
                created_at: new Date().toISOString(),
              }]);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> New Chat
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-slate-50/40">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-slate-200" : "bg-primary"}`}>
                {msg.role === "user"
                  ? <User className="h-4 w-4 text-slate-600" />
                  : <Bot className="h-4 w-4 text-white" />
                }
              </div>
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-tr-none bg-primary text-primary-foreground"
                  : "rounded-tl-none bg-white border shadow-sm"
              }`}>
                {msg.role === "assistant" ? (
                  msg.content ? (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking…</span>
                    </div>
                  )
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        {showSuggestions && (
          <div className="border-t bg-background px-6 pt-3 pb-2">
            <p className="text-xs text-muted-foreground mb-2">
              {visaType ? `Suggested for ${visaType}:` : "Suggested questions:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-full border bg-background px-3 py-1.5 text-xs hover:bg-accent transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="px-6 pb-1 bg-background">
          <Badge variant="warning" className="text-xs">
            General information only · Not legal advice · Consult a licensed attorney for your situation
          </Badge>
        </div>

        {/* Input */}
        <div className="border-t bg-background px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask any immigration question…"
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()} size="icon">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

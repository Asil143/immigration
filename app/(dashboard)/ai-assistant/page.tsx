"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Loader2, Plus, Sparkles, MessageSquare, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (!inCodeBlock) { flushList(); inCodeBlock = true; codeLines = []; }
      else { output.push(`<pre class="code-block"><code>${codeLines.map(escHtml).join("\n")}</code></pre>`); inCodeBlock = false; codeLines = []; }
      continue;
    }
    if (inCodeBlock) { codeLines.push(line); continue; }
    if (line.startsWith("### ")) { flushList(); output.push(`<h3 class="md-h3">${inlineFormat(line.slice(4))}</h3>`); continue; }
    if (line.startsWith("## ")) { flushList(); output.push(`<h2 class="md-h2">${inlineFormat(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("# ")) { flushList(); output.push(`<h1 class="md-h1">${inlineFormat(line.slice(2))}</h1>`); continue; }
    if (/^---+$/.test(line.trim())) { flushList(); output.push('<hr class="md-hr" />'); continue; }
    const olMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (!inList || listType !== "ol") { flushList(); output.push('<ol class="md-ol">'); inList = true; listType = "ol"; }
      output.push(`<li>${inlineFormat(olMatch[2])}</li>`);
      continue;
    }
    const ulMatch = line.match(/^[-*•]\s+(.+)/);
    if (ulMatch) {
      if (!inList || listType !== "ul") { flushList(); output.push('<ul class="md-ul">'); inList = true; listType = "ul"; }
      output.push(`<li>${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }
    if (line.trim() === "") { flushList(); output.push("<br/>"); continue; }
    flushList();
    output.push(`<p class="md-p">${inlineFormat(line)}</p>`);
  }
  flushList();
  return output.join("");
}

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm your VisaPilot AI assistant — personalized to your visa status and key dates.\n\nI can help with F-1, OPT, STEM OPT, H-1B, green cards, and more.\n\n**Remember:** I provide general information, not legal advice. For your specific case, consult a licensed immigration attorney.\n\nWhat would you like to know?",
  created_at: new Date().toISOString(),
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [visaType, setVisaType] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Conversation history
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [convLoading, setConvLoading] = useState(false);
  const [savingConv, setSavingConv] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load profile + conversation list on mount
  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.visa_type) setVisaType(data.visa_type);
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));

    fetch("/api/chat/conversations")
      .then(r => r.ok ? r.json() : [])
      .then(setConversations)
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestedQuestions: string[] =
    (visaType ? QUESTIONS_BY_VISA[visaType] : undefined) ?? QUESTIONS_BY_VISA.default;

  // Auto-save conversation after each AI response
  const saveConversation = useCallback(async (msgs: ChatMessage[], convId: string | null, firstUserMsg?: string) => {
    const payload = msgs
      .filter(m => m.id !== "welcome")
      .map(m => ({ role: m.role, content: m.content }));
    if (payload.length === 0) return convId;

    setSavingConv(true);
    try {
      if (!convId) {
        // Create new conversation
        const title = firstUserMsg
          ? firstUserMsg.slice(0, 60) + (firstUserMsg.length > 60 ? "…" : "")
          : "New conversation";
        const res = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, messages: payload }),
        });
        if (res.ok) {
          const conv: Conversation = await res.json();
          setActiveConvId(conv.id);
          setConversations(prev => [conv, ...prev]);
          return conv.id;
        }
      } else {
        await fetch(`/api/chat/conversations/${convId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload }),
        });
        setConversations(prev => prev.map(c => c.id === convId ? { ...c, updated_at: new Date().toISOString() } : c));
      }
    } catch { /* best-effort save */ } finally {
      setSavingConv(false);
    }
    return convId;
  }, []);

  async function loadConversation(conv: Conversation) {
    setConvLoading(true);
    try {
      const res = await fetch(`/api/chat/conversations/${conv.id}`);
      if (!res.ok) return;
      const data = await res.json();
      const loaded: ChatMessage[] = (data.messages as { role: string; content: string }[]).map((m, i) => ({
        id: `loaded-${i}`,
        role: m.role as "user" | "assistant",
        content: m.content,
        created_at: data.updated_at,
      }));
      setMessages([WELCOME, ...loaded]);
      setActiveConvId(conv.id);
    } finally {
      setConvLoading(false);
    }
  }

  async function deleteConversation(convId: string, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/chat/conversations/${convId}`, { method: "DELETE" });
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConvId === convId) startNewChat();
  }

  function startNewChat() {
    setMessages([WELCOME]);
    setActiveConvId(null);
    inputRef.current?.focus();
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };

    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput("");
    setLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: assistantMsgId, role: "assistant", content: "", created_at: new Date().toISOString() },
    ]);

    let accumulated = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMsgs
            .filter(m => m.id !== "welcome")
            .map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulated } : m)
        );
      }
    } catch {
      accumulated = "I'm having trouble connecting right now. Please try again in a moment.";
      setMessages(prev =>
        prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulated } : m)
      );
    } finally {
      setLoading(false);
    }

    // Save after AI response is complete
    const finalMsgs: ChatMessage[] = [
      ...updatedMsgs,
      { id: assistantMsgId, role: "assistant", content: accumulated, created_at: new Date().toISOString() },
    ];
    await saveConversation(finalMsgs, activeConvId, text);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  const showSuggestions = messages.length === 1 && profileLoaded;
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
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

      <div className="flex h-full">
        {/* ── Sidebar ── */}
        <div className={`flex flex-col border-r bg-slate-50 transition-all duration-200 shrink-0 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}>
          <div className="p-3 border-b flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conversations</span>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1" onClick={startNewChat}>
              <Plus className="h-3.5 w-3.5" /> New
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {conversations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center pt-8 px-4">No saved conversations yet. Start chatting!</p>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv)}
                  className={`w-full text-left px-3 py-2.5 flex items-start gap-2 hover:bg-slate-100 transition-colors group ${activeConvId === conv.id ? "bg-slate-100" : ""}`}
                >
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{conv.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(conv.updated_at)}</p>
                  </div>
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Main chat area ── */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-background px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <button onClick={() => setSidebarOpen(o => !o)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded">
                {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-sm">AI Immigration Assistant</h1>
                  {visaType && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      <Sparkles className="h-2.5 w-2.5" /> {visaType}
                    </span>
                  )}
                  {savingConv && <span className="text-[10px] text-muted-foreground">Saving…</span>}
                </div>
                <p className="text-[11px] text-muted-foreground">Knows your visa status, dates &amp; cases</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={startNewChat} className="text-xs">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New Chat
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 bg-slate-50/40">
            {convLoading ? (
              <div className="flex justify-center pt-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-slate-200" : "bg-primary"}`}>
                    {msg.role === "user"
                      ? <User className="h-3.5 w-3.5 text-slate-600" />
                      : <Bot className="h-3.5 w-3.5 text-white" />
                    }
                  </div>
                  <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-tr-none bg-primary text-primary-foreground"
                      : "rounded-tl-none bg-white border shadow-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      msg.content ? (
                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Thinking…</span>
                        </div>
                      )
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {showSuggestions && (
            <div className="border-t bg-background px-5 pt-3 pb-1">
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
          <div className="px-5 py-1 bg-background">
            <Badge variant="warning" className="text-[10px]">
              General information only · Not legal advice · Consult a licensed attorney for your situation
            </Badge>
          </div>

          {/* Input */}
          <div className="border-t bg-background px-5 py-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
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
      </div>
    </>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Loader2, Plus } from "lucide-react";
import type { ChatMessage } from "@/types";

const SUGGESTED_QUESTIONS = [
  "What are the OPT unemployment day limits?",
  "Can I travel during H-1B transfer?",
  "What is EB-2 NIW and how do I qualify?",
  "How does cap-gap work after H-1B lottery?",
  "What documents do I need for STEM OPT extension?",
  "Can I work on campus with F-1 visa?",
];

function formatMessage(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your VisaPilot AI assistant. I can help you with US immigration questions about F-1, OPT, STEM OPT, H-1B, green cards, and more.\n\n**Remember:** I provide general information, not legal advice. For your specific situation, always consult a licensed immigration attorney.\n\nWhat would you like to know?",
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg]
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content:
                  "I'm having trouble connecting right now. Please try again in a moment.",
              }
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-background px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold">AI Immigration Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Powered by Claude · General info only, not legal advice
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
          <Plus className="mr-1.5 h-4 w-4" /> New Chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                msg.role === "user" ? "bg-slate-200" : "bg-primary"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-4 w-4 text-slate-600" />
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-tr-none bg-primary text-primary-foreground"
                  : "rounded-tl-none bg-white border shadow-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                msg.content ? (
                  <div
                    className="prose-chat"
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
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

      {/* Suggested Questions (shown when only welcome message) */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-xs text-muted-foreground mb-3">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
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

      {/* Legal disclaimer */}
      <div className="px-6 pb-2">
        <Badge variant="warning" className="text-xs">
          General information only · Not legal advice · Consult a licensed attorney for your situation
        </Badge>
      </div>

      {/* Input */}
      <div className="border-t bg-background px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask any immigration question..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()} size="icon">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

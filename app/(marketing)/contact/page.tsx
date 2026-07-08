"use client";

import { useState } from "react";
import { Mail, MessageSquare, Clock, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const subjects = [
    "General question",
    "Bug report",
    "Feature request",
    "Billing / payment issue",
    "Account help",
    "Immigration content feedback",
    "Other",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b bg-slate-50">
        <div className="container mx-auto px-4 py-14 max-w-5xl">
          <p className="text-sm font-medium text-blue-600 mb-2">Get in touch</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Contact Us</h1>
          <p className="text-slate-500 max-w-xl">
            Have a question, found a bug, or want to suggest a feature? We&apos;d love to hear from you.
            We typically respond within 1–2 business days.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Left — contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-semibold text-slate-900 mb-5">Other ways to reach us</h2>
              <div className="space-y-4">
                <a href="mailto:support@statusclock.com" className="flex items-start gap-3 group">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">General support</p>
                    <p className="text-sm text-blue-600 hover:underline">support@statusclock.com</p>
                  </div>
                </a>
                <a href="mailto:privacy@statusclock.com" className="flex items-start gap-3 group">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Privacy inquiries</p>
                    <p className="text-sm text-blue-600 hover:underline">privacy@statusclock.com</p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Response time</p>
                  <p className="text-sm text-slate-500">1–2 business days</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 leading-6">
              <strong>Not legal advice.</strong> We can&apos;t answer case-specific immigration questions
              or review your documents. Please consult a licensed immigration attorney for that.
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">Quick links</h3>
              <ul className="space-y-2">
                {[
                  { label: "Browse visa guides", href: "/guides" },
                  { label: "Try the AI Assistant", href: "/ai-assistant" },
                  { label: "View checklists", href: "/dashboard/tools/checklists" },
                  { label: "Find a lawyer", href: "/lawyers" },
                  { label: "FAQ", href: "/faq" },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                      <ExternalLink className="h-3 w-3" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — form */}
          <div className="md:col-span-2">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-green-50 border border-green-100 rounded-2xl">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Message sent!</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Thanks for reaching out. We&apos;ll get back to you within 1–2 business days.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm text-blue-600 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Your name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Smith"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@university.edu"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select a subject…</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what's on your mind…"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    Something went wrong. Please try emailing us directly at support@statusclock.com.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

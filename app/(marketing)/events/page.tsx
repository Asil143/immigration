"use client";

import { useState } from "react";
import { Video, Bell, MessageSquare, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";

const PLANNED_TOPICS = [
  { tag: "H-1B", title: "H-1B Cap Season walkthrough", desc: "Lottery registration, selection, what to do after — with a licensed attorney." },
  { tag: "OPT", title: "OPT to H-1B: Cap-gap & STEM extension", desc: "Bridging the transition without losing status." },
  { tag: "Green Card", title: "EB-2 NIW self-petition primer", desc: "The three-prong test, what evidence you need, realistic timelines." },
  { tag: "India / China", title: "Priority date backlog deep dive", desc: "AC21 portability, EB-1A escape valve, realistic expectations." },
  { tag: "RFE", title: "RFE response strategies", desc: "How to respond effectively and what attorneys look for." },
];

export default function EventsPage() {
  const [email, setEmail] = useState("");
  const [topicDraft, setTopicDraft] = useState("");
  const [notifyDone, setNotifyDone] = useState(false);
  const [topicDone, setTopicDone] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [topicLoading, setTopicLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setNotifyLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Event Waitlist",
          email,
          subject: "Event waitlist signup",
          message: `${email} joined the webinar waitlist.`,
        }),
      });
      if (!res.ok) throw new Error();
      setNotifyDone(true);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setNotifyLoading(false);
    }
  }

  async function submitTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!topicDraft.trim()) return;
    setTopicLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Topic Suggestion",
          email: "noreply@visapilot.app",
          subject: "Webinar topic suggestion",
          message: topicDraft,
        }),
      });
      if (!res.ok) throw new Error();
      setTopicDone(true);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setTopicLoading(false);
    }
  }

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="py-20 border-b bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-blue-100 text-blue-700 border border-blue-200">
            <Video className="h-4 w-4" />
            Free webinars — coming soon
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Live immigration Q&amp;As with attorneys
          </h1>
          <p className="text-lg text-slate-500 leading-7">
            We're planning free live webinars on H-1B, OPT, green card backlogs, and more —
            with licensed immigration attorneys. No events are scheduled yet.
            Join the waitlist to be the first to know.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-3xl space-y-12">

        {/* Waitlist */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-6 w-6 text-blue-600 shrink-0" />
            <h2 className="text-lg font-bold text-slate-900">Get notified when we go live</h2>
          </div>
          <p className="text-sm text-slate-600 mb-5">
            We'll send one email when the first webinar is scheduled. No spam, unsubscribe any time.
          </p>
          {notifyDone ? (
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              You're on the list — we'll email you when the first event is announced.
            </div>
          ) : (
            <form onSubmit={submitNotify} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-blue-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={notifyLoading || !email}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors shrink-0"
              >
                {notifyLoading ? "…" : "Notify me"}
              </button>
            </form>
          )}
        </div>

        {/* Planned topics */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Topics we're planning to cover</h2>
          <p className="text-sm text-slate-500 mb-6">These are topics we intend to host — not confirmed dates or speakers.</p>
          <div className="space-y-3">
            {PLANNED_TOPICS.map(t => (
              <div key={t.tag} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs font-bold px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0 mt-0.5">{t.tag}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic suggestion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="h-5 w-5 text-amber-500 shrink-0" />
            <h2 className="text-lg font-bold text-slate-900">Suggest a topic</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Have a specific immigration question that would be great for a live Q&A? Tell us — we'll prioritize topics with the most requests.
          </p>
          {topicDone ? (
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              Thanks! We'll factor this in when planning topics.
            </div>
          ) : (
            <form onSubmit={submitTopic} className="space-y-3">
              <textarea
                required
                rows={3}
                value={topicDraft}
                onChange={e => setTopicDraft(e.target.value)}
                placeholder="e.g. How to respond to an H-1B RFE for specialty occupation..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={topicLoading || !topicDraft.trim()}
                className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                {topicLoading ? "Submitting…" : "Submit topic"}
              </button>
            </form>
          )}
          {error && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* In the meantime */}
        <div className="text-center py-4">
          <p className="text-sm text-slate-500">
            While you wait — our{" "}
            <a href="/ai-assistant" className="text-blue-600 hover:underline font-medium">AI Assistant</a>{" "}
            answers immigration questions 24/7, and our{" "}
            <a href="/guides" className="text-blue-600 hover:underline font-medium">visa guides</a>{" "}
            cover every major US immigration path in plain English.
          </p>
        </div>

      </div>
    </div>
  );
}

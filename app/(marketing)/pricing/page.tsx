"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  CheckCircle2, ArrowRight, Zap, Shield, Star,
  Users, ChevronDown, Bot, Calendar, Lock, X, Copy, Check,
} from "lucide-react";

// ─── Payment methods ──────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { label: "Cash App",  handle: "$AsilKamepalli",   href: "https://cash.app/$AsilKamepalli",             color: "#00d632", bg: "rgba(0,214,50,0.08)",   border: "rgba(0,214,50,0.25)" },
  { label: "PayPal",    handle: "AsilKamepalli",     href: "https://paypal.me/AsilKamepalli",             color: "#009cde", bg: "rgba(0,156,222,0.08)",  border: "rgba(0,156,222,0.25)" },
  { label: "Venmo",     handle: "@Asil-Kamepalli",   href: "https://venmo.com/u/Asil-Kamepalli",          color: "#008cff", bg: "rgba(0,140,255,0.08)",  border: "rgba(0,140,255,0.25)" },
  { label: "Chime",     handle: "$Asil-Kamepalli",   href: null,                                          color: "#73cf2e", bg: "rgba(115,207,46,0.08)", border: "rgba(115,207,46,0.25)" },
  { label: "Zelle",     handle: "331-226-7117",      href: null,                                          color: "#6d1ed4", bg: "rgba(109,30,212,0.08)", border: "rgba(109,30,212,0.25)" },
];

interface PlanInfo { name: string; price: number; id: string; }

function PaymentModal({ plan, onClose, userEmail }: { plan: PlanInfo; onClose: () => void; userEmail: string }) {
  const [step, setStep] = useState<"choose" | "confirm" | "done">("choose");
  const [form, setForm] = useState({ email: userEmail, txNote: "" });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function copyHandle(handle: string) {
    navigator.clipboard.writeText(handle);
    setCopied(handle);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.email,
          email: form.email,
          subject: `Payment Confirmation — ${plan.name} ($${plan.price})`,
          message: `Plan: ${plan.name}\nAmount: $${plan.price}\nCustomer email: ${form.email}\n\nTransaction note:\n${form.txNote || "(none provided)"}`,
        }),
      });
      setStep("done");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <p className="font-bold text-slate-900">{plan.name}</p>
            <p className="text-2xl font-black text-blue-600">${plan.price} <span className="text-sm font-normal text-slate-400">{plan.id === "all-access" ? "/ year" : "one-time"}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>

        {step === "choose" && (
          <div className="p-6">
            <p className="text-sm text-slate-500 mb-4">Send <strong className="text-slate-800">${plan.price}</strong> using any of these methods, then click "I've paid" to confirm.</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {PAYMENT_METHODS.map(({ label, handle, href, color, bg, border }) =>
                href ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center p-3 rounded-xl border text-center no-underline hover:opacity-90 transition-opacity"
                    style={{ background: bg, borderColor: border }}>
                    <span className="text-xs font-bold mb-0.5" style={{ color }}>{label}</span>
                    <span className="text-xs text-slate-500">{handle}</span>
                  </a>
                ) : (
                  <button key={label} onClick={() => copyHandle(handle)}
                    className="flex flex-col items-center p-3 rounded-xl border text-center hover:opacity-90 transition-opacity"
                    style={{ background: bg, borderColor: border }}>
                    <span className="text-xs font-bold mb-0.5" style={{ color }}>{label}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      {copied === handle ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      {copied === handle ? "Copied!" : handle}
                    </span>
                  </button>
                )
              )}
            </div>
            <button onClick={() => setStep("confirm")}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors">
              I&apos;ve paid — confirm my order →
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-500">Enter your email and any transaction note so we can activate your plan.</p>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Your email</label>
              <input
                type="email"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Transaction note <span className="text-slate-400 font-normal">(optional — last 4 digits, amount, or screenshot description)</span></label>
              <textarea
                rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.txNote}
                onChange={e => setForm(f => ({ ...f, txNote: e.target.value }))}
                placeholder="e.g. Sent $29 via Cash App at 3:45pm"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep("choose")} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">← Back</button>
              <button onClick={handleSubmit} disabled={!form.email || submitting}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-colors">
                {submitting ? "Sending…" : "Submit — activate my plan"}
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-lg font-bold text-slate-900 mb-2">Order received!</p>
            <p className="text-sm text-slate-500 leading-6">
              We&apos;ll verify your payment and activate your <strong>{plan.name}</strong> within 2–4 hours.
              Check your email at <strong>{form.email}</strong> for confirmation.
            </p>
            <button onClick={onClose} className="mt-5 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const eventPacks = [
  {
    id: "h1b",
    name: "H-1B Season Pack",
    price: 29,
    icon: "🎯",
    color: "#eff6ff",
    border: "#bfdbfe",
    textColor: "#1d4ed8",
    accent: "#2563eb",
    duration: "Active Mar–Jun",
    badge: "Most purchased",
    description: "Full support during H-1B cap registration season",
    features: [
      "H-1B registration step-by-step checklist",
      "Cap-gap & OPT bridge guide",
      "Lottery odds & employer sponsorship lookup",
      "Unlimited AI questions for 90 days",
      "RFE response templates",
      "Deadline alerts during cap season",
    ],
  },
  {
    id: "opt",
    name: "OPT / STEM OPT Pack",
    price: 19,
    icon: "📋",
    color: "#f0fdf4",
    border: "#86efac",
    textColor: "#15803d",
    accent: "#16a34a",
    duration: "Use anytime",
    badge: null,
    description: "Everything for OPT & STEM OPT applications",
    features: [
      "I-765 filing checklist & guide",
      "STEM OPT I-983 training plan template",
      "90-day unemployment tracker",
      "Unlimited AI questions for 60 days",
      "DSO communication templates",
      "Deadline calculator & alerts",
    ],
  },
  {
    id: "rfe",
    name: "RFE Response Pack",
    price: 39,
    icon: "⚡",
    color: "#fff7ed",
    border: "#fed7aa",
    textColor: "#c2410c",
    accent: "#ea580c",
    duration: "Use within 87 days",
    badge: "High urgency",
    description: "Build a strong RFE response before the deadline",
    features: [
      "AI-powered RFE analyzer (real Claude API)",
      "Evidence checklist by RFE type",
      "Draft response frameworks per issue",
      "Unlimited AI questions for 87 days",
      "Attorney review marketplace access",
      "Response letter templates",
    ],
  },
  {
    id: "greencard",
    name: "Green Card Prep Pack",
    price: 49,
    icon: "🌿",
    color: "#faf5ff",
    border: "#d8b4fe",
    textColor: "#6d28d9",
    accent: "#7c3aed",
    duration: "Use anytime",
    badge: null,
    description: "EB-2 NIW, EB-1A, or PERM pathway planning",
    features: [
      "Visa bulletin priority date tracker",
      "EB-2 NIW petition builder guide",
      "EB-1A criteria self-assessment",
      "AC21 portability explainer",
      "India/China backlog calculator",
      "Unlimited AI questions for 90 days",
    ],
  },
];

const freeFeatures = [
  "All visa checklists (12 types)",
  "OPT day counter & timeline tracker",
  "H-1B employer lookup (E-Verify)",
  "Visa comparison tool",
  "Immigration glossary (60+ terms)",
  "Visa bulletin tracker",
  "USCIS fee calculator",
  "AI Assistant (10 questions/month)",
];

const allAccessFeatures = [
  "Everything in Free — forever",
  "All 4 Event Packs included",
  "Unlimited AI Assistant questions",
  "USCIS case auto-monitoring",
  "SMS + email deadline alerts",
  "RFE analyzer (Claude API)",
  "Document vault (AES-256 encrypted)",
  "AI document analyzer",
  "Green card stage tracker",
  "Priority attorney matching",
  "Cancel anytime",
];

const faqs = [
  {
    q: "Why packs instead of a subscription?",
    a: "Because immigration is episodic, not ongoing. A STEM OPT student who just got approved doesn't need anything for 2 years — until H-1B season. Pay for your current event, not months you don't use.",
  },
  {
    q: "When should I choose All-Access instead of a pack?",
    a: "If you're actively mid-process across multiple steps — like waiting on an I-140 while also tracking a visa bulletin and monitoring a pending case — All-Access is better value. If you have one specific event, just buy that pack.",
  },
  {
    q: "Do event packs expire?",
    a: "Only the H-1B Season Pack is time-limited (active during cap season). All other packs never expire — buy now, use when you're ready.",
  },
  {
    q: "What does the AI Assistant actually do?",
    a: "It's powered by Anthropic's Claude and answers general immigration questions — OPT timelines, H-1B cap-gap rules, green card steps, visa bulletin interpretation. It cannot review your specific case or replace an attorney.",
  },
  {
    q: "Can I cancel All-Access?",
    a: "Yes, cancel anytime. Most people cancel once their current immigration event resolves. Your data stays saved — you just lose access to premium features.",
  },
  {
    q: "Do you take a cut from attorney fees?",
    a: "Yes — if you hire through VisaPilot, we charge a 12% platform fee, which is already built into the prices attorneys list. No surprise costs to you.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Documents are AES-256 encrypted. We never sell your data. See our Privacy Policy for full details.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const { isSignedIn, user } = useUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const dest = (path: string) => isSignedIn ? "/dashboard" : path;

  return (
    <div className="bg-white min-h-screen">
      {selectedPlan && <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} userEmail={userEmail} />}

      {/* Hero */}
      <section className="py-20 text-center border-b bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-blue-50 text-blue-700 border border-blue-100">
            <Zap className="h-4 w-4" />
            Pay for what you need — nothing more
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-5 leading-tight">
            Pricing that fits<br />your immigration stage
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-4 leading-7">
            Start free. Buy a pack when a big event hits.
            Go All-Access when your journey gets complex.
          </p>
          <p className="text-sm text-slate-400">No credit card for free tier · Packs never expire · Cancel anytime</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">

        {/* Free tier — always first */}
        <div className="mb-20">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl font-bold text-slate-900">Free</span>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">Always free</span>
              </div>
              <p className="text-slate-500 text-sm mb-5">Everything you need to understand your options. No sign-up required for checklists.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {freeFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0 text-center">
              <Link
                href={dest("/sign-up")}
                className="block px-8 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-700 transition-colors"
              >
                {isSignedIn ? "Go to Dashboard" : "Get started free"}
              </Link>
              <p className="text-xs text-slate-400 mt-2">No credit card needed</p>
            </div>
          </div>
        </div>

        {/* Event Packs — primary revenue */}
        <div id="packs" className="mb-20">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-blue-600 mb-2">Pay once · Use when needed</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Event Packs</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Buy the pack for your current immigration event. One payment, no recurring charges, no expiry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {eventPacks.map((pack) => (
              <div
                key={pack.id}
                className="rounded-2xl border-2 overflow-hidden flex flex-col relative"
                style={{ borderColor: pack.border }}
              >
                {pack.badge && (
                  <div className="text-center py-1.5 text-xs font-bold text-white" style={{ backgroundColor: pack.accent }}>
                    {pack.badge}
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col" style={{ backgroundColor: pack.color }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{pack.icon}</span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: pack.accent + "18", color: pack.accent }}
                    >
                      {pack.duration}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1 text-slate-900">{pack.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{pack.description}</p>
                  <div className="mb-5">
                    <span className="text-3xl font-bold" style={{ color: pack.textColor }}>${pack.price}</span>
                    <span className="text-sm text-slate-400 ml-1">one-time</span>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {pack.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: pack.accent }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-white border-t" style={{ borderColor: pack.border }}>
                  <button
                    onClick={() => setSelectedPlan({ name: pack.name, price: pack.price, id: pack.id })}
                    className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: pack.accent }}
                  >
                    Get {pack.name} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All-Access Annual */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-purple-600 mb-2">For complex, multi-step journeys</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">All-Access Plan</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              When you&apos;re mid-green-card, watching a visa bulletin, monitoring a case, and preparing for an H-1B —
              all at once. One plan covers everything.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-slate-900/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-24 -translate-x-24 pointer-events-none" />

              <div className="relative p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                      <Star className="h-3.5 w-3.5 text-yellow-400" />
                      Best value for active journeys
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">All-Access</h3>
                    <p className="text-slate-400 text-sm">All packs + unlimited AI + every premium tool</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-5xl font-bold text-white">$99</div>
                    <div className="text-slate-400 text-sm mt-1">per year · ~$8/mo</div>
                    <div className="text-xs text-green-400 mt-1 font-medium">Save $100+ vs buying separately</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {allAccessFeatures.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedPlan({ name: "All-Access Plan", price: 99, id: "all-access" })}
                    className="flex-1 text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors"
                  >
                    Get All-Access — $99/year
                  </button>
                  <Link
                    href={dest("/sign-up")}
                    className="flex-1 text-center py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-colors"
                  >
                    {isSignedIn ? "Browse free tools" : "Start free first"}
                  </Link>
                </div>

                <p className="text-center text-xs text-slate-500 mt-4">
                  Cancel anytime · Data stays saved after cancellation
                </p>
              </div>
            </div>

            {/* Value comparison */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "4 Event Packs", value: "$136 value", icon: "🎯" },
                { label: "Unlimited AI", value: "Included", icon: "🤖" },
                { label: "All tools", value: "Included", icon: "⚡" },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-lg mb-1">{item.icon}</p>
                  <p className="text-xs font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decision helper */}
        <div className="mb-20 bg-blue-50 border border-blue-100 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-slate-900 text-center mb-6">Not sure which to pick?</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                who: "I'm exploring options",
                pick: "Free tier",
                href: dest("/sign-up"),
                color: "bg-slate-100 text-slate-700 border-slate-200",
                btn: "bg-slate-800 text-white",
                desc: "Use checklists, guides, and tools — no payment needed.",
              },
              {
                who: "I have a specific event (OPT, H-1B, RFE…)",
                pick: "Event Pack",
                href: "#packs",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                btn: "bg-blue-600 text-white",
                desc: "Buy the pack for that event. One payment, no recurring.",
              },
              {
                who: "I'm mid-journey with multiple active steps",
                pick: "All-Access $99/yr",
                href: dest("/sign-up?plan=all-access"),
                color: "bg-purple-100 text-purple-800 border-purple-200",
                btn: "bg-purple-600 text-white",
                desc: "Everything included. Pay once for the year, cancel anytime.",
              },
            ].map((item) => (
              <div key={item.who} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
                <p className="text-sm text-slate-500 leading-5">"{item.who}"</p>
                <div className={`inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${item.color}`}>
                  <ArrowRight className="h-3 w-3" />
                  {item.pick}
                </div>
                <p className="text-xs text-slate-400 leading-5 flex-1">{item.desc}</p>
                <Link href={item.href} className={`block text-center py-2 rounded-lg text-xs font-bold ${item.btn}`}>
                  {isSignedIn ? "Go to Dashboard" : "Get started"}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Compare table */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Compare Plans</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="p-4 text-left text-sm font-semibold text-slate-500 border-r border-slate-200">Feature</th>
                  <th className="p-4 text-center text-sm font-bold text-slate-800 border-r border-slate-200">Free</th>
                  <th className="p-4 text-center text-sm font-bold text-blue-700 border-r border-slate-200">Event Pack</th>
                  <th className="p-4 text-center text-sm font-bold text-purple-700">All-Access</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Visa checklists & guides", true, true, true],
                  ["OPT tracker & timeline", true, true, true],
                  ["H-1B employer lookup", true, true, true],
                  ["Visa comparison & glossary", true, true, true],
                  ["AI Assistant", "10/mo", "Unlimited (pack duration)", "Unlimited"],
                  ["Checklist for specific event", false, true, true],
                  ["USCIS case monitoring", false, false, true],
                  ["Deadline alerts (SMS + email)", false, false, true],
                  ["RFE analyzer (Claude API)", false, "RFE Pack only", true],
                  ["Document vault (encrypted)", false, false, true],
                  ["Green card stage tracker", false, false, true],
                  ["Priority attorney matching", false, false, true],
                ].map(([feature, free, pack, allAccess], i) => (
                  <tr key={String(feature)} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <td className="p-4 text-sm text-slate-600 border-r border-slate-200">{feature}</td>
                    {[free, pack, allAccess].map((val, j) => (
                      <td key={j} className={`p-4 text-center ${j < 2 ? "border-r border-slate-200" : ""}`}>
                        {val === true
                          ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                          : val === false
                          ? <span className="text-slate-300">—</span>
                          : <span className="text-xs font-medium text-slate-500">{val}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attorney note */}
        <div className="mb-20 p-7 rounded-2xl flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/10">
            <Users className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-white text-lg">Need a real attorney?</p>
            <p className="text-sm mt-1 text-slate-400">
              Book verified immigration attorneys with fixed, transparent fees —
              H-1B filing, NIW petition, RFE response, and more. No hidden charges.
            </p>
          </div>
          <Link href="/lawyers" className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors">
            Browse Attorneys <ArrowRight className="inline ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* FAQ */}
        <div className="mb-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-sm text-slate-800 pr-4">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 bg-slate-50 border-t border-slate-100">
                    <p className="text-sm text-slate-600 leading-7">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: Shield, label: "AES-256 encrypted", sub: "Documents & profile" },
            { icon: Lock, label: "No data selling", sub: "Ever, to anyone" },
            { icon: Bot, label: "Real Claude AI", sub: "Anthropic-powered" },
            { icon: Calendar, label: "Cancel anytime", sub: "No lock-in" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <item.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center py-14 px-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700">
          <h2 className="text-3xl font-bold text-white mb-3">Start free — upgrade when it matters</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            No credit card. No commitment. Upgrade to a pack or All-Access the moment you need it.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href={dest("/sign-up")} className="px-7 py-3 rounded-xl text-sm font-bold bg-white text-blue-700 hover:bg-blue-50 transition-colors">
              {isSignedIn ? "Go to Dashboard" : "Get Started Free"}
            </Link>
            <Link href="/dashboard/tools/checklists" className="px-7 py-3 rounded-xl text-sm font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors">
              Browse Free Checklists
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

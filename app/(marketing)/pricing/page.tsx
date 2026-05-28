"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Zap, Shield, Star, Users,
  Calendar, CreditCard, Building2, HelpCircle, ChevronDown,
} from "lucide-react";

const eventPacks = [
  {
    id: "h1b",
    name: "H-1B Season Pack",
    price: 29,
    icon: "🎯",
    color: "#eff6ff",
    border: "#bfdbfe",
    textColor: "#1d4ed8",
    duration: "Active Mar–Jun",
    description: "Full support during H-1B cap registration season",
    features: [
      "Unlimited AI questions during cap season",
      "H-1B lottery odds calculator",
      "Employer sponsorship lookup",
      "Cap-gap & OPT bridge guide",
      "Step-by-step registration checklist",
      "RFE response templates",
    ],
  },
  {
    id: "opt",
    name: "OPT Extension Pack",
    price: 19,
    icon: "📋",
    color: "#f0fdf4",
    border: "#86efac",
    textColor: "#15803d",
    duration: "Use anytime",
    description: "Everything for OPT & STEM OPT applications",
    features: [
      "I-765 filing checklist & guide",
      "STEM OPT I-983 training plan template",
      "90-day unemployment day tracker",
      "AI assistant for 60 days",
      "Deadline calculator & alerts",
      "DSO communication templates",
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
    duration: "Use anytime",
    description: "EB-2 NIW, EB-1A, or PERM pathway planning",
    features: [
      "Visa bulletin priority date tracker",
      "EB-2 NIW petition builder guide",
      "EB-1A criteria self-assessment",
      "AC21 portability explainer",
      "India/China backlog calculator",
      "Unlimited AI for 90 days",
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
    duration: "Use within 87 days",
    description: "Build a strong RFE response before the deadline",
    features: [
      "RFE type identifier & analyzer",
      "AI-assisted response builder",
      "Evidence checklist by RFE type",
      "Attorney review marketplace",
      "Unlimited AI for 87 days",
      "Response letter templates",
    ],
  },
];

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "For anyone exploring their options",
    color: "#f8fafc",
    border: "#e2e8f0",
    textColor: "#0f172a",
    cta: "Get Started Free",
    ctaHref: "/sign-up",
    highlighted: false,
    features: [
      "Immigration glossary (60+ terms)",
      "Visa comparison tool",
      "H-1B employer lookup",
      "Travel advisory guides",
      "Free webinars & events",
      "10 AI questions/month",
      "USCIS fee calculator",
      "Basic case status check",
    ],
  },
  {
    id: "monitor",
    name: "Monitor",
    price: 7,
    description: "For anyone mid-process with a pending case",
    color: "#eff6ff",
    border: "#2563eb",
    textColor: "#1d4ed8",
    cta: "Start Monitoring",
    ctaHref: "/sign-up?plan=monitor",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "USCIS case auto-monitoring",
      "SMS + email status alerts",
      "Deadline alerts (I-94, EAD, passport)",
      "50 AI questions/month",
      "Immigration profile sync across devices",
      "Processing time tracker",
      "Cancel anytime — $0 when your case is done",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "For complex, multi-step immigration journeys",
    color: "#faf5ff",
    border: "#e2e8f0",
    textColor: "#6d28d9",
    cta: "Start Pro",
    ctaHref: "/sign-up?plan=pro",
    highlighted: false,
    features: [
      "Everything in Monitor",
      "Unlimited AI questions",
      "RFE assistant & response builder",
      "Document vault (encrypted storage)",
      "AI document analyzer",
      "Priority attorney matching",
      "Green card stage tracker",
      "All event packs included free",
    ],
  },
];

const creditPacks = [
  { credits: 10, price: 4, per: "$0.40/credit", popular: false },
  { credits: 50, price: 15, per: "$0.30/credit", popular: true },
  { credits: 150, price: 35, per: "$0.23/credit", popular: false },
];

const faqs = [
  { q: "Why pay for a pack instead of a subscription?", a: "Because immigration is episodic. A STEM OPT student who just got approved doesn't need help for 2 years — they just need the H-1B Season Pack in March. Pay for exactly what you need, when you need it. No wasted months." },
  { q: "Do credits expire?", a: "No. Credits never expire. Buy them when you need to ask a lot of questions, and use them at your own pace." },
  { q: "What happens after my pack duration ends?", a: "Your checklist data and documents are saved. You just lose access to the AI assistant until you buy more credits or another pack. Your profile and deadlines always remain accessible for free." },
  { q: "Can I cancel Monitor subscription anytime?", a: "Yes, cancel anytime with one click. Most people cancel as soon as their case gets approved — that's exactly how it's designed." },
  { q: "Do you take a cut from attorney fees?", a: "Yes — if you hire an attorney through VisaPilot, we take a 12% platform fee. This is already built into the fixed prices attorneys list, so there's no surprise cost to you." },
  { q: "Is my immigration data private?", a: "Yes. Your profile, case numbers, and documents are encrypted. We never share or sell your data. Document vault uses AES-256 encryption." },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

      {/* Hero */}
      <section className="py-16 text-center" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)" }}>
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}>
            <Zap className="h-4 w-4" />
            Pay for what you need — nothing more
          </div>
          <h1 className="text-4xl font-bold mb-4">Pricing that fits your journey</h1>
          <p className="text-lg max-w-2xl mx-auto mb-3" style={{ color: "#64748b" }}>
            Immigration is not a monthly subscription — it's a series of events. Buy a pack for your current situation, monitor your case for $7/month, or go Pro for the full experience.
          </p>
          <p className="text-sm font-medium" style={{ color: "#94a3b8" }}>No credit card required for free tier · Cancel Monitor anytime · Packs never expire</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Event Packs */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Event Packs — Pay Once, Use When Needed</h2>
            <p className="text-sm" style={{ color: "#64748b" }}>Buy the pack for your current immigration event. No subscription, no recurring charges.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {eventPacks.map(pack => (
              <div key={pack.id} className="rounded-2xl border-2 overflow-hidden flex flex-col" style={{ borderColor: pack.border }}>
                <div className="p-5 flex-1" style={{ backgroundColor: pack.color }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{pack.icon}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: pack.textColor + "20", color: pack.textColor }}>{pack.duration}</span>
                  </div>
                  <h3 className="font-bold mb-1" style={{ color: pack.textColor }}>{pack.name}</h3>
                  <p className="text-xs mb-4" style={{ color: "#64748b" }}>{pack.description}</p>
                  <div className="text-3xl font-bold mb-4" style={{ color: pack.textColor }}>
                    ${pack.price}
                    <span className="text-sm font-normal ml-1" style={{ color: "#94a3b8" }}>one-time</span>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {pack.features.map(f => (
                      <li key={f} className="flex items-start gap-1.5 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: pack.textColor }} />
                        <span style={{ color: "#475569" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4" style={{ backgroundColor: "#ffffff" }}>
                  <Link href={`/sign-up?pack=${pack.id}`} className="block text-center py-2 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: pack.textColor }}>
                    Get {pack.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscriptions */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Subscriptions — For Ongoing Journeys</h2>
            <p className="text-sm mb-4" style={{ color: "#64748b" }}>For people actively mid-process. Cancel the moment your case is resolved.</p>
            <div className="inline-flex items-center gap-1 p-1 rounded-full" style={{ backgroundColor: "#f1f5f9" }}>
              {(["monthly", "yearly"] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setBillingCycle(c)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: billingCycle === c ? "#2563eb" : "transparent",
                    color: billingCycle === c ? "#ffffff" : "#64748b",
                  }}
                >
                  {c === "monthly" ? "Monthly" : "Yearly (save 20%)"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map(plan => {
              const price = billingCycle === "yearly" && plan.price > 0
                ? Math.round(plan.price * 0.8)
                : plan.price;
              return (
                <div
                  key={plan.id}
                  className="rounded-2xl border-2 overflow-hidden relative"
                  style={{
                    borderColor: plan.highlighted ? plan.border : "#e2e8f0",
                    transform: plan.highlighted ? "scale(1.03)" : "none",
                    boxShadow: plan.highlighted ? "0 8px 32px rgba(37,99,235,0.12)" : "none",
                  }}
                >
                  {plan.badge && (
                    <div className="text-center py-1.5 text-xs font-bold text-white" style={{ backgroundColor: "#2563eb" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div className="p-6" style={{ backgroundColor: plan.highlighted ? plan.color : "#ffffff" }}>
                    <h3 className="font-bold text-lg mb-1" style={{ color: plan.textColor }}>{plan.name}</h3>
                    <p className="text-xs mb-4" style={{ color: "#64748b" }}>{plan.description}</p>
                    <div className="flex items-end gap-1 mb-6">
                      <span className="text-4xl font-bold" style={{ color: plan.textColor }}>
                        {price === 0 ? "Free" : `$${price}`}
                      </span>
                      {price > 0 && <span className="text-sm mb-1" style={{ color: "#94a3b8" }}>/mo</span>}
                    </div>
                    <Link
                      href={plan.ctaHref}
                      className="block text-center py-2.5 rounded-xl text-sm font-bold transition-all"
                      style={{
                        backgroundColor: plan.highlighted ? "#2563eb" : "#f1f5f9",
                        color: plan.highlighted ? "#ffffff" : "#0f172a",
                      }}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                  <div className="px-6 pb-6" style={{ backgroundColor: plan.highlighted ? plan.color : "#ffffff" }}>
                    <ul className="space-y-2">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: plan.highlighted ? "#2563eb" : "#16a34a" }} />
                          <span style={{ color: "#475569" }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Credits */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">AI Credits — Pay Per Question</h2>
            <p className="text-sm" style={{ color: "#64748b" }}>Buy credits and use them anytime. No expiry. Perfect if you only have a few questions.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {creditPacks.map(cp => (
              <div
                key={cp.credits}
                className="relative p-6 rounded-2xl border-2 text-center min-w-44"
                style={{
                  borderColor: cp.popular ? "#2563eb" : "#e2e8f0",
                  backgroundColor: cp.popular ? "#eff6ff" : "#ffffff",
                }}
              >
                {cp.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#2563eb" }}>
                    Best Value
                  </div>
                )}
                <p className="text-3xl font-bold mb-1" style={{ color: cp.popular ? "#1d4ed8" : "#0f172a" }}>{cp.credits}</p>
                <p className="text-sm font-medium mb-1" style={{ color: "#64748b" }}>AI Credits</p>
                <p className="text-2xl font-bold mb-1" style={{ color: cp.popular ? "#1d4ed8" : "#0f172a" }}>${cp.price}</p>
                <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>{cp.per} · never expires</p>
                <Link
                  href="/sign-up"
                  className="block py-2 rounded-xl text-sm font-bold"
                  style={{
                    backgroundColor: cp.popular ? "#2563eb" : "#f1f5f9",
                    color: cp.popular ? "#ffffff" : "#0f172a",
                  }}
                >
                  Buy Credits
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Attorney note */}
        <div className="mb-16 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" }}>
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <Users className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-white text-lg">Need a real attorney?</p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>Book verified immigration attorneys with fixed, transparent fees — H-1B filing, NIW petition, RFE response, and more. No hidden charges.</p>
          </div>
          <Link href="/lawyers" className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold" style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
            Browse Attorneys <ArrowRight className="inline ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Compare table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Compare All Plans</h2>
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "#e2e8f0" }}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th className="p-4 text-left text-sm font-semibold" style={{ color: "#64748b", borderRight: "1px solid #e2e8f0" }}>Feature</th>
                  {["Free", "Monitor $7/mo", "Pro $19/mo"].map((h, i) => (
                    <th key={h} className="p-4 text-center text-sm font-bold" style={{ color: i === 1 ? "#1d4ed8" : "#0f172a", borderRight: i < 2 ? "1px solid #e2e8f0" : undefined }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Visa guides & glossary", true, true, true],
                  ["AI questions", "10/mo", "50/mo", "Unlimited"],
                  ["Visa comparison tool", true, true, true],
                  ["USCIS case monitoring", false, true, true],
                  ["Deadline alerts (SMS + email)", false, true, true],
                  ["Immigration profile sync", false, true, true],
                  ["Document vault", false, false, true],
                  ["RFE assistant", false, false, true],
                  ["Event packs included", false, false, true],
                  ["Attorney priority matching", false, false, true],
                ].map(([feature, free, monitor, pro], i) => (
                  <tr key={String(feature)} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <td className="p-4 text-sm" style={{ color: "#475569", borderRight: "1px solid #e2e8f0" }}>{feature}</td>
                    {[free, monitor, pro].map((val, j) => (
                      <td key={j} className="p-4 text-center" style={{ borderRight: j < 2 ? "1px solid #e2e8f0" : undefined }}>
                        {val === true
                          ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                          : val === false
                          ? <span style={{ color: "#cbd5e1" }}>—</span>
                          : <span className="text-sm font-medium" style={{ color: "#475569" }}>{val}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform" style={{ transform: openFaq === i ? "rotate(180deg)" : "none", color: "#64748b" }} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-2xl" style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}>
          <h2 className="text-2xl font-bold text-white mb-2">Start free — upgrade when it matters</h2>
          <p className="text-white/80 mb-6">Join thousands of immigrants navigating the US system with VisaPilot.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/sign-up" className="px-6 py-3 rounded-xl text-sm font-bold" style={{ backgroundColor: "#ffffff", color: "#2563eb" }}>
              Get Started Free
            </Link>
            <Link href="/ai-assistant" className="px-6 py-3 rounded-xl text-sm font-bold border-2 border-white/40 text-white hover:bg-white/10">
              Try AI Assistant
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

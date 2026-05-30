"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { visaGuides } from "@/config/navigation";
import {
  Bot,
  Calendar,
  ListChecks,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Shield,
} from "lucide-react";

// --- Typing animation hook ---
const TYPING_WORDS = ["OPT application", "STEM OPT I-983", "H-1B RFE response", "Green Card EB-2", "cap-gap rules"];

function useTypingEffect() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % TYPING_WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  return displayed;
}

// --- Visa stage data ---
type Stage = "f1" | "opt" | "stem" | "h1b" | "gc";

const stages: { id: Stage; label: string; emoji: string }[] = [
  { id: "f1", label: "F-1 Student", emoji: "🎓" },
  { id: "opt", label: "OPT", emoji: "💼" },
  { id: "stem", label: "STEM OPT", emoji: "🔬" },
  { id: "h1b", label: "H-1B", emoji: "🏢" },
  { id: "gc", label: "Green Card", emoji: "🌿" },
];

const stageContent: Record<Stage, {
  headline: string;
  subtext: string;
  urgency: string;
  urgencyColor: string;
  items: string[];
  cta: string;
  href: string;
}> = {
  f1: {
    headline: "Build your paper trail now — before you need it",
    subtext: "USCIS can demand proof of every semester you were enrolled. Most F-1 students don't collect this until they're already in an RFE — and by then it's too late.",
    urgency: "Start collecting documents from Day 1",
    urgencyColor: "text-blue-400",
    items: [
      "Save course syllabi every semester — USCIS demands them all",
      "Report every address change to your DSO within 10 days",
      "Keep every I-20 ever issued to you — never throw them away",
      "Save tuition payment receipts and 6 months of bank statements",
    ],
    cta: "F-1 RFE Prevention Checklist",
    href: "/dashboard/tools/checklists/rfe-f1-maintenance",
  },
  opt: {
    headline: "You have 90 days before graduation to apply",
    subtext: "Miss the 90-day filing window and you lose your OPT eligibility entirely. Once on OPT, you have 90 days max unemployed — the clock starts from your EAD start date, not when you find a job.",
    urgency: "90-day application window closes fast",
    urgencyColor: "text-orange-400",
    items: [
      "Apply 90 days before your graduation date — not after",
      "Report your employer to DSO AND update SEVP Portal within 10 days",
      "Track unemployment days — max 90 days total during OPT",
      "If changing jobs, report the new employer within 10 days",
    ],
    cta: "OPT Application Checklist",
    href: "/dashboard/tools/checklists/opt",
  },
  stem: {
    headline: "Your I-983 must be signed before you start work",
    subtext: "The most common STEM OPT mistake: students start work before their DSO approves the I-983. That's a status violation. You also have just 10 days after your first day to report your employer.",
    urgency: "10-day reporting window after Day 1",
    urgencyColor: "text-red-400",
    items: [
      "I-983 must be completed and DSO-approved before you start",
      "Employer fills Sections 2, 3, 4 — you cannot fill these yourself",
      "Report employer to DSO AND SEVP Portal within 10 days of starting",
      "6-month self-evaluations required throughout your entire STEM OPT",
    ],
    cta: "STEM OPT Reporting Guide",
    href: "/dashboard/tools/checklists/stem-opt-reporting",
  },
  h1b: {
    headline: "Lottery in March. Starts October 1. Prepare now.",
    subtext: "H-1B has a 65,000 cap with millions of applicants. Your employer files the petition — but you need to understand every step, from registration to the cap-gap period if you're on OPT.",
    urgency: "Registration opens March each year",
    urgencyColor: "text-purple-400",
    items: [
      "Employer registers in USCIS online system in March",
      "If selected, petition must be filed by June 30",
      "Cap-gap protects OPT status until Oct 1 if selected",
      "Premium processing gets a decision in 15 business days",
    ],
    cta: "H-1B Checklist",
    href: "/dashboard/tools/checklists/h1b",
  },
  gc: {
    headline: "Green card takes years — start planning early",
    subtext: "Whether it's EB-2 NIW or employer-sponsored EB-2/EB-3, the process involves labor certification, priority dates, and often 5–10 year waits depending on your country of birth.",
    urgency: "Priority dates vary — check the Visa Bulletin",
    urgencyColor: "text-green-400",
    items: [
      "EB-2 NIW: self-petition, no employer needed, prove national interest",
      "EB-2/EB-3: employer files PERM labor certification first",
      "Track your priority date against monthly Visa Bulletin",
      "Concurrent I-485 filing possible if priority date is current",
    ],
    cta: "Green Card Checklist",
    href: "/dashboard/tools/checklists/green-card",
  },
};

// --- Scroll animation wrapper ---
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const tools = [
  {
    icon: ListChecks,
    title: "Visa Checklists",
    description: "12 step-by-step checklists — OPT, STEM OPT, H-1B, Green Card, J-1, O-1, TN, and RFE prevention guides built from real USCIS cases.",
    color: "text-indigo-600 bg-indigo-50",
    href: "/dashboard/tools/checklists",
    highlights: ["12 checklists", "RFE prevention", "Progress tracking"],
  },
  {
    icon: Bot,
    title: "AI Immigration Assistant",
    description: "Ask any immigration question and get instant answers with USCIS citations. Covers OPT deadlines, cap-gap, travel rules, employer changes, and more.",
    color: "text-blue-600 bg-blue-50",
    href: "/ai-assistant",
    highlights: ["USCIS citations", "Available 24/7", "Free to try"],
  },
  {
    icon: Calendar,
    title: "Deadline Tracker",
    description: "Track the 90-day OPT window, 10-day reporting rule, 6-month STEM OPT evaluations, and your I-94 expiry — all in one place.",
    color: "text-purple-600 bg-purple-50",
    href: "/dashboard",
    highlights: ["Auto reminders", "All visa types", "OPT day counter"],
  },
];

export function LandingPage() {
  const typedText = useTypingEffect();
  const [activeStage, setActiveStage] = useState<Stage>("opt");
  const content = stageContent[activeStage];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-32">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(ellipse at 20% 60%, #3b82f6 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, #8b5cf6 0%, transparent 55%)" }}
        />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-6 text-sm px-4 py-1.5 bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              One missed deadline can cost you your F-1 status
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Confused about your{" "}
            <span className="text-blue-400 inline-block min-w-[14ch] text-left">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-xl text-slate-300 leading-8"
          >
            Step-by-step checklists, AI guidance, and deadline tracking —
            built specifically for international students in the US.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="xl" asChild className="bg-blue-500 hover:bg-blue-600 text-white border-0">
              <Link href="/dashboard/tools/checklists">
                Browse Checklists Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild className="border-slate-500 text-white hover:bg-slate-700 bg-transparent">
              <Link href="/ai-assistant">Try AI Assistant</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-slate-400"
          >
            Free to use · No sign-up needed to view checklists
          </motion.p>
        </div>
      </section>

      {/* Interactive Stage Selector */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Where are you right now?</h2>
              <p className="mt-3 text-muted-foreground">Pick your current visa stage — we'll show you exactly what to do next.</p>
            </div>
          </FadeUp>

          {/* Stage pills */}
          <FadeUp delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all border-2 ${
                    activeStage === stage.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-105"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:scale-102"
                  }`}
                >
                  <span className="mr-1.5">{stage.emoji}</span>
                  {stage.label}
                  {activeStage === stage.id && (
                    <motion.div
                      layoutId="stage-pill"
                      className="absolute inset-0 rounded-full bg-slate-900 -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </FadeUp>

          {/* Stage content panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <div className="rounded-2xl border-2 border-slate-100 bg-slate-50 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                      {content.headline}
                    </h3>
                    <p className="text-sm text-slate-600 leading-6 mb-4">
                      {content.subtext}
                    </p>
                    <div className={`flex items-center gap-2 text-sm font-semibold ${content.urgencyColor} mb-6`}>
                      <Clock className="h-4 w-4" />
                      {content.urgency}
                    </div>
                    <Button asChild>
                      <Link href={content.href}>
                        {content.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {content.items.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.3 }}
                        className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3">The tools</Badge>
              <h2 className="text-3xl font-bold tracking-tight">Built for every stage of your journey</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                From your first OPT application to your green card — everything you need is here.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <FadeUp key={tool.title} delay={i * 0.1}>
                  <Link href={tool.href} className="block h-full">
                    <Card className="h-full group hover:shadow-lg transition-all border-2 hover:border-primary/30 cursor-pointer">
                      <CardContent className="p-6">
                        <div className={`inline-flex rounded-xl p-3 ${tool.color} mb-4`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-6 mb-4">
                          {tool.description}
                        </p>
                        <ul className="space-y-1.5">
                          {tool.highlights.map((h) => (
                            <li key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-5 flex items-center text-sm text-primary font-medium">
                          Open <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Chat Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center max-w-5xl mx-auto">
            <FadeUp>
              <div>
                <Badge variant="info" className="mb-4">AI Assistant</Badge>
                <h2 className="text-3xl font-bold tracking-tight">
                  Ask anything about your visa
                </h2>
                <p className="mt-4 text-muted-foreground leading-7">
                  Our AI is trained on USCIS regulations, policy memos, and real
                  immigration cases. Get instant answers with citations — and know when
                  you need a real attorney.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "What are my OPT unemployment day limits?",
                    "Can I travel during H-1B transfer?",
                    "What documents do I need for STEM OPT?",
                    "How does cap-gap work?",
                  ].map((q) => (
                    <li key={q} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">&ldquo;{q}&rdquo;</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8" size="lg" asChild>
                  <Link href="/ai-assistant">Try AI Assistant Free</Link>
                </Button>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="relative rounded-2xl border bg-slate-50 p-4 shadow-xl">
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-300 shrink-0" />
                    <div className="rounded-2xl rounded-tl-none bg-white border p-3 text-sm max-w-xs">
                      Can I change employers on STEM OPT without losing my status?
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tr-none bg-primary/10 p-3 text-sm max-w-sm">
                      <strong>Yes, you can change employers on STEM OPT</strong>, but there
                      are strict steps to follow:
                      <br /><br />
                      1. New employer must be <strong>E-Verify enrolled</strong><br />
                      2. File updated <strong>I-983 Training Plan</strong> with DSO<br />
                      3. Report the change within <strong>10 days</strong><br />
                      <br />
                      ⚠️ Must not exceed <strong>150 total unemployment days</strong>.
                      <div className="mt-2 text-xs text-muted-foreground">Source: USCIS STEM OPT Guidelines</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Visa Guides */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3">Free guides</Badge>
              <h2 className="text-3xl font-bold tracking-tight">Understand every visa type</h2>
              <p className="mt-3 text-muted-foreground">Detailed, jargon-free guides for every major US visa category</p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {visaGuides.map((guide, i) => (
              <FadeUp key={guide.slug} delay={i * 0.08}>
                <Link href={`/guides/${guide.slug}`} className="block h-full">
                  <Card className="h-full transition-all hover:shadow-md cursor-pointer group">
                    <CardContent className="p-6">
                      <div className={`inline-flex rounded-lg p-3 text-2xl mb-4 ${guide.color}`}>
                        {guide.icon}
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{guide.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{guide.subtitle}</p>
                      <div className="mt-4 flex items-center text-sm text-primary font-medium">
                        Read guide <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* RFE Prevention callout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="max-w-5xl mx-auto rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">RFE Prevention Guides</h3>
                  <Badge variant="destructive" className="text-xs">Real USCIS RFE Patterns</Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-6">
                  Built from actual USCIS Requests for Evidence — know exactly which documents to collect from Day 1 of
                  your F-1 enrollment so you&apos;re never caught off guard by an audit.
                </p>
              </div>
              <Button variant="outline" className="shrink-0 border-red-200 text-red-700 hover:bg-red-50" asChild>
                <Link href="/dashboard/tools/checklists">
                  View RFE Guides <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <FadeUp>
            <div className="flex justify-center mb-6 gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <ListChecks className="h-5 w-5 text-blue-400" />
              </div>
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-purple-400" />
              </div>
              <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Your status is too important to guess
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Free checklists, AI guidance, and deadline tracking. No sign-up needed to browse the checklists.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" asChild className="bg-blue-500 hover:bg-blue-600 text-white border-0">
                <Link href="/dashboard/tools/checklists">
                  Browse Checklists Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="border-slate-600 text-white hover:bg-slate-800 bg-transparent">
                <Link href="/sign-up">Create Free Account</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}

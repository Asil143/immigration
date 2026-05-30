"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { visaGuides } from "@/config/navigation";
import {
  Bot, Calendar, ListChecks, ArrowRight, CheckCircle2,
  AlertTriangle, Clock, Shield, Zap, FileText, TrendingUp,
} from "lucide-react";

// ─── Typing hook ────────────────────────────────────────────────────────────
const WORDS = ["OPT application", "STEM OPT I-983", "H-1B RFE response", "cap-gap rules", "Green Card EB-2 NIW"];

function useTyping() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = WORDS[idx];
    let t: ReturnType<typeof setTimeout>;
    if (!del && text.length < word.length) t = setTimeout(() => setText(word.slice(0, text.length + 1)), 55);
    else if (!del && text.length === word.length) t = setTimeout(() => setDel(true), 1800);
    else if (del && text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), 30);
    else { setDel(false); setIdx((i) => (i + 1) % WORDS.length); }
    return () => clearTimeout(t);
  }, [text, del, idx]);
  return text;
}

// ─── 3D tilt card ────────────────────────────────────────────────────────────
const CHECKLISTS = [
  {
    title: "OPT Checklist",
    subtitle: "F-1 Optional Practical Training",
    phase: "Phase 2 of 7 — File I-765",
    color: "#f97316",
    badge: "12 months",
    items: [
      "Apply 90 days before graduation date",
      "Receive EAD card before start date",
      "Report employer to DSO within 10 days",
      "Update SEVP Portal with employer info",
      "Track unemployment — max 90 days",
    ],
  },
  {
    title: "STEM OPT Guide",
    subtitle: "I-983 Reporting — Step by Step",
    phase: "Phase 4 of 9 — Submit to DSO",
    color: "#60a5fa",
    badge: "24 months",
    items: [
      "Download Form I-983 from ICE.gov",
      "Employer completes Sections 2, 3 & 4",
      "Submit signed I-983 to DSO",
      "Report employer within 10 days",
      "Schedule first 6-month evaluation",
    ],
  },
  {
    title: "H-1B Checklist",
    subtitle: "Specialty Occupation Work Visa",
    phase: "Phase 3 of 8 — Petition Filed",
    color: "#34d399",
    badge: "3–6 years",
    items: [
      "Employer files LCA with DOL",
      "Submit H-1B petition to USCIS",
      "Receive I-797 approval notice",
      "Cap-gap bridges OPT to Oct 1",
      "Update I-9 with new status",
    ],
  },
  {
    title: "Green Card Checklist",
    subtitle: "EB-2 / EB-3 Employer Sponsored",
    phase: "Phase 2 of 6 — PERM Filed",
    color: "#fbbf24",
    badge: "EB-2/EB-3",
    items: [
      "Employer files PERM labor cert",
      "File I-140 immigrant petition",
      "Check Visa Bulletin monthly",
      "File I-485 when priority date current",
      "Attend biometrics appointment",
    ],
  },
];

function TiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });
  const glare = useSpring(useTransform(x, [-0.5, 0.5], [0, 1]), { stiffness: 200, damping: 20 });

  function onMouse(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() { x.set(0); y.set(0); }

  const [listIdx, setListIdx] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);
  const current = CHECKLISTS[listIdx];

  useEffect(() => {
    setChecked([]);
  }, [listIdx]);

  useEffect(() => {
    if (checked.length >= current.items.length) {
      // All checked — pause then move to next checklist
      const t = setTimeout(() => {
        setListIdx((i) => (i + 1) % CHECKLISTS.length);
      }, 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setChecked((p) => [...p, p.length]), 850);
    return () => clearTimeout(t);
  }, [checked, current.items.length]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouse}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="relative w-full max-w-sm mx-auto select-none"
    >
      {/* Glare overlay */}
      <motion.div
        style={{ opacity: glare, background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
        className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
      />

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl overflow-hidden">
        {/* Card header — animates on list change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={listIdx + "-header"}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between mb-5"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: current.color + "33" }}>
                <Bot className="h-4 w-4" style={{ color: current.color }} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{current.title}</p>
                <p className="text-slate-400 text-xs">{current.subtitle}</p>
              </div>
            </div>
            <Badge className="text-[10px]" style={{ backgroundColor: current.color + "22", color: current.color, borderColor: current.color + "44" }}>
              {current.badge}
            </Badge>
          </motion.div>
        </AnimatePresence>

        {/* Phase indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={listIdx + "-phase"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-white/5"
          >
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: current.color }} />
            <p className="text-xs text-slate-300 font-medium">{current.phase}</p>
          </motion.div>
        </AnimatePresence>

        {/* Checklist items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={listIdx + "-items"}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-2.5 mb-5"
          >
            {current.items.map((item, i) => (
              <motion.div
                key={item}
                className="flex items-start gap-2.5"
                animate={{ opacity: i <= checked.length ? 1 : 0.35 }}
              >
                <motion.div
                  animate={checked.includes(i) ? { scale: [1, 1.3, 1], backgroundColor: "#22c55e" } : {}}
                  transition={{ duration: 0.3 }}
                  className="mt-0.5 h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: checked.includes(i) ? "#22c55e" : "transparent" }}
                >
                  <AnimatePresence>
                    {checked.includes(i) && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span className={`text-xs leading-4 transition-colors ${checked.includes(i) ? "text-slate-400 line-through" : "text-slate-300"}`}>
                  {item}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
            <span>Progress</span>
            <span>{Math.round((checked.length / current.items.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: current.color }}
              animate={{ width: `${(checked.length / current.items.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Bento cells ─────────────────────────────────────────────────────────────

function BentoAI() {
  const [step, setStep] = useState(0);
  const messages = [
    { role: "user", text: "What happens if I exceed 150 unemployment days on STEM OPT?" },
    { role: "ai", text: "Exceeding 150 total days (OPT + STEM OPT combined) means your F-1 status is violated. USCIS can terminate your SEVIS record. You should consult an attorney immediately if you're approaching this limit." },
  ];
  useEffect(() => {
    if (step === 0) {
      const t = setTimeout(() => setStep(1), 1000);
      return () => clearTimeout(t);
    }
    if (step === 1) {
      const t = setTimeout(() => setStep(2), 2200);
      return () => clearTimeout(t);
    }
    if (step === 2) {
      const t = setTimeout(() => setStep(0), 5000);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="h-full flex flex-col p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-blue-400" />
        </div>
        <p className="font-semibold text-sm text-white">AI Assistant</p>
        <div className="ml-auto flex gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-slate-400">Live</span>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden">
        <AnimatePresence>
          {step >= 1 && (
            <motion.div key="q" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
              <div className="h-5 w-5 rounded-full bg-slate-600 shrink-0 mt-0.5" />
              <div className="rounded-xl rounded-tl-none bg-slate-700 px-3 py-2 text-[11px] text-slate-200 max-w-[85%]">
                {messages[0].text}
              </div>
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div key="a" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-row-reverse">
              <div className="h-5 w-5 rounded-full bg-blue-500 shrink-0 mt-0.5 flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <div className="rounded-xl rounded-tr-none bg-blue-500/20 border border-blue-500/20 px-3 py-2 text-[11px] text-slate-200 max-w-[85%]">
                {messages[1].text}
                <p className="mt-1 text-[9px] text-slate-400">Source: USCIS STEM OPT</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BentoDeadlines() {
  const deadlines = [
    { label: "OPT Application Window", days: 45, total: 90, color: "from-orange-500 to-red-500", urgent: true },
    { label: "STEM OPT 6-mo Evaluation", days: 23, total: 180, color: "from-blue-500 to-indigo-500", urgent: false },
    { label: "H-1B Registration Opens", days: 67, total: 365, color: "from-purple-500 to-pink-500", urgent: false },
  ];
  return (
    <div className="h-full flex flex-col p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Calendar className="h-4 w-4 text-orange-400" />
        </div>
        <p className="font-semibold text-sm text-white">Upcoming Deadlines</p>
      </div>
      <div className="space-y-3 flex-1">
        {deadlines.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-slate-300">{d.label}</span>
              <span className={d.urgent ? "text-red-400 font-semibold" : "text-slate-400"}>{d.days}d left</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${d.color}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${100 - (d.days / d.total) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BentoOPT() {
  const [days, setDays] = useState(0);
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      n += 3;
      setDays(n);
      if (n >= 67) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, []);
  const pct = (days / 90) * 100;
  return (
    <div className="h-full flex flex-col p-5 items-center justify-center text-center">
      <div className="h-7 w-7 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
        <TrendingUp className="h-4 w-4 text-green-400" />
      </div>
      <p className="text-[11px] text-slate-400 mb-1">OPT Unemployment Days Used</p>
      <motion.p
        className={`text-4xl font-black mb-1 ${days > 70 ? "text-red-400" : days > 50 ? "text-orange-400" : "text-green-400"}`}
      >
        {days}
      </motion.p>
      <p className="text-[10px] text-slate-500 mb-3">of 90 days max</p>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-green-500 to-orange-400"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
      <p className="mt-2 text-[10px] text-slate-500">{90 - days} days remaining</p>
    </div>
  );
}

function BentoStats() {
  const stats = [
    { icon: ListChecks, value: "12", label: "Visa Checklists", color: "text-indigo-400" },
    { icon: Shield, value: "2", label: "RFE Prevention Guides", color: "text-red-400" },
    { icon: FileText, value: "9", label: "STEM OPT Phases Covered", color: "text-blue-400" },
    { icon: Zap, value: "100%", label: "Free to browse", color: "text-yellow-400" },
  ];
  return (
    <div className="h-full grid grid-cols-2 gap-3 p-5">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col items-center justify-center bg-white/5 rounded-xl p-3 text-center"
          >
            <Icon className={`h-4 w-4 mb-1.5 ${s.color}`} />
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-slate-400 leading-tight">{s.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Stage selector ──────────────────────────────────────────────────────────
type Stage = "f1" | "opt" | "stem" | "h1b" | "gc";
const stages: { id: Stage; label: string; emoji: string }[] = [
  { id: "f1", label: "F-1 Student", emoji: "🎓" },
  { id: "opt", label: "OPT", emoji: "💼" },
  { id: "stem", label: "STEM OPT", emoji: "🔬" },
  { id: "h1b", label: "H-1B", emoji: "🏢" },
  { id: "gc", label: "Green Card", emoji: "🌿" },
];
const stageContent: Record<Stage, { headline: string; subtext: string; urgency: string; urgencyColor: string; items: string[]; cta: string; href: string }> = {
  f1: {
    headline: "Build your paper trail now — before you need it",
    subtext: "USCIS can demand proof of every semester you were enrolled. Most F-1 students don't collect this until they're in an RFE — by then it's too late.",
    urgency: "Start collecting documents from Day 1",
    urgencyColor: "text-blue-400",
    items: ["Save course syllabi every semester — USCIS demands them all", "Report every address change within 10 days", "Keep every I-20 ever issued — never throw them away", "Save tuition receipts and 6 months of bank statements"],
    cta: "F-1 RFE Prevention Checklist",
    href: "/dashboard/tools/checklists/rfe-f1-maintenance",
  },
  opt: {
    headline: "You have 90 days before graduation to apply",
    subtext: "Miss the 90-day filing window and you lose OPT eligibility entirely. Once on OPT, 90 days max unemployed — clock starts from EAD start date, not when you find a job.",
    urgency: "90-day application window — don't miss it",
    urgencyColor: "text-orange-400",
    items: ["Apply 90 days before graduation — not after", "Report your employer to DSO AND SEVP Portal within 10 days", "Track unemployment — max 90 days during OPT", "New job? Report the employer within 10 days"],
    cta: "OPT Application Checklist",
    href: "/dashboard/tools/checklists/opt",
  },
  stem: {
    headline: "Your I-983 must be signed before you start work",
    subtext: "Most common STEM OPT mistake: students start work before DSO approves the I-983. That's a status violation. You have 10 days after Day 1 to report your employer.",
    urgency: "10-day reporting window starts from Day 1",
    urgencyColor: "text-red-400",
    items: ["I-983 must be DSO-approved before you start", "Employer fills Sections 2, 3, 4 — you cannot do this yourself", "Report employer to DSO AND SEVP Portal within 10 days", "6-month self-evaluations required throughout STEM OPT"],
    cta: "STEM OPT Step-by-Step Guide",
    href: "/dashboard/tools/checklists/stem-opt-reporting",
  },
  h1b: {
    headline: "Lottery in March. Cap-gap protects you until Oct 1.",
    subtext: "H-1B has a 65,000 cap. Your employer files the petition — but you need to understand every step, especially cap-gap if you're currently on OPT or STEM OPT.",
    urgency: "Registration opens March each year",
    urgencyColor: "text-purple-400",
    items: ["Employer registers in USCIS system each March", "If selected, petition filed by June 30", "Cap-gap bridges OPT → H-1B from April 1 to Oct 1", "Premium processing: 15 business day decision"],
    cta: "H-1B Checklist",
    href: "/dashboard/tools/checklists/h1b",
  },
  gc: {
    headline: "Green card takes years — start planning early",
    subtext: "EB-2 NIW or employer-sponsored EB-2/EB-3 — both involve priority dates, labor certification, and often 5–10 year waits depending on your country of birth.",
    urgency: "Priority dates — check the Visa Bulletin monthly",
    urgencyColor: "text-green-400",
    items: ["EB-2 NIW: self-petition, prove national interest", "EB-2/EB-3: employer files PERM labor certification first", "Track your priority date against monthly Visa Bulletin", "Concurrent I-485 possible when priority date is current"],
    cta: "Green Card Checklist",
    href: "/dashboard/tools/checklists/green-card",
  },
};

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function LandingPage() {
  const typedText = useTyping();
  const [activeStage, setActiveStage] = useState<Stage>("stem");
  const content = stageContent[activeStage];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-16">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left: text */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Badge className="mb-6 text-sm px-4 py-1.5 bg-red-500/15 text-red-300 border border-red-500/25">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                  One missed deadline can cost you your F-1 status
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6"
              >
                Confused about{" "}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  {typedText || " "}
                  <span className="animate-pulse text-blue-400">|</span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg"
              >
                Step-by-step checklists, AI guidance, and deadline tracking for
                international students navigating the US immigration system.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                <Button size="xl" asChild className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg shadow-blue-500/25">
                  <Link href="/dashboard/tools/checklists">
                    Browse Checklists Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
                  <Link href="/ai-assistant">Try AI Assistant</Link>
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-slate-500"
              >
                Free to use · No sign-up needed to view checklists
              </motion.p>
            </div>

            {/* Right: 3D tilt card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <TiltCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Bento grid ───────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-slate-800 text-slate-300 border-slate-700">Live preview</Badge>
              <h2 className="text-3xl font-bold text-white tracking-tight">Everything in one dashboard</h2>
              <p className="mt-3 text-slate-400 max-w-xl mx-auto">Your AI assistant, checklists, deadlines, and OPT tracker — all working together.</p>
            </div>
          </FadeUp>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {/* AI chat — tall */}
            <FadeUp delay={0.05}>
              <div className="md:row-span-2 rounded-2xl border border-slate-800 bg-slate-900 min-h-[280px] flex flex-col overflow-hidden group hover:border-slate-700 transition-colors">
                <BentoAI />
                <div className="p-5 pt-0 mt-auto">
                  <Link href="/ai-assistant" className="text-xs text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">
                    Try AI Assistant <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </FadeUp>

            {/* Deadlines */}
            <FadeUp delay={0.1}>
              <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 min-h-[160px] group hover:border-slate-700 transition-colors">
                <BentoDeadlines />
              </div>
            </FadeUp>

            {/* Stats */}
            <FadeUp delay={0.15}>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 min-h-[160px] group hover:border-slate-700 transition-colors">
                <BentoStats />
              </div>
            </FadeUp>

            {/* OPT counter */}
            <FadeUp delay={0.2}>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 min-h-[160px] group hover:border-slate-700 transition-colors">
                <BentoOPT />
              </div>
            </FadeUp>

            {/* Checklists CTA */}
            <FadeUp delay={0.25}>
              <Link href="/dashboard/tools/checklists" className="block">
                <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 min-h-[160px] p-5 flex flex-col justify-between group hover:border-indigo-500/50 transition-colors cursor-pointer">
                  <div>
                    <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
                      <ListChecks className="h-4 w-4 text-indigo-400" />
                    </div>
                    <p className="font-bold text-white text-sm">12 Visa Checklists</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-4">OPT, STEM OPT, H-1B, Green Card, RFE prevention & more</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-indigo-400 mt-3 group-hover:gap-2 transition-all">
                    Browse all <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Stage selector ───────────────────────────────── */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white tracking-tight">Where are you right now?</h2>
              <p className="mt-3 text-slate-400">Pick your current visa stage — we'll show you exactly what to do next.</p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all border-2 ${
                    activeStage === stage.id
                      ? "bg-white text-slate-900 border-white shadow-lg shadow-white/10"
                      : "bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200"
                  }`}
                >
                  <span className="mr-1.5">{stage.emoji}</span>
                  {stage.label}
                </button>
              ))}
            </div>
          </FadeUp>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 leading-snug">{content.headline}</h3>
                    <p className="text-sm text-slate-400 leading-6 mb-4">{content.subtext}</p>
                    <div className={`flex items-center gap-2 text-sm font-semibold ${content.urgencyColor} mb-6`}>
                      <Clock className="h-4 w-4" />
                      {content.urgency}
                    </div>
                    <Button asChild className="bg-white text-slate-900 hover:bg-slate-100">
                      <Link href={content.href}>
                        {content.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-2.5">
                    {content.items.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-3 bg-slate-800/50 rounded-xl p-3.5 border border-slate-700/50"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Visa Guides ──────────────────────────────────── */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-slate-800 text-slate-300 border-slate-700">Free guides</Badge>
              <h2 className="text-3xl font-bold text-white tracking-tight">Understand every visa type</h2>
              <p className="mt-3 text-slate-400">Detailed, jargon-free guides for every major US visa category</p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {visaGuides.map((guide, i) => (
              <FadeUp key={guide.slug} delay={i * 0.08}>
                <Link href={`/guides/${guide.slug}`} className="block h-full">
                  <div className="h-full rounded-2xl border border-slate-800 bg-slate-900 p-6 group hover:border-slate-600 transition-all cursor-pointer">
                    <div className={`inline-flex rounded-xl p-3 text-2xl mb-4 ${guide.color}`}>
                      {guide.icon}
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{guide.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{guide.subtitle}</p>
                    <div className="mt-4 flex items-center text-sm text-blue-400 font-medium">
                      Read guide <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── RFE callout ──────────────────────────────────── */}
      <section className="py-12 bg-slate-950">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="max-w-5xl mx-auto rounded-2xl bg-gradient-to-r from-red-950/60 to-orange-950/60 border border-red-800/40 p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                <Shield className="h-7 w-7 text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-white">RFE Prevention Guides</h3>
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">Real USCIS RFE Patterns</Badge>
                </div>
                <p className="text-sm text-slate-400 leading-6">
                  Built from actual USCIS Requests for Evidence — know which documents to collect from Day 1 of F-1 enrollment so you&apos;re never caught off guard.
                </p>
              </div>
              <Button variant="outline" className="shrink-0 border-red-700 text-red-300 hover:bg-red-950 bg-transparent" asChild>
                <Link href="/dashboard/tools/checklists">
                  View RFE Guides <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <FadeUp>
            <div className="flex justify-center mb-6 gap-3">
              {[ListChecks, Bot, FileText].map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                  className="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center"
                >
                  <Icon className="h-5 w-5 text-slate-300" />
                </motion.div>
              ))}
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              Your status is too important to guess
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              Free checklists, AI guidance, and deadline tracking. No sign-up needed to browse the checklists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" asChild className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg shadow-blue-500/25">
                <Link href="/dashboard/tools/checklists">
                  Browse Checklists Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
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

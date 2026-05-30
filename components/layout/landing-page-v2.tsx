"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  motion, AnimatePresence, useMotionValue, useTransform,
  useSpring, animate,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { visaGuides } from "@/config/navigation";
import {
  Bot, Calendar, ListChecks, ArrowRight, CheckCircle2, AlertTriangle,
  Clock, Shield, FileText, TrendingUp, Zap, Bell,
} from "lucide-react";

// ─── Cursor glow ─────────────────────────────────────────────────────────────
function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  const bg = useTransform(
    [springX, springY],
    ([cx, cy]: number[]) =>
      `radial-gradient(520px circle at ${cx}px ${cy}px, rgba(59,130,246,0.10), transparent 65%)`
  );

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-10"
      style={{ background: bg }}
    />
  );
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return controls.stop;
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Journey map ─────────────────────────────────────────────────────────────
const journeyNodes = [
  {
    id: "f1", label: "F-1 Student", emoji: "🎓", color: "#60a5fa",
    tag: "2-4 years",
    headline: "Build your paper trail from Day 1",
    items: ["Save every semester's syllabi", "Report address changes in 10 days", "Never discard any I-20"],
    href: "/dashboard/tools/checklists/rfe-f1-maintenance",
    cta: "F-1 RFE Prevention Guide",
  },
  {
    id: "opt", label: "OPT", emoji: "💼", color: "#f97316",
    tag: "12 months",
    headline: "Apply 90 days before graduation",
    items: ["90-day filing window — don't miss it", "10-day employer reporting rule", "Max 90 days unemployed"],
    href: "/dashboard/tools/checklists/opt",
    cta: "OPT Checklist",
  },
  {
    id: "stem", label: "STEM OPT", emoji: "🔬", color: "#a78bfa",
    tag: "24 months",
    headline: "I-983 must be signed before Day 1",
    items: ["DSO-approved before you start work", "Report employer within 10 days", "6-month evaluations required"],
    href: "/dashboard/tools/checklists/stem-opt-reporting",
    cta: "STEM OPT Guide",
  },
  {
    id: "h1b", label: "H-1B", emoji: "🏢", color: "#34d399",
    tag: "3–6 years",
    headline: "Lottery in March. Starts October 1.",
    items: ["Employer registers in March", "Cap-gap bridges OPT → H-1B", "Premium processing: 15 days"],
    href: "/dashboard/tools/checklists/h1b",
    cta: "H-1B Checklist",
  },
  {
    id: "gc", label: "Green Card", emoji: "🌿", color: "#fbbf24",
    tag: "5–10+ years",
    headline: "Priority dates and patience",
    items: ["EB-2 NIW: self-petition", "PERM labor cert for employer-sponsored", "Check Visa Bulletin monthly"],
    href: "/dashboard/tools/checklists/green-card",
    cta: "Green Card Checklist",
  },
];

function JourneyMap() {
  const [active, setActive] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 400);
    return () => clearTimeout(t);
  }, []);

  const W = 800; const H = 180;
  const nodeX = [80, 220, 400, 580, 720];
  const nodeY = 90;
  const pathD = `M ${nodeX[0]},${nodeY} L ${nodeX[4]},${nodeY}`;

  return (
    <div className="relative w-full overflow-visible">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ overflow: "visible", maxHeight: 180 }}
      >
        {/* Track */}
        <path d={pathD} stroke="#1e293b" strokeWidth="2" fill="none" />

        {/* Animated fill */}
        <motion.path
          d={pathD}
          stroke="url(#journeyGrad)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
        />

        <defs>
          <linearGradient id="journeyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* Nodes */}
        {journeyNodes.map((node, i) => (
          <g
            key={node.id}
            onClick={() => setActive(active === i ? null : i)}
            className="cursor-pointer"
          >
            {/* Outer pulse ring */}
            <motion.circle
              cx={nodeX[i]} cy={nodeY} r={28}
              fill="none"
              stroke={node.color}
              strokeWidth="1"
              strokeOpacity="0.3"
              animate={{ r: [24, 32, 24], strokeOpacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Node circle */}
            <motion.circle
              cx={nodeX[i]} cy={nodeY} r={22}
              fill={active === i ? node.color : "#0f172a"}
              stroke={node.color}
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: drawn ? 1 : 0 }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 260, damping: 20 }}
            />

            {/* Emoji */}
            <motion.text
              x={nodeX[i]} y={nodeY + 6}
              textAnchor="middle"
              fontSize="16"
              initial={{ opacity: 0 }}
              animate={{ opacity: drawn ? 1 : 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              {node.emoji}
            </motion.text>

            {/* Label */}
            <motion.text
              x={nodeX[i]} y={nodeY + 46}
              textAnchor="middle"
              fontSize="11"
              fill={active === i ? node.color : "#94a3b8"}
              fontWeight={active === i ? "700" : "400"}
              initial={{ opacity: 0, y: nodeY + 52 }}
              animate={{ opacity: drawn ? 1 : 0, y: nodeY + 46 }}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              {node.label}
            </motion.text>

            {/* Tag pill */}
            <motion.text
              x={nodeX[i]} y={nodeY - 36}
              textAnchor="middle"
              fontSize="9"
              fill={node.color}
              fontWeight="600"
              initial={{ opacity: 0 }}
              animate={{ opacity: drawn ? 0.8 : 0 }}
              transition={{ delay: 0.7 + i * 0.15 }}
            >
              {node.tag}
            </motion.text>
          </g>
        ))}
      </svg>

      {/* Tooltip panel */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="mt-6 rounded-2xl border p-6"
            style={{
              borderColor: journeyNodes[active].color + "40",
              background: `linear-gradient(135deg, ${journeyNodes[active].color}08, transparent)`,
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{journeyNodes[active].emoji}</span>
                  <h3 className="font-bold text-white">{journeyNodes[active].headline}</h3>
                </div>
                <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
                  {journeyNodes[active].items.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-sm text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: journeyNodes[active].color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                size="sm"
                className="shrink-0 text-slate-900 font-semibold"
                style={{ backgroundColor: journeyNodes[active].color }}
                asChild
              >
                <Link href={journeyNodes[active].href}>
                  {journeyNodes[active].cta}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!drawn && null}
      {drawn && active === null && (
        <p className="text-center text-xs text-slate-600 mt-4">
          Click any stage to see what you need to do
        </p>
      )}
    </div>
  );
}

// ─── Floating notification cards ─────────────────────────────────────────────
const floatingCards = [
  { icon: Bell, text: "H-1B registration opens in 67 days", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", delay: 0 },
  { icon: CheckCircle2, text: "STEM OPT I-983 approved by DSO", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", delay: 0.4 },
  { icon: AlertTriangle, text: "6-month evaluation due in 23 days", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", delay: 0.8 },
];

function FloatingCards() {
  return (
    <div className="hidden lg:flex flex-col gap-3 absolute right-0 top-8 w-64">
      {floatingCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.text}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + card.delay, duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              className={`rounded-xl border ${card.bg} backdrop-blur-sm px-4 py-3 flex items-center gap-3`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${card.color}`} />
              <p className="text-xs text-slate-300 leading-4">{card.text}</p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Bento cells ─────────────────────────────────────────────────────────────
function BentoAI() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const delays = [1000, 2200, 5000];
    const t = setTimeout(() => setStep((s) => (s + 1) % 3 === 0 ? 0 : s + 1), delays[step] ?? 1000);
    return () => clearTimeout(t);
  }, [step]);
  return (
    <div className="h-full flex flex-col p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-blue-400" />
        </div>
        <p className="font-semibold text-sm text-white">AI Assistant</p>
        <div className="ml-auto flex items-center gap-1">
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
                What happens if I exceed 150 unemployment days on STEM OPT?
              </div>
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div key="a" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-row-reverse">
              <div className="h-5 w-5 rounded-full bg-blue-500 shrink-0 mt-0.5 flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <div className="rounded-xl rounded-tr-none bg-blue-500/20 border border-blue-500/20 px-3 py-2 text-[11px] text-slate-200 max-w-[85%]">
                Your F-1 status is violated and USCIS may terminate your SEVIS record. Consult an attorney immediately if approaching this limit.
                <p className="mt-1 text-[9px] text-slate-400">Source: USCIS STEM OPT Policy</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Link href="/ai-assistant" className="mt-3 text-xs text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">
        Try AI Assistant <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function BentoDeadlines() {
  const items = [
    { label: "OPT Application Window", days: 45, max: 90, color: "#f97316" },
    { label: "STEM OPT 6-mo Eval", days: 23, max: 180, color: "#60a5fa" },
    { label: "H-1B Registration", days: 67, max: 365, color: "#a78bfa" },
  ];
  return (
    <div className="h-full p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Calendar className="h-4 w-4 text-orange-400" />
        </div>
        <p className="font-semibold text-sm text-white">Deadlines</p>
      </div>
      <div className="space-y-3.5">
        {items.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="text-slate-300">{d.label}</span>
              <span className="font-semibold" style={{ color: d.color }}>{d.days}d</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: d.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${100 - (d.days / d.max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.9, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BentoOPTCounter() {
  const [days, setDays] = useState(0);
  const inView = useRef(false);
  useEffect(() => {
    if (inView.current) return;
    inView.current = true;
    let n = 0;
    const t = setInterval(() => {
      n += 2;
      setDays(n);
      if (n >= 67) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, []);
  const pct = (days / 90) * 100;
  const color = days > 70 ? "#ef4444" : days > 50 ? "#f97316" : "#22c55e";
  return (
    <div className="h-full flex flex-col items-center justify-center p-5 text-center">
      <div className="h-7 w-7 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
        <TrendingUp className="h-4 w-4 text-green-400" />
      </div>
      <p className="text-[10px] text-slate-500 mb-1">OPT Unemployment Days</p>
      <motion.p className="text-4xl font-black mb-1" style={{ color }}>{days}</motion.p>
      <p className="text-[10px] text-slate-600 mb-3">of 90 max</p>
      <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.04 }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-slate-600">{90 - days} days left</p>
    </div>
  );
}

function BentoStats() {
  const stats = [
    { icon: ListChecks, val: 12, suffix: "", label: "Checklists", color: "#818cf8" },
    { icon: Shield, val: 2, suffix: "", label: "RFE Guides", color: "#f87171" },
    { icon: FileText, val: 9, suffix: "", label: "STEM phases", color: "#60a5fa" },
    { icon: Zap, val: 100, suffix: "%", label: "Free to browse", color: "#fbbf24" },
  ];
  return (
    <div className="h-full grid grid-cols-2 gap-2.5 p-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center p-3 text-center"
          >
            <Icon className="h-3.5 w-3.5 mb-1.5" style={{ color: s.color }} />
            <p className="text-xl font-black" style={{ color: s.color }}>
              <Counter to={s.val} suffix={s.suffix} />
            </p>
            <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{s.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── FadeUp helper ────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function LandingPageV2() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <CursorGlow />
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-visible pt-20 pb-10 min-h-screen flex flex-col justify-center">
        {/* Static bg blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-700/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-700/8 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-10"
          >
            <Badge className="text-xs px-4 py-1.5 bg-red-500/10 text-red-300 border border-red-500/20">
              <AlertTriangle className="h-3 w-3 mr-1.5" />
              One missed deadline can cost you your F-1 status
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto"
          >
            Navigate your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              entire immigration journey
            </span>{" "}
            in one place
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center text-lg text-slate-400 max-w-2xl mx-auto mb-10"
          >
            From your first F-1 visa to a green card — step-by-step checklists,
            AI guidance, and deadline tracking built for international students in the US.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button size="xl" asChild className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-xl shadow-blue-500/20">
              <Link href="/dashboard/tools/checklists">
                Browse Checklists Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
              <Link href="/ai-assistant">Try AI Assistant</Link>
            </Button>
          </motion.div>

          {/* Journey map */}
          <div className="relative max-w-3xl mx-auto">
            <FloatingCards />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <JourneyMap />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-center text-xs text-slate-600 mt-8"
          >
            Free to use · No sign-up needed to view checklists
          </motion.p>
        </div>
      </section>

      {/* ── Bento grid ───────────────────────────────────── */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-slate-800 text-slate-300 border-slate-700 text-xs">Dashboard preview</Badge>
              <h2 className="text-3xl font-bold text-white tracking-tight">Your tools, always on</h2>
              <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">AI assistant, checklists, deadline tracking, and OPT counter — all in one place.</p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto auto-rows-[160px]">
            {/* AI — tall left */}
            <FadeUp delay={0.05}>
              <div className="col-span-1 row-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur overflow-hidden group hover:border-slate-700 transition-colors h-full">
                <BentoAI />
              </div>
            </FadeUp>

            {/* Deadlines — wide */}
            <FadeUp delay={0.1}>
              <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur group hover:border-slate-700 transition-colors h-full">
                <BentoDeadlines />
              </div>
            </FadeUp>

            {/* Stats */}
            <FadeUp delay={0.15}>
              <div className="col-span-1 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur group hover:border-slate-700 transition-colors h-full">
                <BentoStats />
              </div>
            </FadeUp>

            {/* OPT counter */}
            <FadeUp delay={0.2}>
              <div className="col-span-1 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur group hover:border-slate-700 transition-colors h-full">
                <BentoOPTCounter />
              </div>
            </FadeUp>

            {/* Checklist CTA — wide */}
            <FadeUp delay={0.25}>
              <Link href="/dashboard/tools/checklists" className="col-span-2 block h-full">
                <div className="h-full rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/8 to-purple-500/8 p-5 flex flex-col justify-between group hover:border-indigo-400/40 transition-all cursor-pointer">
                  <div>
                    <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
                      <ListChecks className="h-4 w-4 text-indigo-400" />
                    </div>
                    <p className="font-bold text-white">12 Visa Checklists</p>
                    <p className="text-[11px] text-slate-400 mt-1">OPT · STEM OPT · H-1B · Green Card · RFE prevention</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-indigo-400 group-hover:gap-2 transition-all">
                    Browse all <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Visa Guides ──────────────────────────────────── */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-slate-800 text-slate-300 border-slate-700 text-xs">Free guides</Badge>
              <h2 className="text-3xl font-bold text-white tracking-tight">Understand every visa type</h2>
              <p className="mt-3 text-slate-400 text-sm">Detailed, jargon-free guides for every major US visa category</p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {visaGuides.map((guide, i) => (
              <FadeUp key={guide.slug} delay={i * 0.08}>
                <Link href={`/guides/${guide.slug}`} className="block h-full">
                  <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/60 p-5 group hover:border-slate-600 transition-all cursor-pointer">
                    <div className={`inline-flex rounded-xl p-2.5 text-xl mb-3 ${guide.color}`}>{guide.icon}</div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">{guide.title}</h3>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">{guide.subtitle}</p>
                    <div className="mt-3 flex items-center text-xs text-blue-400 font-medium">
                      Read <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── RFE callout ──────────────────────────────────── */}
      <section className="py-12 border-t border-slate-800/50">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="max-w-5xl mx-auto rounded-2xl border border-red-800/30 bg-gradient-to-r from-red-950/50 to-slate-900 p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-red-500/15 flex items-center justify-center shrink-0">
                <Shield className="h-7 w-7 text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-white">RFE Prevention Guides</h3>
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px]">Real USCIS RFE Patterns</Badge>
                </div>
                <p className="text-sm text-slate-400 leading-6">Built from actual USCIS Requests for Evidence — know which documents to collect from Day 1 of F-1 enrollment so you&apos;re never caught off guard.</p>
              </div>
              <Button variant="outline" className="shrink-0 border-red-800 text-red-300 hover:bg-red-950/50 bg-transparent" asChild>
                <Link href="/dashboard/tools/checklists">
                  View RFE Guides <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-28 border-t border-slate-800/50">
        <div className="container mx-auto px-4 text-center">
          <FadeUp>
            <div className="flex justify-center gap-3 mb-8">
              {[ListChecks, Bot, Clock].map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 2.5, delay: i * 0.35, repeat: Infinity, ease: "easeInOut" }}
                  className="h-12 w-12 rounded-2xl border border-slate-800 bg-slate-900 flex items-center justify-center"
                >
                  <Icon className="h-5 w-5 text-slate-400" />
                </motion.div>
              ))}
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              Your status is too important to guess
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              Free checklists, AI guidance, and deadline tracking. No sign-up needed to browse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" asChild className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-xl shadow-blue-500/20">
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

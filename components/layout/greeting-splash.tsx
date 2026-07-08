"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";

const GREETINGS = [
  { text: "Hello", lang: "English", from: "#1d4ed8", via: "#2563eb", to: "#06b6d4" },
  { text: "Hola", lang: "Español", from: "#c026d3", via: "#e11d48", to: "#f97316" },
  { text: "नमस्ते", lang: "हिन्दी", from: "#b45309", via: "#dc2626", to: "#db2777" },
  { text: "నమస్తే", lang: "తెలుగు", from: "#047857", via: "#0ea5e9", to: "#4f46e5" },
];

const STORAGE_KEY = "visapilot_greeted";
const STEP_MS = 850;

export function GreetingSplash() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const alreadyGreeted = sessionStorage.getItem(STORAGE_KEY);
    if (!alreadyGreeted) sessionStorage.setItem(STORAGE_KEY, "1");
    Promise.resolve().then(() => {
      if (!alreadyGreeted) setVisible(true);
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!visible || closing) return;
    if (idx >= GREETINGS.length - 1) {
      const t = setTimeout(() => setClosing(true), STEP_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx((i) => i + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [visible, closing, idx]);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, [closing]);

  if (!mounted || !visible) return null;

  const g = GREETINGS[idx];

  function skip() {
    if (!closing) setClosing(true);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-[#05060f] cursor-pointer select-none"
      initial={{ clipPath: "circle(150% at 50% 50%)" }}
      animate={{ clipPath: closing ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      onClick={skip}
      role="button"
      aria-label="Skip greeting"
    >
      {/* Color-shifting gradient wash */}
      <AnimatePresence>
        <motion.div
          key={idx}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${g.from}55, transparent 55%), radial-gradient(circle at 75% 80%, ${g.to}55, transparent 55%), linear-gradient(135deg, ${g.from}, ${g.via}, ${g.to})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Floating blurred orbs for depth */}
      <motion.div
        className="absolute h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ background: g.to, top: "10%", left: "8%" }}
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute h-96 w-96 rounded-full blur-3xl opacity-30"
        style={{ background: g.from, bottom: "5%", right: "10%" }}
        animate={{ x: [0, -30, 20, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fine grain texture for a premium, non-flat feel */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.82, filter: "blur(14px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.12, filter: "blur(14px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="text-[clamp(3.5rem,12vw,8rem)] font-black tracking-tight leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.25)]"
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff, ${g.to})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {g.text}
            </span>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-white/60"
            >
              {g.lang}
            </motion.span>
          </motion.div>
        </AnimatePresence>

        {/* Brand mark — settles in as the sequence wraps up */}
        <motion.div
          className="mt-14 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: idx === GREETINGS.length - 1 ? 1 : 0, y: idx === GREETINGS.length - 1 ? 0 : 10 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#1d4ed8]">
            <Bot className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-wide text-white/90">VisaPilot</span>
        </motion.div>

        {/* Progress indicator */}
        <div className="mt-8 flex items-center gap-1.5">
          {GREETINGS.map((item, i) => (
            <span
              key={item.lang}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === idx ? "w-8 bg-white" : i < idx ? "w-1.5 bg-white/70" : "w-1.5 bg-white/25"
              }`}
            />
          ))}
        </div>

        <p className="absolute bottom-8 text-[11px] uppercase tracking-[0.25em] text-white/40">
          Tap anywhere to skip
        </p>
      </div>
    </motion.div>
  );
}

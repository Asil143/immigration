import Link from "next/link";
import { Bot, Target, Shield, Zap, Heart, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About",
  description: "StatusClock helps international students and professionals navigate the U.S. immigration system with confidence.",
};

const values = [
  {
    icon: Target,
    title: "Clarity over complexity",
    description:
      "U.S. immigration is notoriously confusing. We break it down into plain language, step-by-step checklists, and actionable deadlines — no legalese.",
  },
  {
    icon: Shield,
    title: "Accuracy you can trust",
    description:
      "Every checklist and guide is based on official USCIS, DOL, and DOS sources. We flag when rules change and remind you that a licensed attorney is always the safest choice.",
  },
  {
    icon: Zap,
    title: "Speed when it matters",
    description:
      "Missing an immigration deadline can have life-altering consequences. StatusClock surfaces the right action at the right time so nothing slips through the cracks.",
  },
  {
    icon: Heart,
    title: "Built for immigrants, by people who get it",
    description:
      "We understand the anxiety of being in status limbo, the confusion of an RFE, and the complexity of transitioning from F-1 to H-1B to Green Card. We've lived it.",
  },
];

const stats = [
  { value: "12+", label: "Visa checklists" },
  { value: "5", label: "Immigration pathways covered" },
  { value: "Free", label: "Core tools, always" },
  { value: "24/7", label: "AI assistant access" },
];

const team = [
  {
    name: "Built by immigrants",
    description:
      "StatusClock was created by people who went through the F-1 → OPT → H-1B pipeline and wished there was a better resource. We know the stress firsthand.",
  },
  {
    name: "Not a law firm",
    description:
      "We're engineers and designers, not attorneys. We partner with licensed immigration lawyers to verify our content, but StatusClock is an information tool — not legal counsel.",
  },
  {
    name: "Independent & focused",
    description:
      "We're a small, independent team. No VC pressure to upsell you. Our goal is to make immigration navigation accessible to every international student, regardless of budget.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="border-b bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-blue-100">
            <Bot className="h-4 w-4" />
            Our mission
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Immigration shouldn&apos;t require<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              a law degree to understand.
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-8">
            StatusClock gives international students and professionals the checklists,
            AI guidance, and deadline tracking they need to navigate the U.S. immigration
            system with confidence — for free.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-slate-900 mb-1">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The problem we solve */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-3">Why we exist</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-snug">
              The immigration system is designed for lawyers, not students.
            </h2>
            <p className="text-slate-600 leading-7 mb-4">
              Every year, hundreds of thousands of international students and workers navigate
              the U.S. immigration system — often alone, often confused, and often one missed
              deadline away from losing their status.
            </p>
            <p className="text-slate-600 leading-7 mb-4">
              Official government websites are dense and hard to navigate. Immigration attorneys
              charge hundreds of dollars per hour. Reddit threads are full of conflicting advice.
            </p>
            <p className="text-slate-600 leading-7">
              StatusClock exists to fill that gap — with clear checklists, AI-assisted answers,
              deadline tracking, and plain-language guides that actually make sense.
            </p>
          </div>
          <div className="space-y-4">
            {[
              "OPT application windows that close faster than you expect",
              "STEM OPT extensions with 9 phases most students don't know about",
              "H-1B cap lotteries with no guarantee of selection",
              "RFEs that arrive with 87-day deadlines and complex requirements",
              "Green card priority dates that move forward and backward",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg p-4">
                <div className="mt-0.5 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-red-700 leading-5">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-slate-50 border-y">
        <div className="container mx-auto px-4 py-20 max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-blue-600 mb-3">What we stand for</p>
            <h2 className="text-3xl font-bold text-slate-900">Our values</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <v.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-600 text-sm leading-6">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-blue-600 mb-3">Who we are</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">The team behind StatusClock</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            A small team that went through the immigration process and decided to build the tool
            we wished existed.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((t) => (
            <div key={t.name} className="border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3">{t.name}</h3>
              <p className="text-sm text-slate-600 leading-6">{t.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What we cover */}
      <div className="bg-slate-50 border-y">
        <div className="container mx-auto px-4 py-20 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-blue-600 mb-3">Coverage</p>
            <h2 className="text-3xl font-bold text-slate-900">Every major immigration pathway</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { visa: "F-1 Student Visa", desc: "Entry, status maintenance, travel" },
              { visa: "OPT & STEM OPT", desc: "Application, EAD, employer reporting" },
              { visa: "H-1B Work Visa", desc: "Cap lottery, petition, transfers" },
              { visa: "Green Card (EB)", desc: "PERM, I-140, adjustment of status" },
              { visa: "J-1 Exchange Visa", desc: "DS-2019, waivers, two-year rule" },
              { visa: "RFE Response", desc: "H-1B, O-1, and EB petitions" },
            ].map((item) => (
              <div key={item.visa} className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800 text-sm">{item.visa}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 text-sm text-amber-800 leading-6">
          <strong className="text-amber-900">Legal disclaimer:</strong> StatusClock provides general
          immigration information for educational purposes only. We are not a law firm and nothing
          on this platform constitutes legal advice. Always consult a licensed immigration attorney
          for advice specific to your situation.
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 mt-0">
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to navigate with confidence?</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Start with our free checklists — no sign-up required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/tools/checklists"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Browse checklists <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

"use client";

import Link from "next/link";
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
  Search,
  FileCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Pick your visa stage",
    description:
      "Choose from OPT, STEM OPT, H-1B, Green Card, and more. Get a checklist built specifically for where you are right now.",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    number: "02",
    icon: FileCheck,
    title: "Follow the checklist",
    description:
      "Step-by-step phases with exactly what to do, what to collect, and when — built from real USCIS RFE patterns so you don't get caught off guard.",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    number: "03",
    icon: Bot,
    title: "Ask the AI anything",
    description:
      "Get instant answers to immigration questions with USCIS citations. Know your deadlines, understand your rights, and know when to consult a lawyer.",
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
];

const tools = [
  {
    icon: ListChecks,
    title: "Visa Checklists",
    description: "12 step-by-step checklists — OPT, STEM OPT, H-1B, Green Card, J-1, O-1, TN, and more. Plus RFE prevention guides built from real USCIS cases.",
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
    description: "Track the 90-day OPT application window, 10-day employer reporting rule, 6-month STEM OPT evaluations, and your I-94 expiry — all in one place.",
    color: "text-purple-600 bg-purple-50",
    href: "/dashboard",
    highlights: ["Auto reminders", "All visa types", "OPT day counter"],
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 pt-24 pb-28">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 20%, #8b5cf6 0%, transparent 50%)" }}
        />
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-6 text-sm px-4 py-1.5 bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/20">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            One missed deadline can cost you your F-1 status
          </Badge>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Navigate OPT, STEM OPT &amp; H-1B{" "}
            <span className="text-blue-400">without the guesswork</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300 leading-8">
            Step-by-step checklists, AI guidance, and deadline tracking — built specifically
            for international students in the US. Know exactly what to do and when.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" asChild className="bg-blue-500 hover:bg-blue-600 text-white border-0">
              <Link href="/dashboard/tools/checklists">
                Browse Checklists Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild className="border-slate-500 text-white hover:bg-slate-700 bg-transparent">
              <Link href="/ai-assistant">Try AI Assistant</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Free to use · No credit card required · No sign-up needed to view checklists
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3">How it works</Badge>
            <h2 className="text-3xl font-bold tracking-tight">Three steps to stay in status</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              The US immigration system is complicated. We break it down into clear, actionable steps.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative text-center">
                  <div className={`inline-flex rounded-2xl p-4 border ${step.color} mb-5`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-8 text-6xl font-black text-slate-100 select-none pointer-events-none">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Tools */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">The tools</Badge>
            <h2 className="text-3xl font-bold tracking-tight">Built for every stage of your journey</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              From your first OPT application to your green card — everything you need is here.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.title} href={tool.href}>
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
                        Open <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Chat Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center max-w-5xl mx-auto">
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
            <div className="relative rounded-2xl border bg-slate-50 p-4 shadow-xl">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-300 shrink-0" />
                  <div className="rounded-2xl rounded-tl-none bg-white border p-3 text-sm max-w-xs">
                    Can I change employers on STEM OPT without losing my status?
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="h-8 w-8 rounded-full bg-primary shrink-0 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tr-none bg-primary/10 p-3 text-sm max-w-sm">
                    <strong>Yes, you can change employers on STEM OPT</strong>, but there
                    are strict steps to follow:
                    <br /><br />
                    1. Your new employer must be <strong>E-Verify enrolled</strong><br />
                    2. File an updated <strong>I-983 Training Plan</strong> with your DSO<br />
                    3. Report the change within <strong>10 days</strong><br />
                    <br />
                    ⚠️ You must <strong>not exceed 150 total unemployment days</strong>.
                    <div className="mt-2 text-xs text-muted-foreground">Source: USCIS STEM OPT Guidelines</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visa Guides */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Free guides</Badge>
            <h2 className="text-3xl font-bold tracking-tight">Understand every visa type</h2>
            <p className="mt-3 text-muted-foreground">
              Detailed, jargon-free guides for every major US visa category
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {visaGuides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`inline-flex rounded-lg p-3 text-2xl mb-4 ${guide.color}`}>
                      {guide.icon}
                    </div>
                    <h3 className="font-semibold">{guide.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{guide.subtitle}</p>
                    <div className="mt-4 flex items-center text-sm text-primary font-medium">
                      Read guide <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Your status is too important to guess
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Free checklists, AI guidance, and deadline tracking. Start now — no sign-up needed to browse the checklists.
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
        </div>
      </section>

      <Footer />
    </div>
  );
}

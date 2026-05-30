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
  Scale,
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

const coreFeatures = [
  {
    icon: ListChecks,
    title: "Visa Checklists",
    description:
      "12 step-by-step checklists for OPT, STEM OPT, H-1B, Green Card, and more — including RFE prevention guides built from real USCIS patterns. Track your progress as you go.",
    color: "text-indigo-600 bg-indigo-50",
    href: "/dashboard/tools/checklists",
    badge: "12 checklists",
  },
  {
    icon: Bot,
    title: "AI Immigration Assistant",
    description:
      "Ask any immigration question and get instant, accurate guidance powered by Claude AI — with citations to official USCIS sources. Know when to consult an attorney.",
    color: "text-blue-600 bg-blue-50",
    href: "/ai-assistant",
    badge: null,
  },
  {
    icon: Calendar,
    title: "Deadline Tracker",
    description:
      "Never miss a critical immigration deadline. Automatic reminders for OPT applications, I-94 expiry, STEM reporting windows, and more — all in one place.",
    color: "text-purple-600 bg-purple-50",
    href: "/dashboard",
    badge: null,
  },
];

const moreFeatures = [
  {
    icon: Scale,
    title: "Find a Lawyer",
    description:
      "Connect with bar-verified immigration attorneys. Browse by specialty, location, and language.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: Shield,
    title: "RFE Prevention",
    description:
      "Checklists built from real USCIS Requests for Evidence — know exactly what documents to collect from Day 1.",
    color: "text-red-600 bg-red-50",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-20 pb-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4 text-center">
          <Badge variant="info" className="mb-6 text-sm px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Built for F-1 students navigating OPT, STEM OPT &amp; H-1B
          </Badge>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Your immigration{" "}
            <span className="text-primary">co-pilot</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground leading-8">
            AI-powered guidance for international students in the US.
            Navigate OPT, STEM OPT, H-1B, and green card — with step-by-step
            checklists, deadline tracking, and an AI assistant that cites USCIS sources.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" asChild>
              <Link href="/sign-up">
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/ai-assistant">Try AI Assistant</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free to use · No credit card required
          </p>
        </div>
      </section>

      {/* Core Features — what you can do right now */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Everything in one place</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              The tools F-1 students actually need — from your first OPT application to your H-1B approval.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {coreFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href}>
                  <Card className="h-full group hover:shadow-md transition-all border-2 hover:border-primary/30 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`inline-flex rounded-lg p-3 ${feature.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {feature.badge && (
                          <Badge variant="secondary" className="text-xs">{feature.badge}</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-6">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-primary font-medium">
                        Get started <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visa Guides */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Visa Guides</h2>
            <p className="mt-3 text-muted-foreground">
              Free, detailed guides for every major US visa category
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* AI Chat Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge variant="info" className="mb-4">AI Assistant</Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Ask anything about your visa
              </h2>
              <p className="mt-4 text-muted-foreground leading-7">
                Our AI assistant is trained on USCIS regulations, policy memos, and real
                immigration cases. Get instant answers with citations — and know when
                you need a real attorney.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "What are my OPT unemployment day limits?",
                  "Can I travel during H-1B transfer?",
                  "What is EB-2 NIW and am I eligible?",
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

      {/* More features — smaller grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">More tools to protect your status</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
            {moreFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className={`inline-flex rounded-lg p-3 ${feature.color} mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-6">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Start navigating with confidence
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
            Free checklists, AI guidance, and deadline tracking — everything you need to stay in status.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="secondary" asChild>
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

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
  FileText,
  Users,
  Scale,
  Shield,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Immigration Assistant",
    description:
      "Ask any immigration question and get instant, accurate guidance powered by Claude AI — with citations to official USCIS sources.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Calendar,
    title: "Deadline Tracker",
    description:
      "Never miss a critical immigration deadline. Automatic reminders for OPT applications, visa renewals, I-94 expiry, and more.",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: FileText,
    title: "Document Generator",
    description:
      "AI-powered forms, cover letters, and RFE responses. Upload your documents for instant analysis and issue detection.",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Scale,
    title: "Verified Lawyer Marketplace",
    description:
      "Connect with bar-verified immigration attorneys at transparent rates. Book video consultations directly on the platform.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Join thousands of international students sharing experiences. Visa-specific forums, success stories, and attorney AMAs.",
    color: "text-pink-600 bg-pink-50",
  },
  {
    icon: Shield,
    title: "Policy Alert Feed",
    description:
      "Stay ahead of USCIS rule changes, processing time updates, and visa bulletin movements — all in one place.",
    color: "text-teal-600 bg-teal-50",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    visa: "F-1 → OPT",
    university: "UT Austin",
    text: "VisaPilot walked me through the entire OPT process step by step. The deadline reminders saved me — I almost missed the 90-day window.",
    rating: 5,
  },
  {
    name: "Wei C.",
    visa: "H-1B applicant",
    university: "Google SWE",
    text: "The H-1B lottery tracker and cap-gap explainer was incredibly clear. I finally understood what my employer and I both needed to do.",
    rating: 5,
  },
  {
    name: "Fatima A.",
    visa: "EB-2 NIW",
    university: "MIT Postdoc",
    text: "The AI assistant helped me understand my NIW eligibility before I spent $5k on a lawyer. Now I'm working with a lawyer I found here.",
    rating: 5,
  },
];

const stats = [
  { label: "International students helped", value: "50,000+" },
  { label: "Questions answered by AI", value: "2M+" },
  { label: "Verified attorneys", value: "500+" },
  { label: "Deadlines tracked", value: "1M+" },
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
            Now with AI-powered document analysis
          </Badge>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Your immigration{" "}
            <span className="text-primary">co-pilot</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground leading-8">
            AI-powered guidance for international students and immigrants in the US.
            Navigate F-1, OPT, H-1B, green card, and more — with confidence.
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
            Free forever plan · No credit card required
          </p>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Guides */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Visa Guides</h2>
            <p className="mt-3 text-muted-foreground">
              Step-by-step guides for every major US visa category
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

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              From your first student visa to a green card — VisaPilot has you covered at every stage.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
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

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Trusted by thousands</h2>
            <p className="mt-3 text-muted-foreground">
              From F-1 arrival to green card — real stories from our community
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.visa} · {t.university}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            Join 50,000+ international students and immigrants using VisaPilot to navigate the US
            immigration system.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="secondary" asChild>
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

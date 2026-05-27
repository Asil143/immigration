import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Bot, AlertCircle, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Green Card Guide",
  description: "Employment-based green card guide — EB-1, EB-2, EB-3, and NIW pathways explained.",
};

const EB_CATEGORIES = [
  {
    category: "EB-1A",
    title: "Extraordinary Ability",
    description: "For individuals with extraordinary ability in sciences, arts, education, business, or athletics. No employer sponsor required.",
    requirements: ["National or international awards/recognition","Published work with significant citations","Judging others' work in your field","High salary compared to peers","Memberships in prestigious associations"],
    timeline: "12–24 months",
    color: "bg-yellow-50 border-yellow-200 text-yellow-900",
    badge: "bg-yellow-100 text-yellow-700",
  },
  {
    category: "EB-1B",
    title: "Outstanding Researchers & Professors",
    description: "For researchers/professors with international recognition in a specific academic area. Requires employer sponsorship.",
    requirements: ["At least 3 years research/teaching experience","Major prizes or awards","Membership in associations requiring outstanding achievement","Published material about your work","Participation as judge of others' work"],
    timeline: "12–18 months",
    color: "bg-blue-50 border-blue-200 text-blue-900",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    category: "EB-2 NIW",
    title: "National Interest Waiver",
    description: "Waives the job offer and PERM requirements for individuals whose work is in the national interest of the US. Self-petition.",
    requirements: ["Substantial merit and national importance of work","Well-positioned to advance the endeavor","Beneficial to waive job offer and PERM requirements","Strong evidence: papers, citations, media, letters of support"],
    timeline: "12–30 months",
    color: "bg-emerald-50 border-emerald-200 text-emerald-900",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    category: "EB-2",
    title: "Advanced Degree Professionals",
    description: "For professionals with advanced degrees (master's+) or equivalent. Requires employer sponsorship and PERM labor certification.",
    requirements: ["Advanced degree (master's or bachelor's + 5 years exp)","Employer files PERM labor certification","I-140 petition","Priority date must be current for your country"],
    timeline: "3–10+ years (country dependent)",
    color: "bg-indigo-50 border-indigo-200 text-indigo-900",
    badge: "bg-indigo-100 text-indigo-700",
  },
  {
    category: "EB-3",
    title: "Skilled Workers",
    description: "For skilled workers (2+ years training), professionals, and unskilled workers. Requires employer sponsorship and PERM.",
    requirements: ["Skilled: 2+ years training/experience required","Professional: US bachelor's degree or equivalent","Permanent full-time job offer from US employer","PERM labor certification filed by employer"],
    timeline: "3–10+ years (country dependent)",
    color: "bg-orange-50 border-orange-200 text-orange-900",
    badge: "bg-orange-100 text-orange-700",
  },
];

const PROCESS_STEPS = [
  { title: "PERM Labor Certification (EB-2/EB-3 only)", desc: "Employer proves no qualified US workers are available for the position. Takes 8–18 months." },
  { title: "File I-140 (Immigrant Petition)", desc: "USCIS approves your immigrant classification. Establishes your Priority Date." },
  { title: "Wait for Priority Date to Become Current", desc: "Check monthly Visa Bulletin. India and China have multi-year backlogs for EB-2/EB-3." },
  { title: "Adjustment of Status (I-485) or Consular Processing", desc: "If in the US, file I-485. If abroad, go through National Visa Center and US Embassy." },
  { title: "Biometrics, Medical Exam, and Interview", desc: "USCIS may require an interview. Medical exam from a USCIS civil surgeon required." },
  { title: "Receive Green Card", desc: "Conditional (2-year) or permanent (10-year) green card issued. Renewable." },
];

export default function GreenCardGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-emerald-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌿</span>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Permanent Residency</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Green Card — Employment-Based</h1>
            <p className="mt-4 text-lg text-muted-foreground">EB-1, EB-2 NIW, EB-2, and EB-3 pathways explained with timelines</p>
            <div className="mt-6 rounded-lg bg-white border shadow-sm p-4 max-w-xl">
              <p className="text-sm font-semibold text-foreground mb-2">
                ⚡ Self-petition options (no employer needed):
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">EB-1A Extraordinary Ability</Badge>
                <Badge variant="secondary">EB-2 NIW National Interest</Badge>
                <Badge variant="secondary">EB-1B Outstanding Researcher*</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">*EB-1B requires employer sponsor but no PERM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">

            {/* EB Categories */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Employment-Based Categories</h2>
              <div className="space-y-4">
                {EB_CATEGORIES.map(cat => (
                  <div key={cat.category} className={`rounded-xl border p-5 ${cat.color}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={`${cat.badge} border-0 font-bold`}>{cat.category}</Badge>
                        <h3 className="font-bold text-lg">{cat.title}</h3>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">
                        ~{cat.timeline}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-80 mb-3">{cat.description}</p>
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {cat.requirements.map((req, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 opacity-70" />{req}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Process */}
            <section>
              <h2 className="text-2xl font-bold mb-6">The Green Card Process</h2>
              <div className="space-y-4">
                {PROCESS_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">{i+1}</div>
                    <div className="flex-1 pb-5 border-b last:border-0">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Visa Bulletin */}
            <section className="rounded-xl bg-slate-50 border p-6">
              <h2 className="text-xl font-bold mb-3">Visa Bulletin & Priority Dates</h2>
              <p className="text-sm text-muted-foreground leading-6">
                The State Department publishes a monthly Visa Bulletin showing which priority dates are
                &ldquo;current&rdquo; for each country. India and China face backlogs of <strong>10–50+ years</strong> for
                EB-2/EB-3 categories. EB-1A and EB-2 NIW are typically current for India (check monthly).
              </p>
              <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                Check current Visa Bulletin <ExternalLink className="h-4 w-4" />
              </a>
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3">Which path is right for me?</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { type: "Researcher/PhD", path: "EB-1B or EB-2 NIW" },
                    { type: "Tech worker (FAANG)", path: "EB-2 via employer" },
                    { type: "Exceptional talent", path: "EB-1A self-petition" },
                    { type: "Skilled professional", path: "EB-3 via employer" },
                  ].map(({type, path}) => (
                    <div key={type} className="flex justify-between py-1.5 border-b last:border-0">
                      <span className="text-muted-foreground">{type}</span>
                      <span className="font-medium text-primary">{path}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 flex gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
                <p className="text-xs text-orange-800">Green card applications are complex and errors can be costly. Always work with a licensed immigration attorney.</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-0">
              <CardContent className="p-5">
                <Bot className="h-6 w-6 mb-3" />
                <p className="font-semibold">Am I eligible for NIW?</p>
                <p className="mt-1 text-sm opacity-80">Ask our AI to evaluate your EB-2 NIW eligibility.</p>
                <Button variant="secondary" className="mt-4 w-full" asChild>
                  <Link href="/ai-assistant">Ask AI <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

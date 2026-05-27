import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, ArrowRight, Bot, Globe, GraduationCap, Stethoscope, Building2, ChevronRight, Info } from "lucide-react";

const SECTIONS = [
  {
    title: "What is the J-1 Visa?",
    body: `The J-1 Exchange Visitor visa is a nonimmigrant visa category for individuals approved to participate in work-and study-based exchange visitor programs. J-1 programs are sponsored by designated organizations and include students, research scholars, professors, trainees, au pairs, camp counselors, physicians, and summer work travel participants.

J-1 status is governed by the Exchange Visitor Program regulations (22 C.F.R. Part 62) administered by the U.S. Department of State (DOS) through the Bureau of Educational and Cultural Affairs (ECA).`,
  },
  {
    title: "J-1 Program Categories",
    programs: [
      { icon: GraduationCap, title: "Student", desc: "Full-time degree or non-degree academic study at a U.S. educational institution." },
      { icon: Building2, title: "Research Scholar / Professor", desc: "Conducting research or teaching at a U.S. university or research institution." },
      { icon: Stethoscope, title: "Physician", desc: "Graduate medical training or education (residency or fellowship)." },
      { icon: Globe, title: "Trainee", desc: "On-the-job training in a field related to your academic or professional background." },
      { icon: Globe, title: "Summer Work Travel", desc: "Full-time students from other countries working in the U.S. during summer break." },
      { icon: Globe, title: "Au Pair", desc: "Childcare and cultural exchange program for young adults." },
    ],
  },
  {
    title: "Duration of Status",
    body: `J-1 visa holders are admitted for "Duration of Status" (D/S), meaning they are authorized to remain in the U.S. as long as they are maintaining their J-1 program. The DS-2019 (Certificate of Eligibility) lists the program end date — this is the key document governing your authorized stay.

Program extensions must be requested through your sponsor before the program end date on your DS-2019. Extensions must be supported by a valid reason (continued studies, research need, etc.) and approved by the sponsor.`,
  },
  {
    title: "The Two-Year Home Residency Requirement",
    isAlert: true,
    body: `One of the most important — and often misunderstood — aspects of the J-1 visa is the two-year home residency requirement under INA §212(e).

**Who is subject to it?**
You are subject to the two-year rule if any of the following apply:
1. Your exchange program was funded by your home government or the U.S. government
2. Your skills appear on your home country's Exchange Visitor Skills List
3. You came to the U.S. for graduate medical education or training

**What does it mean?**
If subject to the rule, you must physically reside in your home country for an aggregate of at least two years after your J-1 program ends before you can:
- Apply for an H, L, or K nonimmigrant visa
- Apply for permanent residence (green card)

**Verification**
Check your passport visa stamp and DS-2019. If your visa stamp says "Two-Year Rule Applies" or the DS-2019 has a mark indicating government funding or skills list applicability, you are likely subject.`,
  },
  {
    title: "J-1 Waiver Programs",
    body: `If you are subject to the two-year home residency requirement, you may apply for a waiver. There are five types of waivers:

**1. No Objection Statement**
Your home country government submits a statement to the Department of State saying it has no objection to your remaining in the U.S. Not available for physicians who received graduate medical training.

**2. Interested Government Agency (IGA)**
A U.S. federal agency (DOD, USDA, HHS, etc.) agrees that your continued U.S. presence is in the national interest. Common for research scientists and specialized professionals.

**3. Persecution**
If returning to your home country would subject you to persecution based on race, religion, or political opinion.

**4. Exceptional Hardship to U.S. Citizen/LPR Spouse or Child**
You must show that your U.S. citizen or permanent resident spouse or child would suffer exceptional hardship if you had to leave.

**5. Conrad 30 (Physicians)**
Physicians who agree to work full-time for 3 years in a medically underserved area or at a Veterans Affairs facility. Each state can sponsor up to 30 physicians per year. Very popular among foreign medical graduates.`,
  },
  {
    title: "J-2 Dependent Status",
    body: `Your spouse and unmarried children under 21 may accompany you on J-2 dependent status. J-2 holders may apply for employment authorization (I-765 under category (c)(5)) — but the income earned must not be used to support the J-1 holder's study or training; it may be used for other family needs.

J-2 holders are also subject to the two-year rule if the principal J-1 holder is subject to it.`,
  },
  {
    title: "Transitioning from J-1 to Another Status",
    body: `Many J-1 holders eventually seek to change to another nonimmigrant status (such as H-1B or O-1) or apply for permanent residence.

**If NOT subject to the two-year rule:** You may change to H-1B, O-1, or other nonimmigrant status without restriction. You may also be sponsored for a green card.

**If subject to the two-year rule:** You must either fulfill the two-year requirement or obtain a waiver before you can apply for H-1B, L-1, K-1, or permanent residence.

**Physicians:** The Conrad 30 waiver path typically leads to an H-1B or O-1 sponsored by the healthcare facility, and potentially a green card through EB-2 or National Interest Waiver petition.`,
  },
];

const FAQS = [
  {
    q: "How do I know if I'm subject to the two-year home residency requirement?",
    a: "Check your J-1 visa stamp in your passport — it will say 'Two-Year Rule Applies' if you're subject. Also check your DS-2019 and contact your sponsor organization. The State Department maintains a database you can query at travel.state.gov.",
  },
  {
    q: "Can I travel outside the U.S. on J-1 status?",
    a: "Yes. You need a valid J-1 visa stamp (not expired), a valid DS-2019 endorsed for travel by your sponsor within the last 12 months, a valid passport, and any applicable entry documents (like a home country visa if required). Always get your DS-2019 travel endorsed before leaving.",
  },
  {
    q: "What happens if my J-1 program ends and I haven't gotten a waiver?",
    a: "You would need to depart the U.S. (or change to another lawful status if eligible). Overstaying J-1 status triggers the same unlawful presence rules as any other visa — 180+ days of unlawful presence bars reentry for 3 years; 1 year or more bars for 10 years.",
  },
  {
    q: "How long does a J-1 waiver take?",
    a: "Varies by type. No-objection waivers typically take 3–6 months. Conrad 30 physician waivers depend on state timelines (1–6 months for state recommendation, then 4–8 months at DOS). IGA waivers vary widely by agency.",
  },
  {
    q: "Can J-2 holders work?",
    a: "Yes, with an approved EAD (Form I-765 under category (c)(5)). The income cannot be used to support the J-1 principal's study or training. Apply for EAD at least 90 days before you need to start working.",
  },
];

export default function J1GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-b">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <Badge variant="secondary" className="mb-4">Visa Guide</Badge>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🌍</span>
            <h1 className="text-4xl font-bold">J-1 Exchange Visitor Visa</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl leading-6">
            Exchange programs, research scholars, physicians in training, and cultural visitors — plus the critical two-year home residency rule explained.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge variant="outline" className="text-sm">Research Scholars</Badge>
            <Badge variant="outline" className="text-sm">Physicians</Badge>
            <Badge variant="outline" className="text-sm">Students</Badge>
            <Badge variant="outline" className="text-sm">Two-Year Rule</Badge>
            <Badge variant="outline" className="text-sm">J-1 Waivers</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2 space-y-10">
          {SECTIONS.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-bold mb-4">{section.title}</h2>

              {section.isAlert && (
                <div className="rounded-xl border-2 border-orange-300 bg-orange-50 p-5 mb-4 flex gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-900">
                    <p className="font-bold mb-2">Critical: Two-Year Home Residency Requirement</p>
                    <div className="space-y-2">
                      {section.body!.split("\n\n").map((para, j) => (
                        <p key={j} className="leading-5"
                          dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {section.programs && (
                <div className="grid grid-cols-2 gap-3">
                  {section.programs.map((prog, j) => {
                    const Icon = prog.icon;
                    return (
                      <div key={j} className="rounded-lg border p-4 flex gap-3">
                        <div className="rounded-md bg-orange-50 text-orange-600 p-2 h-fit shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{prog.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-4">{prog.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {section.body && !section.isAlert && (
                <div className="space-y-3 text-sm text-muted-foreground leading-6">
                  {section.body.split("\n\n").map((para, j) => {
                    if (para.startsWith("**") && para.includes("**\n")) {
                      const [header, ...rest] = para.split("\n");
                      return (
                        <div key={j}>
                          <p className="font-bold text-foreground mb-1">{header.replace(/\*\*/g, "")}</p>
                          <p dangerouslySetInnerHTML={{ __html: rest.join(" ").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                        </div>
                      );
                    }
                    return (
                      <p key={j} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* FAQs */}
          <div>
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <p className="font-semibold text-sm mb-2 flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {faq.q}
                  </p>
                  <p className="text-sm text-muted-foreground leading-5 pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* AI CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="h-5 w-5 text-primary" />
                <p className="font-bold text-sm">Ask the AI</p>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-4">
                Get instant answers about J-1 waiver requirements, two-year rule applicability, and next steps for your situation.
              </p>
              <Link href="/ai-assistant">
                <Button size="sm" className="w-full">
                  Ask a Question <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Key Facts */}
          <Card>
            <CardContent className="p-5">
              <p className="font-bold text-sm mb-3">Key Facts</p>
              <ul className="space-y-2.5">
                {[
                  "Governed by DOS Bureau of Educational and Cultural Affairs",
                  "DS-2019 is the primary J-1 status document (not the visa stamp)",
                  "Duration of Status (D/S) — stay tied to program end date",
                  "J-2 dependents can get employment authorization",
                  "Two-year rule blocks H/L/K visas and green cards",
                  "5 waiver types — Conrad 30 is most common for physicians",
                ].map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                    {fact}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Two-year rule check */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="font-bold text-sm text-orange-800">Check Your Status</p>
              </div>
              <p className="text-xs text-orange-700 mb-3 leading-4">
                Not sure if the two-year rule applies to you? Ask the VisaPilot AI — it can walk you through the checklist.
              </p>
              <Link href="/ai-assistant">
                <Button size="sm" variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
                  Check Two-Year Rule
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Related guides */}
          <Card>
            <CardContent className="p-5">
              <p className="font-bold text-sm mb-3">Related Guides</p>
              <div className="space-y-2">
                {[
                  { href: "/guides/h1b-visa", label: "H-1B Work Visa" },
                  { href: "/guides/green-card", label: "Employment Green Card" },
                  { href: "/guides/f1-visa", label: "F-1 Student Visa" },
                ].map(g => (
                  <Link key={g.href} href={g.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    {g.label}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex gap-3">
            <Info className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">This guide is for informational purposes only. Consult a licensed immigration attorney for advice specific to your situation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

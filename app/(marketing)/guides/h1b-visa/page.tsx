import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Bot, AlertCircle, Clock, ExternalLink, Calendar } from "lucide-react";

export const metadata = {
  title: "H-1B Visa Guide",
  description: "Complete H-1B specialty occupation visa guide — lottery, petition, extensions, and transfers.",
};

const STEPS = [
  {
    title: "Employer Files Labor Condition Application (LCA)",
    description: "Your employer must file an LCA with the Department of Labor (DOL) before filing the H-1B petition.",
    items: ["Employer posts LCA notice at worksite for 10 business days","DOL certifies LCA (usually 7 days)","LCA covers job title, wage, location, and period of employment","Wage must be prevailing wage or actual wage, whichever is higher"],
    link: "https://flag.dol.gov/",
  },
  {
    title: "H-1B Cap Registration (March each year)",
    description: "For cap-subject H-1Bs, employers must register online before the full petition is filed. USCIS conducts a lottery if registrations exceed the cap.",
    items: ["Registration window: typically March 1–18","Registration fee: $215 per beneficiary","Wait for lottery selection notice","Only selected registrants can file full petition"],
    link: "https://www.uscis.gov/h1b",
  },
  {
    title: "File Form I-129 (Petition for Nonimmigrant Worker)",
    description: "If selected in the lottery, your employer files the full H-1B petition.",
    items: ["File I-129 with all required evidence","Include specialty occupation evidence, degree evaluation if foreign","Pay filing fees ($730 base + ACWIA + fraud prevention fees)","Optional: Premium Processing ($2,805) for 15-business-day decision"],
    link: "https://www.uscis.gov/i-129",
  },
  {
    title: "H-1B Approval and Start Date",
    description: "Cap-subject H-1B start date is October 1 of the fiscal year. Cap-exempt employers can start anytime.",
    items: ["Receive I-797 Approval Notice","Start date: October 1 (cap-subject)","Initial period: 3 years (up to 6 years total)","Cap-gap protects F-1 OPT students during transition"],
  },
  {
    title: "Extensions and Portability",
    description: "H-1B can be extended beyond 6 years if a green card process is started.",
    items: ["File I-129 extension 6 months before expiry","If I-140 approved for 365+ days: eligible for 3-year extensions","H-1B portability: can change employers if new employer files transfer petition","AC21 portability: port green card to same or similar job after 180+ days"],
  },
];

const FAQ = [
  { q: "What is the H-1B annual cap?", a: "65,000 visas per year, plus 20,000 additional for US master's degree holders. Some employers (universities, nonprofits, government research) are cap-exempt." },
  { q: "Can I work for multiple H-1B employers?", a: "Yes — you can work for multiple H-1B employers concurrently. Each employer must file a separate H-1B petition. You cannot work for an employer who has not filed on your behalf." },
  { q: "What is cap-gap?", a: "If you're on OPT and your H-1B is approved for October 1, cap-gap automatically extends your OPT and F-1 status from the OPT expiry date through September 30 (or until H-1B starts)." },
  { q: "Can I travel while my H-1B extension is pending?", a: "You can travel if your current H-1B is still valid. If it expires while you're abroad, you need a valid H-1B visa stamp to re-enter. Consult an attorney before traveling with a pending extension." },
  { q: "What happens if I'm laid off on H-1B?", a: "You have a grace period of 60 days (or until your H-1B end date, whichever is shorter) to find a new employer who will file an H-1B transfer, change to another status, or depart the US." },
];

export default function H1BGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-green-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🏢</span>
              <Badge className="bg-green-100 text-green-700 border-green-200">H-1B Work Visa</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">H-1B Specialty Occupation Visa</h1>
            <p className="mt-4 text-lg text-muted-foreground">Lottery, petition, extensions, and employer transfers — everything you need to know</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-white border p-3 text-center shadow-sm">
                <p className="text-xl font-bold text-green-700">85,000</p>
                <p className="text-xs text-muted-foreground">Annual cap</p>
              </div>
              <div className="rounded-lg bg-white border p-3 text-center shadow-sm">
                <p className="text-xl font-bold text-green-700">6 years</p>
                <p className="text-xs text-muted-foreground">Initial max stay</p>
              </div>
              <div className="rounded-lg bg-white border p-3 text-center shadow-sm">
                <p className="text-xl font-bold text-green-700">~March</p>
                <p className="text-xs text-muted-foreground">Lottery window</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-6">H-1B Process — Step by Step</h2>
              <div className="space-y-6">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">{i+1}</div>
                    <div className="flex-1 pb-6 border-b last:border-0">
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="mt-2 text-muted-foreground text-sm">{step.description}</p>
                      <ul className="mt-3 space-y-2">
                        {step.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />{item}
                          </li>
                        ))}
                      </ul>
                      {step.link && (
                        <a href={step.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          Official resource <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">H-1B Timeline (Cap-Subject)</h2>
              <div className="space-y-2">
                {[
                  { month: "Jan–Feb", event: "Employer and attorney prepare petition documents", color: "bg-blue-100 text-blue-800" },
                  { month: "Mar 1–18", event: "USCIS opens cap registration window", color: "bg-yellow-100 text-yellow-800" },
                  { month: "Late Mar", event: "USCIS runs lottery; notifies selected registrants", color: "bg-orange-100 text-orange-800" },
                  { month: "Apr 1", event: "Filing window opens for selected registrants", color: "bg-green-100 text-green-800" },
                  { month: "Apr–Sep", event: "USCIS adjudicates petitions", color: "bg-purple-100 text-purple-800" },
                  { month: "Oct 1", event: "H-1B employment begins (new fiscal year)", color: "bg-primary/10 text-primary" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 rounded-lg p-3 ${item.color}`}>
                    <span className="font-mono text-xs font-bold w-20 shrink-0">{item.month}</span>
                    <span className="text-sm">{item.event}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQ.map((item, i) => (
                  <Card key={i}><CardContent className="p-5">
                    <h3 className="font-semibold text-sm">{item.q}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-6">{item.a}</p>
                  </CardContent></Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Key Facts</h3>
                <div className="space-y-2 text-sm divide-y">
                  {[["Cap","65k + 20k masters"],["Start date","October 1"],["Initial period","3 years"],["Max stay","6 years (extendable)"],["Dual intent","Yes ✓"],["Spouse work","H-4 EAD (if I-140 approved)"]].map(([k,v]) => (
                    <div key={k} className="flex justify-between pt-2 first:pt-0">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 flex gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
                <p className="text-xs text-orange-800">Not legal advice. H-1B petitions are complex — errors can result in denial or RFE. Consult a licensed attorney.</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-0">
              <CardContent className="p-5">
                <Bot className="h-6 w-6 mb-3" />
                <p className="font-semibold">H-1B questions?</p>
                <p className="mt-1 text-sm opacity-80">Ask our AI assistant anytime.</p>
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

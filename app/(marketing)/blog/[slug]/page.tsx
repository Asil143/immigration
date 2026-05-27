import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, Bot, ArrowRight } from "lucide-react";

const ARTICLES: Record<string, {
  title: string; category: string; badge: string; date: string; readTime: string;
  author: string; body: string; relatedSlugs: string[];
}> = {
  "h1b-2026-lottery-results": {
    title: "H-1B 2026 Lottery Results: USCIS Selects 85,000 Registrations",
    category: "H-1B",
    badge: "Breaking",
    date: "May 27, 2026",
    readTime: "4 min read",
    author: "VisaPilot Editorial",
    relatedSlugs: ["rfe-rates-specialty-occupation-2026", "uscis-processing-times-may-2026"],
    body: `USCIS has completed the H-1B random selection process for fiscal year 2026 (FY2026), selecting approximately 85,000 registrations to meet the statutory cap — 65,000 under the regular cap and 20,000 under the advanced degree exemption.

**Selection Statistics**

USCIS received approximately 470,000 unique registrations this year, continuing the high-volume trend from recent years. The overall selection rate was approximately 18% for the regular cap and 14% for the advanced degree exemption.

Lottery participants were notified through their myUSCIS accounts beginning May 25, 2026.

**What Happens Next**

Selected registrants must file a complete H-1B cap-subject petition between June 1 and June 30, 2026. Petitions must be filed at the service center designated during the registration process (California SC or Vermont SC).

Required documents include:
- Form I-129 with H classification supplement
- Labor Condition Application (LCA) certified by the Department of Labor
- Evidence of specialty occupation and beneficiary's qualifying degree
- Employer support letter
- Filing fees (currently $730 + ACWIA fee if applicable)

**Premium Processing**

Premium processing (Form I-907, $2,805 fee) guarantees a 15 business-day response. USCIS has confirmed premium processing will be available for FY2026 H-1B petitions beginning June 1.

**For Those Not Selected**

Registrations not selected remain in a "reserve" pool. USCIS may conduct additional selections from this pool if the agency determines it needs more petitions to meet the cap. Historically, reserve selections have occurred between August and October.

Employers who did not get selected should also consider alternatives such as:
- H-1B1 (for Chilean and Singaporean nationals)
- TN visa (for Canadian and Mexican nationals)
- O-1A visa (for individuals with extraordinary ability)
- E-3 (for Australian nationals)
- Cap-exempt H-1B employment (through qualifying nonprofits, universities, or government research organizations)`,
  },
  "uscis-processing-times-may-2026": {
    title: "USCIS Processing Times Drop for I-765: OPT Now 3–5 Months at Potomac SC",
    category: "Processing Times",
    badge: "Update",
    date: "May 22, 2026",
    readTime: "3 min read",
    author: "VisaPilot Editorial",
    relatedSlugs: ["h1b-2026-lottery-results", "stem-opt-extension-new-rules"],
    body: `USCIS has updated its published processing times for May 2026, with the most significant change being a reduction in I-765 (Employment Authorization Document) processing times at the Potomac Service Center.

**Key Changes**

Initial OPT applications (I-765 under category (c)(3)(A)) filed at Potomac SC are now showing approval in 3–5 months, down from 5–8 months earlier this year. This follows a USCIS initiative to reduce the EAD backlog that accumulated during 2023–2024.

STEM OPT extensions (category (c)(3)(C)) are processing in 2–3 months, a notable improvement that should provide relief for F-1 students transitioning from OPT to STEM OPT.

**How to Check Your Processing Time**

USCIS publishes processing times at uscis.gov/tools/processing-times. Applicants can check their specific form type, service center, and visa classification. The VisaPilot Processing Times tool also aggregates this data with trend indicators.

**What to Do If You're Outside the Range**

If your application has been pending longer than the published processing time, you may submit an e-request (case inquiry) through the USCIS website. USCIS will typically respond within 30 days. If no response, applicants may contact the USCIS Contact Center at 1-800-375-5283.`,
  },
};

const FALLBACK = {
  title: "Article Not Found",
  category: "News",
  badge: "Info",
  date: "May 2026",
  readTime: "1 min read",
  author: "VisaPilot Editorial",
  relatedSlugs: [],
  body: "This article could not be found. Please browse our blog for the latest immigration news.",
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const article = ARTICLES[params.slug] ?? FALLBACK;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Article header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="destructive" className="text-xs">{article.badge}</Badge>
            <Badge variant="outline" className="text-xs">{article.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold leading-snug mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {article.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {article.readTime}</span>
            <span>By {article.author}</span>
          </div>
        </div>

        {/* Hero image placeholder */}
        <div className="h-56 bg-gradient-to-br from-primary/20 to-blue-100 rounded-2xl mb-8 flex items-center justify-center">
          <div className="text-6xl opacity-20">📰</div>
        </div>

        {/* Article body */}
        <div className="prose prose-sm max-w-none mb-8">
          {article.body.split("\n\n").map((para, i) => {
            if (para.startsWith("**") && para.endsWith("**")) {
              return <h2 key={i} className="text-xl font-bold mt-8 mb-3">{para.replace(/\*\*/g, "")}</h2>;
            }
            if (para.startsWith("- ")) {
              return (
                <ul key={i} className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm my-3">
                  {para.split("\n").filter(l => l.startsWith("- ")).map((item, j) => (
                    <li key={j}>{item.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i} className="text-muted-foreground leading-7 mb-4"
              dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
            />;
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-10">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>

        {/* AI CTA */}
        <Card className="mb-10 border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="rounded-xl bg-primary text-white p-3 shrink-0">
              <Bot className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Have questions about this update?</p>
              <p className="text-xs text-muted-foreground mt-1 leading-4">Ask the VisaPilot AI Assistant — it&apos;s trained on USCIS policies, processing times, and immigration law.</p>
            </div>
            <Link href="/ai-assistant">
              <Button size="sm">Ask AI <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-xs text-yellow-800">
          <strong>Disclaimer:</strong> This article is for informational purposes only and does not constitute legal advice. Immigration law changes frequently — consult a licensed immigration attorney for advice specific to your situation.
        </div>
      </div>
    </div>
  );
}

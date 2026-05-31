import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { visaGuides } from "@/config/navigation";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata = {
  title: "Visa Guides",
  description: "Step-by-step US immigration guides for F-1, OPT, H-1B, green card and more.",
};

export default function GuidesPage() {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-800 mb-4">
            <BookOpen className="h-4 w-4" />
            Free Guides
          </div>
          <h1 className="text-4xl font-bold tracking-tight">US Visa Guides</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Comprehensive, step-by-step guides written for international students and
            immigrants. Updated with every USCIS policy change.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visaGuides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`}>
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`inline-flex rounded-xl p-3 text-3xl mb-4 ${guide.color}`}>
                    {guide.icon}
                  </div>
                  <Badge variant="info" className="mb-3 text-xs">
                    {guide.slug === "f1-visa"
                      ? "Most Popular"
                      : guide.slug === "opt-stem-opt"
                      ? "Post-Graduation"
                      : guide.slug === "h1b-visa"
                      ? "Work Visa"
                      : guide.slug === "j1-visa"
                      ? "Exchange Visitor"
                      : guide.slug === "travel-advisory"
                      ? "Travel & Re-entry"
                      : "Permanent Residency"}
                  </Badge>
                  <h2 className="font-bold text-lg">{guide.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{guide.subtitle}</p>
                  <div className="mt-6 flex items-center text-sm font-medium text-primary">
                    Read guide <ArrowRight className="ml-1.5 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
          <h2 className="text-xl font-bold">Have a specific question?</h2>
          <p className="mt-2 text-muted-foreground">
            Our AI assistant can answer any immigration question instantly.
          </p>
          <div className="mt-4">
            <Link
              href="/ai-assistant"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Ask AI Assistant <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

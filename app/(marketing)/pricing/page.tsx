import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { PLANS } from "@/lib/stripe/client";

export const metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for VisaPilot immigration guidance.",
};

export default function PricingPage() {
  const plans = [
    {
      key: "free",
      ...PLANS.free,
      highlighted: false,
      ctaText: "Get Started Free",
      ctaHref: "/sign-up",
    },
    {
      key: "pro",
      ...PLANS.pro,
      highlighted: true,
      ctaText: "Start Pro",
      ctaHref: "/sign-up?plan=pro",
    },
    {
      key: "premium",
      ...PLANS.premium,
      highlighted: false,
      ctaText: "Start Premium",
      ctaHref: "/sign-up?plan=premium",
    },
  ];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.key}
              className={plan.highlighted ? "border-primary shadow-xl scale-105" : ""}
            >
              {plan.highlighted && (
                <div className="text-center -mb-px">
                  <Badge className="rounded-b-none rounded-t-lg px-4">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">
                    {"price" in plan && plan.price === 0
                      ? "Free"
                      : `$${"monthlyPrice" in plan ? plan.monthlyPrice : 0}`}
                  </span>
                  {"monthlyPrice" in plan && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                  {"yearlyPrice" in plan && (
                    <p className="text-xs text-green-600 mt-1">
                      or ${plan.yearlyPrice}/year (save{" "}
                      {Math.round(
                        (1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100
                      )}
                      %)
                    </p>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-4"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.ctaHref}>
                    {plan.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold">Need a lawyer?</h2>
          <p className="mt-2 text-muted-foreground">
            Book verified immigration attorneys directly on VisaPilot. Transparent rates,
            no hidden fees.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/lawyers">Browse Attorneys</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

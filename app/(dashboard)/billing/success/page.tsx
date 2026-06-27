import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BillingSuccessPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const planName = plan === "premium" ? "Premium" : "Pro";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-md w-full text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Welcome to VisaPilot {planName}!</h1>
        <p className="text-muted-foreground mb-8">
          Your subscription is active. All {planName} features are now unlocked — enjoy the full VisaPilot experience.
        </p>

        <div className="rounded-2xl border bg-white p-5 text-left mb-6 space-y-3">
          {planName === "Pro" ? (
            <>
              <Feature text="Unlimited AI assistant queries" />
              <Feature text="5 document uploads & analysis per month" />
              <Feature text="Unlimited case trackers" />
              <Feature text="SMS deadline reminders" />
              <Feature text="Priority date alerts" />
            </>
          ) : (
            <>
              <Feature text="Everything in Pro" />
              <Feature text="Unlimited document generation" />
              <Feature text="RFE response assistant" />
              <Feature text="$50/month attorney consultation credits" />
              <Feature text="Dedicated support" />
            </>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full gap-2">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/ai-assistant">
            <Button variant="outline" className="w-full gap-2">
              <Sparkles className="h-4 w-4" /> Try the AI Assistant
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Questions? Email <a href="mailto:kamepalliasil143@gmail.com" className="underline">kamepalliasil143@gmail.com</a>
        </p>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

import Link from "next/link";
import { XCircle, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-md w-full text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mx-auto mb-6">
          <XCircle className="h-10 w-10 text-slate-400" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment cancelled</h1>
        <p className="text-muted-foreground mb-8">
          No charge was made. You can upgrade any time from your settings or the pricing page.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/pricing">
            <Button className="w-full">View Plans</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <a href="mailto:kamepalliasil143@gmail.com?subject=VisaPilot%20question">
            <Button variant="ghost" className="w-full gap-2">
              <MessageSquare className="h-4 w-4" /> Contact Support
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Bot } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Bot className="h-5 w-5" />
              </div>
              VisaPilot
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered immigration guidance for international students and immigrants in the US.
            </p>
            <p className="text-xs text-muted-foreground">
              ⚠️ Not legal advice. Consult a licensed attorney for your specific situation.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Visa Guides</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/guides/f1-visa" className="hover:text-primary">F-1 Student Visa</Link></li>
              <li><Link href="/guides/opt-stem-opt" className="hover:text-primary">OPT & STEM OPT</Link></li>
              <li><Link href="/guides/h1b-visa" className="hover:text-primary">H-1B Work Visa</Link></li>
              <li><Link href="/guides/green-card" className="hover:text-primary">Green Card</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/ai-assistant" className="hover:text-primary">AI Assistant</Link></li>
              <li><Link href="/community" className="hover:text-primary">Community</Link></li>
              <li><Link href="/lawyers" className="hover:text-primary">Find a Lawyer</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary">Legal Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VisaPilot. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            VisaPilot provides general information only and does not constitute legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

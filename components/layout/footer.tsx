import Link from "next/link";
import { Bot } from "lucide-react";

const guides = [
  { href: "/guides/f1-visa",           label: "F-1 Student Visa"     },
  { href: "/guides/opt-stem-opt",      label: "OPT & STEM OPT"       },
  { href: "/guides/h1b-visa",          label: "H-1B Work Visa"       },
  { href: "/guides/green-card",        label: "Green Card — Employment" },
  { href: "/guides/family-green-card", label: "Green Card — Family"  },
  { href: "/guides/j1-visa",           label: "J-1 Exchange Visa"    },
  { href: "/guides/travel-advisory",   label: "Travel Advisory"      },
];

const tools = [
  { href: "/dashboard/tools/checklists",    label: "Visa Checklists"  },
  { href: "/dashboard/tools/opt-tracker",   label: "OPT Day Counter"  },
  { href: "/dashboard/tools/visa-bulletin", label: "Visa Bulletin"    },
  { href: "/dashboard/tools/fee-calculator",label: "Fee Calculator"   },
  { href: "/ai-assistant",                  label: "AI Assistant"     },
  { href: "/employer-lookup",               label: "Employer Lookup"  },
];

const company = [
  { href: "/pricing",         label: "Pricing"          },
  { href: "/lawyers",         label: "Find a Lawyer"    },
  { href: "/blog",            label: "Blog"             },
  { href: "/community",       label: "Community"        },
  { href: "/about",           label: "About"            },
  { href: "/contact",         label: "Contact"          },
  { href: "/faq",             label: "FAQ"              },
];

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                <Bot className="h-5 w-5" />
              </div>
              StatusClock
            </Link>
            <p className="text-sm text-slate-400 leading-6 max-w-xs">
              Step-by-step checklists, AI guidance, and deadline tracking for
              international students navigating the US immigration system.
            </p>
            <p className="text-xs text-slate-500 leading-5">
              ⚠️ General information only — not legal advice.
              Consult a licensed immigration attorney for your specific situation.
            </p>
          </div>

          {/* Visa Guides */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Visa Guides</h3>
            <ul className="space-y-2.5">
              {guides.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Free Tools</h3>
            <ul className="space-y-2.5">
              {tools.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Company</h3>
            <ul className="space-y-2.5">
              {company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} StatusClock. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, ArrowRight, Bell, TrendingUp, Info, Bot } from "lucide-react";

const BULLETIN_MONTH = "June 2026";

interface BulletinRow {
  category: string;
  chargeability: string;
  china: string;
  india: string;
  mexico: string;
  philippines: string;
}

const FINAL_ACTION: BulletinRow[] = [
  { category: "EB-1", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
  { category: "EB-2", chargeability: "C", china: "01JAN19", india: "01APR12", mexico: "C", philippines: "C" },
  { category: "EB-3 Skilled/Prof", chargeability: "C", china: "01JUL19", india: "01JUN12", mexico: "22OCT22", philippines: "C" },
  { category: "EB-3 Other", chargeability: "01JAN21", china: "01JAN21", india: "01JAN21", mexico: "01JAN21", philippines: "01JAN21" },
  { category: "EB-4", chargeability: "C", china: "C", india: "C", mexico: "22MAY19", philippines: "22MAY19" },
  { category: "EB-5 Set-aside", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
];

const COUNTRY_COLS: { key: keyof BulletinRow; label: string }[] = [
  { key: "chargeability", label: "All Others" },
  { key: "china", label: "China" },
  { key: "india", label: "India" },
  { key: "mexico", label: "Mexico" },
  { key: "philippines", label: "Philippines" },
];

function CellBadge({ value }: { value: string }) {
  if (value === "C") return <Badge variant="success" className="text-xs font-mono">Current</Badge>;
  if (value === "U") return <Badge variant="destructive" className="text-xs font-mono">Unavailable</Badge>;
  return <span className="text-sm font-mono text-muted-foreground">{value}</span>;
}

const HIGHLIGHTS = [
  { label: "EB-2 India", value: "01APR12", change: "+1 month", positive: true },
  { label: "EB-3 India", value: "01JUN12", change: "+1 month", positive: true },
  { label: "EB-2 China", value: "01JAN19", change: "+1 month", positive: true },
  { label: "EB-1 All", value: "Current", change: "No change", positive: true },
];

export default function PublicVisaBulletinPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="info" className="mb-4">
            {BULLETIN_MONTH} — Department of State
          </Badge>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                Visa Bulletin
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Monthly priority date cutoffs for employment-based and family-based immigrant visa categories.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Bell className="mr-2 h-4 w-4" /> Get Alerts
              </Button>
              <Link href="/dashboard/tools/visa-bulletin">
                <Button>
                  Track My Date <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Month highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {HIGHLIGHTS.map(h => (
            <Card key={h.label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{h.label}</p>
                <p className="font-bold text-sm font-mono">{h.value}</p>
                <div className={`flex items-center gap-1 mt-1 text-xs ${h.positive ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className="h-3 w-3" />
                  {h.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="mb-8">
          <CardContent className="p-0 overflow-x-auto">
            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
              <h2 className="font-bold text-base">Employment-Based Final Action Dates</h2>
              <Badge variant="secondary" className="text-xs">{BULLETIN_MONTH}</Badge>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Preference</th>
                  {COUNTRY_COLS.map(c => (
                    <th key={c.key} className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {FINAL_ACTION.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-medium">{row.category}</td>
                    {COUNTRY_COLS.map(c => (
                      <td key={c.key} className="px-4 py-3 text-center">
                        <CellBadge value={row[c.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">How to read this table</p>
              <ul className="mt-1.5 space-y-1 text-xs text-blue-700 list-disc list-inside">
                <li><strong>C</strong> — Current: no backlog, visas available</li>
                <li><strong>U</strong> — Unavailable: no visas this month</li>
                <li><strong>Date</strong> — Only applicants whose priority date is <em>before</em> this date may proceed</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex gap-3">
            <BarChart3 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-semibold">Track your priority date</p>
              <p className="text-xs text-green-700 mt-1 leading-4">
                Sign in to VisaPilot to check if your specific priority date is current, get monthly movement alerts, and see historical trends.
              </p>
              <Link href="/dashboard/tools/visa-bulletin" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline">
                Open tracker <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* AI CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
              <Bot className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Questions about your green card timeline?</p>
              <p className="text-sm text-muted-foreground mt-0.5">Ask the VisaPilot AI — it can estimate your wait time based on your priority date and current bulletin trends.</p>
            </div>
            <Link href="/ai-assistant">
              <Button>
                Ask AI <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

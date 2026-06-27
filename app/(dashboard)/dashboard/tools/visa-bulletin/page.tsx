"use client";

import { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart3, TrendingUp, Calendar, Bell, CheckCircle2, Clock,
  AlertCircle, Info, Sparkles, ArrowRight, TrendingDown,
} from "lucide-react";

// ─── Bulletin data (June 2026) ────────────────────────────────────────────────
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
  { category: "EB-1", chargeability: "C",       china: "C",       india: "C",       mexico: "C",       philippines: "C"       },
  { category: "EB-2", chargeability: "C",       china: "01JAN19", india: "01APR12", mexico: "C",       philippines: "C"       },
  { category: "EB-3 Skilled/Prof", chargeability: "C", china: "01JUL19", india: "01JUN12", mexico: "22OCT22", philippines: "C" },
  { category: "EB-3 Other",        chargeability: "01JAN21", china: "01JAN21", india: "01JAN21", mexico: "01JAN21", philippines: "01JAN21" },
  { category: "EB-4", chargeability: "C",       china: "C",       india: "C",       mexico: "22MAY19", philippines: "22MAY19" },
  { category: "EB-5 Set-aside",    chargeability: "C", china: "C", india: "C",       mexico: "C",       philippines: "C"       },
];

const DATES_FOR_FILING: BulletinRow[] = [
  { category: "EB-1", chargeability: "C",       china: "C",       india: "C",       mexico: "C",       philippines: "C"       },
  { category: "EB-2", chargeability: "C",       china: "01MAY19", india: "01NOV12", mexico: "C",       philippines: "C"       },
  { category: "EB-3 Skilled/Prof", chargeability: "C", china: "01NOV19", india: "01SEP12", mexico: "C", philippines: "C"      },
  { category: "EB-3 Other",        chargeability: "01JUL21", china: "01JUL21", india: "01JUL21", mexico: "01JUL21", philippines: "01JUL21" },
  { category: "EB-4", chargeability: "C",       china: "C",       india: "C",       mexico: "08JUL19", philippines: "08JUL19" },
  { category: "EB-5 Set-aside",    chargeability: "C", china: "C", india: "C",       mexico: "C",       philippines: "C"       },
];

// 6-month history for movement speed calculation
const HISTORY = [
  { month: "Jun 2026", eb2India: "01APR12", eb3India: "01JUN12", eb2China: "01JAN19", eb3China: "01JUL19" },
  { month: "May 2026", eb2India: "01MAR12", eb3India: "01MAY12", eb2China: "01DEC18", eb3China: "01MAY19" },
  { month: "Apr 2026", eb2India: "01FEB12", eb3India: "01APR12", eb2China: "01NOV18", eb3China: "01APR19" },
  { month: "Mar 2026", eb2India: "01JAN12", eb3India: "01MAR12", eb2China: "01OCT18", eb3China: "01MAR19" },
  { month: "Feb 2026", eb2India: "01NOV11", eb3India: "01JAN12", eb2China: "01SEP18", eb3China: "01FEB19" },
  { month: "Jan 2026", eb2India: "01OCT11", eb3India: "01NOV11", eb2China: "01AUG18", eb3China: "01JAN19" },
];

const COUNTRY_COLS: { key: keyof BulletinRow; label: string }[] = [
  { key: "chargeability", label: "All Chargeability" },
  { key: "china", label: "China" },
  { key: "india", label: "India" },
  { key: "mexico", label: "Mexico" },
  { key: "philippines", label: "Philippines" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseDate(d: string): Date | null {
  if (!d || d === "C" || d === "U") return null;
  const day   = parseInt(d.slice(0, 2), 10);
  const months: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
  };
  const mon = months[d.slice(2, 5).toUpperCase()];
  const yr  = parseInt(d.slice(5), 10) + 2000;
  if (isNaN(day) || mon === undefined || isNaN(yr)) return null;
  return new Date(yr, mon, day);
}

function monthsBetween(a: Date, b: Date): number {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

function getMovementSpeed(category: string, country: string): number | null {
  if (country !== "india" && country !== "china") return null;
  const col = country === "india"
    ? (category === "EB-2" ? "eb2India" : category === "EB-3 Skilled/Prof" ? "eb3India" : null)
    : (category === "EB-2" ? "eb2China" : category === "EB-3 Skilled/Prof" ? "eb3China" : null);
  if (!col) return null;

  let totalMovement = 0;
  let count = 0;
  for (let i = 0; i < HISTORY.length - 1; i++) {
    const newer = parseDate(HISTORY[i][col as keyof typeof HISTORY[0]]);
    const older = parseDate(HISTORY[i + 1][col as keyof typeof HISTORY[0]]);
    if (newer && older) {
      totalMovement += monthsBetween(older, newer);
      count++;
    }
  }
  return count > 0 ? totalMovement / count : null;
}

function CellBadge({ value }: { value: string }) {
  if (value === "C") return <Badge variant="success" className="text-xs font-mono">Current</Badge>;
  if (value === "U") return <Badge variant="destructive" className="text-xs font-mono">Unavail</Badge>;
  return <span className="text-sm font-mono text-muted-foreground">{value}</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VisaBulletinPage() {
  const { user } = useUser();
  const [priorityDate, setPriorityDate] = useState("");
  const [category, setCategory] = useState("EB-2");
  const [country, setCountry] = useState("india");
  const [alertSent, setAlertSent] = useState(false);

  const calc = useMemo(() => {
    const currentRow = FINAL_ACTION.find(r => r.category === category);
    const cutoffStr  = currentRow ? currentRow[country as keyof BulletinRow] : "C";
    const isCurrent  = cutoffStr === "C";

    if (isCurrent) return { status: "current" as const, cutoffStr };

    const cutoffDate = parseDate(cutoffStr);
    const myDate     = priorityDate ? new Date(priorityDate) : null;

    if (!cutoffDate) return { status: "unavailable" as const, cutoffStr };

    if (!myDate) return { status: "no-date" as const, cutoffStr, cutoffDate };

    // Is user's date before the cutoff? (current)
    if (myDate <= cutoffDate) return { status: "current" as const, cutoffStr };

    const gapMonths   = monthsBetween(cutoffDate, myDate);
    const speedMonths = getMovementSpeed(category, country); // months advanced per bulletin month
    const yearsLeft   = speedMonths && speedMonths > 0 ? gapMonths / speedMonths / 12 : null;
    const estYear     = yearsLeft ? Math.round(new Date().getFullYear() + yearsLeft) : null;

    return {
      status:      "waiting" as const,
      cutoffStr,
      cutoffDate,
      myDate,
      gapMonths,
      speedMonths,
      yearsLeft,
      estYear,
    };
  }, [priorityDate, category, country]);

  const showEB1Tip = (country === "india" || country === "china") &&
    (category === "EB-2" || category === "EB-3 Skilled/Prof") &&
    calc.status === "waiting";

  async function saveAlert() {
    // Save notification preference — fire and forget
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priority_date: priorityDate,
        priority_category: category,
        priority_country: country,
        notification_prefs: { visa_bulletin: true },
      }),
    }).catch(() => {});
    setAlertSent(true);
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Visa Bulletin Tracker</h1>
        </div>
        <p className="text-muted-foreground">{BULLETIN_MONTH} · Enter your priority date to see when you can file</p>
      </div>

      {/* ── Personal priority date calculator ──────────────────────────────── */}
      <Card className="mb-6 overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b bg-slate-50">
          <p className="text-sm font-semibold mb-3">My Priority Date Calculator</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Preference Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {FINAL_ACTION.map(r => <option key={r.category} value={r.category}>{r.category}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Country of Birth</label>
              <select value={country} onChange={e => setCountry(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {COUNTRY_COLS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Your Priority Date</label>
              <input type="date" value={priorityDate} onChange={e => setPriorityDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          {calc.status === "current" && (
            <div className="rounded-xl p-4 bg-green-50 border border-green-200 flex items-center gap-4">
              <CheckCircle2 className="h-10 w-10 text-green-600 shrink-0" />
              <div>
                <p className="font-bold text-lg text-green-700">Your date is CURRENT — file now!</p>
                <p className="text-sm text-green-600 mt-0.5">
                  {calc.cutoffStr === "C"
                    ? `${category} has no backlog for your country. You can file your I-485 or immigrant visa application immediately.`
                    : `Your priority date is before the ${BULLETIN_MONTH} cutoff of ${calc.cutoffStr}. You may now file.`}
                </p>
              </div>
            </div>
          )}

          {calc.status === "no-date" && (
            <div className="rounded-xl p-4 bg-slate-50 border flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="h-5 w-5 shrink-0" />
              Enter your priority date above to see exactly where you stand.
            </div>
          )}

          {calc.status === "waiting" && (
            <div className="space-y-4">
              {/* Gap summary */}
              <div className="rounded-xl p-4 bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-4">
                  <Clock className="h-10 w-10 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-blue-800 text-lg">
                      {calc.gapMonths} month{calc.gapMonths !== 1 ? "s" : ""} behind the cutoff
                    </p>
                    <p className="text-sm text-blue-600 mt-0.5">
                      Bulletin cutoff is <strong>{calc.cutoffStr}</strong> · Your date: <strong>{priorityDate}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Wait estimate grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Gap</p>
                  <p className="text-2xl font-black text-slate-800">{calc.gapMonths}</p>
                  <p className="text-xs text-muted-foreground">months behind</p>
                </div>
                <div className="rounded-xl border p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Avg. Monthly Move</p>
                  <p className="text-2xl font-black text-blue-700">
                    {calc.speedMonths !== null ? `${calc.speedMonths.toFixed(1)}mo` : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">per bulletin</p>
                </div>
                <div className={`rounded-xl border p-4 text-center ${calc.yearsLeft && calc.yearsLeft > 10 ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
                  <p className="text-xs text-muted-foreground mb-1">Est. Wait</p>
                  <p className={`text-2xl font-black ${calc.yearsLeft && calc.yearsLeft > 10 ? "text-red-700" : "text-amber-700"}`}>
                    {calc.yearsLeft !== null ? `~${calc.yearsLeft < 1 ? "<1 yr" : `${calc.yearsLeft.toFixed(0)} yr${Number(calc.yearsLeft.toFixed(0)) !== 1 ? "s" : ""}`}` : "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {calc.estYear ? `~${calc.estYear}` : "based on current speed"}
                  </p>
                </div>
              </div>

              {calc.speedMonths !== null && (
                <p className="text-xs text-muted-foreground">
                  Based on {HISTORY.length - 1}-month average movement of {calc.speedMonths.toFixed(1)} months/bulletin.
                  USCIS movement is unpredictable — this is an estimate, not a guarantee.
                </p>
              )}

              {/* Alert button */}
              {user && (
                alertSent ? (
                  <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Alert saved — we'll email you when your date gets within 90 days.
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={saveAlert}>
                    <Bell className="mr-2 h-4 w-4" /> Alert me when my date gets within 90 days
                  </Button>
                )
              )}
            </div>
          )}

          {/* EB-1 Escape Valve tip for India/China EB-2/EB-3 with long waits */}
          {showEB1Tip && calc.yearsLeft !== null && calc.yearsLeft > 3 && (
            <div className="mt-4 rounded-xl p-4 bg-purple-50 border border-purple-200">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-purple-800">EB-1A / EB-1B escape route — currently current</p>
                  <p className="text-xs text-purple-700 mt-1 leading-5">
                    EB-1 (extraordinary ability, outstanding professors) has no backlog for India or China right now.
                    If you have a PhD, significant research, or achievements that meet the criteria, switching to EB-1
                    could move you to the front of the line. Ask your attorney about EB-1A self-petition eligibility.
                  </p>
                  <a href="/ai-assistant" className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 underline mt-2">
                    Ask the AI if you qualify <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Bulletin Tables ──────────────────────────────────────────────────── */}
      <Tabs defaultValue="final-action" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="final-action">Final Action Dates</TabsTrigger>
          <TabsTrigger value="dates-filing">Dates for Filing</TabsTrigger>
        </TabsList>

        {[
          { value: "final-action", data: FINAL_ACTION, desc: "Use these dates to determine when you can receive your green card." },
          { value: "dates-filing", data: DATES_FOR_FILING, desc: "USCIS may allow filing I-485 when your date passes this cutoff (check monthly USCIS announcement)." },
        ].map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <p className="px-5 pt-4 pb-2 text-xs text-muted-foreground">{tab.desc}</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                      {COUNTRY_COLS.map(c => (
                        <th key={c.key} className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tab.data.map((row, i) => {
                      const isMyRow = row.category === category;
                      return (
                        <tr key={i} className={`${isMyRow ? "bg-primary/5 ring-1 ring-inset ring-primary/20" : "hover:bg-slate-50/50"}`}>
                          <td className="px-5 py-3 font-medium">
                            {row.category}
                            {isMyRow && <Badge variant="info" className="ml-2 text-[10px]">Selected</Badge>}
                          </td>
                          {COUNTRY_COLS.map(c => (
                            <td key={c.key} className="px-4 py-3 text-center">
                              <CellBadge value={row[c.key]} />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* ── Movement history ─────────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Priority Date Movement — Last {HISTORY.length} Months
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Month</th>
                <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">EB-2 India</th>
                <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">EB-3 India</th>
                <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">EB-2 China</th>
                <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">EB-3 China</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {HISTORY.map((row, i) => {
                const prev = HISTORY[i + 1];
                function moveBadge(cur: string, old?: string) {
                  if (!old) return null;
                  const a = parseDate(cur), b = parseDate(old);
                  if (!a || !b) return null;
                  const mv = monthsBetween(b, a);
                  if (mv === 0) return <span className="text-xs text-slate-400 ml-1">→</span>;
                  return mv > 0
                    ? <span className="text-xs text-green-600 ml-1">+{mv}mo</span>
                    : <span className="text-xs text-red-500 ml-1">{mv}mo</span>;
                }
                return (
                  <tr key={i} className={i === 0 ? "bg-primary/5 font-semibold" : "hover:bg-slate-50/50"}>
                    <td className="px-5 py-3">
                      {row.month}
                      {i === 0 && <Badge variant="info" className="ml-2 text-[10px]">Current</Badge>}
                    </td>
                    {(["eb2India","eb3India","eb2China","eb3China"] as const).map(col => (
                      <td key={col} className="px-4 py-3 text-center font-mono text-xs whitespace-nowrap">
                        {row[col]}
                        {moveBadge(row[col], prev?.[col])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ── Info ─────────────────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">How to read the Visa Bulletin</p>
          <ul className="mt-1 space-y-1 list-disc list-inside text-xs text-blue-700">
            <li><strong>C (Current)</strong> — No backlog; you can file immediately.</li>
            <li><strong>U (Unavailable)</strong> — No visas available this month for this category.</li>
            <li><strong>Date</strong> — Only applicants whose priority date is <em>before</em> this date may proceed.</li>
            <li>USCIS announces each month whether to use Final Action or Dates for Filing — check USCIS.gov.</li>
            <li>Wait estimates are based on recent movement speed and may change significantly month to month.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Calendar, Bell, CheckCircle2, Clock, AlertCircle, Info } from "lucide-react";

const BULLETIN_MONTH = "June 2026";
const BULLETIN_YEAR = "2026";

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

const DATES_FOR_FILING: BulletinRow[] = [
  { category: "EB-1", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
  { category: "EB-2", chargeability: "C", china: "01MAY19", india: "01NOV12", mexico: "C", philippines: "C" },
  { category: "EB-3 Skilled/Prof", chargeability: "C", china: "01NOV19", india: "01SEP12", mexico: "C", philippines: "C" },
  { category: "EB-3 Other", chargeability: "01JUL21", china: "01JUL21", india: "01JUL21", mexico: "01JUL21", philippines: "01JUL21" },
  { category: "EB-4", chargeability: "C", china: "C", india: "C", mexico: "08JUL19", philippines: "08JUL19" },
  { category: "EB-5 Set-aside", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
];

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

function CellBadge({ value }: { value: string }) {
  if (value === "C") return <Badge variant="success" className="text-xs font-mono">Current</Badge>;
  if (value === "U") return <Badge variant="destructive" className="text-xs font-mono">Unavail</Badge>;
  return <span className="text-sm font-mono text-muted-foreground">{value}</span>;
}

export default function VisaBulletinPage() {
  const [priorityDate, setPriorityDate] = useState("2019-06-15");
  const [category, setCategory] = useState("EB-2");
  const [country, setCountry] = useState("india");

  const currentRow = FINAL_ACTION.find(r => r.category === category);
  const currentDate = currentRow ? currentRow[country as keyof BulletinRow] : "—";
  const isCurrent = currentDate === "C";

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Visa Bulletin Tracker</h1>
        </div>
        <p className="text-muted-foreground">
          {BULLETIN_MONTH} Visa Bulletin — Check if your priority date is current
        </p>
      </div>

      {/* Priority Date Check */}
      <Card className="mb-6">
        <CardContent className="p-5 space-y-4">
          <p className="text-sm font-semibold">Check My Priority Date</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Preference Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {FINAL_ACTION.map(r => (
                  <option key={r.category} value={r.category}>{r.category}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Country of Birth</label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {COUNTRY_COLS.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Your Priority Date</label>
              <input
                type="date"
                value={priorityDate}
                onChange={e => setPriorityDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className={`rounded-xl p-4 flex items-center gap-4 ${isCurrent ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}>
            {isCurrent ? (
              <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
            ) : (
              <Clock className="h-8 w-8 text-blue-600 shrink-0" />
            )}
            <div className="flex-1">
              <p className={`font-bold text-lg ${isCurrent ? "text-green-700" : "text-blue-700"}`}>
                {isCurrent ? "Your date is CURRENT" : `Bulletin cutoff: ${currentDate}`}
              </p>
              <p className={`text-sm mt-0.5 ${isCurrent ? "text-green-600" : "text-blue-600"}`}>
                {isCurrent
                  ? `Great news! You can file your ${category} green card application now.`
                  : `Your priority date (${priorityDate}) is ahead of the current cutoff for ${category} / ${country}.`}
              </p>
            </div>
            {!isCurrent && (
              <Button size="sm" variant="outline" className="shrink-0">
                <Bell className="mr-2 h-4 w-4" /> Get Alert
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulletin Tables */}
      <Tabs defaultValue="final-action" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="final-action">Final Action Dates</TabsTrigger>
          <TabsTrigger value="dates-filing">Dates for Filing</TabsTrigger>
        </TabsList>

        {[
          { value: "final-action", data: FINAL_ACTION, desc: "Use these dates to determine when you can receive your green card." },
          { value: "dates-filing", data: DATES_FOR_FILING, desc: "USCIS may allow filing I-485 when your date is past this cutoff (check monthly USCIS announcement)." },
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
                    {tab.data.map((row, i) => (
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
          </TabsContent>
        ))}
      </Tabs>

      {/* History */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Priority Date Movement (Last 6 Months)
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
              {HISTORY.map((row, i) => (
                <tr key={i} className={i === 0 ? "bg-primary/5 font-semibold" : "hover:bg-slate-50/50"}>
                  <td className="px-5 py-3">
                    {row.month}
                    {i === 0 && <Badge variant="info" className="ml-2 text-[10px]">Current</Badge>}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{row.eb2India}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{row.eb3India}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{row.eb2China}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{row.eb3China}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">How to read the Visa Bulletin</p>
          <ul className="mt-1 space-y-1 list-disc list-inside text-xs text-blue-700">
            <li><strong>C (Current)</strong> — No backlog; you can file immediately.</li>
            <li><strong>U (Unavailable)</strong> — No visas available this month for this category.</li>
            <li><strong>Date</strong> — Only applicants with a priority date <em>before</em> this date may proceed.</li>
            <li>Check USCIS.gov each month — they announce whether to use Final Action or Dates for Filing.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

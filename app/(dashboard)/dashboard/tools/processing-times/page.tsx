"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Search, TrendingUp, TrendingDown, Minus, Info, RefreshCw } from "lucide-react";

const LAST_UPDATED = "May 27, 2026";

interface ProcessingRow {
  form: string;
  title: string;
  serviceCenter: string;
  min: number;
  max: number;
  unit: "months" | "weeks" | "business days";
  trend: "up" | "down" | "stable";
  category: string;
}

const DATA: ProcessingRow[] = [
  // Employment
  { form: "I-765", title: "Employment Authorization (Initial OPT)", serviceCenter: "Potomac SC", min: 3, max: 5, unit: "months", trend: "down", category: "Employment" },
  { form: "I-765", title: "Employment Authorization (STEM OPT)", serviceCenter: "Potomac SC", min: 2, max: 3, unit: "months", trend: "down", category: "Employment" },
  { form: "I-129 H-1B", title: "Petition for H-1B Worker", serviceCenter: "California SC", min: 3, max: 6, unit: "months", trend: "stable", category: "Employment" },
  { form: "I-129 H-1B", title: "Petition for H-1B Worker", serviceCenter: "Vermont SC", min: 3, max: 5, unit: "months", trend: "stable", category: "Employment" },
  { form: "I-140 EB-1", title: "Immigrant Petition (EB-1)", serviceCenter: "Nebraska SC", min: 6, max: 10, unit: "months", trend: "up", category: "Employment" },
  { form: "I-140 EB-2/EB-3", title: "Immigrant Petition (EB-2/3)", serviceCenter: "Nebraska SC", min: 6, max: 12, unit: "months", trend: "up", category: "Employment" },
  { form: "I-140 EB-2 NIW", title: "EB-2 National Interest Waiver", serviceCenter: "Nebraska SC", min: 12, max: 24, unit: "months", trend: "stable", category: "Employment" },
  // Family
  { form: "I-130", title: "Petition for Alien Relative (spouse)", serviceCenter: "National Benefits Center", min: 12, max: 19, unit: "months", trend: "up", category: "Family" },
  { form: "I-485", title: "Adjustment of Status (EB)", serviceCenter: "National Benefits Center", min: 12, max: 26, unit: "months", trend: "stable", category: "Family" },
  { form: "I-485", title: "Adjustment of Status (family)", serviceCenter: "National Benefits Center", min: 18, max: 34, unit: "months", trend: "up", category: "Family" },
  // Student
  { form: "I-539", title: "Change of Status (F-1)", serviceCenter: "Potomac SC", min: 4, max: 10, unit: "months", trend: "down", category: "Student" },
  // Travel
  { form: "I-131", title: "Travel Document (Advance Parole)", serviceCenter: "Potomac SC", min: 4, max: 7, unit: "months", trend: "stable", category: "Travel" },
  // Naturalization
  { form: "N-400", title: "Application for Naturalization", serviceCenter: "Field Office", min: 12, max: 18, unit: "months", trend: "stable", category: "Citizenship" },
  // Premium
  { form: "I-129 PP", title: "H-1B Premium Processing", serviceCenter: "Any SC", min: 15, max: 15, unit: "business days", trend: "stable", category: "Premium" },
  { form: "I-140 PP", title: "EB Petition Premium Processing", serviceCenter: "Any SC", min: 15, max: 15, unit: "business days", trend: "stable", category: "Premium" },
];

const CATEGORIES = ["All", "Employment", "Family", "Student", "Travel", "Citizenship", "Premium"];

function TrendIcon({ trend }: { trend: ProcessingRow["trend"] }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-red-500" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-green-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function timeBadgeColor(min: number, unit: ProcessingRow["unit"]): string {
  const months = unit === "weeks" ? min / 4 : unit === "business days" ? min / 20 : min;
  if (months <= 3) return "bg-green-100 text-green-700";
  if (months <= 9) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function ProcessingTimesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = DATA.filter(row => {
    const matchesSearch = !search ||
      row.form.toLowerCase().includes(search.toLowerCase()) ||
      row.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || row.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Clock className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">USCIS Processing Times</h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">Current USCIS processing times for all major immigration forms</p>
          <Badge variant="outline" className="text-xs gap-1.5">
            <RefreshCw className="h-3 w-3" /> Updated {LAST_UPDATED}
          </Badge>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "OPT / I-765", time: "3–5 mo", color: "text-green-600", bg: "bg-green-50" },
          { label: "H-1B / I-129", time: "3–6 mo", color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "EB-2/3 / I-140", time: "6–12 mo", color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Premium (I-140)", time: "15 days", color: "text-blue-600", bg: "bg-blue-50" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className={`p-4 ${s.bg} rounded-lg`}>
              <p className={`text-xl font-black ${s.color}`}>{s.time}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search form or description..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="mb-6">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Form</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Service Center</th>
                <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Processing Time</th>
                <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs font-bold text-primary">{row.form}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs">{row.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{row.serviceCenter}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${timeBadgeColor(row.min, row.unit)}`}>
                      {row.min === row.max ? `${row.min} ${row.unit}` : `${row.min}–${row.max} ${row.unit}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendIcon trend={row.trend} />
                      <span className="text-xs text-muted-foreground capitalize">{row.trend}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">No results for &quot;{search}&quot;</div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5"><TrendingDown className="h-3.5 w-3.5 text-green-500" /> Processing getting faster</div>
        <div className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-red-500" /> Processing getting slower</div>
        <div className="flex items-center gap-1.5"><Minus className="h-3.5 w-3.5 text-muted-foreground" /> No recent change</div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">About these times</p>
          <p className="mt-1 text-xs text-blue-700 leading-5">
            Times are estimated based on USCIS published data. Your actual wait may vary based on your service center, case complexity, and RFEs. Premium processing (Form I-907) guarantees a 15 business-day response for eligible petitions.
          </p>
        </div>
      </div>
    </div>
  );
}

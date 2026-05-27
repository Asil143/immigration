"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Timer, AlertCircle, CheckCircle2, Info, Calendar, TrendingDown } from "lucide-react";
import { differenceInDays, format, addDays, parseISO } from "date-fns";

const MAX_STANDARD = 90;
const MAX_STEM = 150;

interface UnemployedPeriod {
  id: string;
  start: string;
  end: string | null;
}

export default function OPTTrackerPage() {
  const [optType, setOptType] = useState<"standard" | "stem">("standard");
  const [optStart, setOptStart] = useState("2025-01-15");
  const [optEnd, setOptEnd] = useState("2026-01-14");
  const [periods, setPeriods] = useState<UnemployedPeriod[]>([
    { id: "1", start: "2025-03-01", end: "2025-03-21" },
    { id: "2", start: "2025-06-10", end: "2025-06-20" },
  ]);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const max = optType === "standard" ? MAX_STANDARD : MAX_STEM;

  const totalUsed = useMemo(() => {
    return periods.reduce((acc, p) => {
      if (!p.start) return acc;
      const end = p.end ? parseISO(p.end) : new Date();
      const start = parseISO(p.start);
      return acc + Math.max(0, differenceInDays(end, start));
    }, 0);
  }, [periods]);

  const remaining = Math.max(0, max - totalUsed);
  const pct = Math.min(100, (totalUsed / max) * 100);
  const status = pct >= 90 ? "critical" : pct >= 70 ? "warning" : "safe";

  const statusConfig = {
    safe:     { color: "text-green-600",  bg: "bg-green-50",  barColor: "bg-green-500",  label: "Safe",    icon: CheckCircle2 },
    warning:  { color: "text-yellow-600", bg: "bg-yellow-50", barColor: "bg-yellow-500", label: "Warning", icon: AlertCircle  },
    critical: { color: "text-red-600",    bg: "bg-red-50",    barColor: "bg-red-500",    label: "Critical",icon: AlertCircle  },
  }[status];

  const StatusIcon = statusConfig.icon;

  function addPeriod() {
    if (!newStart) return;
    setPeriods(p => [...p, { id: Date.now().toString(), start: newStart, end: newEnd || null }]);
    setNewStart(""); setNewEnd("");
  }

  function removePeriod(id: string) {
    setPeriods(p => p.filter(x => x.id !== id));
  }

  const daysUntilOptEnd = differenceInDays(parseISO(optEnd), new Date());
  const safeUntil = addDays(new Date(), remaining);

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Timer className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">OPT Unemployment Day Counter</h1>
        </div>
        <p className="text-muted-foreground">Track your unemployment days to stay within USCIS limits</p>
      </div>

      {/* OPT Type + Dates */}
      <Card className="mb-6">
        <CardContent className="p-5 space-y-4">
          <div className="flex gap-3">
            {(["standard", "stem"] as const).map(t => (
              <button
                key={t}
                onClick={() => setOptType(t)}
                className={`flex-1 rounded-lg border p-3 text-sm font-medium transition-colors ${
                  optType === t ? "border-primary bg-primary/5 text-primary" : "text-muted-foreground hover:border-primary/40"
                }`}
              >
                {t === "standard" ? "Standard OPT (90 days)" : "STEM OPT Extension (150 days)"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>OPT Start Date</Label>
              <Input type="date" value={optStart} onChange={e => setOptStart(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>OPT End Date</Label>
              <Input type="date" value={optEnd} onChange={e => setOptEnd(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main counter */}
      <Card className={`mb-6 border-2 ${status === "safe" ? "border-green-200" : status === "warning" ? "border-yellow-200" : "border-red-200"}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-muted-foreground">Unemployment Days Used</p>
              <div className="flex items-end gap-2 mt-1">
                <span className={`text-5xl font-black ${statusConfig.color}`}>{totalUsed}</span>
                <span className="text-2xl text-muted-foreground mb-1">/ {max}</span>
              </div>
            </div>
            <div className={`rounded-2xl p-4 ${statusConfig.bg} flex flex-col items-center`}>
              <StatusIcon className={`h-8 w-8 ${statusConfig.color}`} />
              <Badge variant={status === "safe" ? "success" : status === "warning" ? "warning" : "destructive"} className="mt-2 text-xs">
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0 days</span>
              <span>{max} days (limit)</span>
            </div>
            <div className="relative h-4 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${statusConfig.barColor}`}
                style={{ width: `${pct}%` }}
              />
              {/* Warning threshold marker */}
              <div className="absolute top-0 bottom-0 border-l-2 border-yellow-400 border-dashed" style={{ left: "70%" }} />
              <div className="absolute top-0 bottom-0 border-l-2 border-red-400 border-dashed" style={{ left: "90%" }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xl font-bold text-green-600">{remaining}</p>
              <p className="text-xs text-muted-foreground">Days remaining</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xl font-bold">{daysUntilOptEnd}</p>
              <p className="text-xs text-muted-foreground">Until OPT ends</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-bold text-foreground">{format(safeUntil, "MMM d")}</p>
              <p className="text-xs text-muted-foreground">Limit reached by</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unemployment periods */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Unemployment Periods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {periods.map(p => {
            const end = p.end ? parseISO(p.end) : new Date();
            const days = Math.max(0, differenceInDays(end, parseISO(p.start)));
            return (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Start</p>
                    <p className="font-medium">{format(parseISO(p.start), "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End</p>
                    <p className="font-medium">{p.end ? format(parseISO(p.end), "MMM d, yyyy") : <span className="text-orange-500">Ongoing</span>}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Days</p>
                    <p className="font-bold text-primary">{days}</p>
                  </div>
                </div>
                <button onClick={() => removePeriod(p.id)} className="text-muted-foreground hover:text-destructive text-xs">✕</button>
              </div>
            );
          })}

          <div className="border-t pt-3 grid grid-cols-5 gap-2 items-end">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">Start Date</Label>
              <Input type="date" value={newStart} onChange={e => setNewStart(e.target.value)} className="h-8 text-sm" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">End Date (leave blank if ongoing)</Label>
              <Input type="date" value={newEnd} onChange={e => setNewEnd(e.target.value)} className="h-8 text-sm" />
            </div>
            <Button size="sm" onClick={addPeriod} disabled={!newStart} className="h-8">Add</Button>
          </div>
        </CardContent>
      </Card>

      {/* Info box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">Important Rules</p>
          <ul className="mt-1 space-y-1 list-disc list-inside text-xs text-blue-700">
            <li>Report any employment (start/stop) to your DSO within 10 days</li>
            <li>Standard OPT: max 90 total unemployment days</li>
            <li>STEM OPT: max 150 total days (includes days from standard OPT)</li>
            <li>Exceeding the limit may result in failure to maintain F-1 status</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

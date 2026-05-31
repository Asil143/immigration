"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, Circle, AlertCircle, Info, ExternalLink, RotateCcw,
  BookOpen, User, FileText, Send, DollarSign, Clock, CreditCard,
  Building2, Globe, Zap, Trophy, Scale, Flag, Calendar, AlertTriangle,
  Cloud, CloudOff, Loader2,
} from "lucide-react";
import type { ChecklistDef, Phase } from "@/lib/checklists/types";

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen, User, FileText, Send, DollarSign, Clock, CreditCard,
  Building2, Globe, Zap, Trophy, Scale, Flag, Calendar, AlertTriangle,
  AlertCircle, Info, CheckCircle: CheckCircle2,
};

const TYPE_CONFIG = {
  doc:    { label: "Document", color: "bg-blue-100 text-blue-700"    },
  form:   { label: "Form",     color: "bg-orange-100 text-orange-700" },
  fee:    { label: "Fee",      color: "bg-red-100 text-red-700"      },
  action: { label: "Action",   color: "bg-slate-100 text-slate-600"  },
  online: { label: "Online",   color: "bg-green-100 text-green-700"  },
};

type SyncStatus = "idle" | "saving" | "saved" | "error";

interface Props {
  checklist: ChecklistDef;
  storageKey: string;
}

export function ChecklistView({ checklist, storageKey }: Props) {
  const { isSignedIn } = useUser();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load progress — server if signed in, localStorage fallback
  useEffect(() => {
    async function load() {
      if (isSignedIn) {
        try {
          const res = await fetch(`/api/checklists/${checklist.slug}/progress`);
          if (res.ok) {
            const data = await res.json();
            setChecked(data.checked ?? {});
            return;
          }
        } catch {}
      }
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
        setChecked(saved);
      } catch {}
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  function persistToServer(next: Record<string, boolean>) {
    clearTimeout(saveTimer.current);
    setSyncStatus("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        await fetch(`/api/checklists/${checklist.slug}/progress`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checked: next }),
        });
        setSyncStatus("saved");
        setTimeout(() => setSyncStatus("idle"), 2500);
      } catch {
        setSyncStatus("error");
      }
    }, 700);
  }

  function toggle(id: string) {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(storageKey, JSON.stringify(next));
      if (isSignedIn) persistToServer(next);
      return next;
    });
  }

  function resetAll() {
    setChecked({});
    localStorage.removeItem(storageKey);
    if (isSignedIn) persistToServer({});
  }

  const allItems = checklist.phases.flatMap(p => p.items);
  const doneItems = allItems.filter(i => checked[i.id]).length;
  const progressPct = allItems.length > 0 ? Math.round((doneItems / allItems.length) * 100) : 0;

  const phaseProgress = (phase: Phase) => {
    const done = phase.items.filter(i => checked[i.id]).length;
    return { done, total: phase.items.length, pct: Math.round((done / phase.items.length) * 100) };
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{checklist.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{checklist.title} Checklist</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{checklist.subtitle}</p>
          </div>
        </div>

        {/* Sync indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {isSignedIn ? (
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
              syncStatus === "saving" ? "text-amber-600 bg-amber-50 border-amber-200" :
              syncStatus === "saved"  ? "text-green-600 bg-green-50 border-green-200" :
              syncStatus === "error"  ? "text-red-600 bg-red-50 border-red-200" :
              "text-slate-500 bg-slate-50 border-slate-200"
            }`}>
              {syncStatus === "saving" && <Loader2 className="h-3 w-3 animate-spin" />}
              {syncStatus === "saved"  && <Cloud className="h-3 w-3" />}
              {syncStatus === "error"  && <CloudOff className="h-3 w-3" />}
              {syncStatus === "idle"   && <Cloud className="h-3 w-3" />}
              {syncStatus === "saving" ? "Saving…" :
               syncStatus === "saved"  ? "Synced" :
               syncStatus === "error"  ? "Sync failed" :
               "Synced across devices"}
            </span>
          ) : (
            <SignUpButton mode="modal">
              <button className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors">
                <CloudOff className="h-3 w-3" />
                Sign in to save progress
              </button>
            </SignUpButton>
          )}
        </div>
      </div>

      {/* Progress card */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold">Overall Progress</p>
              <p className="text-sm text-muted-foreground mt-0.5">{doneItems} of {allItems.length} items completed</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-primary">{progressPct}%</span>
              <Button variant="ghost" size="sm" onClick={resetAll} className="text-muted-foreground gap-1.5 text-xs">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>
            </div>
          </div>
          <Progress value={progressPct} className="h-3" />
          <div className="flex flex-wrap gap-2 mt-4">
            {checklist.phases.map(phase => {
              const prog = phaseProgress(phase);
              const done = prog.done === prog.total;
              return (
                <a key={phase.id} href={`#${phase.id}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    done ? "bg-green-100 border-green-300 text-green-700" : "bg-white border-slate-200 text-slate-600"
                  }`}>
                  {done ? <CheckCircle2 className="h-3 w-3" /> : <span className="font-bold">{prog.done}/{prog.total}</span>}
                  Phase {phase.number}
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key facts */}
      {checklist.keyFacts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {checklist.keyFacts.map(fact => {
            const Icon = ICON_MAP[fact.icon] ?? Info;
            return (
              <div key={fact.label} className="rounded-lg bg-white border p-3 text-center">
                <Icon className={`h-4 w-4 mx-auto mb-1 ${fact.color}`} />
                <p className={`text-lg font-black ${fact.color}`}>{fact.value}</p>
                <p className="text-xs font-medium">{fact.label}</p>
                <p className="text-[10px] text-muted-foreground">{fact.sub}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Phases */}
      <div className="space-y-6">
        {checklist.phases.map(phase => {
          const prog = phaseProgress(phase);
          const allDone = prog.done === prog.total;
          const Icon = ICON_MAP[phase.icon] ?? BookOpen;

          return (
            <div key={phase.id} id={phase.id}>
              <Card className={`border-2 transition-colors ${allDone ? "border-green-300 bg-green-50/30" : phase.colorBorder}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${phase.colorBg}`}>
                        <Icon className={`h-5 w-5 ${phase.colorText}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-base">Phase {phase.number}: {phase.title}</CardTitle>
                          {allDone && <Badge variant="success" className="text-xs">Done</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{phase.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                      <span className="font-semibold text-foreground">{prog.done}/{prog.total}</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${prog.pct}%` }} />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-2">
                  {phase.alert && (
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 mb-3">
                      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">{phase.alert}</p>
                    </div>
                  )}

                  {phase.items.map(item => {
                    const isChecked = !!checked[item.id];
                    const typeMeta = item.type ? TYPE_CONFIG[item.type] : null;
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                          isChecked ? "bg-green-50 border-green-200" : "hover:bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked
                            ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                            : <Circle className="h-5 w-5 text-slate-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 flex-wrap">
                            <p className={`text-sm font-medium leading-snug flex-1 ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                              {item.text}
                            </p>
                            {typeMeta && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${typeMeta.color}`}>
                                {typeMeta.label}
                              </span>
                            )}
                          </div>
                          {item.note && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.note}</p>}
                          {item.link && (
                            <a
                              href={item.link.url}
                              target={item.link.url.startsWith("http") ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5 font-medium"
                            >
                              <ExternalLink className="h-3 w-3" />{item.link.label}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

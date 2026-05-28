"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { allChecklists } from "@/lib/checklists";

function useChecklistProgress(slug: string, totalItems: number) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`visapilot_checklist_${slug}`) || "{}");
      const done = Object.values(saved).filter(Boolean).length;
      setPct(totalItems > 0 ? Math.round((done / totalItems) * 100) : 0);
    } catch {}
  }, [slug, totalItems]);

  return pct;
}

function ChecklistCard({ checklist }: { checklist: (typeof allChecklists)[number] }) {
  const totalItems = checklist.phases.reduce((sum, p) => sum + p.items.length, 0);
  const pct = useChecklistProgress(checklist.slug, totalItems);

  return (
    <Link href={`/dashboard/tools/checklists/${checklist.slug}`}>
      <Card className="group hover:shadow-md transition-all cursor-pointer border-2 hover:border-primary/30 h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl leading-none">{checklist.emoji}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors leading-snug">
                {checklist.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                {checklist.subtitle}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{checklist.phases.length} phases · {totalItems} items</span>
              {pct === 100
                ? <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle2 className="h-3 w-3" /> Done</span>
                : <span className="font-medium text-primary">{pct}%</span>
              }
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ChecklistsHubPage() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Visa Checklists</h1>
        <p className="text-muted-foreground mt-1">
          Step-by-step guides for every major US visa type — track your progress as you complete each item.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allChecklists.map(checklist => (
          <ChecklistCard key={checklist.slug} checklist={checklist} />
        ))}
      </div>
    </div>
  );
}

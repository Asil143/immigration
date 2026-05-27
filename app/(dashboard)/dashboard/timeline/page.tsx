"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  Check,
  Trash2,
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import type { Deadline, DeadlinePriority } from "@/types";

const MOCK_DEADLINES: Deadline[] = [
  {
    id: "1",
    user_id: "u1",
    case_id: null,
    title: "Apply for OPT (I-765)",
    description: "Can apply up to 90 days before graduation. USCIS takes 3-5 months.",
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "critical",
    is_completed: false,
    reminder_days: [30, 7, 1],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "u1",
    case_id: null,
    title: "STEM OPT Extension Filing",
    description: "File I-765 extension at least 90 days before OPT expires",
    due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    is_completed: false,
    reminder_days: [60, 30, 7],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "u1",
    case_id: null,
    title: "Passport Renewal",
    description: "Passport expires in ~6 months. Renew before it expires.",
    due_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    is_completed: false,
    reminder_days: [90, 30],
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "u1",
    case_id: null,
    title: "Update I-20 Address",
    description: "Report address change to DSO within 10 days",
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    is_completed: true,
    reminder_days: [7, 1],
    created_at: new Date().toISOString(),
  },
];

const priorityConfig: Record<
  DeadlinePriority,
  { label: string; icon: typeof AlertCircle; color: string; badgeVariant: "destructive" | "warning" | "info" | "secondary" }
> = {
  critical: { label: "Critical", icon: AlertCircle, color: "text-red-500", badgeVariant: "destructive" },
  high: { label: "High", icon: Clock, color: "text-orange-500", badgeVariant: "warning" },
  medium: { label: "Medium", icon: Clock, color: "text-blue-500", badgeVariant: "info" },
  low: { label: "Low", icon: CheckCircle2, color: "text-slate-400", badgeVariant: "secondary" },
};

export default function TimelinePage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>(MOCK_DEADLINES);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newPriority, setNewPriority] = useState<DeadlinePriority>("medium");

  const active = deadlines.filter((d) => !d.is_completed).sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );
  const completed = deadlines.filter((d) => d.is_completed);

  function toggle(id: string) {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_completed: !d.is_completed } : d))
    );
  }

  function remove(id: string) {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  }

  function addDeadline() {
    if (!newTitle || !newDate) return;
    const d: Deadline = {
      id: Date.now().toString(),
      user_id: "u1",
      case_id: null,
      title: newTitle,
      description: null,
      due_date: new Date(newDate).toISOString(),
      priority: newPriority,
      is_completed: false,
      reminder_days: [7, 1],
      created_at: new Date().toISOString(),
    };
    setDeadlines((prev) => [...prev, d]);
    setNewTitle("");
    setNewDate("");
    setShowAdd(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Timeline & Deadlines</h1>
          <p className="mt-1 text-muted-foreground">Track every critical immigration date</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Deadline
        </Button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <Card className="mb-6 border-primary/30">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold">New Deadline</h3>
            <Input
              placeholder="Deadline title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex gap-3">
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="flex-1"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as DeadlinePriority)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={addDeadline}>Add</Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Deadlines */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Active Deadlines ({active.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {active.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No active deadlines. Add one above!
            </p>
          )}
          {active.map((d) => {
            const daysLeft = differenceInDays(parseISO(d.due_date), new Date());
            const config = priorityConfig[d.priority];
            const Icon = config.icon;

            return (
              <div key={d.id} className="flex items-start gap-3 rounded-lg border p-4 group">
                <button onClick={() => toggle(d.id)} className="mt-0.5">
                  <div className="h-5 w-5 rounded border-2 border-slate-300 hover:border-primary transition-colors" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-medium text-sm">{d.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.badgeVariant}>
                        {daysLeft < 0
                          ? `${Math.abs(daysLeft)}d overdue`
                          : daysLeft === 0
                          ? "Today"
                          : `${daysLeft}d left`}
                      </Badge>
                      <button
                        onClick={() => remove(d.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {d.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{d.description}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                    {format(parseISO(d.due_date), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Completed */}
      {completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4" />
              Completed ({completed.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completed.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-lg border p-3 opacity-60"
              >
                <button onClick={() => toggle(d.id)}>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </button>
                <p className="text-sm line-through text-muted-foreground">{d.title}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

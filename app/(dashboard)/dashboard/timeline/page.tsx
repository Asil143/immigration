"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus, Calendar, AlertCircle, Clock, CheckCircle2, Check, Trash2, Loader2,
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";

type Priority = "critical" | "high" | "medium" | "low";

interface Deadline {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  priority: Priority;
  is_completed: boolean;
}

const priorityConfig: Record<Priority, { icon: typeof AlertCircle; color: string; badgeVariant: "destructive" | "warning" | "info" | "secondary" }> = {
  critical: { icon: AlertCircle, color: "text-red-500", badgeVariant: "destructive" },
  high:     { icon: Clock,        color: "text-orange-500", badgeVariant: "warning" },
  medium:   { icon: Clock,        color: "text-blue-500",   badgeVariant: "info" },
  low:      { icon: CheckCircle2, color: "text-slate-400",  badgeVariant: "secondary" },
};

export default function TimelinePage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/deadlines")
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setDeadlines(data); })
      .finally(() => setLoading(false));
  }, []);

  async function addDeadline() {
    if (!newTitle || !newDate) return;
    setSaving(true);
    const res = await fetch("/api/deadlines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, due_date: newDate, priority: newPriority }),
    });
    if (res.ok) {
      const d = await res.json();
      setDeadlines(prev => [d, ...prev]);
      setNewTitle(""); setNewDate(""); setShowAdd(false);
    }
    setSaving(false);
  }

  async function toggle(id: string, current: boolean) {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, is_completed: !current } : d));
    await fetch("/api/deadlines", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_completed: !current }),
    });
  }

  async function remove(id: string) {
    setDeadlines(prev => prev.filter(d => d.id !== id));
    await fetch("/api/deadlines", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  const active = deadlines.filter(d => !d.is_completed).sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );
  const completed = deadlines.filter(d => d.is_completed);

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

      {showAdd && (
        <Card className="mb-6 border-primary/30">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold">New Deadline</h3>
            <Input placeholder="Deadline title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <div className="flex gap-3">
              <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="flex-1" />
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as Priority)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={addDeadline} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Add
              </Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Active Deadlines ({active.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : active.length === 0 ? (
            <div className="text-center py-8 rounded-xl" style={{ backgroundColor: "#f8fafc", border: "1px dashed #e2e8f0" }}>
              <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-muted-foreground">No active deadlines</p>
              <p className="text-xs text-muted-foreground mt-1">Click Add Deadline to track an upcoming date.</p>
            </div>
          ) : active.map(d => {
            const daysLeft = differenceInDays(parseISO(d.due_date), new Date());
            const config = priorityConfig[d.priority];
            const Icon = config.icon;
            return (
              <div key={d.id} className="flex items-start gap-3 rounded-lg border p-4 group">
                <button onClick={() => toggle(d.id, d.is_completed)} className="mt-0.5">
                  <div className="h-5 w-5 rounded border-2 border-slate-300 hover:border-primary transition-colors" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-medium text-sm">{d.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.badgeVariant}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Today" : `${daysLeft}d left`}
                      </Badge>
                      <button onClick={() => remove(d.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {d.description && <p className="mt-0.5 text-xs text-muted-foreground">{d.description}</p>}
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

      {completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
              <Check className="h-4 w-4" /> Completed ({completed.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completed.map(d => (
              <div key={d.id} className="flex items-center gap-3 rounded-lg border p-3 opacity-60">
                <button onClick={() => toggle(d.id, d.is_completed)}>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </button>
                <p className="text-sm line-through text-muted-foreground">{d.title}</p>
                <button onClick={() => remove(d.id)} className="ml-auto text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

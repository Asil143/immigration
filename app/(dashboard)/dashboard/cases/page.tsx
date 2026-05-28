"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, FolderOpen, Clock, CheckCircle2, XCircle,
  Calendar, AlertCircle, Loader2, Trash2,
} from "lucide-react";
import { format } from "date-fns";

type CaseStatus = "active" | "pending" | "approved" | "denied" | "expired" | "archived";

interface VisaCase {
  id: string;
  visa_type: string;
  title: string;
  status: CaseStatus;
  receipt_number: string | null;
  start_date: string | null;
  expiry_date: string | null;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<CaseStatus, { icon: React.ElementType; color: string; badge: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  active:   { icon: CheckCircle2, color: "text-green-600",  badge: "success"     },
  pending:  { icon: Clock,        color: "text-yellow-600", badge: "warning"     },
  approved: { icon: CheckCircle2, color: "text-blue-600",   badge: "info"        },
  denied:   { icon: XCircle,      color: "text-red-600",    badge: "destructive" },
  expired:  { icon: AlertCircle,  color: "text-slate-500",  badge: "secondary"   },
  archived: { icon: FolderOpen,   color: "text-slate-400",  badge: "outline"     },
};

const VISA_TYPES = ["F-1","OPT","STEM OPT","H-1B","H-4","J-1","L-1A","L-1B","O-1A","O-1B","TN","EB-1","EB-2","EB-3","Other"];
const STATUSES: CaseStatus[] = ["active","pending","approved","denied","expired","archived"];

export default function CasesPage() {
  const [cases, setCases] = useState<VisaCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<VisaCase | null>(null);
  const [form, setForm] = useState({ visa_type: "", title: "", status: "active" as CaseStatus, receipt_number: "", start_date: "", expiry_date: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/visa-cases")
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setCases(data); })
      .finally(() => setLoading(false));
  }, []);

  async function addCase() {
    if (!form.visa_type || !form.title) return;
    setSaving(true);
    const res = await fetch("/api/visa-cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visa_type: form.visa_type, title: form.title, status: form.status,
        receipt_number: form.receipt_number || null,
        start_date: form.start_date || null, expiry_date: form.expiry_date || null,
        notes: form.notes || null,
      }),
    });
    if (res.ok) {
      const d = await res.json();
      setCases(prev => [d, ...prev]);
      setForm({ visa_type: "", title: "", status: "active", receipt_number: "", start_date: "", expiry_date: "", notes: "" });
      setOpen(false);
    }
    setSaving(false);
  }

  async function removeCase(id: string) {
    setCases(prev => prev.filter(c => c.id !== id));
    setSelected(null);
    await fetch("/api/visa-cases", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  const active = cases.filter(c => c.status === "active" || c.status === "pending");
  const historical = cases.filter(c => ["approved","denied","expired","archived"].includes(c.status));

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Cases</h1>
          <p className="mt-1 text-muted-foreground">Track all your visa applications and status</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Case
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {[
          { label: "Active",   value: cases.filter(c=>c.status==="active").length,   color: "text-green-600"  },
          { label: "Pending",  value: cases.filter(c=>c.status==="pending").length,  color: "text-yellow-600" },
          { label: "Approved", value: cases.filter(c=>c.status==="approved").length, color: "text-blue-600"   },
          { label: "Total",    value: cases.length,                                  color: "text-foreground" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : cases.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: "#f8fafc", border: "1px dashed #e2e8f0" }}>
          <FolderOpen className="h-10 w-10 mx-auto mb-3 text-slate-300" />
          <p className="font-medium text-muted-foreground">No cases yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click New Case to start tracking a visa application.</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="space-y-4 mb-8">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Active & Pending</h2>
              {active.map(c => {
                const cfg = statusConfig[c.status];
                const Icon = cfg.icon;
                return (
                  <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(c)}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="info" className="text-xs">{c.visa_type}</Badge>
                            <Badge variant={cfg.badge} className="text-xs"><Icon className="mr-1 h-3 w-3" />{cfg.badge === "success" ? "Active" : "Pending"}</Badge>
                          </div>
                          <h3 className="font-semibold mt-2">{c.title}</h3>
                          {c.receipt_number && <p className="text-xs text-muted-foreground mt-1">Receipt: <span className="font-mono">{c.receipt_number}</span></p>}
                        </div>
                      </div>
                      {(c.start_date || c.expiry_date) && (
                        <div className="mt-3 flex gap-4 text-xs text-muted-foreground border-t pt-3">
                          {c.start_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Start: {format(new Date(c.start_date), "MMM d, yyyy")}</span>}
                          {c.expiry_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Expires: {format(new Date(c.expiry_date), "MMM d, yyyy")}</span>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {historical.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Historical</h2>
              {historical.map(c => {
                const cfg = statusConfig[c.status];
                const Icon = cfg.icon;
                return (
                  <Card key={c.id} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setSelected(c)}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${cfg.color}`} />
                        <div>
                          <p className="font-medium text-sm">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.visa_type}</p>
                        </div>
                      </div>
                      <Badge variant={cfg.badge} className="text-xs capitalize">{c.status}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add Case Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Case</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Visa Type</Label>
              <Select value={form.visa_type} onValueChange={v => setForm(f => ({ ...f, visa_type: v }))}>
                <SelectTrigger><SelectValue placeholder="Select visa type..." /></SelectTrigger>
                <SelectContent>{VISA_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Case Title</Label>
              <Input placeholder="e.g. OPT Application Spring 2026" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as CaseStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Receipt # (optional)</Label>
                <Input placeholder="IOE..." value={form.receipt_number} onChange={e => setForm(f => ({ ...f, receipt_number: e.target.value.toUpperCase() }))} className="font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Expiry Date</Label>
                <Input type="date" value={form.expiry_date} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Textarea placeholder="Any details..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="resize-none" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addCase} disabled={!form.visa_type || !form.title || saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Create Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Case Detail Dialog */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge variant="info">{selected.visa_type}</Badge>
                {selected.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={statusConfig[selected.status].badge} className="capitalize">{selected.status}</Badge>
              </div>
              {selected.receipt_number && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Receipt #</span>
                  <span className="font-mono text-sm">{selected.receipt_number}</span>
                </div>
              )}
              {selected.start_date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="text-sm">{format(new Date(selected.start_date), "MMMM d, yyyy")}</span>
                </div>
              )}
              {selected.expiry_date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expiry Date</span>
                  <span className="text-sm">{format(new Date(selected.expiry_date), "MMMM d, yyyy")}</span>
                </div>
              )}
              {selected.notes && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selected.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="destructive" size="sm" onClick={() => removeCase(selected.id)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete Case
              </Button>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

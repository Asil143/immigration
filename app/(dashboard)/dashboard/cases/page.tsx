"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Plus, FolderOpen, Clock, CheckCircle2, XCircle,
  Calendar, FileText, AlertCircle, ChevronRight, MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import type { VisaCase, CaseStatus, VisaType } from "@/types";

const MOCK_CASES: (VisaCase & { progress: number; next_step: string })[] = [
  {
    id: "1", user_id: "u1",
    visa_type: "OPT", title: "OPT Application (Spring 2025)",
    status: "active", receipt_number: "IOE0912345678",
    start_date: "2025-01-15", expiry_date: "2026-01-14",
    progress: 75, next_step: "Waiting for EAD card delivery",
    notes: "Applied 90 days before graduation. Receipt received.",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "2", user_id: "u1",
    visa_type: "STEM-OPT", title: "STEM OPT Extension",
    status: "pending", receipt_number: null,
    start_date: null, expiry_date: "2026-01-14",
    progress: 20, next_step: "Get employer to sign I-983 Training Plan",
    notes: "Need to file 90 days before OPT expires.",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "3", user_id: "u1",
    visa_type: "H-1B", title: "H-1B Cap Registration FY2026",
    status: "pending", receipt_number: "WAC2512345678",
    start_date: null, expiry_date: null,
    progress: 40, next_step: "Waiting for lottery results (late March)",
    notes: "Registered by employer. Specialty occupation: Software Engineer.",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "4", user_id: "u1",
    visa_type: "F-1", title: "F-1 Student Status",
    status: "approved", receipt_number: null,
    start_date: "2022-08-20", expiry_date: "2025-05-15",
    progress: 100, next_step: "Graduated — now on OPT",
    notes: "Program completed. Grace period active until OPT starts.",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];

const statusConfig: Record<CaseStatus, { label: string; icon: React.ElementType; color: string; badge: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  active:   { label: "Active",   icon: CheckCircle2, color: "text-green-600",  badge: "success"     },
  pending:  { label: "Pending",  icon: Clock,        color: "text-yellow-600", badge: "warning"     },
  approved: { label: "Approved", icon: CheckCircle2, color: "text-blue-600",  badge: "info"        },
  denied:   { label: "Denied",   icon: XCircle,      color: "text-red-600",   badge: "destructive" },
  expired:  { label: "Expired",  icon: AlertCircle,  color: "text-slate-500", badge: "secondary"   },
  archived: { label: "Archived", icon: FolderOpen,   color: "text-slate-400", badge: "outline"     },
};

const VISA_TYPES: VisaType[] = ["F-1","OPT","STEM-OPT","H-1B","H-4","J-1","L-1","O-1","EB-1","EB-2","EB-3","Other"];

export default function CasesPage() {
  const [cases, setCases] = useState(MOCK_CASES);
  const [open, setOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<typeof MOCK_CASES[0] | null>(null);
  const [form, setForm] = useState({ visa_type: "" as VisaType, title: "", notes: "" });

  function addCase() {
    if (!form.visa_type || !form.title) return;
    setCases(prev => [...prev, {
      id: Date.now().toString(), user_id: "u1",
      visa_type: form.visa_type, title: form.title, status: "pending",
      receipt_number: null, start_date: null, expiry_date: null,
      progress: 0, next_step: "Set up your case details",
      notes: form.notes || null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }]);
    setForm({ visa_type: "" as VisaType, title: "", notes: "" });
    setOpen(false);
  }

  const active = cases.filter(c => c.status === "active" || c.status === "pending");
  const historical = cases.filter(c => c.status === "approved" || c.status === "denied" || c.status === "expired" || c.status === "archived");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Cases</h1>
          <p className="mt-1 text-muted-foreground">Track all your visa applications and status</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Case
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {[
          { label: "Active", value: cases.filter(c=>c.status==="active").length, color: "text-green-600" },
          { label: "Pending", value: cases.filter(c=>c.status==="pending").length, color: "text-yellow-600" },
          { label: "Approved", value: cases.filter(c=>c.status==="approved").length, color: "text-blue-600" },
          { label: "Total", value: cases.length, color: "text-foreground" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active cases */}
      <div className="space-y-4 mb-8">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Active & Pending</h2>
        {active.map(c => {
          const cfg = statusConfig[c.status];
          const Icon = cfg.icon;
          return (
            <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCase(c)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="info" className="text-xs">{c.visa_type}</Badge>
                      <Badge variant={cfg.badge} className="text-xs">
                        <Icon className="mr-1 h-3 w-3" />{cfg.label}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mt-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                      {c.next_step}
                    </p>
                    {c.receipt_number && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Receipt: <span className="font-mono">{c.receipt_number}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 w-28">
                    <p className="text-xs text-muted-foreground mb-1">{c.progress}% complete</p>
                    <Progress value={c.progress} className="h-1.5" />
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

      {/* Historical */}
      {historical.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Historical</h2>
          {historical.map(c => {
            const cfg = statusConfig[c.status];
            const Icon = cfg.icon;
            return (
              <Card key={c.id} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setSelectedCase(c)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${cfg.color}`} />
                    <div>
                      <p className="font-medium text-sm">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.visa_type}</p>
                    </div>
                  </div>
                  <Badge variant={cfg.badge} className="text-xs">{cfg.label}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add case dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Case</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Visa Type</Label>
              <Select value={form.visa_type} onValueChange={v => setForm(f => ({ ...f, visa_type: v as VisaType }))}>
                <SelectTrigger><SelectValue placeholder="Select visa type..." /></SelectTrigger>
                <SelectContent>
                  {VISA_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Case Title</Label>
              <Input placeholder="e.g. OPT Application Spring 2025" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Textarea placeholder="Add any details about this case..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="resize-none" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addCase} disabled={!form.visa_type || !form.title}>Create Case</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Case detail dialog */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge variant="info">{selectedCase.visa_type}</Badge>
                {selectedCase.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={statusConfig[selectedCase.status].badge}>{statusConfig[selectedCase.status].label}</Badge>
              </div>
              {selectedCase.receipt_number && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Receipt #</span>
                  <span className="font-mono text-sm">{selectedCase.receipt_number}</span>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progress</p>
                <Progress value={selectedCase.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{selectedCase.progress}%</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-xs font-medium text-blue-800">Next Step</p>
                <p className="text-sm text-blue-700 mt-0.5">{selectedCase.next_step}</p>
              </div>
              {selectedCase.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedCase.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

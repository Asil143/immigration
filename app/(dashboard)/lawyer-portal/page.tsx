"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Scale, Users, Calendar, DollarSign, Star, MessageCircle, Clock, CheckCircle2,
  AlertCircle, TrendingUp, Plus, Search, Bell, Settings, Eye, Phone, Mail, Video,
} from "lucide-react";

const MOCK_LEADS = [
  { id: "1", name: "Raj Patel", email: "raj@email.com", type: "H-1B Transfer", urgency: "high", date: "Today", message: "I need help with an H-1B transfer from my current employer. RFE received last week.", status: "new" },
  { id: "2", name: "Li Wei", email: "liwei@email.com", type: "EB-2 NIW", urgency: "medium", date: "Yesterday", message: "Looking for guidance on self-petition National Interest Waiver.", status: "new" },
  { id: "3", name: "Priya Sharma", email: "priya@email.com", type: "Green Card (EB-3)", urgency: "low", date: "2 days ago", message: "My employer filed I-140 for EB-3. Need help with I-485 filing.", status: "contacted" },
  { id: "4", name: "Carlos Mendez", email: "carlos@email.com", type: "F-1 to H-1B Cap", urgency: "high", date: "3 days ago", message: "OPT expires in 3 months. Need H-1B cap filing support.", status: "in_progress" },
  { id: "5", name: "Aisha Okonkwo", email: "aisha@email.com", type: "J-1 Waiver", urgency: "medium", date: "1 week ago", message: "Seeking Conrad 30 waiver — currently on J-1 as a physician.", status: "in_progress" },
];

const MOCK_CONSULTS = [
  { id: "1", name: "Raj Patel", type: "Initial Consultation", date: "Jun 2, 2026", time: "2:00 PM", duration: "30 min", mode: "video", status: "upcoming" },
  { id: "2", name: "Carlos Mendez", type: "Document Review", date: "Jun 3, 2026", time: "10:00 AM", duration: "60 min", mode: "phone", status: "upcoming" },
  { id: "3", name: "Priya Sharma", type: "I-485 Prep", date: "May 28, 2026", time: "3:00 PM", duration: "45 min", mode: "video", status: "completed" },
  { id: "4", name: "Daniel Park", type: "Initial Consultation", date: "May 27, 2026", time: "11:00 AM", duration: "30 min", mode: "video", status: "completed" },
];

const MOCK_REVIEWS = [
  { name: "Raj P.", rating: 5, text: "Extremely knowledgeable and responsive. Helped me navigate a complex H-1B RFE in just 3 days.", date: "May 2026" },
  { name: "Sarah K.", rating: 5, text: "Best immigration lawyer I've worked with. Clear explanations and very organized process.", date: "Apr 2026" },
  { name: "Mei L.", rating: 4, text: "Great guidance on my EB-2 NIW case. Timely responses and professional.", date: "Mar 2026" },
];

const urgencyConfig = {
  high:   { label: "Urgent", color: "bg-red-100 text-red-700 border-red-200" },
  medium: { label: "Standard", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  low:    { label: "Low", color: "bg-green-100 text-green-700 border-green-200" },
};

const statusConfig = {
  new:         { label: "New Lead", color: "bg-blue-100 text-blue-700" },
  contacted:   { label: "Contacted", color: "bg-purple-100 text-purple-700" },
  in_progress: { label: "In Progress", color: "bg-orange-100 text-orange-700" },
  completed:   { label: "Completed", color: "bg-green-100 text-green-700" },
};

export default function LawyerPortalPage() {
  const [leadSearch, setLeadSearch] = useState("");

  const filteredLeads = MOCK_LEADS.filter(l =>
    !leadSearch ||
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.type.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const newLeads = MOCK_LEADS.filter(l => l.status === "new").length;
  const upcomingConsults = MOCK_CONSULTS.filter(c => c.status === "upcoming").length;
  const avgRating = (MOCK_REVIEWS.reduce((a, r) => a + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Lawyer Portal</h1>
            <p className="text-muted-foreground text-sm">Manage your leads, consultations, and profile</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" /> {newLeads} new
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Users, label: "Active Leads", value: MOCK_LEADS.length.toString(), sub: `${newLeads} new today`, color: "text-blue-600 bg-blue-50" },
          { icon: Calendar, label: "Upcoming Consults", value: upcomingConsults.toString(), sub: "Next: Jun 2", color: "text-purple-600 bg-purple-50" },
          { icon: DollarSign, label: "This Month", value: "$4,800", sub: "+12% vs last month", color: "text-green-600 bg-green-50" },
          { icon: Star, label: "Avg Rating", value: avgRating, sub: `${MOCK_REVIEWS.length} reviews`, color: "text-orange-600 bg-orange-50" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${s.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-black">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">{s.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="leads">
        <TabsList className="mb-5">
          <TabsTrigger value="leads">
            Client Leads <Badge variant="secondary" className="ml-2 text-[10px]">{MOCK_LEADS.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        {/* Leads */}
        <TabsContent value="leads">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={leadSearch} onChange={e => setLeadSearch(e.target.value)} placeholder="Search leads..." className="pl-9" />
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Lead
            </Button>
          </div>

          <div className="space-y-3">
            {filteredLeads.map(lead => {
              const urg = urgencyConfig[lead.urgency as keyof typeof urgencyConfig];
              const stat = statusConfig[lead.status as keyof typeof statusConfig];
              return (
                <Card key={lead.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {lead.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">{lead.name}</p>
                            <Badge className={`text-[10px] border ${urg.color}`}>{urg.label}</Badge>
                            <Badge className={`text-[10px] ${stat.color}`}>{stat.label}</Badge>
                          </div>
                          <p className="text-xs text-primary font-medium mt-0.5">{lead.type}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-4 line-clamp-2">{lead.message}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">{lead.email} · {lead.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <MessageCircle className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" className="h-7 px-2 text-xs">
                          <Phone className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Calendar */}
        <TabsContent value="calendar">
          <div className="space-y-3">
            {MOCK_CONSULTS.map(c => (
              <Card key={c.id} className={c.status === "completed" ? "opacity-60" : ""}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`rounded-xl p-3 shrink-0 ${c.status === "upcoming" ? "bg-primary/10 text-primary" : "bg-slate-100 text-muted-foreground"}`}>
                    {c.mode === "video" ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{c.name}</p>
                      <Badge variant={c.status === "upcoming" ? "info" : "secondary"} className="text-[10px]">
                        {c.status === "upcoming" ? "Upcoming" : "Completed"}
                      </Badge>
                    </div>
                    <p className="text-xs text-primary font-medium">{c.type}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {c.date} at {c.time}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
                    </div>
                  </div>
                  {c.status === "upcoming" && (
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="h-7 text-xs">Reschedule</Button>
                      <Button size="sm" className="h-7 text-xs">Join</Button>
                    </div>
                  )}
                  {c.status === "completed" && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  )}
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Availability Block
            </Button>
          </div>
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews">
          <div className="flex items-center gap-6 mb-5 p-4 rounded-xl bg-slate-50 border">
            <div className="text-center">
              <p className="text-4xl font-black text-primary">{avgRating}</p>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-4 w-4 ${parseFloat(avgRating) >= i ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{MOCK_REVIEWS.length} reviews</p>
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div className="flex-1 space-y-1.5">
              {[5,4,3,2,1].map(star => {
                const count = MOCK_REVIEWS.filter(r => r.rating === star).length;
                const pct = (count / MOCK_REVIEWS.length) * 100;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-muted-foreground">{star}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-4 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-3">
            {MOCK_REVIEWS.map((r, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {r.name[0]}
                      </div>
                      <p className="font-semibold text-sm">{r.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`h-3.5 w-3.5 ${r.rating >= i ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-5">{r.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-black text-primary">
                  JD
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold">Jane Doe, Esq.</p>
                  <p className="text-sm text-muted-foreground">Immigration Attorney · New York, NY</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["H-1B", "EB-2/3", "NIW", "F-1/OPT", "J-1 Waiver"].map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm">Edit Profile</Button>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Bar Number", value: "NY-123456" },
                  { label: "Years Experience", value: "12 years" },
                  { label: "Initial Consult", value: "$150 / 30 min" },
                  { label: "Languages", value: "English, Hindi, Spanish" },
                  { label: "Response Time", value: "Within 2 hours" },
                  { label: "Profile Status", value: "Active & Verified" },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="font-medium mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Bio</p>
                <p className="text-sm text-muted-foreground leading-5">
                  Experienced immigration attorney specializing in employment-based visas for tech professionals. Former USCIS consultant with over 1,000 successful H-1B, EB-2, and NIW cases. Based in New York with clients across the US.
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Profile is verified and visible to clients</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-100">
                  View Public Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

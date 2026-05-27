"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Search, Star, MapPin, Languages, Scale, Shield, CheckCircle2,
  Calendar, Clock, MessageSquare, ChevronRight, Award, Video,
} from "lucide-react";
import type { Lawyer, LawyerSpecialization } from "@/types";

type MockLawyer = Lawyer & { about_blurb: string; review_snippets: { author: string; text: string; rating: number }[] };

const MOCK_LAWYERS: MockLawyer[] = [
  {
    id: "1", user_id: "l1",
    full_name: "James R. Martinez",
    avatar_url: null,
    bar_number: "CA123456",
    state_licensed: ["California", "New York"],
    specializations: ["H-1B/Work Visas", "Green Card", "F-1/Student Visas"] as LawyerSpecialization[],
    bio: "15 years of experience specializing in employment-based immigration for tech workers. Former USCIS adjudicator. Offices in San Jose and New York.",
    about_blurb: "Former USCIS adjudicator with deep inside knowledge of how applications are evaluated.",
    hourly_rate: 450,
    consultation_fee: 150,
    years_experience: 15,
    languages: ["English", "Spanish"],
    rating: 4.9,
    review_count: 142,
    is_verified: true,
    is_featured: true,
    calendly_url: null,
    created_at: new Date().toISOString(),
    review_snippets: [
      { author: "Priya S.", text: "Got my H-1B approved on first try. James knew exactly what USCIS was looking for.", rating: 5 },
      { author: "Wei C.", text: "Helped me navigate a complicated RFE. Very responsive and professional.", rating: 5 },
    ],
  },
  {
    id: "2", user_id: "l2",
    full_name: "Sarah J. Kim",
    avatar_url: null,
    bar_number: "TX987654",
    state_licensed: ["Texas", "Washington"],
    specializations: ["F-1/Student Visas", "H-1B/Work Visas", "Naturalization"] as LawyerSpecialization[],
    bio: "Specializing in F-1 and OPT cases for international students. Worked with top universities in Texas. Speaks Korean and English.",
    about_blurb: "Dedicated to helping international students transition from F-1 to work authorization successfully.",
    hourly_rate: 350,
    consultation_fee: 100,
    years_experience: 8,
    languages: ["English", "Korean"],
    rating: 4.8,
    review_count: 89,
    is_verified: true,
    is_featured: false,
    calendly_url: null,
    created_at: new Date().toISOString(),
    review_snippets: [
      { author: "Min-jun L.", text: "Sarah guided me through OPT to H-1B cap-gap. Clear explanations, very affordable.", rating: 5 },
    ],
  },
  {
    id: "3", user_id: "l3",
    full_name: "David P. Nguyen",
    avatar_url: null,
    bar_number: "WA456123",
    state_licensed: ["Washington", "Oregon"],
    specializations: ["Green Card", "EB-1", "Asylum"] as LawyerSpecialization[],
    bio: "10 years focused on EB-1 extraordinary ability and NIW petitions for researchers and scientists. Published author on immigration law.",
    about_blurb: "Expert in building extraordinary ability cases for researchers, academics, and scientists.",
    hourly_rate: 500,
    consultation_fee: 200,
    years_experience: 10,
    languages: ["English", "Vietnamese"],
    rating: 4.9,
    review_count: 67,
    is_verified: true,
    is_featured: true,
    calendly_url: null,
    created_at: new Date().toISOString(),
    review_snippets: [
      { author: "Dr. Fatima A.", text: "David structured my EB-2 NIW petition brilliantly. Approved in 8 months.", rating: 5 },
    ],
  },
  {
    id: "4", user_id: "l4",
    full_name: "Maria L. Chen",
    avatar_url: null,
    bar_number: "IL789321",
    state_licensed: ["Illinois", "Michigan"],
    specializations: ["Family Immigration", "Naturalization", "H-1B/Work Visas"] as LawyerSpecialization[],
    bio: "Full-service immigration firm focused on family-based and employment immigration. Chicago-based with remote consultations nationwide.",
    about_blurb: "Comprehensive family and employment immigration services with flat-fee structures.",
    hourly_rate: 300,
    consultation_fee: 75,
    years_experience: 12,
    languages: ["English", "Mandarin", "Spanish"],
    rating: 4.7,
    review_count: 204,
    is_verified: true,
    is_featured: false,
    calendly_url: null,
    created_at: new Date().toISOString(),
    review_snippets: [
      { author: "Carlos M.", text: "Affordable and very organized. Helped my whole family navigate the green card process.", rating: 5 },
    ],
  },
];

const SPECIALIZATIONS: LawyerSpecialization[] = [
  "F-1/Student Visas", "H-1B/Work Visas", "Green Card",
  "Family Immigration", "Deportation Defense", "Asylum", "Naturalization", "Business Immigration",
];

export default function LawyersPage() {
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("all");
  const [lang, setLang] = useState("all");
  const [selected, setSelected] = useState<MockLawyer | null>(null);

  const filtered = MOCK_LAWYERS.filter(l => {
    const matchSearch = !search ||
      l.full_name.toLowerCase().includes(search.toLowerCase()) ||
      l.bio.toLowerCase().includes(search.toLowerCase());
    const matchSpec = spec === "all" || l.specializations.includes(spec as LawyerSpecialization);
    const matchLang = lang === "all" || l.languages.includes(lang);
    return matchSearch && matchSpec && matchLang;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Find an Immigration Attorney</h1>
        <p className="mt-1 text-muted-foreground">
          All attorneys are bar-verified. Transparent rates, no hidden fees.
        </p>
      </div>

      {/* Trust bar */}
      <div className="flex flex-wrap gap-6 mb-8 text-sm text-muted-foreground">
        {[
          { icon: Shield, text: "Bar-number verified" },
          { icon: CheckCircle2, text: "Reviewed by clients" },
          { icon: Video, text: "Video consultations available" },
          { icon: Award, text: "Specialization-matched" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-1.5">
            <Icon className="h-4 w-4 text-green-500" />{text}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or specialty..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={spec} onValueChange={setSpec}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All specializations</SelectItem>
            {SPECIALIZATIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any language</SelectItem>
            {["English", "Spanish", "Mandarin", "Korean", "Vietnamese", "Hindi"].map(l => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lawyer cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {filtered.map(lawyer => (
          <Card key={lawyer.id} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setSelected(lawyer)}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                    {lawyer.full_name.split(" ").map(n => n[0]).slice(0,2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold">{lawyer.full_name}</h3>
                        {lawyer.is_verified && (
                          <Shield className="h-4 w-4 text-blue-500" aria-label="Bar-verified" />
                        )}
                        {lawyer.is_featured && (
                          <Badge variant="info" className="text-xs">Featured</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{lawyer.rating}</span>
                        <span className="text-xs text-muted-foreground">({lawyer.review_count} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary">${lawyer.consultation_fee}</p>
                      <p className="text-xs text-muted-foreground">consultation</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{lawyer.about_blurb}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {lawyer.specializations.slice(0, 3).map(s => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{lawyer.state_licensed.join(", ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Languages className="h-3 w-3" />{lawyer.languages.join(", ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />{lawyer.years_experience} years exp.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1" onClick={e => { e.stopPropagation(); setSelected(lawyer); }}>
                  <Calendar className="mr-2 h-4 w-4" /> Book Consultation
                </Button>
                <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); setSelected(lawyer); }}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Scale className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No attorneys match your filters. Try adjusting your search.</p>
        </div>
      )}

      {/* Lawyer detail dialog */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="sr-only">{selected.full_name}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({selected.review_count})</TabsTrigger>
                <TabsTrigger value="book">Book</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="flex gap-4 mb-5">
                  <Avatar className="h-16 w-16 shrink-0">
                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                      {selected.full_name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{selected.full_name}</h2>
                      {selected.is_verified && <Shield className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {Array.from({length:5}).map((_,i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(selected.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                      ))}
                      <span className="text-sm font-semibold ml-1">{selected.rating}</span>
                      <span className="text-sm text-muted-foreground">({selected.review_count})</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selected.state_licensed.join(", ")}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{selected.years_experience} yrs</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">{selected.bio}</p>

                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2">Specializations</p>
                    <div className="space-y-1">
                      {selected.specializations.map(s => (
                        <div key={s} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Languages</p>
                    <div className="space-y-1">
                      {selected.languages.map(l => (
                        <div key={l} className="flex items-center gap-2">
                          <Languages className="h-4 w-4 text-blue-500" />
                          <span>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xl font-bold text-primary">${selected.consultation_fee}</p>
                    <p className="text-xs text-muted-foreground">Consultation</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xl font-bold">${selected.hourly_rate}</p>
                    <p className="text-xs text-muted-foreground">Per hour</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xl font-bold">{selected.review_count}</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-4">
                  {selected.review_snippets.map((rev, i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">{rev.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{rev.author}</span>
                        <div className="flex ml-auto">
                          {Array.from({length: rev.rating}).map((_,j) => (
                            <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{rev.text}"</p>
                    </div>
                  ))}
                  <p className="text-center text-sm text-muted-foreground">
                    Showing {selected.review_snippets.length} of {selected.review_count} reviews
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="book">
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="font-semibold text-blue-900">Book a {30}-minute consultation</p>
                    <p className="text-sm text-blue-700 mt-1">
                      ${selected.consultation_fee} · Video call via secure link · Secure payment
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["Mon Jun 2", "Tue Jun 3", "Wed Jun 4", "Thu Jun 5", "Fri Jun 6"].map(d => (
                      <button key={d} className="rounded-lg border p-3 text-xs text-center hover:border-primary hover:bg-primary/5 transition-colors">
                        {d}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"].map(t => (
                      <button key={t} className="rounded-lg border p-2 text-xs text-center hover:border-primary hover:bg-primary/5 transition-colors">
                        {t} ET
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />Book for ${selected.consultation_fee}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

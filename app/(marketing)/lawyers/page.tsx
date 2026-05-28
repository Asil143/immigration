"use client";

import { useState, useMemo } from "react";
import {
  Search, Star, MapPin, Shield, CheckCircle2, Calendar, Clock,
  Video, Award, ChevronRight, Users, DollarSign, Filter, X,
} from "lucide-react";

const attorneys = [
  {
    id: "1",
    name: "James R. Martinez",
    initials: "JM",
    color: "#1d4ed8",
    bg: "#eff6ff",
    title: "Senior Immigration Partner",
    firm: "Martinez Immigration Law",
    location: "San Jose, CA",
    licensed: ["California", "New York"],
    languages: ["English", "Spanish"],
    experience: 15,
    rating: 4.9,
    reviews: 142,
    verified: true,
    featured: true,
    specializations: ["H-1B", "EB-2 NIW", "RFE Response", "Green Card"],
    bio: "Former USCIS adjudicator. 15 years specializing in tech worker immigration. Deep knowledge of how USCIS evaluates H-1B specialty occupation cases.",
    services: [
      { name: "H-1B Extension Filing", price: 1800, duration: "6–8 weeks" },
      { name: "H-1B Initial Petition", price: 2400, duration: "8–12 weeks" },
      { name: "RFE Response (H-1B)", price: 1200, duration: "2–4 weeks" },
      { name: "Free 15-min Consult", price: 0, duration: "15 minutes" },
    ],
    availability: "Next available: Tomorrow",
    responseTime: "Responds within 2 hours",
  },
  {
    id: "2",
    name: "Sarah J. Kim",
    initials: "SK",
    color: "#6d28d9",
    bg: "#faf5ff",
    title: "Immigration Attorney",
    firm: "Kim & Associates",
    location: "New York, NY",
    licensed: ["New York", "New Jersey"],
    languages: ["English", "Korean", "Mandarin"],
    experience: 10,
    rating: 4.8,
    reviews: 98,
    verified: true,
    featured: true,
    specializations: ["F-1/OPT", "H-1B", "O-1A", "EB-1A"],
    bio: "Specialist in student visa transitions and extraordinary ability petitions. Successfully filed 200+ O-1A cases for researchers and startup founders.",
    services: [
      { name: "OPT/STEM OPT Guidance", price: 400, duration: "1 week" },
      { name: "O-1A Petition Filing", price: 3200, duration: "10–14 weeks" },
      { name: "EB-1A Self-Petition", price: 4500, duration: "16–20 weeks" },
      { name: "Free 15-min Consult", price: 0, duration: "15 minutes" },
    ],
    availability: "Next available: In 3 days",
    responseTime: "Responds within 4 hours",
  },
  {
    id: "3",
    name: "David Chen",
    initials: "DC",
    color: "#15803d",
    bg: "#f0fdf4",
    title: "Immigration & Business Law",
    firm: "Chen Legal Group",
    location: "Seattle, WA",
    licensed: ["Washington", "California"],
    languages: ["English", "Mandarin", "Cantonese"],
    experience: 12,
    rating: 4.9,
    reviews: 211,
    verified: true,
    featured: false,
    specializations: ["EB-2 NIW", "EB-1A", "L-1", "Green Card"],
    bio: "Focused on self-petition green cards for researchers and engineers. Published author on NIW strategy. 95% approval rate on EB-2 NIW petitions.",
    services: [
      { name: "EB-2 NIW Petition", price: 3800, duration: "12–16 weeks" },
      { name: "EB-1A Petition", price: 4800, duration: "14–18 weeks" },
      { name: "L-1A/L-1B Transfer", price: 2200, duration: "8–12 weeks" },
      { name: "Free 15-min Consult", price: 0, duration: "15 minutes" },
    ],
    availability: "Next available: This week",
    responseTime: "Responds within 6 hours",
  },
  {
    id: "4",
    name: "Priya Nair",
    initials: "PN",
    color: "#c2410c",
    bg: "#fff7ed",
    title: "Immigration Attorney",
    firm: "Nair Immigration PLLC",
    location: "Houston, TX",
    licensed: ["Texas", "Florida"],
    languages: ["English", "Hindi", "Tamil"],
    experience: 8,
    rating: 4.7,
    reviews: 76,
    verified: true,
    featured: false,
    specializations: ["H-1B", "H-4 EAD", "I-485", "Advance Parole"],
    bio: "Specialist in H-4 EAD and pending I-485 cases. Helps dependent spouses get work authorization and advises on safe travel for adjustment of status applicants.",
    services: [
      { name: "H-4 EAD Application", price: 900, duration: "4–6 weeks" },
      { name: "I-485 Filing Package", price: 3500, duration: "Full process" },
      { name: "Advance Parole (I-131)", price: 750, duration: "3–4 weeks" },
      { name: "Free 15-min Consult", price: 0, duration: "15 minutes" },
    ],
    availability: "Next available: Tomorrow",
    responseTime: "Responds within 3 hours",
  },
  {
    id: "5",
    name: "Maria Santos",
    initials: "MS",
    color: "#0891b2",
    bg: "#ecfeff",
    title: "Healthcare Immigration Specialist",
    firm: "Santos Law Firm",
    location: "Chicago, IL",
    licensed: ["Illinois", "Michigan"],
    languages: ["English", "Spanish", "Portuguese"],
    experience: 11,
    rating: 4.8,
    reviews: 134,
    verified: true,
    featured: false,
    specializations: ["J-1 Waiver", "O-1 (Healthcare)", "EB-2 NIW", "Conrad 30"],
    bio: "Exclusive focus on healthcare worker immigration. Expert in Conrad 30 J-1 waivers and physician green cards. Works with Mayo Clinic, Northwestern, and major hospital systems.",
    services: [
      { name: "J-1 Conrad 30 Waiver", price: 4200, duration: "16–24 weeks" },
      { name: "Physician EB-2 NIW", price: 4000, duration: "12–16 weeks" },
      { name: "O-1 for Physicians", price: 3600, duration: "10–14 weeks" },
      { name: "Free 15-min Consult", price: 0, duration: "15 minutes" },
    ],
    availability: "Next available: In 5 days",
    responseTime: "Responds within 8 hours",
  },
  {
    id: "6",
    name: "Rahul Kapoor",
    initials: "RK",
    color: "#9333ea",
    bg: "#fdf4ff",
    title: "Corporate Immigration Attorney",
    firm: "Kapoor & Partners",
    location: "San Francisco, CA",
    licensed: ["California"],
    languages: ["English", "Hindi", "Punjabi"],
    experience: 14,
    rating: 4.9,
    reviews: 189,
    verified: true,
    featured: true,
    specializations: ["EB-1C", "L-1A", "PERM", "Green Card"],
    bio: "Specializes in EB-1C multinational manager green cards. Helps tech managers transferred to US offices bypass the India EB-2/EB-3 backlog entirely.",
    services: [
      { name: "EB-1C Petition", price: 4200, duration: "12–16 weeks" },
      { name: "PERM Labor Certification", price: 3000, duration: "12–18 months" },
      { name: "I-140 + I-485 Bundle", price: 5500, duration: "Full process" },
      { name: "Free 15-min Consult", price: 0, duration: "15 minutes" },
    ],
    availability: "Next available: Next week",
    responseTime: "Responds within 24 hours",
  },
];

const SPECIALIZATIONS = ["All", "H-1B", "EB-2 NIW", "EB-1A", "EB-1C", "O-1A", "L-1", "F-1/OPT", "J-1 Waiver", "I-485", "PERM", "Green Card"];
const LOCATIONS = ["All Locations", "California", "New York", "Texas", "Washington", "Illinois", "Florida"];

export default function LawyersMarketplacePage() {
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("All");
  const [location, setLocation] = useState("All Locations");
  const [selected, setSelected] = useState<typeof attorneys[0] | null>(null);
  const [bookedId, setBookedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return attorneys.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.specializations.some(s => s.toLowerCase().includes(q)) || a.bio.toLowerCase().includes(q);
      const matchSpec = spec === "All" || a.specializations.includes(spec);
      const matchLoc = location === "All Locations" || a.licensed.includes(location);
      return matchSearch && matchSpec && matchLoc;
    });
  }, [search, spec, location]);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

      {/* Hero */}
      <section className="py-14" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#93c5fd" }}>
            <Shield className="h-4 w-4" />
            Verified Immigration Attorneys
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Attorney Marketplace</h1>
          <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            Fixed-fee immigration services. No hourly billing surprises. Every attorney verified and vetted.
          </p>
          <div className="flex justify-center gap-8">
            {[["6", "Verified attorneys"], ["Fixed fees", "No hourly billing"], ["12%", "Platform fee only"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{val}</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-6xl">

        {/* Trust bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 p-4 rounded-2xl" style={{ backgroundColor: "#f8fafc" }}>
          {[
            { icon: Shield, text: "All attorneys bar-verified" },
            { icon: DollarSign, text: "Fixed fees — no surprises" },
            { icon: CheckCircle2, text: "Free 15-min consult with every attorney" },
            { icon: Award, text: "Average 4.8★ rating across 850+ reviews" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm font-medium" style={{ color: "#475569" }}>
              <Icon className="h-4 w-4 text-blue-600" />
              {text}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search by name, specialty, or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: "#e2e8f0" }}
            />
          </div>
          <select value={spec} onChange={e => setSpec(e.target.value)} className="px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }}>
            {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={location} onChange={e => setLocation(e.target.value)} className="px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }}>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <p className="text-sm mb-5" style={{ color: "#94a3b8" }}>{filtered.length} attorneys found</p>

        {/* Listings */}
        <div className="space-y-4">
          {filtered.map(attorney => (
            <div key={attorney.id} className="rounded-2xl border overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
              <div className="p-5 flex flex-col sm:flex-row gap-5">
                {/* Avatar */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="relative shrink-0">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: attorney.color }}>
                      {attorney.initials}
                    </div>
                    {attorney.verified && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#2563eb" }}>
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold">{attorney.name}</h3>
                          {attorney.featured && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#fef9c3", color: "#92400e" }}>Featured</span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: "#64748b" }}>{attorney.title} · {attorney.firm}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">{attorney.rating}</span>
                        <span className="text-xs" style={{ color: "#94a3b8" }}>({attorney.reviews})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: "#64748b" }}>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{attorney.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{attorney.experience} yrs exp</span>
                      <span className="flex items-center gap-1"><Video className="h-3 w-3" />{attorney.responseTime}</span>
                    </div>

                    <p className="text-xs mt-2 leading-relaxed" style={{ color: "#475569" }}>{attorney.bio}</p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {attorney.specializations.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: attorney.bg, color: attorney.color }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Services preview */}
                <div className="sm:w-64 shrink-0">
                  <p className="text-xs font-semibold mb-2" style={{ color: "#475569" }}>Fixed-Fee Services</p>
                  <div className="space-y-1.5 mb-3">
                    {attorney.services.slice(0, 3).map(svc => (
                      <div key={svc.name} className="flex items-center justify-between text-xs">
                        <span style={{ color: "#475569" }}>{svc.name}</span>
                        <span className="font-bold ml-2" style={{ color: svc.price === 0 ? "#16a34a" : "#0f172a" }}>
                          {svc.price === 0 ? "Free" : `$${svc.price.toLocaleString()}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] mb-3" style={{ color: "#16a34a" }}>✓ {attorney.availability}</p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelected(attorney)}
                      className="py-2 rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: attorney.color }}
                    >
                      View Profile & Book
                    </button>
                    <button
                      onClick={() => setBookedId(attorney.id)}
                      className="py-2 rounded-xl text-sm font-semibold border"
                      style={{ borderColor: "#e2e8f0", color: "#475569" }}
                    >
                      {bookedId === attorney.id ? "✓ Consult Booked!" : "Book Free Consult"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-16 mb-10">
          <h2 className="text-2xl font-bold text-center mb-8">How the Marketplace Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Book a free 15-min consult", desc: "Every attorney offers a free intro call. Explain your situation and get a clear answer on whether they can help.", color: "#eff6ff", textColor: "#1d4ed8" },
              { step: "2", title: "Get a fixed-fee quote", desc: "No hourly billing. Every service has a fixed price upfront — H-1B extension, NIW petition, RFE response. You know the total before you start.", color: "#f0fdf4", textColor: "#15803d" },
              { step: "3", title: "Pay securely through VisaPilot", desc: "Payment is held in escrow until your filing is submitted. We charge a 12% platform fee — already included in the listed price.", color: "#faf5ff", textColor: "#6d28d9" },
            ].map(s => (
              <div key={s.step} className="p-5 rounded-2xl" style={{ backgroundColor: s.color }}>
                <div className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white mb-3" style={{ backgroundColor: s.textColor }}>
                  {s.step}
                </div>
                <h3 className="font-bold mb-2" style={{ color: s.textColor }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attorney detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: selected.color }}>
                    {selected.initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selected.name}</h2>
                    <p className="text-sm" style={{ color: "#64748b" }}>{selected.title} · {selected.firm}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
                      <span className="text-sm font-bold ml-1">{selected.rating}</span>
                      <span className="text-xs ml-1" style={{ color: "#94a3b8" }}>({selected.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}>
                  <X className="h-5 w-5" style={{ color: "#94a3b8" }} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{selected.bio}</p>

              <div>
                <h3 className="font-bold mb-3 text-sm">Fixed-Fee Services</h3>
                <div className="space-y-2">
                  {selected.services.map(svc => (
                    <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: "#e2e8f0" }}>
                      <div>
                        <p className="text-sm font-medium">{svc.name}</p>
                        <p className="text-xs" style={{ color: "#94a3b8" }}>Est. {svc.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: svc.price === 0 ? "#16a34a" : "#0f172a" }}>
                          {svc.price === 0 ? "Free" : `$${svc.price.toLocaleString()}`}
                        </p>
                        <button
                          className="text-xs font-semibold mt-0.5"
                          style={{ color: selected.color }}
                          onClick={() => { setBookedId(svc.name); setSelected(null); }}
                        >
                          Book →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: "#475569" }}>Languages</p>
                  <div className="flex gap-1.5">{selected.languages.map(l => <span key={l} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>{l}</span>)}</div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: "#475569" }}>Licensed in</p>
                  <div className="flex gap-1.5">{selected.licensed.map(l => <span key={l} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>{l}</span>)}</div>
                </div>
              </div>

              <button
                className="w-full py-3 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: selected.color }}
                onClick={() => { setBookedId(selected.id); setSelected(null); }}
              >
                Book Free 15-Min Consult
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

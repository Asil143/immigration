"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, DollarSign, Building2, Clock, CheckCircle2, Star, Filter, Bookmark, ExternalLink, TrendingUp, Zap } from "lucide-react";

const jobs = [
  { id: 1, title: "Senior Software Engineer", company: "Google", logo: "G", logoColor: "#1d4ed8", logoBg: "#eff6ff", location: "Mountain View, CA", remote: "Hybrid", salary: "$180k–$240k", type: "Full-time", posted: "2 days ago", h1bFiled: 10200, approvalRate: 98.1, sponsorTier: "platinum", tags: ["Python", "Distributed Systems", "ML"], description: "Join the core infrastructure team building systems that serve billions of users. We offer H-1B sponsorship and green card support from day 1.", saved: false },
  { id: 2, title: "Machine Learning Engineer", company: "Meta", logo: "M", logoColor: "#6d28d9", logoBg: "#faf5ff", location: "Menlo Park, CA", remote: "Hybrid", salary: "$190k–$260k", type: "Full-time", posted: "1 day ago", h1bFiled: 6700, approvalRate: 96.4, sponsorTier: "platinum", tags: ["PyTorch", "LLMs", "Python"], description: "Build next-generation AI systems. Our immigration team handles H-1B and green card from offer letter to citizenship.", saved: false },
  { id: 3, title: "Software Development Engineer II", company: "Amazon", logo: "A", logoColor: "#c2410c", logoBg: "#fff7ed", location: "Seattle, WA", remote: "Hybrid", salary: "$165k–$210k", type: "Full-time", posted: "3 days ago", h1bFiled: 12400, approvalRate: 97.2, sponsorTier: "platinum", tags: ["Java", "AWS", "Distributed Systems"], description: "Amazon sponsors H-1B for all qualifying roles. Our immigration team has processed 12,000+ H-1B petitions with a 97% approval rate.", saved: false },
  { id: 4, title: "Data Scientist", company: "Microsoft", logo: "MS", logoColor: "#15803d", logoBg: "#f0fdf4", location: "Redmond, WA", remote: "Remote OK", salary: "$155k–$200k", type: "Full-time", posted: "1 week ago", h1bFiled: 9800, approvalRate: 97.8, sponsorTier: "platinum", tags: ["Python", "Azure", "Statistics"], description: "Work on Microsoft's AI-powered products. Full immigration support including H-1B, green card sponsorship, and immigration legal fee coverage.", saved: false },
  { id: 5, title: "GPU Software Engineer", company: "Nvidia", logo: "N", logoColor: "#0891b2", logoBg: "#ecfeff", location: "Santa Clara, CA", remote: "On-site", salary: "$190k–$270k", type: "Full-time", posted: "4 days ago", h1bFiled: 2600, approvalRate: 97.4, sponsorTier: "platinum", tags: ["CUDA", "C++", "GPU Architecture"], description: "Shape the future of GPU computing. Nvidia has a dedicated immigration team and sponsors H-1B and EB-1A for exceptional engineers.", saved: false },
  { id: 6, title: "Quantitative Analyst", company: "Goldman Sachs", logo: "GS", logoColor: "#92400e", logoBg: "#fffbeb", location: "New York, NY", remote: "On-site", salary: "$160k–$220k", type: "Full-time", posted: "5 days ago", h1bFiled: 3100, approvalRate: 95.2, sponsorTier: "gold", tags: ["Python", "Statistics", "Finance"], description: "Join our quantitative strategies team. Goldman sponsors H-1B for all tech and quant roles.", saved: false },
  { id: 7, title: "Research Scientist – NLP", company: "Apple", logo: "AP", logoColor: "#374151", logoBg: "#f9fafb", location: "Cupertino, CA", remote: "Hybrid", salary: "$185k–$255k", type: "Full-time", posted: "1 week ago", h1bFiled: 5900, approvalRate: 95.7, sponsorTier: "gold", tags: ["NLP", "Swift", "ML Research"], description: "Apple's ML Research team sponsors H-1B for all research positions and supports outstanding researchers through EB-1A.", saved: false },
  { id: 8, title: "Full Stack Engineer", company: "Salesforce", logo: "SF", logoColor: "#1d4ed8", logoBg: "#eff6ff", location: "San Francisco, CA", remote: "Remote OK", salary: "$150k–$195k", type: "Full-time", posted: "2 weeks ago", h1bFiled: 2900, approvalRate: 96.1, sponsorTier: "gold", tags: ["React", "Java", "Salesforce Platform"], description: "Build the world's #1 CRM platform. Salesforce offers full H-1B sponsorship and green card support.", saved: false },
  { id: 9, title: "Research Scientist (Postdoc)", company: "MIT", logo: "MIT", logoColor: "#6d28d9", logoBg: "#faf5ff", location: "Cambridge, MA", remote: "On-site", salary: "$75k–$110k", type: "Full-time", posted: "3 days ago", h1bFiled: 890, approvalRate: 99.1, sponsorTier: "cap-exempt", tags: ["Research", "AI", "Academia"], description: "MIT is cap-exempt — no H-1B lottery required. Year-round H-1B filing. Also eligible for O-1 sponsorship for outstanding researchers.", saved: false },
  { id: 10, title: "Software Engineer – Infrastructure", company: "Stripe", logo: "ST", logoColor: "#6d28d9", logoBg: "#fdf4ff", location: "San Francisco, CA", remote: "Hybrid", salary: "$170k–$220k", type: "Full-time", posted: "1 week ago", h1bFiled: 780, approvalRate: 94.2, sponsorTier: "gold", tags: ["Go", "Distributed Systems", "Payments"], description: "Build the infrastructure powering global payments. Stripe sponsors H-1B and has a dedicated immigration team for all engineering hires.", saved: false },
  { id: 11, title: "Hardware Engineer – Semiconductors", company: "Intel", logo: "I", logoColor: "#0891b2", logoBg: "#ecfeff", location: "Santa Clara, CA", remote: "On-site", salary: "$140k–$185k", type: "Full-time", posted: "2 weeks ago", h1bFiled: 3800, approvalRate: 96.8, sponsorTier: "gold", tags: ["VLSI", "Chip Design", "C++"], description: "Intel has been sponsoring H-1B for 30+ years. Dedicated immigration team handles H-1B, green card PERM, and I-140 for all engineering hires.", saved: false },
  { id: 12, title: "Research Engineer – Autonomous Vehicles", company: "Tesla", logo: "T", logoColor: "#dc2626", logoBg: "#fef2f2", location: "Austin, TX", remote: "On-site", salary: "$145k–$195k", type: "Full-time", posted: "3 days ago", h1bFiled: 2200, approvalRate: 94.6, sponsorTier: "gold", tags: ["Computer Vision", "Python", "C++"], description: "Join Tesla's Autopilot team. Tesla sponsors H-1B for qualified engineers and has an internal immigration team.", saved: false },
];

const ROLES = ["All Roles", "Software Engineer", "Data Scientist", "ML Engineer", "Research Scientist", "Quantitative Analyst", "Hardware Engineer"];
const LOCATIONS_LIST = ["All Locations", "California", "New York", "Washington", "Texas", "Massachusetts"];
const REMOTE_OPTIONS = ["Any", "Remote OK", "Hybrid", "On-site"];
const TIER_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  platinum: { bg: "#eff6ff", color: "#1d4ed8", label: "Platinum Sponsor" },
  gold: { bg: "#fffbeb", color: "#d97706", label: "Top Sponsor" },
  "cap-exempt": { bg: "#f0fdf4", color: "#15803d", label: "Cap-Exempt 🎓" },
};

export default function JobBoardPage() {
  const [search, setSearch] = useState("");
  const [remote, setRemote] = useState("Any");
  const [tier, setTier] = useState("all");
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<"recent" | "approvalRate" | "salary">("recent");

  const filtered = useMemo(() => {
    let list = jobs.filter(j => {
      const q = search.toLowerCase();
      const matchSearch = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.some(t => t.toLowerCase().includes(q));
      const matchRemote = remote === "Any" || j.remote === remote;
      const matchTier = tier === "all" || j.sponsorTier === tier;
      return matchSearch && matchRemote && matchTier;
    });
    if (sortBy === "approvalRate") list = [...list].sort((a, b) => b.approvalRate - a.approvalRate);
    if (sortBy === "salary") list = [...list].sort((a, b) => parseInt(b.salary.replace(/[^0-9]/g, "").slice(0, 6)) - parseInt(a.salary.replace(/[^0-9]/g, "").slice(0, 6)));
    return list;
  }, [search, remote, tier, sortBy]);

  function toggleSave(id: number) {
    setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

      {/* Hero */}
      <section className="py-14" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}>
            <Zap className="h-4 w-4" />
            H-1B Sponsorship Verified
          </div>
          <h1 className="text-4xl font-bold mb-3">Jobs That Sponsor H-1B</h1>
          <p className="text-lg max-w-xl mx-auto mb-2" style={{ color: "#64748b" }}>
            Every listing is cross-checked against USCIS H-1B disclosure data. No guessing whether they sponsor.
          </p>
          <p className="text-sm" style={{ color: "#94a3b8" }}>Approval rate, number of H-1Bs filed, and sponsor tier shown for every company</p>
          <div className="flex justify-center gap-8 mt-6">
            {[["12", "Open positions"], ["10,000+", "H-1Bs verified"], ["97%", "Avg approval rate"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-blue-700">{val}</p>
                <p className="text-sm" style={{ color: "#64748b" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-5xl">

        {/* Sponsor tier legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(TIER_COLORS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setTier(tier === key ? "all" : key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                backgroundColor: tier === key ? val.bg : "#ffffff",
                color: val.color,
                borderColor: tier === key ? val.color : "#e2e8f0",
              }}
            >
              <TrendingUp className="h-3 w-3" />
              {val.label}
            </button>
          ))}
          {tier !== "all" && (
            <button onClick={() => setTier("all")} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
              <Filter className="h-3 w-3" /> Show all
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: "#e2e8f0" }}
            />
          </div>
          <select value={remote} onChange={e => setRemote(e.target.value)} className="px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }}>
            {REMOTE_OPTIONS.map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }}>
            <option value="recent">Sort: Most Recent</option>
            <option value="approvalRate">Sort: Highest Approval Rate</option>
            <option value="salary">Sort: Highest Salary</option>
          </select>
        </div>

        <p className="text-sm mb-5" style={{ color: "#94a3b8" }}>{filtered.length} positions found</p>

        {/* Job listings */}
        <div className="space-y-4">
          {filtered.map(job => {
            const tier = TIER_COLORS[job.sponsorTier];
            const isSaved = saved.has(job.id);
            return (
              <div key={job.id} className="rounded-2xl border overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center font-bold shrink-0" style={{ backgroundColor: job.logoBg, color: job.logoColor }}>
                      {job.logo}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-bold">{job.title}</h3>
                          <p className="text-sm" style={{ color: "#64748b" }}>{job.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: tier.bg, color: tier.color }}>{tier.label}</span>
                          <button onClick={() => toggleSave(job.id)}>
                            <Bookmark className={`h-5 w-5 transition-colors`} style={{ color: isSaved ? "#2563eb" : "#cbd5e1", fill: isSaved ? "#2563eb" : "none" }} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: "#64748b" }}>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.posted}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>{job.remote}</span>
                      </div>

                      <p className="text-xs mt-2 leading-relaxed" style={{ color: "#475569" }}>{job.description}</p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* H-1B stats bar */}
                <div className="px-5 py-2.5 flex items-center justify-between flex-wrap gap-3 border-t" style={{ borderColor: "#f1f5f9", backgroundColor: "#fafafa" }}>
                  <div className="flex gap-5 text-xs">
                    <div>
                      <span style={{ color: "#94a3b8" }}>H-1Bs filed: </span>
                      <span className="font-bold text-blue-600">{job.h1bFiled.toLocaleString()}</span>
                    </div>
                    <div>
                      <span style={{ color: "#94a3b8" }}>Approval rate: </span>
                      <span className="font-bold text-green-600">{job.approvalRate}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href="/ai-assistant" className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}>
                      Ask AI about this role
                    </a>
                    <a href="/sign-up" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: "#2563eb" }}>
                      Apply <ExternalLink className="inline h-3 w-3 ml-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-2xl text-center" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <h3 className="font-bold mb-2">Is your target company on this list?</h3>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>Our AI can analyze any employer's H-1B sponsorship history from USCIS public data and tell you the odds.</p>
          <a href="/ai-assistant" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: "#2563eb" }}>
            Check Any Employer →
          </a>
        </div>
      </div>
    </div>
  );
}

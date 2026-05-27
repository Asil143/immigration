import { Calendar, Clock, Users, Video, MapPin, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";

const upcomingEvents = [
  {
    id: 1,
    title: "H-1B Cap Season 2026: Everything You Need to Know",
    date: "February 12, 2026",
    time: "7:00 PM EST",
    type: "webinar",
    host: "VisaPilot + Immigration Attorney",
    speaker: "Michael Chen, Esq.",
    speakerTitle: "Partner, Chen & Associates Immigration Law",
    attendees: 1240,
    maxAttendees: 2000,
    tags: ["H-1B", "Lottery", "Cap Season"],
    description: "A comprehensive walkthrough of the H-1B cap season — registration process, lottery odds, what to do if selected, and backup options if not selected.",
    color: "#eff6ff",
    textColor: "#1d4ed8",
    free: true,
  },
  {
    id: 2,
    title: "OPT to H-1B: Bridging the Gap Without Losing Status",
    date: "February 26, 2026",
    time: "6:30 PM PST",
    type: "webinar",
    host: "VisaPilot",
    speaker: "Priya Agarwal, Esq.",
    speakerTitle: "Immigration Attorney, Fragomen",
    attendees: 890,
    maxAttendees: 1500,
    tags: ["OPT", "H-1B", "Cap-Gap"],
    description: "Understanding cap-gap, STEM OPT extension timelines, and exactly what documentation you need to stay in status while transitioning to H-1B.",
    color: "#f0fdf4",
    textColor: "#15803d",
    free: true,
  },
  {
    id: 3,
    title: "EB-2 NIW Deep Dive: Self-Petitioning Without an Employer",
    date: "March 5, 2026",
    time: "7:00 PM EST",
    type: "webinar",
    host: "VisaPilot",
    speaker: "David Kim, Esq.",
    speakerTitle: "Senior Counsel, Klasko Immigration Law Partners",
    attendees: 1050,
    maxAttendees: 1500,
    tags: ["EB-2 NIW", "Green Card", "Self-Petition"],
    description: "The three-prong Dhanasar test, how to build a strong NIW petition, what evidence to include, and realistic timelines for different nationalities.",
    color: "#faf5ff",
    textColor: "#6d28d9",
    free: true,
  },
  {
    id: 4,
    title: "Navigating the India Green Card Backlog in 2026",
    date: "March 19, 2026",
    time: "7:00 PM EST",
    type: "webinar",
    host: "VisaPilot",
    speaker: "Sunita Reddy, Esq.",
    speakerTitle: "Attorney, Berry Appleman & Leiden",
    attendees: 620,
    maxAttendees: 1000,
    tags: ["India Backlog", "EB-2", "Priority Date", "AC21"],
    description: "India EB-2/EB-3 priority date analysis, AC21 portability, job changes while I-485 is pending, EB-1A as an alternative, and realistic expectations for the decade ahead.",
    color: "#fff7ed",
    textColor: "#c2410c",
    free: true,
  },
  {
    id: 5,
    title: "1-on-1 Attorney Consultation: Free 15-Minute Session",
    date: "Ongoing — Book Your Slot",
    time: "Various times available",
    type: "consultation",
    host: "VisaPilot Lawyer Network",
    speaker: "Verified Immigration Attorneys",
    speakerTitle: "5 attorneys available this week",
    attendees: 0,
    maxAttendees: 1,
    tags: ["Private Consultation", "Attorney", "Any Visa"],
    description: "Book a free 15-minute consultation with a verified immigration attorney. Ideal for a quick question about your situation before deciding on next steps.",
    color: "#ecfeff",
    textColor: "#0891b2",
    free: true,
  },
  {
    id: 6,
    title: "Travel on a Pending Green Card: Advance Parole Q&A",
    date: "April 2, 2026",
    time: "6:00 PM PST",
    type: "webinar",
    host: "VisaPilot",
    speaker: "Maria Santos, Esq.",
    speakerTitle: "Immigration Partner, Jackson Lewis",
    attendees: 445,
    maxAttendees: 800,
    tags: ["I-485", "Advance Parole", "Travel"],
    description: "When you can and cannot travel with a pending I-485, what AP is and how to get it on short notice, H-1B travel as an alternative, and real case examples.",
    color: "#fef2f2",
    textColor: "#dc2626",
    free: true,
  },
];

const pastEvents = [
  { title: "Understanding the Visa Bulletin: Priority Dates Explained", date: "Jan 15, 2026", attendees: 2300, recording: true },
  { title: "O-1A Visa: Who Qualifies and How to Build Your Petition", date: "Jan 8, 2026", attendees: 1800, recording: true },
  { title: "F-1 OPT Application Workshop", date: "Dec 18, 2025", attendees: 3100, recording: true },
  { title: "H-1B RFE Response Strategies", date: "Dec 5, 2025", attendees: 1600, recording: true },
];

export default function EventsPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

      {/* Hero */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}>
            <Video className="h-4 w-4" />
            Free Immigration Webinars
          </div>
          <h1 className="text-4xl font-bold mb-4">Webinars & Events</h1>
          <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: "#64748b" }}>
            Free live webinars with real immigration attorneys. Ask questions, get answers, no sales pitch.
          </p>
          <div className="flex justify-center gap-8">
            {[["6", "Upcoming events"], ["30+", "Past recordings"], ["100% Free", "Always"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-blue-700">{val}</p>
                <p className="text-sm" style={{ color: "#64748b" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Email subscription */}
        <div className="p-5 rounded-2xl mb-10 flex flex-col sm:flex-row items-center gap-4" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <Bell className="h-6 w-6 text-blue-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900">Get notified about new events</p>
            <p className="text-sm text-blue-700">We send 1 email per week with upcoming webinar announcements. No spam.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#bfdbfe" }} />
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white shrink-0" style={{ backgroundColor: "#2563eb" }}>Notify me</button>
          </div>
        </div>

        {/* Upcoming */}
        <h2 className="text-xl font-bold mb-5">Upcoming Events</h2>
        <div className="space-y-5 mb-12">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="rounded-2xl border overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
              <div className="p-5 flex flex-col sm:flex-row gap-4">
                <div className="sm:w-20 shrink-0">
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: event.color }}>
                    <Calendar className="h-5 w-5 mx-auto mb-1" style={{ color: event.textColor }} />
                    <p className="text-[10px] font-bold uppercase" style={{ color: event.textColor }}>
                      {event.date.split(",")[0].split(" ").slice(0, 2).join(" ")}
                    </p>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm leading-snug">{event.title}</h3>
                    {event.free && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>FREE</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs mb-2" style={{ color: "#64748b" }}>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.date} · {event.time}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.attendees.toLocaleString()} registered</span>
                    {event.type === "webinar" ? (
                      <span className="flex items-center gap-1"><Video className="h-3 w-3" /> Live Webinar</span>
                    ) : (
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Private Session</span>
                    )}
                  </div>
                  <p className="text-xs mb-2" style={{ color: "#475569" }}>{event.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium">{event.speaker}</p>
                      <p className="text-[11px]" style={{ color: "#94a3b8" }}>{event.speakerTitle}</p>
                    </div>
                    <button className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: event.textColor }}>
                      Register Free →
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-5 py-2 border-t flex flex-wrap gap-1.5" style={{ borderColor: "#f1f5f9", backgroundColor: "#fafafa" }}>
                {event.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: event.color, color: event.textColor }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Past recordings */}
        <h2 className="text-xl font-bold mb-5">Past Recordings</h2>
        <div className="space-y-3 mb-10">
          {pastEvents.map((event, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
              <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#f1f5f9" }}>
                <Video className="h-5 w-5" style={{ color: "#64748b" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{event.date} · {event.attendees.toLocaleString()} attended</p>
              </div>
              {event.recording && (
                <button className="text-xs font-semibold flex items-center gap-1 shrink-0" style={{ color: "#2563eb" }}>
                  Watch <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Suggest a topic */}
        <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <h3 className="font-bold mb-2">Want us to cover a specific topic?</h3>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>Submit a topic suggestion and we will try to schedule a webinar if enough people are interested.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="text" placeholder="e.g. EB-1A for software engineers" className="flex-1 px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "#e2e8f0" }} />
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white shrink-0" style={{ backgroundColor: "#2563eb" }}>Submit</button>
          </div>
        </div>
      </div>

    </div>
  );
}

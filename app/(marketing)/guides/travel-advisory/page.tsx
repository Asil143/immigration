import { AlertCircle, CheckCircle2, Plane, Globe, Shield, Clock } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    icon: "✈️",
    title: "Traveling on F-1 / OPT / STEM OPT",
    color: "#eff6ff",
    border: "#bfdbfe",
    items: [
      { q: "What documents do I need to re-enter the US on F-1?", a: "Valid F-1 visa stamp, valid passport (6+ months), valid I-20 with DSO travel signature (within 6 months), and proof of continued enrollment. If on OPT, bring your EAD card and offer letter." },
      { q: "My F-1 visa stamp expired — can I still travel?", a: "You can travel with an expired F-1 visa stamp if you only visit Canada, Mexico, or adjacent islands and stay for less than 30 days (automatic revalidation). Otherwise, you must get a new visa stamp at a US consulate abroad before returning." },
      { q: "Can I travel internationally while on OPT?", a: "Yes. Bring your EAD, valid passport, valid F-1 visa stamp (or get a new one abroad), I-20 with travel signature, and your offer letter or employment verification. If your OPT has ended and you're in the 60-day grace period, you cannot re-enter as F-1." },
      { q: "Can I travel while my STEM OPT extension is pending?", a: "Yes, with caution. Bring your cap-gap extension letter, EAD, valid visa stamp, I-20 with travel signature, and employment letter. If your current OPT EAD expires before the new one is approved, you may have re-entry issues. Consult your DSO first." },
    ],
  },
  {
    icon: "🏢",
    title: "Traveling on H-1B",
    color: "#f0fdf4",
    border: "#86efac",
    items: [
      { q: "What documents do I need to travel on H-1B?", a: "Valid H-1B visa stamp in your passport, valid passport, I-797 approval notice (original), and employer letter confirming employment. If your visa stamp has expired, you'll need to get a new one at a US consulate." },
      { q: "Can I travel while my H-1B extension is pending?", a: "If your I-94 is still valid, yes — you can travel using your current approval and re-enter on it. If your I-94 has expired and you're relying on the 240-day cap-gap rule, do NOT travel internationally; you won't be able to re-enter until the new H-1B is approved." },
      { q: "My H-1B visa stamp expired. Do I need a new one?", a: "The visa stamp is for entry only. If you're inside the US with an approved H-1B, you don't need a valid stamp to stay or work. But you need a valid stamp to re-enter after international travel. You must get a new stamp at a US consulate abroad." },
      { q: "What is H-1B dropbox eligibility?", a: "Qualified applicants may renew their H-1B visa stamp via a 'dropbox' (courier service) without an in-person interview at certain US consulates. Eligibility depends on your nationality, consulate, prior visa, and fingerprint history. Check the specific consulate's website." },
    ],
  },
  {
    icon: "🌿",
    title: "Traveling with a Pending Green Card (I-485)",
    color: "#fffbeb",
    border: "#fde68a",
    items: [
      { q: "Can I travel internationally while my I-485 is pending?", a: "NOT without Advance Parole (Form I-131). Leaving the US without AP while your I-485 is pending is treated as abandonment of your green card application. Only exception: valid H-1B, L-1, O-1, or similar status allows re-entry." },
      { q: "What is Advance Parole and how do I get it?", a: "Advance Parole (AP) is travel permission for pending I-485 applicants. File Form I-131 concurrently with or after your I-485. Once approved, you receive an AP document (Form I-512L) that allows re-entry while the I-485 is pending. Processing: 4–9 months." },
      { q: "Can I travel on H-1B instead of AP while I-485 is pending?", a: "Yes. If you have valid H-1B (or L-1/O-1) status, you can re-enter on that status while your I-485 is pending — even without AP. This is often the safest option. Make sure your H-1B I-797 and visa stamp are valid." },
      { q: "My AP document hasn't arrived and I need to travel urgently?", a: "You can request an emergency AP appointment at your local USCIS field office. Bring proof of emergency travel (e.g., medical emergency, death of close relative). Same-day AP may be issued at the officer's discretion." },
    ],
  },
  {
    icon: "📋",
    title: "Visa Stamping Abroad",
    color: "#faf5ff",
    border: "#d8b4fe",
    items: [
      { q: "Where can I get my visa stamped?", a: "At any US consulate or embassy worldwide. Many people stamp in their home country or in a 'third country' (e.g., Canada or Mexico). Third-country stamping carries risk — if denied, you may be stuck abroad. Check VisaJourney for recent experiences." },
      { q: "What documents do I need for H-1B stamping?", a: "DS-160, valid passport, I-797 approval notice (original + copy), employment offer letter, pay stubs, employment verification letter, I-129 petition copy, educational credentials, and photos. Requirements vary by consulate." },
      { q: "How long does stamping take?", a: "Varies widely. US consulates in India often have waits of 6–18 months for interview appointments. Canada, Mexico, and European consulates can sometimes be done in days to weeks. Check the US consulate website for current wait times." },
      { q: "What is administrative processing (221g)?", a: "Additional security screening required after your visa interview. Can take days to months with no transparency. Common for nationals of certain countries or in certain professions (STEM, dual-use technologies). Check ceac.state.gov for status." },
    ],
  },
];

const checklist = [
  { item: "Valid passport (6+ months validity)", required: true },
  { item: "Valid visa stamp for your category", required: true },
  { item: "I-797 approval notice (H-1B/O-1/L-1)", required: false },
  { item: "I-20 with travel signature (F-1)", required: false },
  { item: "EAD card (OPT/STEM OPT)", required: false },
  { item: "Advance Parole document (if I-485 pending)", required: false },
  { item: "Employment offer letter / verification", required: false },
  { item: "Recent pay stubs (3–6 months)", required: false },
  { item: "I-94 printout (i94.cbp.dhs.gov)", required: false },
  { item: "SEVIS fee receipt (if re-entering F-1 after transfer)", required: false },
];

export default function TravelAdvisoryPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

      {/* Hero */}
      <section className="py-14" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#fed7aa", color: "#9a3412" }}>
              <Plane className="h-4 w-4" />
              Travel Guide for Visa Holders
            </div>
            <h1 className="text-4xl font-bold mb-4">International Travel Advisory</h1>
            <p className="text-lg" style={{ color: "#64748b" }}>
              Everything you need to know about traveling internationally while maintaining your US visa status — F-1, H-1B, OPT, and green card applicants.
            </p>
            <div className="flex items-start gap-2 mt-6 p-4 rounded-xl" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 text-sm">Always consult an immigration attorney before traveling</p>
                <p className="text-sm text-red-700 mt-0.5">Travel rules are complex and fact-specific. This guide is for informational purposes only and not legal advice.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Pre-travel checklist */}
        <div className="mb-12 p-6 rounded-2xl border-2" style={{ borderColor: "#2563eb", backgroundColor: "#eff6ff" }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="font-bold text-blue-900">Pre-Travel Document Checklist</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 shrink-0 ${item.required ? "text-blue-600" : "text-gray-400"}`} />
                <span className="text-sm">{item.item}</span>
                {item.required && <span className="text-xs text-blue-600 font-semibold ml-auto">Always</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Q&A sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-bold">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className="rounded-xl border-l-4 p-4" style={{ borderColor: section.border.replace("fe", "60"), backgroundColor: section.color }}>
                    <p className="font-semibold text-sm mb-2">{item.q}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Globe, title: "Check I-94 Record", desc: "Verify your current authorized stay", href: "https://i94.cbp.dhs.gov", external: true },
            { icon: Clock, title: "Consulate Wait Times", desc: "US visa appointment availability", href: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/wait-times.html", external: true },
            { icon: Shield, title: "Ask AI Assistant", desc: "Get personalized travel advice", href: "/ai-assistant", external: false },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="p-4 rounded-xl border flex gap-3 items-start hover:shadow-md transition-shadow"
                style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}
              >
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#eff6ff" }}>
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{link.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{link.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}

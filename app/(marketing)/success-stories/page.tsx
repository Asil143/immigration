import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Star, Quote, ArrowRight } from "lucide-react";
import Link from "next/link";

const stories = [
  {
    name: "Priya Sharma",
    country: "🇮🇳 India",
    path: "F-1 → OPT → H-1B → Green Card",
    company: "Software Engineer at Google",
    duration: "7 years",
    avatar: "PS",
    color: "#eff6ff",
    textColor: "#1d4ed8",
    rating: 5,
    quote: "VisaPilot's OPT tracker saved me when I almost hit the 90-day unemployment limit. The deadline alerts are a lifesaver for anyone navigating OPT.",
    story: "I graduated from UT Austin with an MS in CS in 2018. OPT was my first step, then I won the H-1B lottery on my second try in 2020. My I-140 was approved in 2021, and I'm currently waiting on the priority date to become current. VisaPilot helped me understand exactly where I stand in the EB-2 backlog.",
    tags: ["OPT", "H-1B Lottery", "EB-2"],
  },
  {
    name: "Carlos Mendoza",
    country: "🇲🇽 Mexico",
    path: "TN Visa → EB-2 NIW",
    company: "Civil Engineer at Bechtel",
    duration: "4 years",
    avatar: "CM",
    color: "#f0fdf4",
    textColor: "#15803d",
    rating: 5,
    quote: "I had no idea TN to EB-2 NIW was possible until I used VisaPilot's visa comparison tool. Now I have my green card.",
    story: "As a Mexican engineer, TN was easy and fast. But I always wanted a more permanent path. VisaPilot's comparison tool showed me that EB-2 NIW could work for my infrastructure work. I self-petitioned in 2022 and got my green card in 2024. The AI assistant helped me draft my NIW cover letter.",
    tags: ["TN Visa", "EB-2 NIW", "Green Card"],
  },
  {
    name: "Wei Zhang",
    country: "🇨🇳 China",
    path: "F-1 → H-1B → EB-1A",
    company: "Research Scientist at Pfizer",
    duration: "9 years",
    avatar: "WZ",
    color: "#faf5ff",
    textColor: "#6d28d9",
    rating: 5,
    quote: "China EB-2 backlog was 50+ years. VisaPilot showed me the EB-1A path — I got my green card in 18 months without a PERM.",
    story: "I did my PhD at MIT and joined Pfizer on OPT, then H-1B. The EB-2 India/China backlog was devastating. VisaPilot's AI assistant suggested I explore EB-1A based on my publications and patents. With 12 peer-reviewed papers and a patent, I qualified. Approved in 2023.",
    tags: ["PhD", "H-1B", "EB-1A", "No PERM"],
  },
  {
    name: "Aisha Okonkwo",
    country: "🇳🇬 Nigeria",
    path: "F-1 → OPT → H-1B → Citizenship",
    company: "Data Scientist at JPMorgan",
    duration: "10 years",
    avatar: "AO",
    color: "#fff7ed",
    textColor: "#c2410c",
    rating: 5,
    quote: "From student visa to US citizen in 10 years. VisaPilot kept me on track at every step with its timeline and deadline reminders.",
    story: "I came to the US for my MBA at Wharton in 2013. OPT led to H-1B with JPMorgan in 2015. My employer sponsored my EB-2 green card — I received it in 2019. I became a citizen in 2024. The N-400 naturalization guide on VisaPilot was incredibly detailed and accurate.",
    tags: ["MBA", "OPT", "H-1B", "EB-2", "Citizenship"],
  },
  {
    name: "Rahul Patel",
    country: "🇮🇳 India",
    path: "H-1B Cap-Exempt → EB-1C",
    company: "Associate Professor → Engineering Manager at Amazon",
    duration: "6 years",
    avatar: "RP",
    color: "#ecfeff",
    textColor: "#0891b2",
    rating: 5,
    quote: "I went cap-exempt route through university to avoid the lottery, then transferred to Amazon with L-1 and got EB-1C. VisaPilot explained the whole path clearly.",
    story: "After my PhD, I joined a university as an assistant professor — cap-exempt H-1B, no lottery. Amazon recruited me in 2020. They transferred me on L-1A as a manager, which opened the EB-1C path. Green card in 2022 — bypassing the India EB-2 50-year backlog entirely.",
    tags: ["Cap-Exempt", "L-1A", "EB-1C", "India Backlog"],
  },
  {
    name: "Sofia Garcia",
    country: "🇨🇴 Colombia",
    path: "J-1 → Waiver → O-1A",
    company: "Physician at Mayo Clinic",
    duration: "5 years",
    avatar: "SG",
    color: "#fef2f2",
    textColor: "#dc2626",
    rating: 5,
    quote: "J-1 two-year home residency requirement felt like the end of my US dream. VisaPilot's guide on Conrad 30 waivers changed everything.",
    story: "I came on J-1 for my medical residency and got hit with the two-year home residency requirement. VisaPilot's J-1 guide explained the Conrad 30 waiver program in detail. Mayo Clinic in an underserved area sponsored my waiver. Got O-1A status in 2022, now applying for EB-1A green card.",
    tags: ["J-1", "Conrad 30 Waiver", "O-1A"],
  },
];

export default function SuccessStoriesPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #fef9c3 0%, #fff7ed 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1 mb-4">
            {[1,2,3,4,5].map((s) => <Star key={s} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
          </div>
          <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
            Real journeys from students and immigrants who navigated the US immigration system — and made it.
          </p>
          <div className="flex justify-center gap-8 mt-8">
            {[["50,000+", "Users helped"], ["4.9/5", "Average rating"], ["98%", "Would recommend"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold" style={{ color: "#0f172a" }}>{val}</p>
                <p className="text-sm" style={{ color: "#64748b" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-8">
          {stories.map((story, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
              <div className="p-6" style={{ backgroundColor: story.color }}>
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0" style={{ backgroundColor: story.textColor, color: "#ffffff" }}>
                    {story.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-bold text-lg">{story.name}</p>
                        <p className="text-sm" style={{ color: "#64748b" }}>{story.country} · {story.company}</p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: story.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: story.textColor + "20", color: story.textColor }}>
                        {story.path}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>
                        {story.duration} journey
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2">
                  <Quote className="h-5 w-5 shrink-0 mt-0.5" style={{ color: story.textColor }} />
                  <p className="text-sm font-medium italic" style={{ color: "#0f172a" }}>{story.quote}</p>
                </div>
              </div>

              <div className="p-6" style={{ backgroundColor: "#ffffff" }}>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{story.story}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {story.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Start your own success story</h2>
          <p className="mb-6" style={{ color: "#64748b" }}>Join 50,000+ immigrants who use VisaPilot to navigate their journey with confidence.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white" style={{ backgroundColor: "#2563eb" }}>
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/ai-assistant" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border" style={{ borderColor: "#e2e8f0", color: "#0f172a" }}>
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

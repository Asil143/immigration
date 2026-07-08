import { Globe, GraduationCap, Stethoscope, Building2, type LucideIcon } from "lucide-react";
import type { Guide } from "@/types";

export const F1_GUIDE: Guide = {
  slug: "f1-visa",
  visa_type: "F-1",
  title: "F-1 Student Visa Guide",
  subtitle: "Everything you need to maintain status and navigate OPT",
  overview:
    "The F-1 visa is a nonimmigrant student visa that allows foreign nationals to study at US academic institutions. Maintaining your F-1 status requires following strict rules set by SEVP (Student and Exchange Visitor Program) and your DSO (Designated School Official).",
  processing_times: "Consular processing: 2–8 weeks. SEVIS fee must be paid 3 business days before interview.",
  fees: "SEVIS fee: $350. Visa application fee (MRV): $185.",
  last_updated: "2025-05-01",
  steps: [
    {
      title: "Get Accepted & Receive I-20",
      description: "Your US school sends you an I-20 (Certificate of Eligibility) after admission.",
      action_items: [
        "Confirm your enrollment with the school",
        "Receive Form I-20 from your DSO",
        "Review all information on I-20 for accuracy",
        "Pay SEVIS fee (Form I-901) at fmjfee.com",
      ],
      uscis_link: "https://www.ice.gov/sevis",
      estimated_time: "1–4 weeks after acceptance",
    },
    {
      title: "Apply for F-1 Visa at US Embassy/Consulate",
      description: "Schedule and attend a visa interview at the nearest US Embassy.",
      action_items: [
        "Complete DS-160 online application",
        "Pay visa application fee (MRV fee)",
        "Schedule visa interview appointment",
        "Prepare documents: I-20, SEVIS fee receipt, DS-160, passport, financial proof, admission letter",
        "Attend visa interview",
      ],
      uscis_link: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
      estimated_time: "4–8 weeks before program start",
    },
    {
      title: "Enter the US",
      description: "You may enter up to 30 days before your program start date.",
      action_items: [
        "Carry original I-20 when entering",
        "Keep your SEVIS fee receipt",
        "Verify your I-94 record at i94.cbp.dhs.gov within 3 days",
        "Register for classes immediately",
      ],
      estimated_time: "Up to 30 days before program start",
    },
    {
      title: "Maintain F-1 Status",
      description: "Ongoing requirements to keep your F-1 status valid.",
      action_items: [
        "Enroll full-time each semester (usually 12+ credits)",
        "Report address changes to DSO within 10 days",
        "Keep passport valid (renew 6 months before expiry)",
        "Get travel signature on I-20 before leaving US (valid 6 months)",
        "Report major changes (major, employer, graduation date) to DSO",
      ],
    },
  ],
  faq: [
    {
      question: "Can I work on an F-1 visa?",
      answer:
        "On-campus employment is allowed up to 20 hours/week during classes, 40 hours during breaks. Off-campus work requires authorization (CPT or OPT). Unauthorized work is a severe violation that can result in deportation.",
    },
    {
      question: "What is the grace period after graduation?",
      answer:
        "F-1 students get a 60-day grace period after their program end date (or OPT end date) to leave the US, transfer schools, or change status.",
    },
    {
      question: "Can I travel outside the US on F-1?",
      answer:
        "Yes, with a valid visa stamp and travel signature on your I-20 (from your DSO, valid 6 months). Your visa stamp must be valid to re-enter; if expired, you'll need to apply for a new one abroad.",
    },
    {
      question: "What happens if I drop below full-time enrollment?",
      answer:
        "Dropping below full-time without DSO authorization violates your F-1 status. Contact your DSO before dropping classes. Exceptions exist for final semester, medical reasons, and academic difficulty (with DSO approval).",
    },
  ],
};

export const OPT_GUIDE: Guide = {
  slug: "opt-stem-opt",
  visa_type: "OPT",
  title: "OPT & STEM OPT Guide",
  subtitle: "Work authorization for F-1 students after graduation",
  overview:
    "Optional Practical Training (OPT) allows F-1 students to work in their field of study for up to 12 months. STEM OPT is a 24-month extension for eligible STEM graduates, for a total of 36 months.",
  processing_times: "USCIS processing: 3–5 months. Apply 90 days before program end date.",
  fees: "Form I-765 filing fee: $520.",
  last_updated: "2025-05-01",
  steps: [
    {
      title: "Request OPT Recommendation from DSO",
      description:
        "Contact your DSO 3–4 months before graduation to start the OPT process.",
      action_items: [
        "Meet with your DSO",
        "Confirm graduation date",
        "DSO updates SEVIS and issues new I-20 with OPT recommendation",
        "Receive OPT I-20 from DSO",
      ],
      estimated_time: "90 days before program end",
    },
    {
      title: "File Form I-765 with USCIS",
      description: "Submit your OPT application to USCIS.",
      action_items: [
        "Complete Form I-765 (Application for Employment Authorization)",
        "Gather required documents: I-20, passport copy, I-94, 2 passport photos",
        "Pay $520 filing fee",
        "Submit application (can file online or by mail)",
        "Keep copy of everything submitted",
      ],
      uscis_link: "https://www.uscis.gov/i-765",
      estimated_time: "Apply 90–60 days before program end",
    },
    {
      title: "Receive EAD Card",
      description: "USCIS mails your Employment Authorization Document (EAD).",
      action_items: [
        "Track case status at egov.uscis.gov",
        "Verify all info on EAD card is correct",
        "Note your OPT start and end dates",
        "You cannot start work before EAD start date",
      ],
      estimated_time: "3–5 months after filing",
    },
    {
      title: "Report Employment to DSO",
      description: "F-1 rules require you to report employment.",
      action_items: [
        "Report employer name, address, start date to DSO within 10 days of starting",
        "Employment must be in your field of study",
        "Maximum 20 hours/week if still enrolled",
        "Report unemployment periods (max 90 days)",
      ],
    },
    {
      title: "Apply for STEM OPT Extension (if eligible)",
      description: "STEM graduates can apply for a 24-month extension.",
      action_items: [
        "Employer must be E-Verify enrolled",
        "Submit I-983 Training Plan signed by employer and student",
        "File I-765 extension 90 days before OPT expiry",
        "Submit to DSO first, then file with USCIS",
      ],
      uscis_link: "https://www.uscis.gov/opt",
      estimated_time: "Apply 90 days before OPT end date",
    },
  ],
  faq: [
    {
      question: "How many days can I be unemployed during OPT?",
      answer:
        "Standard OPT: maximum 90 days total unemployment. STEM OPT: maximum 150 days total (including time unemployed during standard OPT). Exceeding this limit violates your F-1 status.",
    },
    {
      question: "Does freelancing or self-employment count for OPT?",
      answer:
        "Self-employment is allowed on standard OPT if you are working in your field of study. Self-employment is NOT allowed on STEM OPT — your employer must be an E-Verify enrolled company.",
    },
    {
      question: "What if my OPT application is still pending when my program ends?",
      answer:
        "If you applied on time (before program end) and have a USCIS receipt notice, you are in a 180-day cap-gap bridge until your EAD arrives or is denied. Check your receipt notice date carefully.",
    },
  ],
};

// ─── H-1B guide content ────────────────────────────────────────────────────

export interface H1BStep {
  title: string;
  description: string;
  items: string[];
  link?: string;
}

export const H1B_STEPS: H1BStep[] = [
  {
    title: "Employer Files Labor Condition Application (LCA)",
    description: "Your employer must file an LCA with the Department of Labor (DOL) before filing the H-1B petition.",
    items: ["Employer posts LCA notice at worksite for 10 business days", "DOL certifies LCA (usually 7 days)", "LCA covers job title, wage, location, and period of employment", "Wage must be prevailing wage or actual wage, whichever is higher"],
    link: "https://flag.dol.gov/",
  },
  {
    title: "H-1B Cap Registration (March each year)",
    description: "For cap-subject H-1Bs, employers must register online before the full petition is filed. USCIS conducts a lottery if registrations exceed the cap.",
    items: ["Registration window: typically March 1–18", "Registration fee: $215 per beneficiary", "Wait for lottery selection notice", "Only selected registrants can file full petition"],
    link: "https://www.uscis.gov/h1b",
  },
  {
    title: "File Form I-129 (Petition for Nonimmigrant Worker)",
    description: "If selected in the lottery, your employer files the full H-1B petition.",
    items: ["File I-129 with all required evidence", "Include specialty occupation evidence, degree evaluation if foreign", "Pay filing fees ($730 base + ACWIA + fraud prevention fees)", "Optional: Premium Processing ($2,805) for 15-business-day decision"],
    link: "https://www.uscis.gov/i-129",
  },
  {
    title: "H-1B Approval and Start Date",
    description: "Cap-subject H-1B start date is October 1 of the fiscal year. Cap-exempt employers can start anytime.",
    items: ["Receive I-797 Approval Notice", "Start date: October 1 (cap-subject)", "Initial period: 3 years (up to 6 years total)", "Cap-gap protects F-1 OPT students during transition"],
  },
  {
    title: "Extensions and Portability",
    description: "H-1B can be extended beyond 6 years if a green card process is started.",
    items: ["File I-129 extension 6 months before expiry", "If I-140 approved for 365+ days: eligible for 3-year extensions", "H-1B portability: can change employers if new employer files transfer petition", "AC21 portability: port green card to same or similar job after 180+ days"],
  },
];

export const H1B_FAQ: { q: string; a: string }[] = [
  { q: "What is the H-1B annual cap?", a: "65,000 visas per year, plus 20,000 additional for US master's degree holders. Some employers (universities, nonprofits, government research) are cap-exempt." },
  { q: "Can I work for multiple H-1B employers?", a: "Yes — you can work for multiple H-1B employers concurrently. Each employer must file a separate H-1B petition. You cannot work for an employer who has not filed on your behalf." },
  { q: "What is cap-gap?", a: "If you're on OPT and your H-1B is approved for October 1, cap-gap automatically extends your OPT and F-1 status from the OPT expiry date through September 30 (or until H-1B starts)." },
  { q: "Can I travel while my H-1B extension is pending?", a: "You can travel if your current H-1B is still valid. If it expires while you're abroad, you need a valid H-1B visa stamp to re-enter. Consult an attorney before traveling with a pending extension." },
  { q: "What happens if I'm laid off on H-1B?", a: "You have a grace period of 60 days (or until your H-1B end date, whichever is shorter) to find a new employer who will file an H-1B transfer, change to another status, or depart the US." },
];

// ─── Green Card guide content ──────────────────────────────────────────────

export interface EBCategory {
  category: string;
  title: string;
  description: string;
  requirements: string[];
  timeline: string;
  color: string;
  badge: string;
}

export const GREEN_CARD_EB_CATEGORIES: EBCategory[] = [
  {
    category: "EB-1A",
    title: "Extraordinary Ability",
    description: "For individuals with extraordinary ability in sciences, arts, education, business, or athletics. No employer sponsor required.",
    requirements: ["National or international awards/recognition", "Published work with significant citations", "Judging others' work in your field", "High salary compared to peers", "Memberships in prestigious associations"],
    timeline: "12–24 months",
    color: "bg-yellow-50 border-yellow-200 text-yellow-900",
    badge: "bg-yellow-100 text-yellow-700",
  },
  {
    category: "EB-1B",
    title: "Outstanding Researchers & Professors",
    description: "For researchers/professors with international recognition in a specific academic area. Requires employer sponsorship.",
    requirements: ["At least 3 years research/teaching experience", "Major prizes or awards", "Membership in associations requiring outstanding achievement", "Published material about your work", "Participation as judge of others' work"],
    timeline: "12–18 months",
    color: "bg-blue-50 border-blue-200 text-blue-900",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    category: "EB-2 NIW",
    title: "National Interest Waiver",
    description: "Waives the job offer and PERM requirements for individuals whose work is in the national interest of the US. Self-petition.",
    requirements: ["Substantial merit and national importance of work", "Well-positioned to advance the endeavor", "Beneficial to waive job offer and PERM requirements", "Strong evidence: papers, citations, media, letters of support"],
    timeline: "12–30 months",
    color: "bg-emerald-50 border-emerald-200 text-emerald-900",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    category: "EB-2",
    title: "Advanced Degree Professionals",
    description: "For professionals with advanced degrees (master's+) or equivalent. Requires employer sponsorship and PERM labor certification.",
    requirements: ["Advanced degree (master's or bachelor's + 5 years exp)", "Employer files PERM labor certification", "I-140 petition", "Priority date must be current for your country"],
    timeline: "3–10+ years (country dependent)",
    color: "bg-indigo-50 border-indigo-200 text-indigo-900",
    badge: "bg-indigo-100 text-indigo-700",
  },
  {
    category: "EB-3",
    title: "Skilled Workers",
    description: "For skilled workers (2+ years training), professionals, and unskilled workers. Requires employer sponsorship and PERM.",
    requirements: ["Skilled: 2+ years training/experience required", "Professional: US bachelor's degree or equivalent", "Permanent full-time job offer from US employer", "PERM labor certification filed by employer"],
    timeline: "3–10+ years (country dependent)",
    color: "bg-orange-50 border-orange-200 text-orange-900",
    badge: "bg-orange-100 text-orange-700",
  },
];

export const GREEN_CARD_PROCESS_STEPS: { title: string; desc: string }[] = [
  { title: "PERM Labor Certification (EB-2/EB-3 only)", desc: "Employer proves no qualified US workers are available for the position. Takes 8–18 months." },
  { title: "File I-140 (Immigrant Petition)", desc: "USCIS approves your immigrant classification. Establishes your Priority Date." },
  { title: "Wait for Priority Date to Become Current", desc: "Check monthly Visa Bulletin. India and China have multi-year backlogs for EB-2/EB-3." },
  { title: "Adjustment of Status (I-485) or Consular Processing", desc: "If in the US, file I-485. If abroad, go through National Visa Center and US Embassy." },
  { title: "Biometrics, Medical Exam, and Interview", desc: "USCIS may require an interview. Medical exam from a USCIS civil surgeon required." },
  { title: "Receive Green Card", desc: "Conditional (2-year) or permanent (10-year) green card issued. Renewable." },
];

// ─── J-1 guide content ─────────────────────────────────────────────────────

export interface J1Program {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface J1Section {
  title: string;
  body?: string;
  isAlert?: boolean;
  programs?: J1Program[];
}

export const J1_SECTIONS: J1Section[] = [
  {
    title: "What is the J-1 Visa?",
    body: `The J-1 Exchange Visitor visa is a nonimmigrant visa category for individuals approved to participate in work-and study-based exchange visitor programs. J-1 programs are sponsored by designated organizations and include students, research scholars, professors, trainees, au pairs, camp counselors, physicians, and summer work travel participants.

J-1 status is governed by the Exchange Visitor Program regulations (22 C.F.R. Part 62) administered by the U.S. Department of State (DOS) through the Bureau of Educational and Cultural Affairs (ECA).`,
  },
  {
    title: "J-1 Program Categories",
    programs: [
      { icon: GraduationCap, title: "Student", desc: "Full-time degree or non-degree academic study at a U.S. educational institution." },
      { icon: Building2, title: "Research Scholar / Professor", desc: "Conducting research or teaching at a U.S. university or research institution." },
      { icon: Stethoscope, title: "Physician", desc: "Graduate medical training or education (residency or fellowship)." },
      { icon: Globe, title: "Trainee", desc: "On-the-job training in a field related to your academic or professional background." },
      { icon: Globe, title: "Summer Work Travel", desc: "Full-time students from other countries working in the U.S. during summer break." },
      { icon: Globe, title: "Au Pair", desc: "Childcare and cultural exchange program for young adults." },
    ],
  },
  {
    title: "Duration of Status",
    body: `J-1 visa holders are admitted for "Duration of Status" (D/S), meaning they are authorized to remain in the U.S. as long as they are maintaining their J-1 program. The DS-2019 (Certificate of Eligibility) lists the program end date — this is the key document governing your authorized stay.

Program extensions must be requested through your sponsor before the program end date on your DS-2019. Extensions must be supported by a valid reason (continued studies, research need, etc.) and approved by the sponsor.`,
  },
  {
    title: "The Two-Year Home Residency Requirement",
    isAlert: true,
    body: `One of the most important — and often misunderstood — aspects of the J-1 visa is the two-year home residency requirement under INA §212(e).

**Who is subject to it?**
You are subject to the two-year rule if any of the following apply:
1. Your exchange program was funded by your home government or the U.S. government
2. Your skills appear on your home country's Exchange Visitor Skills List
3. You came to the U.S. for graduate medical education or training

**What does it mean?**
If subject to the rule, you must physically reside in your home country for an aggregate of at least two years after your J-1 program ends before you can:
- Apply for an H, L, or K nonimmigrant visa
- Apply for permanent residence (green card)

**Verification**
Check your passport visa stamp and DS-2019. If your visa stamp says "Two-Year Rule Applies" or the DS-2019 has a mark indicating government funding or skills list applicability, you are likely subject.`,
  },
  {
    title: "J-1 Waiver Programs",
    body: `If you are subject to the two-year home residency requirement, you may apply for a waiver. There are five types of waivers:

**1. No Objection Statement**
Your home country government submits a statement to the Department of State saying it has no objection to your remaining in the U.S. Not available for physicians who received graduate medical training.

**2. Interested Government Agency (IGA)**
A U.S. federal agency (DOD, USDA, HHS, etc.) agrees that your continued U.S. presence is in the national interest. Common for research scientists and specialized professionals.

**3. Persecution**
If returning to your home country would subject you to persecution based on race, religion, or political opinion.

**4. Exceptional Hardship to U.S. Citizen/LPR Spouse or Child**
You must show that your U.S. citizen or permanent resident spouse or child would suffer exceptional hardship if you had to leave.

**5. Conrad 30 (Physicians)**
Physicians who agree to work full-time for 3 years in a medically underserved area or at a Veterans Affairs facility. Each state can sponsor up to 30 physicians per year. Very popular among foreign medical graduates.`,
  },
  {
    title: "J-2 Dependent Status",
    body: `Your spouse and unmarried children under 21 may accompany you on J-2 dependent status. J-2 holders may apply for employment authorization (I-765 under category (c)(5)) — but the income earned must not be used to support the J-1 holder's study or training; it may be used for other family needs.

J-2 holders are also subject to the two-year rule if the principal J-1 holder is subject to it.`,
  },
  {
    title: "Transitioning from J-1 to Another Status",
    body: `Many J-1 holders eventually seek to change to another nonimmigrant status (such as H-1B or O-1) or apply for permanent residence.

**If NOT subject to the two-year rule:** You may change to H-1B, O-1, or other nonimmigrant status without restriction. You may also be sponsored for a green card.

**If subject to the two-year rule:** You must either fulfill the two-year requirement or obtain a waiver before you can apply for H-1B, L-1, K-1, or permanent residence.

**Physicians:** The Conrad 30 waiver path typically leads to an H-1B or O-1 sponsored by the healthcare facility, and potentially a green card through EB-2 or National Interest Waiver petition.`,
  },
];

export const J1_FAQS: { q: string; a: string }[] = [
  {
    q: "How do I know if I'm subject to the two-year home residency requirement?",
    a: "Check your J-1 visa stamp in your passport — it will say 'Two-Year Rule Applies' if you're subject. Also check your DS-2019 and contact your sponsor organization. The State Department maintains a database you can query at travel.state.gov.",
  },
  {
    q: "Can I travel outside the U.S. on J-1 status?",
    a: "Yes. You need a valid J-1 visa stamp (not expired), a valid DS-2019 endorsed for travel by your sponsor within the last 12 months, a valid passport, and any applicable entry documents (like a home country visa if required). Always get your DS-2019 travel endorsed before leaving.",
  },
  {
    q: "What happens if my J-1 program ends and I haven't gotten a waiver?",
    a: "You would need to depart the U.S. (or change to another lawful status if eligible). Overstaying J-1 status triggers the same unlawful presence rules as any other visa — 180+ days of unlawful presence bars reentry for 3 years; 1 year or more bars for 10 years.",
  },
  {
    q: "How long does a J-1 waiver take?",
    a: "Varies by type. No-objection waivers typically take 3–6 months. Conrad 30 physician waivers depend on state timelines (1–6 months for state recommendation, then 4–8 months at DOS). IGA waivers vary widely by agency.",
  },
  {
    q: "Can J-2 holders work?",
    a: "Yes, with an approved EAD (Form I-765 under category (c)(5)). The income cannot be used to support the J-1 principal's study or training. Apply for EAD at least 90 days before you need to start working.",
  },
];

// ─── Travel advisory content ───────────────────────────────────────────────

export interface TravelAdvisoryItem {
  q: string;
  a: string;
}

export interface TravelAdvisorySection {
  icon: string;
  title: string;
  color: string;
  border: string;
  items: TravelAdvisoryItem[];
}

export const TRAVEL_ADVISORY_SECTIONS: TravelAdvisorySection[] = [
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

export const TRAVEL_ADVISORY_CHECKLIST: { item: string; required: boolean }[] = [
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

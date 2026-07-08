import { Globe, GraduationCap, Stethoscope, Building2, type LucideIcon } from "lucide-react";

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
    title: "Academic Training for J-1 Students",
    body: `J-1 students (not research scholars or professors) may work in "Academic Training" (AT) — practical, off-campus employment directly related to their major field of study. It plays a similar role to F-1 OPT, but the rules are different.

**Duration**
Academic Training is generally limited to the amount of time you spent in full-time student status, up to a maximum of 18 months. If you complete a doctoral degree and continue directly into postdoctoral academic training, the total (including any AT used during your degree) can extend up to 36 months.

**Timing**
AT can be used before completing your studies (pre-completion) or after (post-completion), but pre-completion AT counts against your total available time. Post-completion AT must generally begin within 30 days of your program end date.

**Authorization**
Unlike OPT, there is no separate USCIS application or EAD card. Your program's Responsible Officer authorizes AT directly on your DS-2019 based on a written training/employment offer related to your field of study. Get this authorization before you start working — working without it is a status violation.

**Bridging to other status**
Academic Training does not convert into F-1 OPT, and there's no automatic extension bridge comparable to F-1's cap-gap. Many J-1 students use AT as a runway to an H-1B petition, but if the H-1B isn't approved and effective before your AT/DS-2019 period ends, you must depart, change status, or otherwise maintain lawful presence.`,
  },
  {
    title: "The 24-Month and 12-Month Bars (Research Scholars & Professors)",
    body: `J-1 Research Scholars and Professors face repeat-participation restrictions that don't apply to most other categories. These bars are separate from — and in addition to — the two-year home residency requirement.

**The 24-month bar**
Once you complete a J-1 Research Scholar or Professor program, you generally cannot begin a *new* Research Scholar or Professor program for 24 months. This is a repeat-participation limit, not a residency requirement — it applies regardless of home-country skills lists or government funding, and it doesn't restrict you from other J-1 categories (like Short-Term Scholar) or other visa types.

**The 12-month bar**
If you spent more than six months in the U.S. in J-1 or J-2 status during the 12 months immediately before the start date of a new Research Scholar or Professor program, you're subject to a 12-month bar and cannot begin that new program until the bar clears. Brief prior visits (for example, short conference trips as a J-1 Short-Term Scholar) generally don't trigger this bar — check with your prospective sponsor's Responsible Officer, since the exceptions are technical.

Both bars are assessed by the sponsoring institution when issuing your DS-2019, so delays here usually surface early — well before a visa application — if your program officer is doing their job correctly.`,
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
  {
    q: "Can I do Academic Training and then switch to F-1 status for OPT?",
    a: "There's no automatic conversion between the two — Academic Training and OPT are separate work authorizations tied to separate visa categories. You'd need to be accepted into a new academic program and obtain a change of status (or new F-1 visa) to become an F-1 student, at which point OPT eligibility would follow F-1 rules from scratch. Most J-1 students instead use Academic Training as a bridge directly to H-1B or another status rather than looping through F-1.",
  },
  {
    q: "What happens if my J-1 sponsor loses its Department of State designation?",
    a: "Your sponsor can no longer issue or extend DS-2019 forms, but your existing status doesn't disappear overnight. The State Department typically requires affected participants to transfer to a new designated sponsor within a set window (often 30–45 days) to keep their SEVIS record and status active. Contact your program office immediately if you hear your sponsor is under review — waiting can leave you out of status.",
  },
  {
    q: "Can I change J-1 sponsors or programs while I'm still in the U.S.?",
    a: "Yes, this is called a program transfer. Your current sponsor must agree to release your SEVIS record, and the new sponsor issues a new DS-2019 continuing your program (generally within the same category, such as Research Scholar to Research Scholar). There's no gap in status if the transfer is processed correctly, but timing and paperwork should be coordinated closely with both Responsible Officers.",
  },
  {
    q: "Is there a cap-gap extension for J-1 holders waiting on an H-1B, like there is for F-1?",
    a: "No. F-1's automatic cap-gap extension doesn't exist for J-1. If your DS-2019 end date arrives before your H-1B is approved and its October 1 start date kicks in, you must depart the U.S., extend or maintain another lawful status, or use remaining Academic Training time to bridge the gap. Plan your H-1B filing and program end date with this gap in mind — it's a common trap for J-1 research scholars and postdocs.",
  },
  {
    q: "What are the specific rules for the Au Pair program?",
    a: "The initial program period is 12 months, with an option to extend for an additional 6, 9, or 12 months at the sponsor and host family's discretion (up to 24 months total). Au pairs are limited to a maximum of 10 hours of childcare per day and 45 hours per week, and must complete at least 6 semester hours (or equivalent) of academic coursework during their first year.",
  },
  {
    q: "What are the rules for Summer Work Travel participants?",
    a: "Summer Work Travel is open to full-time, postsecondary students on their school's summer break, with a maximum program length of about 4 months. Participants generally need a job placement secured (or use a limited window to search after arrival, depending on program rules) and must be able to support themselves financially. Certain job types are off-limits, including positions involving unskilled factory labor, construction, roofing, and any job that could be seen as exploitative, such as live-in childcare or adult entertainment.",
  },
  {
    q: "Can J-1 students repeat the student category indefinitely?",
    a: "Not in practice. Unlike the hard 24-month bar for Research Scholars and Professors, J-1 students don't face a fixed statutory repeat bar, but sponsors and the State Department expect genuine progression — moving to a new degree level (e.g., bachelor's to master's) is normal, while repeating the same level of study back-to-back is generally not approved. Talk to your program's Responsible Officer before assuming a second student program will be authorized.",
  },
];

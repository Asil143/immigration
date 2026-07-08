export interface FamilyCategory {
  category: string;
  title: string;
  description: string;
  requirements: string[];
  timeline: string;
  color: string;
  badge: string;
}

export const FAMILY_CATEGORIES: FamilyCategory[] = [
  {
    category: "IR-1/CR-1",
    title: "Spouse of a U.S. Citizen",
    description: "Immediate relative category — no annual numerical cap, so there's no priority-date wait. CR-1 (conditional, married under 2 years) converts to IR-1 status via Form I-751 after 2 years.",
    requirements: ["Legally valid marriage to a U.S. citizen", "Petitioner is a U.S. citizen (not just LPR — see F2A below)", "Bona fide marriage — not entered into for immigration purposes", "Form I-130 filed by the U.S. citizen spouse"],
    timeline: "12–24 months",
    color: "bg-rose-50 border-rose-200 text-rose-900",
    badge: "bg-rose-100 text-rose-700",
  },
  {
    category: "IR-2",
    title: "Unmarried Child (Under 21) of a U.S. Citizen",
    description: "Immediate relative category for unmarried children under 21 of a U.S. citizen parent. No annual cap or priority-date wait.",
    requirements: ["Child is unmarried and under 21", "Petitioner (parent) is a U.S. citizen", "Legal parent-child relationship established (birth, legitimation, or adoption)"],
    timeline: "10–18 months",
    color: "bg-pink-50 border-pink-200 text-pink-900",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    category: "IR-5",
    title: "Parent of a U.S. Citizen",
    description: "Immediate relative category for parents of an adult U.S. citizen. No annual cap or priority-date wait.",
    requirements: ["Petitioning U.S. citizen child must be 21 or older", "Valid parent-child relationship (birth or legal adoption before age 16)", "Stepparents qualify if marriage occurred before child turned 18"],
    timeline: "10–18 months",
    color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900",
    badge: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    category: "F1",
    title: "Unmarried Sons/Daughters (21+) of U.S. Citizens",
    description: "First preference family category. Numerically limited — subject to an annual cap and priority-date wait via the Visa Bulletin.",
    requirements: ["Son/daughter is unmarried and 21 or older", "Petitioner is a U.S. citizen parent", "Priority date must be current for country of birth"],
    timeline: "7–10+ years",
    color: "bg-rose-50 border-rose-200 text-rose-900",
    badge: "bg-rose-100 text-rose-700",
  },
  {
    category: "F2A",
    title: "Spouses & Unmarried Children (Under 21) of Green Card Holders",
    description: "Second preference (A) category for the spouse and minor unmarried children of a lawful permanent resident. Usually the fastest-moving preference category.",
    requirements: ["Petitioner is a lawful permanent resident (not yet a U.S. citizen)", "Beneficiary is the LPR's spouse, or unmarried child under 21", "Priority date must be current — F2A moves relatively quickly"],
    timeline: "2–5 years",
    color: "bg-pink-50 border-pink-200 text-pink-900",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    category: "F2B",
    title: "Unmarried Sons/Daughters (21+) of Green Card Holders",
    description: "Second preference (B) category for adult unmarried children of a lawful permanent resident.",
    requirements: ["Petitioner is a lawful permanent resident", "Son/daughter is unmarried and 21 or older", "Priority date must be current for country of birth"],
    timeline: "5–10+ years",
    color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900",
    badge: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    category: "F3",
    title: "Married Sons/Daughters of U.S. Citizens",
    description: "Third preference category for married children of a U.S. citizen, regardless of age.",
    requirements: ["Son/daughter is married (any age)", "Petitioner is a U.S. citizen parent", "Priority date must be current for country of birth"],
    timeline: "10–14+ years",
    color: "bg-rose-50 border-rose-200 text-rose-900",
    badge: "bg-rose-100 text-rose-700",
  },
  {
    category: "F4",
    title: "Siblings of U.S. Citizens",
    description: "Fourth preference category — the longest-backlogged family category, especially for Mexico, India, and the Philippines.",
    requirements: ["Petitioning U.S. citizen sibling must be 21 or older", "Both petitioner and beneficiary share at least one legal parent", "Priority date must be current — often the longest wait of any category"],
    timeline: "14–24+ years",
    color: "bg-pink-50 border-pink-200 text-pink-900",
    badge: "bg-pink-100 text-pink-700",
  },
];

export const FAMILY_PROCESS_STEPS: { title: string; desc: string }[] = [
  { title: "Confirm the Relationship Category", desc: "Determine whether your relationship falls under Immediate Relative (no wait) or a numbered Family Preference category (F1–F4, priority-date wait required)." },
  { title: "Petitioner Files Form I-130", desc: "The U.S. citizen or lawful permanent resident relative files Form I-130 (Petition for Alien Relative) to establish the qualifying family relationship. This alone does not grant any status — it only establishes eligibility." },
  { title: "Wait for a Priority Date (Preference Categories Only)", desc: "Immediate relatives skip this step entirely. Preference categories (F1–F4) must wait for their priority date to become current on the monthly Visa Bulletin before moving forward." },
  { title: "Petitioner Files Form I-864 (Affidavit of Support)", desc: "The petitioner must demonstrate household income at or above 125% of the federal poverty line to financially sponsor the beneficiary, or provide a joint sponsor who can." },
  { title: "Consular Processing or Adjustment of Status", desc: "If the beneficiary is outside the U.S., the case goes to the National Visa Center for consular processing and an interview abroad. If already lawfully in the U.S., they may instead file Form I-485 to adjust status." },
  { title: "Biometrics & Interview", desc: "USCIS (or the consulate) schedules biometrics and an in-person interview with both the petitioner and beneficiary to confirm the bona fide relationship." },
  { title: "Green Card Issued", desc: "Approved. Marriages under 2 years at approval receive a conditional 2-year card (Form I-751 removes conditions later); all other categories receive a 10-year renewable card." },
];

export const FAMILY_FAQ: { question: string; answer: string }[] = [
  {
    question: "What's the difference between 'Immediate Relative' and 'Family Preference' categories?",
    answer:
      "Immediate Relative categories (spouse, unmarried child under 21, or parent of a U.S. citizen) have no annual numerical cap, so there's no priority-date wait — the case moves as fast as USCIS/NVC can process it. Family Preference categories (F1–F4) are capped each year, so even after I-130 approval, the beneficiary must wait for their priority date to become current on the Visa Bulletin — this can take anywhere from 2 to 24+ years depending on the category and country of birth.",
  },
  {
    question: "Can I petition for my fiancé(e) using Form I-130?",
    answer:
      "No. Form I-130 is only for someone you are already legally married to. To bring a fiancé(e) to the U.S. to marry, a U.S. citizen must file Form I-129F for a K-1 fiancé(e) visa instead — a different process with its own 90-day marriage requirement after arrival.",
  },
  {
    question: "Can my spouse and children be included on my family petition?",
    answer:
      "In Family Preference categories (F1–F4), the principal beneficiary's spouse and unmarried children under 21 can typically be included as derivative beneficiaries without a separate I-130. In the Immediate Relative category, each family member generally needs their own I-130 filed by the U.S. citizen petitioner, since the immediate relative classification doesn't allow derivatives.",
  },
  {
    question: "What happens if the petitioner dies before the process is complete?",
    answer:
      "Under INA §204(l), certain beneficiaries may still be eligible for the green card if the petitioner dies after I-130 approval, provided the beneficiary was residing in the U.S. at the time of death and continues to reside there. A qualifying relative may also be able to serve as a substitute sponsor for the Affidavit of Support. This is a complex area — consult an immigration attorney promptly if this happens.",
  },
  {
    question: "Can I work or travel while my I-130 or I-485 is pending?",
    answer:
      "Filing Form I-130 alone does not grant any work authorization or travel permission. If you're in the U.S. and have filed Form I-485 to adjust status, you can apply for a combo Employment Authorization Document and Advance Parole travel document (Form I-765/I-131) to work and travel legally while your green card application is pending.",
  },
  {
    question: "What is VAWA and how does it relate to family-based petitions?",
    answer:
      "The Violence Against Women Act (VAWA) allows spouses, children, and parents who have been abused by a U.S. citizen or lawful permanent resident family member to self-petition for a green card — without the abuser's knowledge or cooperation. Despite the name, VAWA self-petitions are available regardless of gender.",
  },
];

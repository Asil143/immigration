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
      { q: "Can my F-2 dependent travel with me or separately?", a: "Yes. Your F-2 spouse or child needs their own valid F-2 visa stamp, a dependent I-20 with a current travel signature, and proof of the relationship (marriage certificate or child's birth certificate). If they travel without you, they should also carry proof of your continued F-1 enrollment or OPT employment." },
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
      { q: "What documents does my H-4 spouse or child need to travel?", a: "A valid H-4 visa stamp, valid passport, their own I-797 approval notice (if one was issued for the H-4), and proof of relationship (marriage certificate or child's birth certificate), plus evidence of the H-1B principal's ongoing employment. If your H-4 spouse has an EAD, they should carry that too, especially if traveling separately." },
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
  {
    icon: "🛂",
    title: "Traveling as a Green Card Holder (Returning Resident)",
    color: "#fdf2f8",
    border: "#fbcfe8",
    items: [
      { q: "How long can I stay outside the US before risking my green card?", a: "There's no hard cutoff, but trips under 6 months are generally safe. Trips between 6 months and 1 year invite extra scrutiny from CBP about whether you've abandoned your residency (job, home, family, taxes). Trips over 1 year create a legal presumption of abandonment unless you have a Re-entry Permit." },
      { q: "What is a Re-entry Permit (Form I-131) and when do I need one?", a: "A Re-entry Permit lets an LPR stay abroad for up to 2 years without triggering the presumption of abandonment. You must file Form I-131 while physically present in the US, then complete biometrics before departing — you generally cannot apply for one from abroad. Get it before an extended trip, not after." },
      { q: "What happens if CBP questions my intent to remain a US resident?", a: "A CBP officer may ask about your ties to the US — job, home, tax filings, family — and can send you to secondary inspection. They may ask you to sign Form I-407 (voluntary relinquishment of status). You are NOT required to sign it; you can instead request a hearing before an immigration judge to contest any abandonment finding." },
      { q: "Do I still need to file US taxes while living abroad long-term?", a: "Yes. As an LPR you must continue filing US federal taxes as a resident no matter where you live, and report worldwide income. Filing as a 'nonresident' or not filing at all can be used as evidence that you abandoned your residency." },
    ],
  },
  {
    icon: "🌍",
    title: "Traveling on J-1 / J-2 Status",
    color: "#ecfeff",
    border: "#a5f3fc",
    items: [
      { q: "How long is my DS-2019 travel signature valid?", a: "A travel signature from your Responsible Officer (RO) or Alternate RO is valid for 12 months for most exchange visitors, but only 6 months for students. Get a fresh signature before any trip if yours is close to expiring — you need a current one to re-enter." },
      { q: "What documents do J-1/J-2 travelers need to re-enter the US?", a: "A valid J-1 (or J-2) visa stamp, valid passport, DS-2019 with a current travel signature, and proof of program funding or financial support. If your program charges a SEVIS fee, keep your payment receipt in case it's requested." },
      { q: "What is the two-year home residency requirement and does it affect travel?", a: "Some J-1 participants (and their J-2 dependents) are subject to INA 212(e), requiring 2 years in their home country before they're eligible for an H or L visa or a green card. Being subject to 212(e) does not restrict travel while you're in J status, but you may want to carry documentation of your 212(e) status if you're pursuing a waiver." },
      { q: "Can my J-2 dependent travel separately from me?", a: "Yes. Your J-2 spouse or child needs their own valid J-2 visa, their own DS-2019 with a current travel signature, and proof of the relationship (marriage or birth certificate). They should also carry evidence of your continued J-1 program status." },
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
  { item: "DS-2019 with travel signature (J-1/J-2)", required: false },
  { item: "Re-entry Permit (if outside US 1+ year as LPR)", required: false },
  { item: "Marriage or birth certificate (if traveling with a dependent visa holder)", required: false },
];

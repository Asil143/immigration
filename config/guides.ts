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

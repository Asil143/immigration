export interface I765Question {
  id: string;
  part: string;
  partTitle: string;
  label: string;
  question: string;
  hint: string;
  optional?: boolean;
  options?: string[];
}

export const I765_PARTS = [
  { id: "Part 1", title: "Reason for Applying" },
  { id: "Part 2", title: "Personal Information" },
  { id: "Part 3", title: "Contact & Address" },
  { id: "Part 4", title: "School & Program Information" },
  { id: "Part 5", title: "OPT / STEM OPT Details" },
];

export const I765_QUESTIONS: I765Question[] = [
  // ── Part 1: Reason for Applying ──────────────────────────────────────────────
  {
    id: "eligibility_category",
    part: "Part 1",
    partTitle: "Reason for Applying",
    label: "Eligibility Category",
    question:
      "Welcome! Let's fill out Form I-765 (Application for Employment Authorization) together.\n\nWhich type of OPT are you applying for?",
    hint: "Select one",
    options: [
      "(c)(3)(A) — Pre-Completion OPT (before graduation)",
      "(c)(3)(B) — Post-Completion OPT (after graduation)",
      "(c)(3)(C) — STEM OPT Extension (24-month)",
    ],
  },
  {
    id: "application_reason",
    part: "Part 1",
    partTitle: "Reason for Applying",
    label: "Application Reason",
    question: "Is this an initial OPT application or a renewal/extension?",
    hint: "Select one",
    options: [
      "Initial application",
      "Replacement EAD (lost/stolen/damaged)",
      "Renewal / Extension",
    ],
  },

  // ── Part 2: Personal Information ─────────────────────────────────────────────
  {
    id: "family_name",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "Family Name (Last Name)",
    question: "What is your family name (last name) exactly as it appears on your passport?",
    hint: "e.g., Patel",
  },
  {
    id: "given_name",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "Given Name (First Name)",
    question: "What is your given name (first name)?",
    hint: "e.g., Rahul",
  },
  {
    id: "middle_name",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "Middle Name",
    question: "What is your middle name? (Type 'N/A' if none)",
    hint: "e.g., Kumar or N/A",
    optional: true,
  },
  {
    id: "other_names",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "Other Names Used",
    question: "Have you used any other names — maiden name, alias, nickname, or name before marriage? If yes, list them. If not, type 'N/A'.",
    hint: "e.g., Jane Doe or N/A",
    optional: true,
  },
  {
    id: "date_of_birth",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "Date of Birth",
    question: "What is your date of birth?",
    hint: "e.g., 08/15/1999",
  },
  {
    id: "city_of_birth",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "City/Town of Birth",
    question: "What city or town were you born in?",
    hint: "e.g., Mumbai",
  },
  {
    id: "country_of_birth",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "Country of Birth",
    question: "What country were you born in?",
    hint: "e.g., India",
  },
  {
    id: "country_of_citizenship",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "Country of Citizenship",
    question: "What country are you a citizen of? (If dual citizen, list both)",
    hint: "e.g., India",
  },
  {
    id: "gender",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "Gender",
    question: "What is your gender as shown on your passport?",
    hint: "Select one",
    options: ["Male", "Female", "Nonbinary"],
  },
  {
    id: "a_number",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "Alien Registration Number (A-Number)",
    question: "Do you have an Alien Registration Number (A-Number)? It starts with 'A' followed by 8 or 9 digits. Type 'N/A' if you don't have one.",
    hint: "e.g., A 123 456 789 or N/A",
    optional: true,
  },
  {
    id: "sevis_id",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "SEVIS ID Number",
    question: "What is your SEVIS ID number? You can find it on your I-20 (starts with 'N' followed by 9 or 10 digits).",
    hint: "e.g., N0012345678",
  },
  {
    id: "ssn",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "U.S. Social Security Number",
    question: "Do you have a U.S. Social Security Number (SSN)? If yes, enter it. If not, type 'N/A'.",
    hint: "e.g., 123-45-6789 or N/A",
    optional: true,
  },

  // ── Part 3: Contact & Address ─────────────────────────────────────────────────
  {
    id: "mailing_street",
    part: "Part 3",
    partTitle: "Contact & Address",
    label: "Mailing Address — Street",
    question: "What is your current mailing address — street number and name? (include Apt/Suite if applicable)",
    hint: "e.g., 123 University Ave, Apt 4B",
  },
  {
    id: "mailing_city",
    part: "Part 3",
    partTitle: "Contact & Address",
    label: "Mailing Address — City",
    question: "What city do you live in?",
    hint: "e.g., Boston",
  },
  {
    id: "mailing_state",
    part: "Part 3",
    partTitle: "Contact & Address",
    label: "Mailing Address — State",
    question: "What state? (2-letter code)",
    hint: "e.g., MA",
  },
  {
    id: "mailing_zip",
    part: "Part 3",
    partTitle: "Contact & Address",
    label: "Mailing Address — ZIP Code",
    question: "What is your ZIP code?",
    hint: "e.g., 02139",
  },
  {
    id: "email",
    part: "Part 3",
    partTitle: "Contact & Address",
    label: "Email Address",
    question: "What is your email address?",
    hint: "e.g., rahul@university.edu",
  },
  {
    id: "daytime_phone",
    part: "Part 3",
    partTitle: "Contact & Address",
    label: "Daytime Phone Number",
    question: "What is your daytime phone number (U.S. number preferred)?",
    hint: "e.g., (617) 555-1234",
  },

  // ── Part 4: School & Program ──────────────────────────────────────────────────
  {
    id: "school_name",
    part: "Part 4",
    partTitle: "School & Program Information",
    label: "School Name",
    question: "What is the full official name of your school (as it appears on your I-20)?",
    hint: "e.g., Massachusetts Institute of Technology",
  },
  {
    id: "school_city",
    part: "Part 4",
    partTitle: "School & Program Information",
    label: "School City & State",
    question: "What city and state is your school in?",
    hint: "e.g., Cambridge, MA",
  },
  {
    id: "degree_level",
    part: "Part 4",
    partTitle: "School & Program Information",
    label: "Degree Level",
    question: "What degree level are you pursuing (or did you complete for post-completion OPT)?",
    hint: "Select one",
    options: [
      "Associate's",
      "Bachelor's",
      "Master's",
      "Doctorate (PhD)",
      "Certificate / Other",
    ],
  },
  {
    id: "major_field",
    part: "Part 4",
    partTitle: "School & Program Information",
    label: "Major / Field of Study",
    question: "What is your major or field of study (as shown on your I-20 and transcript)?",
    hint: "e.g., Computer Science, Electrical Engineering",
  },
  {
    id: "graduation_date",
    part: "Part 4",
    partTitle: "School & Program Information",
    label: "Graduation Date",
    question: "What is your graduation date (or expected graduation date)? This should match your I-20.",
    hint: "e.g., 05/15/2024",
  },
  {
    id: "i20_expiry",
    part: "Part 4",
    partTitle: "School & Program Information",
    label: "I-20 Program End Date",
    question: "What is the program end date on your current I-20?",
    hint: "e.g., 08/31/2024",
  },

  // ── Part 5: OPT / STEM Details ────────────────────────────────────────────────
  {
    id: "opt_start_date",
    part: "Part 5",
    partTitle: "OPT / STEM OPT Details",
    label: "Requested OPT Start Date",
    question:
      "What start date are you requesting for your OPT? This should be:\n• At least 3 business days after filing\n• No more than 60 days after graduation (post-completion OPT)\n• No earlier than 90 days before graduation (pre-completion OPT)",
    hint: "e.g., 06/01/2024",
  },
  {
    id: "opt_end_date",
    part: "Part 5",
    partTitle: "OPT / STEM OPT Details",
    label: "Requested OPT End Date",
    question: "What end date are you requesting? Standard OPT is 12 months from the start date. STEM OPT extension adds 24 months.",
    hint: "e.g., 05/31/2025",
  },
  {
    id: "stem_degree",
    part: "Part 5",
    partTitle: "OPT / STEM OPT Details",
    label: "STEM Degree Used for Extension",
    question:
      "STEM OPT only: Which STEM degree are you using to qualify for the extension? Include field of study and school name. (Type 'N/A' if applying for standard OPT.)",
    hint: "e.g., MS Computer Science, MIT — or N/A",
    optional: true,
  },
  {
    id: "employer_name",
    part: "Part 5",
    partTitle: "OPT / STEM OPT Details",
    label: "Employer Name (STEM OPT)",
    question:
      "STEM OPT only: What is the name of your employer (must be E-Verify enrolled)? Type 'N/A' if applying for standard OPT or if you don't have an employer yet.",
    hint: "e.g., Google LLC or N/A",
    optional: true,
  },
  {
    id: "employer_ein",
    part: "Part 5",
    partTitle: "OPT / STEM OPT Details",
    label: "Employer EIN (STEM OPT)",
    question:
      "STEM OPT only: What is your employer's EIN (Employer Identification Number)? You can find it on your offer letter or W-2. Type 'N/A' if not applicable.",
    hint: "e.g., 12-3456789 or N/A",
    optional: true,
  },
];

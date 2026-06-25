export interface I131Question {
  id: string;
  part: string;
  partTitle: string;
  label: string;
  question: string;
  hint: string;
  optional?: boolean;
  options?: string[];
}

export const I131_PARTS = [
  { id: "Part 1", title: "Type of Application" },
  { id: "Part 2", title: "Personal Information" },
  { id: "Part 3", title: "Travel Information" },
  { id: "Part 4", title: "Eligibility & Basis" },
  { id: "Part 5", title: "Contact & Address" },
];

export const I131_QUESTIONS: I131Question[] = [
  // ── Part 1: Type of Application ──────────────────────────────────────────────
  {
    id: "application_type",
    part: "Part 1",
    partTitle: "Type of Application",
    label: "Type of Travel Document",
    question:
      "Welcome! Let's fill out Form I-131 (Application for Travel Document) together.\n\nWhat type of travel document are you applying for?",
    hint: "Select one",
    options: [
      "Advance Parole — I have a pending I-485 (green card application)",
      "Advance Parole — Other basis (TPS, asylum pending, etc.)",
      "Refugee Travel Document — I am a refugee or asylee",
      "Re-entry Permit — I am a Lawful Permanent Resident (LPR)",
    ],
  },
  {
    id: "application_reason",
    part: "Part 1",
    partTitle: "Type of Application",
    label: "Reason for Travel",
    question: "What is the main reason you need to travel outside the United States?",
    hint: "e.g., Family emergency, job, vacation, medical",
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
    question: "Middle name? (Type 'N/A' if none)",
    hint: "e.g., Kumar or N/A",
    optional: true,
  },
  {
    id: "date_of_birth",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "Date of Birth",
    question: "What is your date of birth?",
    hint: "e.g., 08/15/1995",
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
    question: "What country are you currently a citizen of?",
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
    question: "What is your A-Number? It starts with 'A' followed by 8 or 9 digits. You can find it on your green card, EAD, or I-797 notice. Type 'N/A' if you don't have one yet.",
    hint: "e.g., A 123 456 789 or N/A",
    optional: true,
  },
  {
    id: "ssn",
    part: "Part 2",
    partTitle: "Personal Information",
    label: "U.S. Social Security Number",
    question: "Do you have a U.S. Social Security Number? Type 'N/A' if not.",
    hint: "e.g., 123-45-6789 or N/A",
    optional: true,
  },

  // ── Part 3: Travel Information ────────────────────────────────────────────────
  {
    id: "countries_to_visit",
    part: "Part 3",
    partTitle: "Travel Information",
    label: "Countries to Visit",
    question: "Which countries do you plan to visit? List all of them.",
    hint: "e.g., India, UK",
  },
  {
    id: "departure_date",
    part: "Part 3",
    partTitle: "Travel Information",
    label: "Expected Date of Departure",
    question: "When do you plan to depart the United States? If you don't have a specific date yet, give an approximate date.",
    hint: "e.g., 09/15/2025",
  },
  {
    id: "return_date",
    part: "Part 3",
    partTitle: "Travel Information",
    label: "Expected Date of Return",
    question: "When do you plan to return to the United States?",
    hint: "e.g., 10/01/2025",
  },
  {
    id: "trip_duration",
    part: "Part 3",
    partTitle: "Travel Information",
    label: "Total Trip Duration",
    question: "How long total do you plan to be outside the U.S.? (This helps USCIS determine the validity period to grant)",
    hint: "e.g., 2 weeks, 1 month",
  },
  {
    id: "previously_issued_ap",
    part: "Part 3",
    partTitle: "Travel Information",
    label: "Prior Advance Parole",
    question: "Have you ever been issued an Advance Parole or other USCIS travel document before? If yes, give the document number and expiry date. If no, type 'No'.",
    hint: "e.g., No — or Yes, AP doc #XXXXX, expired 01/2024",
    optional: true,
  },

  // ── Part 4: Eligibility & Basis ───────────────────────────────────────────────
  {
    id: "i485_receipt",
    part: "Part 4",
    partTitle: "Eligibility & Basis",
    label: "I-485 Receipt Number",
    question:
      "If you have a pending I-485 (Adjustment of Status), what is your I-485 receipt number? You can find it on your I-797 notice. Type 'N/A' if not applicable.",
    hint: "e.g., MSC2412345678 or N/A",
    optional: true,
  },
  {
    id: "i485_filed_date",
    part: "Part 4",
    partTitle: "Eligibility & Basis",
    label: "I-485 Filing Date",
    question: "When was your I-485 filed? Type 'N/A' if not applicable.",
    hint: "e.g., 03/10/2024 or N/A",
    optional: true,
  },
  {
    id: "current_status",
    part: "Part 4",
    partTitle: "Eligibility & Basis",
    label: "Current Immigration Status",
    question: "What is your current U.S. immigration status?",
    hint: "Select one",
    options: [
      "F-1 (OPT / STEM OPT)",
      "H-1B or H-4",
      "L-1A or L-1B",
      "TPS (Temporary Protected Status)",
      "Asylee / Refugee",
      "Lawful Permanent Resident (Green Card)",
      "Parolee",
      "Other",
    ],
  },
  {
    id: "removal_proceedings",
    part: "Part 4",
    partTitle: "Eligibility & Basis",
    label: "Removal Proceedings",
    question: "Are you currently in removal, deportation, or exclusion proceedings before an immigration court?",
    hint: "Select one",
    options: ["No", "Yes"],
  },

  // ── Part 5: Address & Contact ─────────────────────────────────────────────────
  {
    id: "mailing_street",
    part: "Part 5",
    partTitle: "Contact & Address",
    label: "Mailing Address — Street",
    question: "What is your current mailing address — street number and name? (include Apt/Suite if applicable)",
    hint: "e.g., 123 Oak St, Apt 2C",
  },
  {
    id: "mailing_city",
    part: "Part 5",
    partTitle: "Contact & Address",
    label: "City",
    question: "What city?",
    hint: "e.g., Chicago",
  },
  {
    id: "mailing_state",
    part: "Part 5",
    partTitle: "Contact & Address",
    label: "State",
    question: "What state? (2-letter code)",
    hint: "e.g., IL",
  },
  {
    id: "mailing_zip",
    part: "Part 5",
    partTitle: "Contact & Address",
    label: "ZIP Code",
    question: "What is your ZIP code?",
    hint: "e.g., 60614",
  },
  {
    id: "daytime_phone",
    part: "Part 5",
    partTitle: "Contact & Address",
    label: "Daytime Phone",
    question: "What is your daytime phone number?",
    hint: "e.g., (312) 555-1234",
  },
  {
    id: "email",
    part: "Part 5",
    partTitle: "Contact & Address",
    label: "Email Address",
    question: "What is your email address?",
    hint: "e.g., rahul@email.com",
  },
];

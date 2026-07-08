export interface I539Question {
  id: string;
  part: string;
  partTitle: string;
  label: string;
  question: string;
  hint: string;
  optional?: boolean;
  options?: string[];
}

export const I539_PARTS = [
  { id: "Part 1", title: "Reason for Application" },
  { id: "Part 2", title: "Information About You" },
  { id: "Part 3", title: "Application Type & Address" },
  { id: "Part 4", title: "Additional Information" },
  { id: "Part 5", title: "Contact Information" },
];

export const I539_QUESTIONS: I539Question[] = [
  // ── Part 1: Reason for Application ───────────────────────────────────────────
  {
    id: "application_reason",
    part: "Part 1",
    partTitle: "Reason for Application",
    label: "Reason for Application",
    question:
      "Welcome! Let's fill out Form I-539 (Application to Extend/Change Nonimmigrant Status) together.\n\nAre you asking to extend your current nonimmigrant status, or to change to a different nonimmigrant status?",
    hint: "Select one",
    options: [
      "Extension of stay in the same status",
      "Change to a different nonimmigrant status",
      "Reinstatement to student or exchange visitor status",
    ],
  },
  {
    id: "new_status_requested",
    part: "Part 1",
    partTitle: "Reason for Application",
    label: "New Status Requested",
    question:
      "If you're changing status, which nonimmigrant category are you requesting? (Type 'N/A' if you're only extending your current status.)",
    hint: "Select one",
    options: [
      "B-1 (Business Visitor)",
      "B-2 (Tourist/Visitor)",
      "F-1 (Student)",
      "F-2 (Dependent of F-1)",
      "H-4 (Dependent of H-1B)",
      "J-2 (Dependent of J-1)",
      "L-2 (Dependent of L-1)",
      "N/A — extending same status",
    ],
    optional: true,
  },

  // ── Part 2: Information About You ────────────────────────────────────────────
  {
    id: "family_name",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Family Name (Last Name)",
    question: "What is your family name (last name) exactly as it appears on your passport?",
    hint: "e.g., Nguyen",
  },
  {
    id: "given_name",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Given Name (First Name)",
    question: "What is your given name (first name)?",
    hint: "e.g., Linh",
  },
  {
    id: "middle_name",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Middle Name",
    question: "What is your middle name? (Type 'N/A' if none)",
    hint: "e.g., Thi or N/A",
    optional: true,
  },
  {
    id: "a_number",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Alien Registration Number (A-Number)",
    question: "Do you have an Alien Registration Number (A-Number)? It starts with 'A' followed by 8 or 9 digits. Type 'N/A' if you don't have one.",
    hint: "e.g., A 123 456 789 or N/A",
    optional: true,
  },
  {
    id: "uscis_account_number",
    part: "Part 2",
    partTitle: "Information About You",
    label: "USCIS Online Account Number",
    question: "Do you have a USCIS Online Account Number (if you've filed anything online with USCIS before)? Type 'N/A' if not.",
    hint: "e.g., 1234567890 or N/A",
    optional: true,
  },
  {
    id: "date_of_birth",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Date of Birth",
    question: "What is your date of birth?",
    hint: "e.g., 03/22/1996",
  },
  {
    id: "country_of_birth",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Country of Birth",
    question: "What country were you born in?",
    hint: "e.g., Vietnam",
  },
  {
    id: "country_of_citizenship",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Country of Citizenship",
    question: "What country are you a citizen of? (If dual citizen, list both)",
    hint: "e.g., Vietnam",
  },
  {
    id: "ssn",
    part: "Part 2",
    partTitle: "Information About You",
    label: "U.S. Social Security Number",
    question: "Do you have a U.S. Social Security Number (SSN)? If yes, enter it. If not, type 'N/A'.",
    hint: "e.g., 123-45-6789 or N/A",
    optional: true,
  },
  {
    id: "current_status",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Current Nonimmigrant Status",
    question: "What is your current nonimmigrant status (as shown on your most recent I-94)?",
    hint: "Select one",
    options: [
      "B-1 (Business Visitor)",
      "B-2 (Tourist/Visitor)",
      "F-1 (Student)",
      "F-2 (Dependent of F-1)",
      "H-1B (Specialty Occupation Worker)",
      "H-4 (Dependent of H-1B)",
      "J-1 (Exchange Visitor)",
      "J-2 (Dependent of J-1)",
      "L-1 or L-2",
      "Other",
    ],
  },
  {
    id: "status_expiry_date",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Date Current Status Expires",
    question: "What date does your current authorized stay expire? You'll find this as the 'Admit Until Date' on your I-94.",
    hint: "e.g., 09/30/2026",
  },
  {
    id: "i94_number",
    part: "Part 2",
    partTitle: "Information About You",
    label: "I-94 Arrival/Departure Record Number",
    question: "What is your I-94 number? You can look this up and print your I-94 at i94.cbp.dhs.gov.",
    hint: "e.g., 12345678901",
  },
  {
    id: "passport_number",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Passport Number",
    question: "What is your passport number?",
    hint: "e.g., N1234567",
  },
  {
    id: "passport_country",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Passport Country of Issuance",
    question: "Which country issued your passport?",
    hint: "e.g., Vietnam",
  },
  {
    id: "passport_expiry",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Passport Expiration Date",
    question: "When does your passport expire?",
    hint: "e.g., 11/14/2029",
  },

  // ── Part 3: Application Type & Address ───────────────────────────────────────
  {
    id: "mailing_street",
    part: "Part 3",
    partTitle: "Application Type & Address",
    label: "U.S. Mailing Address — Street",
    question: "What is your current U.S. mailing address — street number and name? (include Apt/Suite if applicable)",
    hint: "e.g., 45 Riverside Dr, Apt 2C",
  },
  {
    id: "mailing_city",
    part: "Part 3",
    partTitle: "Application Type & Address",
    label: "U.S. Mailing Address — City",
    question: "What city do you live in?",
    hint: "e.g., Austin",
  },
  {
    id: "mailing_state",
    part: "Part 3",
    partTitle: "Application Type & Address",
    label: "U.S. Mailing Address — State",
    question: "What state? (2-letter code)",
    hint: "e.g., TX",
  },
  {
    id: "mailing_zip",
    part: "Part 3",
    partTitle: "Application Type & Address",
    label: "U.S. Mailing Address — ZIP Code",
    question: "What is your ZIP code?",
    hint: "e.g., 78701",
  },
  {
    id: "family_application",
    part: "Part 3",
    partTitle: "Application Type & Address",
    label: "Family Filing Together",
    question: "Is this application for you alone, or are family members (spouse/children) applying together with you on this same request?",
    hint: "Select one",
    options: [
      "Just me (single applicant)",
      "Me and my family members (co-applicants)",
    ],
  },
  {
    id: "status_granted_date",
    part: "Part 3",
    partTitle: "Application Type & Address",
    label: "Date Current Status Was Granted",
    question: "What date were you last granted your current status (the date on your most recent I-94 or approval notice)?",
    hint: "e.g., 08/15/2025",
  },
  {
    id: "reason_for_request",
    part: "Part 3",
    partTitle: "Application Type & Address",
    label: "Reason for Extension/Change",
    question: "In a sentence or two, why are you requesting this extension or change of status? (This helps us write the required explanation statement.)",
    hint: "e.g., My academic program was extended by one semester",
  },

  // ── Part 4: Additional Information ───────────────────────────────────────────
  {
    id: "current_employer_school",
    part: "Part 4",
    partTitle: "Additional Information",
    label: "Current Employer or School",
    question: "Do you currently have a U.S. employer or are you enrolled at a U.S. school? If so, what is its name? Type 'N/A' if neither applies.",
    hint: "e.g., University of Texas at Austin or N/A",
    optional: true,
  },
  {
    id: "unauthorized_employment",
    part: "Part 4",
    partTitle: "Additional Information",
    label: "Unauthorized Employment",
    question: "Have you or any co-applicant included in this request ever worked in the U.S. without authorization?",
    hint: "Select one",
    options: ["No", "Yes"],
  },
  {
    id: "removal_proceedings",
    part: "Part 4",
    partTitle: "Additional Information",
    label: "Removal/Deportation Proceedings",
    question: "Have you or any co-applicant ever been in removal, deportation, or exclusion proceedings before an immigration court?",
    hint: "Select one",
    options: ["No", "Yes"],
  },

  // ── Part 5: Contact Information ───────────────────────────────────────────────
  {
    id: "daytime_phone",
    part: "Part 5",
    partTitle: "Contact Information",
    label: "Daytime Phone Number",
    question: "What is your daytime phone number?",
    hint: "e.g., (512) 555-0198",
  },
  {
    id: "email",
    part: "Part 5",
    partTitle: "Contact Information",
    label: "Email Address",
    question: "What is your email address?",
    hint: "e.g., linh@example.com",
  },
];

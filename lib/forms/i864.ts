export interface I864Question {
  id: string;
  section: string;
  sectionTitle: string;
  label: string;
  question: string;
  hint: string;
  optional?: boolean;
}

export const I864_QUESTIONS: I864Question[] = [
  // Part 1
  {
    id: "basis",
    section: "Part 1",
    sectionTitle: "Basis for Filing",
    label: "Relationship to Immigrant",
    question:
      "Welcome! I'll guide you through the I-864 Affidavit of Support step by step.\n\nFirst — what is your relationship to the immigrant you're sponsoring? For example: spouse, parent, child, sibling, or other family member.",
    hint: "e.g., Spouse, Parent, Child, Sibling",
  },

  // Part 2: Sponsor info
  {
    id: "sponsor_family_name",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "Family Name (Last Name)",
    question: "What is your family name (last name)?",
    hint: "e.g., Smith",
  },
  {
    id: "sponsor_given_name",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "Given Name (First Name)",
    question: "What is your given name (first name)?",
    hint: "e.g., John",
  },
  {
    id: "sponsor_middle_name",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "Middle Name",
    question: "What is your middle name? (Type 'none' if you don't have one)",
    hint: "e.g., Michael",
    optional: true,
  },
  {
    id: "sponsor_address_street",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "Street Address",
    question:
      "What is your current home street address? Include house number, street name, and apartment number if any.",
    hint: "e.g., 123 Main Street Apt 4B",
  },
  {
    id: "sponsor_address_city",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "City",
    question: "What city do you live in?",
    hint: "e.g., Houston",
  },
  {
    id: "sponsor_address_state",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "State",
    question: "What state do you live in?",
    hint: "e.g., TX",
  },
  {
    id: "sponsor_address_zip",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "ZIP Code",
    question: "What is your ZIP code?",
    hint: "e.g., 77001",
  },
  {
    id: "sponsor_dob",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "Date of Birth",
    question: "What is your date of birth?",
    hint: "MM/DD/YYYY",
  },
  {
    id: "sponsor_ssn",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "U.S. Social Security Number",
    question:
      "What is your U.S. Social Security Number? (This stays private and is only for the form)",
    hint: "XXX-XX-XXXX",
  },
  {
    id: "sponsor_phone",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "Daytime Phone Number",
    question: "What is your daytime phone number?",
    hint: "e.g., (713) 555-1234",
  },
  {
    id: "sponsor_citizenship",
    section: "Part 2",
    sectionTitle: "Information About You (Sponsor)",
    label: "Citizenship / Immigration Status",
    question:
      "What is your U.S. citizenship or immigration status?\n• U.S. Citizen by birth or naturalization\n• U.S. National\n• Lawful Permanent Resident (Green Card holder)",
    hint: "e.g., U.S. Citizen",
  },

  // Part 3
  {
    id: "household_size",
    section: "Part 3",
    sectionTitle: "Household Size",
    label: "Total Household Members",
    question:
      "How many people are in your household? Count yourself, your spouse (if applicable), all dependents listed on your tax return, and the immigrant(s) you're sponsoring.",
    hint: "e.g., 4",
  },

  // Part 4
  {
    id: "employment_status",
    section: "Part 4",
    sectionTitle: "Employment & Income",
    label: "Employment Status",
    question:
      "What is your current employment status?\n• Employed (full-time or part-time)\n• Self-employed\n• Retired\n• Unemployed",
    hint: "e.g., Employed",
  },
  {
    id: "employer_name",
    section: "Part 4",
    sectionTitle: "Employment & Income",
    label: "Employer / Business Name",
    question:
      "What is your employer's name? (If self-employed, write your business name. If retired or unemployed, say so.)",
    hint: "e.g., Google LLC",
  },
  {
    id: "occupation",
    section: "Part 4",
    sectionTitle: "Employment & Income",
    label: "Occupation / Job Title",
    question: "What is your job title or occupation?",
    hint: "e.g., Software Engineer",
  },
  {
    id: "annual_income",
    section: "Part 4",
    sectionTitle: "Employment & Income",
    label: "Current Annual Income",
    question:
      "What is your current annual income (before taxes)? Please give the dollar amount.",
    hint: "e.g., $85,000",
  },

  // Part 7: Immigrant contact info
  {
    id: "immigrant_family_name",
    section: "Part 7",
    sectionTitle: "Immigrant's Information",
    label: "Immigrant's Family Name",
    question:
      "Great, almost done! Now a few questions about the immigrant.\n\nWhat is their family name (last name)?",
    hint: "e.g., Patel",
  },
  {
    id: "immigrant_given_name",
    section: "Part 7",
    sectionTitle: "Immigrant's Information",
    label: "Immigrant's Given Name",
    question: "What is their given name (first name)?",
    hint: "e.g., Priya",
  },
  {
    id: "immigrant_dob",
    section: "Part 7",
    sectionTitle: "Immigrant's Information",
    label: "Immigrant's Date of Birth",
    question: "What is their date of birth?",
    hint: "MM/DD/YYYY",
  },
  {
    id: "immigrant_country_of_birth",
    section: "Part 7",
    sectionTitle: "Immigrant's Information",
    label: "Immigrant's Country of Birth",
    question: "What country were they born in?",
    hint: "e.g., India",
  },
  {
    id: "immigrant_visa_category",
    section: "Part 7",
    sectionTitle: "Immigrant's Information",
    label: "Immigrant Visa Category",
    question:
      "What immigrant visa category are they applying for?\n• IR-1 — Spouse of U.S. Citizen\n• IR-2/CR-2 — Child of U.S. Citizen\n• IR-5 — Parent of U.S. Citizen\n• F-2A — Spouse/child of LPR\n• Other (please specify)",
    hint: "e.g., IR-1",
  },
];

export const I864_SECTIONS = [
  { id: "Part 1", title: "Basis for Filing" },
  { id: "Part 2", title: "Information About You (Sponsor)" },
  { id: "Part 3", title: "Household Size" },
  { id: "Part 4", title: "Employment & Income" },
  { id: "Part 7", title: "Immigrant's Information" },
];

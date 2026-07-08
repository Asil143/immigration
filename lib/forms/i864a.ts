export interface I864AQuestion {
  id: string;
  part: string;
  partTitle: string;
  label: string;
  question: string;
  hint: string;
  optional?: boolean;
  options?: string[];
}

export const I864A_PARTS = [
  { id: "Part 1", title: "Basis for Contract" },
  { id: "Part 2", title: "Household Member's Information" },
  { id: "Part 3", title: "Household Member's Income and Employment" },
  { id: "Part 4", title: "Contact Information and Certification" },
];

export const I864A_QUESTIONS: I864AQuestion[] = [
  // ── Part 1: Basis for Contract ───────────────────────────────────────────────
  {
    id: "relationship_to_sponsor",
    part: "Part 1",
    partTitle: "Basis for Contract",
    label: "Relationship to Sponsor",
    question:
      "Welcome! Let's fill out Form I-864A (Contract Between Sponsor and Household Member) together.\n\nThis form lets you combine your income with the sponsor's to help meet the income requirement for Form I-864.\n\nFirst — what is your relationship to the sponsor?",
    hint: "Select one",
    options: [
      "Spouse of the sponsor",
      "Adult child of the sponsor",
      "Parent of the sponsor",
      "Sibling of the sponsor",
      "Other relative of the sponsor",
      "Dependent listed on the sponsor's most recent tax return",
    ],
  },
  {
    id: "basis_role",
    part: "Part 1",
    partTitle: "Basis for Contract",
    label: "Role in This Contract",
    question: "Are you the intending immigrant yourself, or a household member combining income with the sponsor?",
    hint: "Select one",
    options: [
      "I am a household member combining income with the sponsor",
      "I am the intending immigrant and a member of the sponsor's household",
    ],
  },

  // ── Part 2: Household Member's Information ───────────────────────────────────
  {
    id: "family_name",
    part: "Part 2",
    partTitle: "Household Member's Information",
    label: "Family Name (Last Name)",
    question: "What is your family name (last name) exactly as it appears on your government-issued ID?",
    hint: "e.g., Gonzalez",
  },
  {
    id: "given_name",
    part: "Part 2",
    partTitle: "Household Member's Information",
    label: "Given Name (First Name)",
    question: "What is your given name (first name)?",
    hint: "e.g., Maria",
  },
  {
    id: "middle_name",
    part: "Part 2",
    partTitle: "Household Member's Information",
    label: "Middle Name",
    question: "Middle name? (Type 'N/A' if none)",
    hint: "e.g., Elena or N/A",
    optional: true,
  },
  {
    id: "date_of_birth",
    part: "Part 2",
    partTitle: "Household Member's Information",
    label: "Date of Birth",
    question: "What is your date of birth?",
    hint: "e.g., 04/22/1988",
  },
  {
    id: "ssn",
    part: "Part 2",
    partTitle: "Household Member's Information",
    label: "U.S. Social Security Number",
    question: "What is your U.S. Social Security Number?",
    hint: "e.g., 123-45-6789",
  },
  {
    id: "mailing_street",
    part: "Part 2",
    partTitle: "Household Member's Information",
    label: "Mailing Address — Street",
    question: "What is your current mailing address — street number and name? (include Apt/Suite if applicable)",
    hint: "e.g., 456 Elm St, Apt 3B",
  },
  {
    id: "mailing_city",
    part: "Part 2",
    partTitle: "Household Member's Information",
    label: "City",
    question: "What city or town?",
    hint: "e.g., Phoenix",
  },
  {
    id: "mailing_state",
    part: "Part 2",
    partTitle: "Household Member's Information",
    label: "State",
    question: "What state? (2-letter code)",
    hint: "e.g., AZ",
  },
  {
    id: "mailing_zip",
    part: "Part 2",
    partTitle: "Household Member's Information",
    label: "ZIP Code",
    question: "What is your ZIP code?",
    hint: "e.g., 85001",
  },

  // ── Part 3: Household Member's Income and Employment ─────────────────────────
  {
    id: "current_annual_income",
    part: "Part 3",
    partTitle: "Household Member's Income and Employment",
    label: "Current Individual Annual Income",
    question: "What is your current individual annual income? (Include only your own income, not household total)",
    hint: "e.g., $42,000",
  },
  {
    id: "employer_name",
    part: "Part 3",
    partTitle: "Household Member's Income and Employment",
    label: "Employer Name",
    question: "Who is your current employer? Type 'N/A' if self-employed or not currently employed.",
    hint: "e.g., Trader Joe's or N/A",
    optional: true,
  },
  {
    id: "employer_address",
    part: "Part 3",
    partTitle: "Household Member's Income and Employment",
    label: "Employer Address",
    question: "What is your employer's address? Type 'N/A' if not applicable.",
    hint: "e.g., 789 Market St, Phoenix, AZ 85002",
    optional: true,
  },
  {
    id: "occupation",
    part: "Part 3",
    partTitle: "Household Member's Income and Employment",
    label: "Occupation",
    question: "What is your occupation or job title?",
    hint: "e.g., Store Manager",
  },

  // ── Part 4: Contact Information and Certification ────────────────────────────
  {
    id: "daytime_phone",
    part: "Part 4",
    partTitle: "Contact Information and Certification",
    label: "Daytime Phone",
    question: "What is your daytime phone number?",
    hint: "e.g., (602) 555-0198",
  },
  {
    id: "email",
    part: "Part 4",
    partTitle: "Contact Information and Certification",
    label: "Email Address",
    question: "What is your email address?",
    hint: "e.g., maria@email.com",
  },
  {
    id: "sponsor_full_name",
    part: "Part 4",
    partTitle: "Contact Information and Certification",
    label: "Sponsor's Full Name",
    question: "Finally, what is the full name of the sponsor you're entering this contract with (the person filing Form I-864)?",
    hint: "e.g., John A. Smith",
  },
];

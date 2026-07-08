export interface I90Question {
  id: string;
  part: string;
  partTitle: string;
  label: string;
  question: string;
  hint: string;
  optional?: boolean;
  options?: string[];
}

export const I90_PARTS = [
  { id: "Part 1", title: "Reason for Applying" },
  { id: "Part 2", title: "Information About You" },
  { id: "Part 3", title: "Address History" },
  { id: "Part 4", title: "Additional Information & Contact" },
];

export const I90_QUESTIONS: I90Question[] = [
  // ── Part 1: Reason for Applying ──────────────────────────────────────────────
  {
    id: "reason_for_applying",
    part: "Part 1",
    partTitle: "Reason for Applying",
    label: "Reason for Applying",
    question:
      "Welcome! Let's fill out Form I-90 (Application to Replace Permanent Resident Card) together.\n\nWhat is your main reason for applying?",
    hint: "Select one",
    options: [
      "My card was lost, stolen, or destroyed",
      "My card was never received (I never got the card USCIS mailed)",
      "My card is expiring or has already expired (10-year card)",
      "My card contains incorrect data due to a USCIS error",
      "My name or other biographic information has legally changed",
      "My card was mutilated or damaged",
      "I automatically converted from conditional to permanent resident",
      "I need to correct my status because I was issued a card in error",
      "I need a card for a commercial driver's license / photo ID exception",
      "Other reason",
    ],
  },
  {
    id: "current_card_number",
    part: "Part 1",
    partTitle: "Reason for Applying",
    label: "Current Card Number",
    question: "What is the card number on your current or most recently issued Permanent Resident Card? You can find it on the back of the card. Type 'N/A' if you never received a card.",
    hint: "e.g., SC1234567890 or N/A",
    optional: true,
  },
  {
    id: "card_expiration_date",
    part: "Part 1",
    partTitle: "Reason for Applying",
    label: "Card Expiration Date",
    question: "What is (or was) the expiration date printed on your card? Type 'N/A' if you don't know or never received a card.",
    hint: "e.g., 05/12/2026 or N/A",
    optional: true,
  },

  // ── Part 2: Information About You ────────────────────────────────────────────
  {
    id: "family_name",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Family Name (Last Name)",
    question: "What is your family name (last name) exactly as it appears on your Permanent Resident Card?",
    hint: "e.g., Nguyen",
  },
  {
    id: "given_name",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Given Name (First Name)",
    question: "What is your given name (first name)?",
    hint: "e.g., Minh",
  },
  {
    id: "middle_name",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Middle Name",
    question: "Middle name? (Type 'N/A' if none)",
    hint: "e.g., Van or N/A",
    optional: true,
  },
  {
    id: "other_names_used",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Other Names Used",
    question: "Have you used any other names (maiden name, nickname, alias)? List them, or type 'N/A' if none.",
    hint: "e.g., Maiden name: Tran or N/A",
    optional: true,
  },
  {
    id: "gender",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Gender",
    question: "What is your gender as shown on your Permanent Resident Card?",
    hint: "Select one",
    options: ["Male", "Female", "Nonbinary"],
  },
  {
    id: "date_of_birth",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Date of Birth",
    question: "What is your date of birth?",
    hint: "e.g., 03/22/1990",
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
    question: "What country are you currently a citizen or national of?",
    hint: "e.g., Vietnam",
  },
  {
    id: "a_number",
    part: "Part 2",
    partTitle: "Information About You",
    label: "Alien Registration Number (A-Number)",
    question: "What is your A-Number? It starts with 'A' followed by 8 or 9 digits, and appears on your green card, EAD, or USCIS notices.",
    hint: "e.g., A 123 456 789",
  },
  {
    id: "uscis_online_account_number",
    part: "Part 2",
    partTitle: "Information About You",
    label: "USCIS Online Account Number",
    question: "Do you have a USCIS Online Account Number (from filing forms online)? Type 'N/A' if you don't have one.",
    hint: "e.g., 1234567890 or N/A",
    optional: true,
  },
  {
    id: "ssn",
    part: "Part 2",
    partTitle: "Information About You",
    label: "U.S. Social Security Number",
    question: "Do you have a U.S. Social Security Number? Type 'N/A' if not.",
    hint: "e.g., 123-45-6789 or N/A",
    optional: true,
  },

  // ── Part 3: Address History ──────────────────────────────────────────────────
  {
    id: "mailing_street",
    part: "Part 3",
    partTitle: "Address History",
    label: "Mailing Address — Street",
    question: "What is your current mailing address — street number and name? (include Apt/Suite if applicable)",
    hint: "e.g., 45 Maple Ave, Apt 3B",
  },
  {
    id: "mailing_city",
    part: "Part 3",
    partTitle: "Address History",
    label: "City",
    question: "What city?",
    hint: "e.g., Houston",
  },
  {
    id: "mailing_state",
    part: "Part 3",
    partTitle: "Address History",
    label: "State",
    question: "What state? (2-letter code)",
    hint: "e.g., TX",
  },
  {
    id: "mailing_zip",
    part: "Part 3",
    partTitle: "Address History",
    label: "ZIP Code",
    question: "What is your ZIP code?",
    hint: "e.g., 77002",
  },
  {
    id: "physical_address_same",
    part: "Part 3",
    partTitle: "Address History",
    label: "Physical Address Same as Mailing",
    question: "Is your physical residence the same as the mailing address you just gave?",
    hint: "Select one",
    options: ["Yes, same address", "No, different address"],
  },
  {
    id: "resident_since_date",
    part: "Part 3",
    partTitle: "Address History",
    label: "Date You Became a Permanent Resident",
    question: "What date did you become a lawful permanent resident? This is on your green card or the approval notice.",
    hint: "e.g., 06/01/2016",
  },

  // ── Part 4: Additional Information & Contact ─────────────────────────────────
  {
    id: "last_admission_date",
    part: "Part 4",
    partTitle: "Additional Information & Contact",
    label: "Date of Last Admission",
    question: "What was the date of your last admission into the United States as a permanent resident?",
    hint: "e.g., 06/01/2016",
  },
  {
    id: "class_of_admission",
    part: "Part 4",
    partTitle: "Additional Information & Contact",
    label: "Class of Admission",
    question: "What was your class of admission (the code shown on your green card, like IR1, EB2, F2B, etc.)?",
    hint: "e.g., IR1, EB2, F2B",
  },
  {
    id: "outside_us_since_admission",
    part: "Part 4",
    partTitle: "Additional Information & Contact",
    label: "Time Outside the U.S.",
    question: "Since becoming a permanent resident, have you been outside the United States for one year or more in a single trip?",
    hint: "Select one",
    options: ["No", "Yes"],
  },
  {
    id: "daytime_phone",
    part: "Part 4",
    partTitle: "Additional Information & Contact",
    label: "Daytime Phone",
    question: "What is your daytime phone number?",
    hint: "e.g., (713) 555-0198",
  },
  {
    id: "email",
    part: "Part 4",
    partTitle: "Additional Information & Contact",
    label: "Email Address",
    question: "What is your email address?",
    hint: "e.g., minh@email.com",
  },
];

"use client";

import { Users } from "lucide-react";
import { FormWizard, type Fields } from "@/components/forms/form-wizard";
import { I130_QUESTIONS, I130_PARTS } from "@/lib/forms/i130";

function normalize(fieldId: string, raw: string): string {
  const v = raw.trim();
  if (!v || v.toLowerCase() === "n/a" || v.toLowerCase() === "none") return "N/A";

  if (fieldId.includes("dob") || fieldId.includes("date")) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${mm}/${dd}/${d.getFullYear()}`;
    }
    return v;
  }
  if (fieldId.endsWith("_ssn")) {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 9) return `${digits.slice(0,3)}-${digits.slice(3,5)}-${digits.slice(5)}`;
  }
  if (fieldId.includes("phone")) {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  if (fieldId.includes("mailing_state") && v.length <= 3) return v.toUpperCase();
  if (fieldId.includes("zip")) return v;
  if (
    fieldId.includes("name") ||
    fieldId.includes("city") ||
    fieldId.includes("country") ||
    fieldId.includes("relationship") ||
    fieldId.includes("place_of_birth") ||
    fieldId.includes("address")
  ) {
    return v.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
  }
  return v;
}

function isoToMDY(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}

function fmtSSN(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 9 ? `${d.slice(0,3)}-${d.slice(3,5)}-${d.slice(5)}` : raw;
}

function fmtPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : raw;
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

// Only the petitioner's fields get prefilled from the user's own profile/documents —
// the beneficiary is a different person, so their fields are always answered fresh.
function prefillFromProfile(p: Record<string, unknown>): Fields {
  const f: Fields = {};
  if (p.first_name) f.petitioner_given_name = titleCase(String(p.first_name));
  if (p.last_name) f.petitioner_family_name = titleCase(String(p.last_name));
  if (p.middle_name) f.petitioner_middle_name = titleCase(String(p.middle_name));
  if (p.date_of_birth) f.petitioner_dob = isoToMDY(String(p.date_of_birth));
  if (p.ssn) f.petitioner_ssn = fmtSSN(String(p.ssn));
  if (p.mailing_street) f.petitioner_mailing_street = String(p.mailing_street);
  if (p.mailing_city && p.mailing_state && p.mailing_zip) {
    f.petitioner_mailing_city_state_zip = `${titleCase(String(p.mailing_city))}, ${String(p.mailing_state).toUpperCase()} ${String(p.mailing_zip)}`;
  }
  if (p.phone) f.petitioner_daytime_phone = fmtPhone(String(p.phone));
  if (p.a_number) f.petitioner_a_number = String(p.a_number);
  if (p.visa_type) {
    const vt = String(p.visa_type);
    if (vt.includes("LPR") || vt.toLowerCase().includes("green card") || vt.includes("Permanent Resident"))
      f.petitioner_citizenship_basis = "Lawful Permanent Resident (Green Card holder)";
  }
  return f;
}

function prefillFromDocuments(docs: Array<Record<string, unknown>>): Fields {
  const f: Fields = {};
  for (const doc of docs) {
    const ef = (doc.extracted_data as { extracted_fields?: Record<string, string | null> } | undefined)?.extracted_fields;
    if (!ef) continue;
    if (ef.first_name && !f.petitioner_given_name) f.petitioner_given_name = titleCase(ef.first_name);
    if (ef.last_name && !f.petitioner_family_name) f.petitioner_family_name = titleCase(ef.last_name);
    if (ef.middle_name && !f.petitioner_middle_name) f.petitioner_middle_name = titleCase(ef.middle_name);
    if (ef.date_of_birth && !f.petitioner_dob) f.petitioner_dob = isoToMDY(ef.date_of_birth);
    if (ef.country_of_birth && !f.petitioner_place_of_birth) f.petitioner_place_of_birth = titleCase(ef.country_of_birth);
    if (ef.a_number && !f.petitioner_a_number) f.petitioner_a_number = ef.a_number;
  }
  return f;
}

async function prefill(): Promise<Fields> {
  const [profileRes, docsRes] = await Promise.all([
    fetch("/api/profile"),
    fetch("/api/documents"),
  ]);
  let combined: Fields = {};
  if (docsRes.ok) {
    const docs = await docsRes.json();
    if (Array.isArray(docs)) combined = { ...combined, ...prefillFromDocuments(docs) };
  }
  if (profileRes.ok) {
    const profile = await profileRes.json();
    if (profile && !profile.error) combined = { ...combined, ...prefillFromProfile(profile) };
  }
  return combined;
}

export default function I130Page() {
  return (
    <FormWizard
      formNumber="I-130"
      subtitle="Petition for Alien Relative"
      formTypeForSubmission="I-130"
      icon={Users}
      color="rose"
      questions={I130_QUESTIONS}
      parts={I130_PARTS}
      description="Answer questions in plain English to establish your qualifying family relationship with a relative — the first step toward sponsoring them for a green card."
      subtext="Covers Parts 1, 2, 4, and 5 of the official USCIS Form I-130."
      notices={[
        {
          tone: "amber",
          text: "Processing times vary significantly by relationship category and your relative's country of origin. Approval of this petition doesn't grant any immigration status by itself — it establishes that the beneficiary is eligible to later apply for a green card.",
        },
      ]}
      normalize={normalize}
      prefill={prefill}
    />
  );
}

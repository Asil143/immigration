"use client";

import { Briefcase } from "lucide-react";
import { FormWizard, type Fields } from "@/components/forms/form-wizard";
import { I140_QUESTIONS, I140_PARTS } from "@/lib/forms/i140";

function normalize(fieldId: string, raw: string): string {
  const v = raw.trim();
  if (!v || v.toLowerCase() === "n/a" || v.toLowerCase() === "none") return "N/A";

  if (fieldId === "beneficiary_dob" || fieldId === "priority_date") {
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${mm}/${dd}/${d.getFullYear()}`;
    }
    return v;
  }
  if (fieldId === "beneficiary_ssn") {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 9) return `${digits.slice(0,3)}-${digits.slice(3,5)}-${digits.slice(5)}`;
  }
  if (fieldId.includes("phone")) {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  if (fieldId.includes("state") && v.length <= 3) return v.toUpperCase();
  if (fieldId.includes("wage") || fieldId.includes("income")) {
    const cleaned = v.replace(/[$,]/g, "");
    if (/^\d+(\.\d+)?$/.test(cleaned)) return `$${Number(cleaned).toLocaleString()}`;
    return v; // combined/free-text answers (e.g. "gross X, net Y") are left as typed
  }
  if (
    fieldId.includes("name") ||
    fieldId.includes("country") ||
    fieldId.includes("citizenship") ||
    fieldId === "employer_type_of_business" ||
    fieldId === "job_title"
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

function buildAddress(street?: unknown, city?: unknown, state?: unknown, zip?: unknown): string | undefined {
  const cityState = [city ? titleCase(String(city)) : null, state ? String(state).toUpperCase() : null]
    .filter(Boolean)
    .join(", ");
  const parts = [street ? String(street) : null, cityState || null, zip ? String(zip) : null].filter(Boolean);
  return parts.length ? parts.join(", ") : undefined;
}

// The worker applying through StatusClock is almost always the beneficiary of an
// I-140, not the petitioner — so profile/document data prefills beneficiary_*
// fields only. Employer/petitioner fields are intentionally left blank since
// they describe the sponsoring company, not the individual user's profile.
function prefillFromProfile(p: Record<string, unknown>): Fields {
  const f: Fields = {};
  if (p.first_name) f.beneficiary_given_name = titleCase(String(p.first_name));
  if (p.last_name) f.beneficiary_family_name = titleCase(String(p.last_name));
  if (p.middle_name) f.beneficiary_middle_name = titleCase(String(p.middle_name));
  if (p.date_of_birth) f.beneficiary_dob = isoToMDY(String(p.date_of_birth));
  if (p.country_of_birth) f.beneficiary_country_of_birth = titleCase(String(p.country_of_birth));
  if (p.ssn) f.beneficiary_ssn = fmtSSN(String(p.ssn));
  const address = buildAddress(p.mailing_street, p.mailing_city, p.mailing_state, p.mailing_zip);
  if (address) f.beneficiary_address = address;
  if (p.phone) f.beneficiary_phone = fmtPhone(String(p.phone));
  if (p.email) f.beneficiary_email = String(p.email);
  if (p.a_number) f.beneficiary_a_number = String(p.a_number);
  if (p.visa_type) f.beneficiary_current_status = String(p.visa_type);
  return f;
}

function prefillFromDocuments(docs: Array<Record<string, unknown>>): Fields {
  const f: Fields = {};
  for (const doc of docs) {
    const ef = (doc.extracted_data as { extracted_fields?: Record<string, string | null> } | undefined)?.extracted_fields;
    if (!ef) continue;
    if (ef.first_name && !f.beneficiary_given_name) f.beneficiary_given_name = titleCase(ef.first_name);
    if (ef.last_name && !f.beneficiary_family_name) f.beneficiary_family_name = titleCase(ef.last_name);
    if (ef.middle_name && !f.beneficiary_middle_name) f.beneficiary_middle_name = titleCase(ef.middle_name);
    if (ef.date_of_birth && !f.beneficiary_dob) f.beneficiary_dob = isoToMDY(ef.date_of_birth);
    if (ef.country_of_birth && !f.beneficiary_country_of_birth) f.beneficiary_country_of_birth = titleCase(ef.country_of_birth);
    if (ef.a_number && !f.beneficiary_a_number) f.beneficiary_a_number = ef.a_number;
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

export default function I140Page() {
  return (
    <FormWizard
      formNumber="I-140"
      subtitle="Immigrant Petition for Alien Worker"
      formTypeForSubmission="I-140"
      icon={Briefcase}
      color="indigo"
      questions={I140_QUESTIONS}
      parts={I140_PARTS}
      description="Answer questions in plain English about the employer, the job, and the worker being sponsored. This establishes eligibility for an employment-based green card under EB-1, EB-2 (including NIW), or EB-3."
      subtext="Covers Parts 1, 2, 3, 4, and 6 of the official USCIS Form I-140."
      notices={[
        {
          tone: "blue",
          text: "For EB-2 and EB-3 petitions (other than a National Interest Waiver), a labor certification (PERM) must typically be approved by the Department of Labor before this petition can be filed. EB-1 and EB-2 NIW self-petitioners can skip that step.",
        },
      ]}
      normalize={normalize}
      prefill={prefill}
    />
  );
}

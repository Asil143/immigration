"use client";

import { useEffect, useRef } from "react";

type Fields = Record<string, string>;

interface Props {
  fields: Fields;
  activeFieldId: string | null;
}

// ── primitives ────────────────────────────────────────────────────────────────

function FormField({
  id, label, value, active, span = 1,
}: { id?: string; label: string; value?: string; active?: boolean; span?: number }) {
  return (
    <div
      data-field={id}
      className={`flex flex-col ${span === 2 ? "col-span-2" : span === 3 ? "col-span-3" : ""}`}
    >
      <span className="text-[7.5px] text-slate-600 leading-none mb-0.5 font-normal">{label}</span>
      <div className={`border border-slate-500 min-h-[18px] px-1 py-[1px] text-[9px] transition-all ${
        active ? "bg-yellow-100 border-blue-600 border-2" : value ? "bg-white" : "bg-white"
      }`}>
        <span className={value ? "text-slate-900 font-medium" : "text-transparent"}>
          {value || "."}
        </span>
      </div>
    </div>
  );
}

function CheckBox({ checked, label, sub }: { checked?: boolean; label: string; sub?: string }) {
  return (
    <div className="flex items-start gap-1 mb-1">
      <div className={`mt-[1px] w-[9px] h-[9px] border border-slate-600 shrink-0 flex items-center justify-center ${checked ? "bg-slate-800" : "bg-white"}`}>
        {checked && <span className="text-white text-[6px] font-bold leading-none">✓</span>}
      </div>
      <div>
        <span className="text-[8.5px] leading-tight text-slate-800">{label}</span>
        {sub && <div className="border border-slate-500 min-h-[14px] mt-0.5 px-1 text-[8px] w-36 bg-white">{sub}</div>}
      </div>
    </div>
  );
}

function SectionBar({ text }: { text: string }) {
  return (
    <div className="bg-slate-600 text-white text-[9px] font-bold px-2 py-[3px] mt-2 mb-1">
      {text}
    </div>
  );
}

function PageFooter({ page }: { page: number }) {
  return (
    <div className="border-t border-slate-400 mt-2 pt-1 flex justify-between">
      <span className="text-[7.5px] text-slate-500">Form I-864 Edition 10/17/24</span>
      <span className="text-[7.5px] text-slate-500">Page {page} of 12</span>
    </div>
  );
}

function PageWrap({ children, page }: { children: React.ReactNode; page: number }) {
  return (
    <div className="bg-white border border-slate-400 shadow-sm mb-3 px-5 pt-3 pb-2" style={{ width: 680, minHeight: 880 }}>
      {children}
      <PageFooter page={page} />
    </div>
  );
}

// ── Page 1 ────────────────────────────────────────────────────────────────────
function Page1({ f, a }: { f: Fields; a: string | null }) {
  const basis = (f.basis ?? "").toLowerCase();
  return (
    <PageWrap page={1}>
      {/* Top header */}
      <div className="flex justify-between items-start mb-1 border-b border-slate-400 pb-1">
        <div>
          <p className="text-[9px] font-bold">Department of Homeland Security</p>
          <p className="text-[8px]">U.S. Citizenship and Immigration Services</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-extrabold">USCIS Form I-864</p>
          <p className="text-[7.5px]">OMB No. 1615-0075</p>
          <p className="text-[7.5px]">Expires 10/31/2027</p>
        </div>
      </div>
      <p className="text-center text-[11px] font-bold mb-1">Affidavit of Support Under Section 213A of the INA</p>

      {/* USCIS use table */}
      <table className="w-full border-collapse border border-slate-500 text-[7.5px] mb-2">
        <tbody>
          <tr>
            <td className="border border-slate-500 p-1 w-24 align-top" rowSpan={2}>
              <p className="font-bold">For USCIS Use Only</p>
              <div className="mt-1 space-y-0.5">
                {["☐ Petitioner","☐ 1st Joint Sponsor","☐ 2nd Joint Sponsor","☐ Substitute Sponsor","☐ 5% Owner"].map(l => <p key={l}>{l}</p>)}
              </div>
            </td>
            <td className="border border-slate-500 p-1 align-top">
              <p className="font-bold mb-1">Section 213A Review</p>
              <p>☐ MEETS requirements &nbsp; ☐ DOES NOT MEET requirements</p>
              <p className="mt-1">Reviewed By: _______________</p>
              <p>Office: _______________</p>
              <p>Date (mm/dd/yyyy): _______________</p>
            </td>
            <td className="border border-slate-500 p-1 align-top w-28">
              <p className="font-bold">Number of Support Affidavits in File</p>
              <p className="mt-1">☐ 1 &nbsp; ☐ 2</p>
              <p className="font-bold mt-2">Remarks</p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Attorney row */}
      <div className="flex gap-2 border border-slate-500 p-1 mb-2 text-[7.5px]">
        <div className="flex items-center gap-1 border-r border-slate-400 pr-2">
          <div className="w-3 h-3 border border-slate-500" />
          <span>Select if Form G-28 or G-28I is attached.</span>
        </div>
        <div className="flex-1">
          <span className="font-bold">Attorney State Bar Number (if applicable): </span>
          <span className="inline-block border-b border-slate-500 w-24" />
        </div>
        <div className="flex-1">
          <span className="font-bold">Attorney or Accredited Representative USCIS Online Account Number (if any): </span>
          <span className="inline-block border-b border-slate-500 w-24" />
        </div>
      </div>

      <p className="text-[8.5px] font-bold mb-1">► START HERE - Type or print in black ink.</p>

      <SectionBar text="Part 1. Basis For Filing Affidavit of Support" />
      <p className="text-[8px] mb-1">I am the sponsor submitting this affidavit of support because (Select only one box).</p>

      <CheckBox checked={basis.includes("1a") || basis.includes("petitioner")} label="1.a.  I am the petitioner. I filed or am filing for the immigration of my relative." />
      <div className="flex items-start gap-1 mb-1">
        <div className={`mt-[1px] w-[9px] h-[9px] border border-slate-600 shrink-0 flex items-center justify-center ${basis.includes("1b") ? "bg-slate-800" : "bg-white"}`}>
          {basis.includes("1b") && <span className="text-white text-[6px] font-bold">✓</span>}
        </div>
        <div className="text-[8.5px] leading-tight">
          <span>1.b.  I filed an alien worker petition on behalf of the intending immigrant, who is related to me as my </span>
          <span className="inline-block border-b border-slate-500 w-20 ml-1 align-bottom" />
        </div>
      </div>
      <div className="flex items-start gap-1 mb-1">
        <div className={`mt-[1px] w-[9px] h-[9px] border border-slate-600 shrink-0 flex items-center justify-center ${(basis.includes("1c") || basis.includes("5%") || basis.includes("ownership")) ? "bg-slate-800" : "bg-white"}`}>
          {(basis.includes("1c") || basis.includes("5%") || basis.includes("ownership")) && <span className="text-white text-[6px] font-bold">✓</span>}
        </div>
        <div className="text-[8.5px] leading-tight">
          <span>1.c.  I have an ownership interest of at least 5 percent in </span>
          <span className="inline-block border-b border-slate-500 w-24 align-bottom" />
          <br /><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;which filed an alien worker petition on behalf of the intending immigrant, who is related to me as my </span>
          <span className="inline-block border-b border-slate-500 w-20 align-bottom" />
        </div>
      </div>
      <CheckBox checked={basis.includes("1d") || basis.includes("only joint")} label="1.d.  I am the only joint sponsor." />
      <div className="flex items-start gap-1 mb-1">
        <div className={`mt-[1px] w-[9px] h-[9px] border border-slate-600 shrink-0 flex items-center justify-center ${basis.includes("1e") ? "bg-slate-800" : "bg-white"}`}>
          {basis.includes("1e") && <span className="text-white text-[6px] font-bold">✓</span>}
        </div>
        <span className="text-[8.5px]">1.e.  I am the &nbsp;</span>
        <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center ${basis.includes("first") ? "bg-slate-800" : "bg-white"}`}>
          {basis.includes("first") && <span className="text-white text-[6px] font-bold">✓</span>}
        </div>
        <span className="text-[8.5px]">&nbsp; first &nbsp;</span>
        <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center ${basis.includes("second") ? "bg-slate-800" : "bg-white"}`}>
          {basis.includes("second") && <span className="text-white text-[6px] font-bold">✓</span>}
        </div>
        <span className="text-[8.5px]">&nbsp; second of two joint sponsors.</span>
      </div>
      <div className="flex items-start gap-1 mb-2">
        <div className={`mt-[1px] w-[9px] h-[9px] border border-slate-600 shrink-0 flex items-center justify-center ${basis.includes("1f") || basis.includes("substitute") || basis.includes("deceased") ? "bg-slate-800" : "bg-white"}`}>
          {(basis.includes("1f") || basis.includes("substitute") || basis.includes("deceased")) && <span className="text-white text-[6px] font-bold">✓</span>}
        </div>
        <div className="text-[8.5px] leading-tight">
          <span>1.f.  The original petitioner is deceased. I am the substitute sponsor. I am the intending immigrant's </span>
          <span className="inline-block border-b border-slate-500 w-24 align-bottom" />
        </div>
      </div>
      <p className="text-[7.5px] font-bold mb-2">NOTE: As a sponsor, you must include proof of your U.S. citizenship, U.S. national status, or lawful permanent resident status.</p>

      <SectionBar text="Part 2. Information About You (Sponsor)" />
      <p className="text-[8px] font-semibold mb-0.5">1. Sponsor's Full Legal Name (Do not provide a nickname)</p>
      <div className="grid grid-cols-3 gap-1">
        <FormField id="sponsor_family_name" label="Family Name (Last Name)" value={f.sponsor_family_name} active={a === "sponsor_family_name"} />
        <FormField id="sponsor_given_name" label="Given Name (First Name)" value={f.sponsor_given_name} active={a === "sponsor_given_name"} />
        <FormField id="sponsor_middle_name" label="Middle Name (if applicable)" value={f.sponsor_middle_name} active={a === "sponsor_middle_name"} />
      </div>
    </PageWrap>
  );
}

// ── Page 2 ────────────────────────────────────────────────────────────────────
function Page2({ f, a }: { f: Fields; a: string | null }) {
  const status = (f.sponsor_citizenship ?? "").toLowerCase();
  return (
    <PageWrap page={2}>
      <SectionBar text="Part 2. Information About You (Sponsor) (continued)" />

      <p className="text-[8px] font-semibold mt-1 mb-0.5">2. Sponsor's Current Mailing Address</p>
      <FormField id="sponsor_mailing_street" label="In Care Of Name (if any)" value={undefined} active={false} span={1} />
      <div className="grid grid-cols-4 gap-1 mt-1">
        <FormField id="sponsor_mailing_street" label="Street Number and Name" value={f.sponsor_mailing_street} active={a === "sponsor_mailing_street"} span={3} />
        <div>
          <span className="text-[7.5px] text-slate-600 leading-none mb-0.5 block">Apt. Ste. Flr.</span>
          <div className="flex gap-0.5">
            <div className="w-4 h-[18px] border border-slate-500" />
            <div className="w-4 h-[18px] border border-slate-500" />
            <div className="w-4 h-[18px] border border-slate-500" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 mt-1">
        <FormField id="sponsor_mailing_city" label="City or Town" value={f.sponsor_mailing_city} active={a === "sponsor_mailing_city"} />
        <FormField id="sponsor_mailing_state" label="State" value={f.sponsor_mailing_state} active={a === "sponsor_mailing_state"} />
        <FormField id="sponsor_mailing_zip" label="ZIP Code" value={f.sponsor_mailing_zip} active={a === "sponsor_mailing_zip"} />
      </div>
      <div className="grid grid-cols-3 gap-1 mt-1 mb-1">
        <FormField label="Province" value={undefined} active={false} />
        <FormField label="Postal Code" value={undefined} active={false} />
        <FormField label="Country" value={f.sponsor_domicile_country} active={a === "sponsor_domicile_country"} />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-[8px]">3. Is your current mailing address the same as your physical address?</span>
        <div className="flex items-center gap-1 ml-auto">
          <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center ${f.sponsor_same_physical?.toLowerCase().startsWith("y") ? "bg-slate-800" : "bg-white"}`}>
            {f.sponsor_same_physical?.toLowerCase().startsWith("y") && <span className="text-white text-[6px] font-bold">✓</span>}
          </div>
          <span className="text-[8px]">Yes</span>
          <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center ml-1 ${f.sponsor_same_physical?.toLowerCase().startsWith("n") ? "bg-slate-800" : "bg-white"}`}>
            {f.sponsor_same_physical?.toLowerCase().startsWith("n") && <span className="text-white text-[6px] font-bold">✓</span>}
          </div>
          <span className="text-[8px]">No</span>
        </div>
      </div>
      <p className="text-[7.5px] text-slate-600 mb-1">If you answered "No" to Item Number 3., provide your physical address in Item Number 4.</p>

      <p className="text-[8px] font-semibold mb-0.5">4. Sponsor's Physical Address (if different from the address above)</p>
      <div className="grid grid-cols-3 gap-1 mb-1">
        <FormField label="Street Number and Name" value={undefined} active={false} span={2} />
        <FormField label="Number" value={undefined} active={false} />
      </div>
      <div className="grid grid-cols-3 gap-1 mb-1">
        <FormField label="City or Town" value={undefined} active={false} />
        <FormField label="State" value={undefined} active={false} />
        <FormField label="ZIP Code" value={undefined} active={false} />
      </div>
      <div className="grid grid-cols-3 gap-1 mb-2">
        <FormField label="Province" value={undefined} active={false} />
        <FormField label="Postal Code" value={undefined} active={false} />
        <FormField label="Country" value={undefined} active={false} />
      </div>

      <p className="text-[8px] font-semibold mb-0.5">Other Information</p>
      <div className="grid grid-cols-3 gap-1 mb-1">
        <FormField id="sponsor_domicile_country" label="5. Country of Domicile" value={f.sponsor_domicile_country} active={a === "sponsor_domicile_country"} />
        <FormField id="sponsor_dob" label="6. Date of Birth (mm/dd/yyyy)" value={f.sponsor_dob} active={a === "sponsor_dob"} />
        <FormField id="sponsor_country_of_birth" label="7. Country of Birth" value={f.sponsor_country_of_birth} active={a === "sponsor_country_of_birth"} />
      </div>

      <div className="mb-1">
        <p className="text-[8px] font-semibold mb-0.5">8. U.S. Social Security Number (Required)</p>
        <div className="flex items-center gap-1">
          <span className="text-[8px]">►</span>
          <div data-field="sponsor_ssn" className={`border border-slate-500 px-1 py-[1px] text-[9px] w-36 ${a === "sponsor_ssn" ? "bg-yellow-100 border-blue-600 border-2" : "bg-white"}`}>
            {f.sponsor_ssn || ""}
          </div>
        </div>
      </div>

      <p className="text-[8px] font-semibold mb-0.5">9. Immigration Status</p>
      <CheckBox checked={status.includes("citizen") && !status.includes("national")} label="I am a U.S. citizen." />
      <CheckBox checked={status.includes("national")} label="I am a U.S. national." />
      <CheckBox checked={status.includes("permanent") || status.includes("lpr") || status.includes("green card")} label="I am a lawful permanent resident." />

      <div className="grid grid-cols-2 gap-1 mt-1">
        <div>
          <p className="text-[8px] font-semibold mb-0.5">10. Sponsor's A-Number (if any)</p>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-bold">► A-</span>
            <div data-field="sponsor_a_number" className={`border border-slate-500 px-1 py-[1px] text-[9px] flex-1 ${a === "sponsor_a_number" ? "bg-yellow-100 border-blue-600 border-2" : "bg-white"}`}>
              {f.sponsor_a_number === "N/A" ? "" : f.sponsor_a_number || ""}
            </div>
          </div>
        </div>
        <div>
          <p className="text-[8px] font-semibold mb-0.5">11. USCIS Online Account Number (if any)</p>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-bold">►</span>
            <div className="border border-slate-500 h-[18px] flex-1 bg-white" />
          </div>
        </div>
      </div>

      <p className="text-[8px] font-semibold mt-2 mb-0.5">Military Service (To be completed by petitioner sponsors only.)</p>
      <div className="flex items-center gap-2">
        <span className="text-[8px]">12. I am currently on <strong>active duty</strong> in the United States Armed Forces or U.S. Coast Guard.</span>
        <div className="ml-auto flex items-center gap-1">
          <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center ${f.sponsor_military?.toLowerCase().startsWith("y") ? "bg-slate-800" : "bg-white"}`}>
            {f.sponsor_military?.toLowerCase().startsWith("y") && <span className="text-white text-[6px] font-bold">✓</span>}
          </div>
          <span className="text-[8px]">Yes</span>
          <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center ml-1 ${f.sponsor_military?.toLowerCase().startsWith("n") ? "bg-slate-800" : "bg-white"}`}>
            {f.sponsor_military?.toLowerCase().startsWith("n") && <span className="text-white text-[6px] font-bold">✓</span>}
          </div>
          <span className="text-[8px]">No</span>
        </div>
      </div>
    </PageWrap>
  );
}

// ── Page 3 ────────────────────────────────────────────────────────────────────
function Page3({ f, a }: { f: Fields; a: string | null }) {
  return (
    <PageWrap page={3}>
      <SectionBar text="Part 3. Information About the Principal Immigrant" />

      <p className="text-[8px] font-semibold mb-0.5">1. Principal Immigrant's Full Legal Name (Do not provide a nickname)</p>
      <div className="grid grid-cols-3 gap-1 mb-1">
        <FormField id="immigrant_family_name" label="Family Name (Last Name)" value={f.immigrant_family_name} active={a === "immigrant_family_name"} />
        <FormField id="immigrant_given_name" label="Given Name (First Name)" value={f.immigrant_given_name} active={a === "immigrant_given_name"} />
        <FormField id="immigrant_middle_name" label="Middle Name (if applicable)" value={f.immigrant_middle_name} active={a === "immigrant_middle_name"} />
      </div>

      <p className="text-[8px] font-semibold mb-0.5">2. Current Mailing Address</p>
      <FormField label="In Care Of Name (if any)" value={undefined} active={false} />
      <div className="grid grid-cols-4 gap-1 mt-1">
        <FormField label="Street Number and Name" value={undefined} active={false} span={3} />
        <div>
          <span className="text-[7.5px] text-slate-600 block mb-0.5">Apt. Ste. Flr.</span>
          <div className="flex gap-0.5">
            {[1,2,3].map(i => <div key={i} className="w-4 h-[18px] border border-slate-500" />)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 mt-1 mb-1">
        <FormField label="City or Town" value={undefined} active={false} />
        <FormField label="State" value={undefined} active={false} />
        <FormField label="ZIP Code" value={undefined} active={false} />
      </div>
      <div className="grid grid-cols-3 gap-1 mb-2">
        <FormField label="Province" value={undefined} active={false} />
        <FormField label="Postal Code" value={undefined} active={false} />
        <FormField label="Country" value={undefined} active={false} />
      </div>

      <p className="text-[8px] font-semibold mb-0.5">Other Information</p>
      <div className="grid grid-cols-2 gap-1 mb-1">
        <FormField id="immigrant_country_of_citizenship" label="3. Country of Citizenship or Nationality" value={f.immigrant_country_of_citizenship} active={a === "immigrant_country_of_citizenship"} />
        <FormField id="immigrant_dob" label="4. Date of Birth (mm/dd/yyyy)" value={f.immigrant_dob} active={a === "immigrant_dob"} />
      </div>
      <div className="grid grid-cols-2 gap-1 mb-1">
        <div>
          <p className="text-[7.5px] text-slate-600 mb-0.5">5. Alien Registration Number (A-Number) (if any)</p>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-bold">► A-</span>
            <div data-field="immigrant_a_number" className={`border border-slate-500 flex-1 h-[18px] px-1 text-[9px] ${a === "immigrant_a_number" ? "bg-yellow-100 border-blue-600 border-2" : "bg-white"}`}>
              {f.immigrant_a_number === "N/A" ? "" : f.immigrant_a_number || ""}
            </div>
          </div>
        </div>
        <div>
          <p className="text-[7.5px] text-slate-600 mb-0.5">6. USCIS Online Account Number (if any)</p>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-bold">►</span>
            <div className="border border-slate-500 flex-1 h-[18px] bg-white" />
          </div>
        </div>
      </div>
      <div className="mb-2">
        <FormField id="immigrant_phone" label="7. Daytime Telephone Number" value={f.immigrant_phone} active={a === "immigrant_phone"} />
      </div>

      <SectionBar text="Part 4. Information About the Immigrants You Are Sponsoring" />
      <p className="text-[8px] font-semibold mt-1 mb-1">1. I am sponsoring the principal immigrant named in Part 3.</p>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1">
          <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center ${f.sponsoring_principal?.toLowerCase().startsWith("y") ? "bg-slate-800" : "bg-white"}`}>
            {f.sponsoring_principal?.toLowerCase().startsWith("y") && <span className="text-white text-[6px] font-bold">✓</span>}
          </div>
          <span className="text-[8px]">Yes</span>
        </div>
        <span className="text-[8px]">No, I am sponsoring family members in Part 4. as the second joint sponsor or I am sponsoring family members who are immigrating more than six months after the principal immigrant.</span>
      </div>

      <div className="flex items-start gap-1 mb-1">
        <div className="w-[9px] h-[9px] border border-slate-600 mt-0.5 bg-white shrink-0" />
        <p className="text-[8px]">2. I am sponsoring the following family members immigrating at the same time or within six months of the principal immigrant named in Part 3. (List family members in Item Numbers 4. - 7. Do not include any relative listed on a separate visa petition.)</p>
      </div>
      <div className="flex items-start gap-1 mb-2">
        <div className="w-[9px] h-[9px] border border-slate-600 mt-0.5 bg-white shrink-0" />
        <p className="text-[8px]">3. I am sponsoring the following family members who are immigrating more than six months after the principal immigrant. (List family members in Item Numbers 4. - 7.)</p>
      </div>

      <p className="text-[8.5px] font-bold mb-0.5">4. Family Member 1</p>
      <div className="grid grid-cols-3 gap-1 mb-1">
        <FormField label="Family Name (Last Name)" value={undefined} active={false} />
        <FormField label="Given Name (First Name)" value={undefined} active={false} />
        <FormField label="Middle Name (if applicable)" value={undefined} active={false} />
      </div>
      <div className="grid grid-cols-2 gap-1 mb-1">
        <FormField label="Relationship to Principal Immigrant" value={undefined} active={false} />
        <FormField label="Date of Birth (mm/dd/yyyy)" value={undefined} active={false} />
      </div>
      <div className="mb-1">
        <p className="text-[7.5px] text-slate-600 mb-0.5">Alien Registration Number (A-Number, if any)</p>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-bold">►</span>
          <div className="border border-slate-500 w-36 h-[18px] bg-white" />
        </div>
      </div>
      <div>
        <p className="text-[7.5px] text-slate-600 mb-0.5">USCIS Online Account Number (if any)</p>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-bold">►</span>
          <div className="border border-slate-500 w-36 h-[18px] bg-white" />
        </div>
      </div>
    </PageWrap>
  );
}

// ── Page 4 ────────────────────────────────────────────────────────────────────
function Page4({ f, a }: { f: Fields; a: string | null }) {
  return (
    <PageWrap page={4}>
      <SectionBar text="Part 4. Information About the Immigrants You Are Sponsoring (continued)" />
      {[{ n: "5. Family Member 2" }, { n: "6. Family Member 3" }, { n: "7. Family Member 4" }].map(({ n }) => (
        <div key={n} className="mb-3">
          <p className="text-[8.5px] font-bold mb-0.5">{n}</p>
          <div className="grid grid-cols-3 gap-1 mb-1">
            <FormField label="Family Name (Last Name)" value={undefined} active={false} />
            <FormField label="Given Name (First Name)" value={undefined} active={false} />
            <FormField label="Middle Name (if applicable)" value={undefined} active={false} />
          </div>
          <div className="grid grid-cols-2 gap-1 mb-1">
            <FormField label="Relationship to Principal Immigrant" value={undefined} active={false} />
            <FormField label="Date of Birth (mm/dd/yyyy)" value={undefined} active={false} />
          </div>
          <div className="mb-0.5">
            <p className="text-[7.5px] text-slate-600 mb-0.5">Alien Registration Number (A-Number, if any)</p>
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-bold">►</span>
              <div className="border border-slate-500 w-36 h-[18px] bg-white" />
            </div>
          </div>
          <div>
            <p className="text-[7.5px] text-slate-600 mb-0.5">USCIS Online Account Number (if any)</p>
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-bold">►</span>
              <div className="border border-slate-500 w-36 h-[18px] bg-white" />
            </div>
          </div>
        </div>
      ))}
      <p className="text-[7.5px] mt-2">If you need additional space, use the space provided in <strong>Part 11. Additional Information</strong>.</p>
    </PageWrap>
  );
}

// ── Page 5 ────────────────────────────────────────────────────────────────────
function Page5({ f, a }: { f: Fields; a: string | null }) {
  const total =
    (parseInt(f.household_immigrants_sponsored || "0") || 0) + 1 +
    (parseInt(f.household_spouse || "0") || 0) +
    (parseInt(f.household_dependent_children || "0") || 0) +
    (parseInt(f.household_other_dependents || "0") || 0);

  const empStatus = (f.employment_status ?? "").toLowerCase();

  return (
    <PageWrap page={5}>
      <div className="flex gap-2">
        <div className="border border-slate-500 p-1 text-[7.5px] w-16 shrink-0">
          <p className="font-bold">For USCIS Use Only</p>
        </div>
        <div className="flex-1">
          <SectionBar text="Part 5. Sponsor's Household Size" />
          <p className="text-[7.5px] font-bold mb-1">NOTE: Do not count any member of your household more than once.</p>
          <p className="text-[8px] font-bold mb-1">Persons you are sponsoring in this affidavit:</p>

          <div className="flex justify-between items-start mb-1">
            <p className="text-[8px] flex-1 mr-2">1. Enter the total number of immigrants you are sponsoring on this affidavit which includes the principal immigrant listed in Part 3., any immigrants listed in Part 4.</p>
            <div data-field="household_immigrants_sponsored" className={`border border-slate-500 w-12 h-[18px] px-1 text-[9px] text-center shrink-0 ${a === "household_immigrants_sponsored" ? "bg-yellow-100 border-blue-600 border-2" : "bg-white"}`}>
              {f.household_immigrants_sponsored || ""}
            </div>
          </div>

          <p className="text-[8px] font-bold mb-1">Persons NOT sponsored in this affidavit:</p>
          {[
            { label: "2. Yourself.", val: "1", id: undefined },
            { label: "3. If you are currently married, enter \"1\" for your spouse.", val: f.household_spouse, id: "household_spouse" },
            { label: "4. If you have dependent children, enter the number here.", val: f.household_dependent_children, id: "household_dependent_children" },
            { label: "5. If you have any other dependents, enter the number here.", val: f.household_other_dependents, id: "household_other_dependents" },
            { label: "6. If you have sponsored any other persons on Form I-864 or Form I-864EZ who are now lawful permanent residents and you are still obligated to support, enter the number here.", val: undefined, id: undefined },
            { label: "7. If you have siblings, parents, or adult children with the same principal residence who are combining their income with yours by submitting Form I-864A, enter the number here.", val: undefined, id: undefined },
          ].map(({ label, val, id }) => (
            <div key={label} className="flex justify-between items-start mb-1">
              <p className="text-[8px] flex-1 mr-2">{label}</p>
              <div data-field={id} className={`border border-slate-500 w-12 h-[18px] px-1 text-[9px] text-center shrink-0 ${id && a === id ? "bg-yellow-100 border-blue-600 border-2" : "bg-white"}`}>
                {val || ""}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-1 border-t border-slate-400 pt-1">
            <p className="text-[8px] font-bold">8. Add together Part 5., Item Numbers 1. - 7. and enter the number here.</p>
            <div className="text-right">
              <p className="text-[8px] font-bold">Household Size:</p>
              <div className={`border border-slate-600 w-12 h-[18px] px-1 text-[9px] text-center font-bold ml-auto ${total > 0 ? "bg-blue-50" : "bg-white"}`}>
                {total > 0 ? total : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionBar text="Part 6. Sponsor's Employment and Income" />
      <p className="text-[8px] mb-0.5">I am currently:</p>
      <div className="flex gap-1 mb-1 items-center">
        <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center shrink-0 ${empStatus.includes("employ") && !empStatus.includes("self") ? "bg-slate-800" : "bg-white"}`}>
          {empStatus.includes("employ") && !empStatus.includes("self") && <span className="text-white text-[6px] font-bold">✓</span>}
        </div>
        <span className="text-[8px]">1. Employed as a/an</span>
        <FormField id="occupation" label="" value={f.occupation} active={a === "occupation"} span={1} />
      </div>
      <div className="mb-1">
        <FormField id="employer_name_1" label="2. Name of Employer 1" value={f.employer_name_1} active={a === "employer_name_1"} />
      </div>
      <div className="mb-1">
        <FormField label="3. Name of Employer 2 (if applicable)" value={undefined} active={false} />
      </div>
      <div className="flex gap-1 items-center mb-1">
        <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center shrink-0 ${empStatus.includes("self") ? "bg-slate-800" : "bg-white"}`}>
          {empStatus.includes("self") && <span className="text-white text-[6px] font-bold">✓</span>}
        </div>
        <span className="text-[8px]">4. Self-Employed as a/an (Occupation)</span>
      </div>
      <div className="flex gap-4 mb-1">
        <div className="flex items-center gap-1">
          <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center ${empStatus.includes("retire") ? "bg-slate-800" : "bg-white"}`}>
            {empStatus.includes("retire") && <span className="text-white text-[6px] font-bold">✓</span>}
          </div>
          <span className="text-[8px]">5. Retired Since (mm/dd/yyyy)</span>
          <div className="border border-slate-500 w-20 h-[18px] bg-white" />
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-[9px] h-[9px] border border-slate-600 flex items-center justify-center ${empStatus.includes("unemploy") ? "bg-slate-800" : "bg-white"}`}>
            {empStatus.includes("unemploy") && <span className="text-white text-[6px] font-bold">✓</span>}
          </div>
          <span className="text-[8px]">6. Unemployed Since (mm/dd/yyyy)</span>
          <div className="border border-slate-500 w-20 h-[18px] bg-white" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[8px]">7. My current individual annual income is:</span>
        <span className="text-[8px]">$</span>
        <div data-field="annual_income" className={`border border-slate-500 w-28 h-[18px] px-1 text-[9px] ${a === "annual_income" ? "bg-yellow-100 border-blue-600 border-2" : "bg-white"}`}>
          {f.annual_income || ""}
        </div>
      </div>
    </PageWrap>
  );
}

// ── Page 6 ────────────────────────────────────────────────────────────────────
function Page6({ f, a }: { f: Fields; a: string | null }) {
  return (
    <PageWrap page={6}>
      <div className="flex gap-2">
        <div className="border border-slate-500 p-1 text-[7.5px] w-16 shrink-0"><p className="font-bold">For USCIS Use Only</p></div>
        <div className="flex-1">
          <SectionBar text="Part 6. Sponsor's Employment and Income (continued)" />
          <p className="text-[8px] font-bold mb-1">Income you are using from any other person who was counted in your household size:</p>
          {[8, 9, 10, 11].map(n => (
            <div key={n} className="border border-slate-400 p-1 mb-1">
              <p className="text-[8px] font-bold mb-0.5">Person {n - 7}</p>
              <div className="grid grid-cols-2 gap-1 mb-0.5">
                <FormField label="Name" value={undefined} active={false} />
                <FormField label="Relationship" value={undefined} active={false} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px]">Current Income $</span>
                <div className="border border-slate-500 w-24 h-[18px] bg-white" />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[8px] font-bold">12. My Current Annual Household Income (Total all lines from Part 6. Item Numbers 7. - 11.):</span>
            <span className="text-[8px]">$</span>
            <div className="border border-slate-500 w-24 h-[18px] bg-white" />
          </div>
          <div className="flex items-start gap-1 mt-1">
            <div className="w-[9px] h-[9px] border border-slate-600 bg-white shrink-0 mt-0.5" />
            <p className="text-[8px]">13. The people listed in Item Numbers 8. - 11. have completed Form I-864A.</p>
          </div>
          <div className="flex items-start gap-1 mt-0.5">
            <div className="w-[9px] h-[9px] border border-slate-600 bg-white shrink-0 mt-0.5" />
            <p className="text-[8px]">14. One or more of the people listed in Item Numbers 8. - 11. do not need to complete Form I-864A because he or she is the intending immigrant and has no accompanying dependents.</p>
          </div>
          <p className="text-[8px] font-bold mt-1">Remarks</p>
          <div className="border border-slate-500 h-10 bg-white mb-1" />

          <p className="text-[8.5px] font-bold mt-2">Federal Tax Return Information</p>
          <div className="flex items-center gap-2">
            <span className="text-[8px]">15. Have you filed a Federal income tax return for each of the three most recent tax years?</span>
            <div className="flex items-center gap-1 ml-auto">
              <div className="w-[9px] h-[9px] border border-slate-600 bg-white" /><span className="text-[8px]">Yes</span>
              <div className="w-[9px] h-[9px] border border-slate-600 bg-white ml-1" /><span className="text-[8px]">No</span>
            </div>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

// ── Page 7 ────────────────────────────────────────────────────────────────────
function Page7({ f, a }: { f: Fields; a: string | null }) {
  return (
    <PageWrap page={7}>
      <div className="flex gap-2">
        <div className="border border-slate-500 p-1 text-[7.5px] w-16 shrink-0"><p className="font-bold">For USCIS Use Only</p></div>
        <div className="flex-1">
          <SectionBar text="Part 6. Sponsor's Employment and Income (continued)" />
          <p className="text-[8px] mb-1">My total income (adjusted gross income on IRS Form 1040EZ) as reported on my Federal income tax returns for the most recent year was:</p>
          <table className="border-collapse border border-slate-500 text-[8px] mb-1">
            <thead>
              <tr>
                <td className="border border-slate-400 px-2 py-0.5 font-bold"></td>
                <td className="border border-slate-400 px-4 py-0.5 font-bold">Tax Year</td>
                <td className="border border-slate-400 px-4 py-0.5 font-bold">Total Income</td>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "16.a. Most Recent", id: "tax_year_1", val: f.tax_year_1 },
                { label: "16.b. 2nd Most Recent", id: "tax_year_2", val: f.tax_year_2 },
                { label: "16.c. 3rd Most Recent", id: "tax_year_3", val: f.tax_year_3 },
              ].map(({ label, id, val }) => (
                <tr key={label}>
                  <td className="border border-slate-400 px-2 py-0.5 font-semibold">{label}</td>
                  <td className="border border-slate-400 px-1 py-0.5">
                    <div data-field={id} className={`min-w-[60px] h-[16px] px-1 text-[8px] ${a === id ? "bg-yellow-100" : "bg-white"}`}>
                      {val?.split(",")[0]?.trim() || ""}
                    </div>
                  </td>
                  <td className="border border-slate-400 px-1 py-0.5">
                    <div className={`min-w-[80px] h-[16px] px-1 text-[8px] ${a === id ? "bg-yellow-100" : "bg-white"}`}>
                      $ {val?.split(",").slice(1).join(",").trim() || ""}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-start gap-1">
            <div className="w-[9px] h-[9px] border border-slate-600 bg-white shrink-0 mt-0.5" />
            <p className="text-[8px]">17. I was not required to file a Federal income tax return as my income was below the IRS required level and I have attached evidence to support this.</p>
          </div>

          <SectionBar text="Part 7. Use of Assets to Supplement Income (if Applicable)" />
          <p className="text-[7.5px] mb-1">If your income, or the total income for you and your household, from Part 6. exceeds the Federal Poverty Guidelines for your household size, <strong>YOU ARE NOT REQUIRED</strong> to complete this Part 7. Skip to Part 8.</p>
          <p className="text-[8px] font-bold mb-1">Your Assets (if applicable)</p>
          {[
            "1. Enter the balance of all cash, savings, and checking accounts.",
            "2. Enter the net cash value of real-estate holdings.",
            "3. Enter the net cash value of all stocks, bonds, certificates of deposit, and any other assets not already included in Item Number 1. or Item Number 2.",
            "4. Add together Item Numbers 1. - 3. and enter the number here.",
          ].map(label => (
            <div key={label} className="flex justify-between items-center mb-1">
              <p className="text-[8px] flex-1 mr-2">{label}</p>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[8px]">$</span>
                <div className="border border-slate-500 w-20 h-[18px] bg-white" />
              </div>
            </div>
          ))}
          <p className="text-[8px] font-bold mb-1">Assets of your household members (if applicable)</p>
          <div className="flex justify-between items-center">
            <p className="text-[8px] flex-1 mr-2">5. Add together the household members' assets reported on all the Form I-864A Part 4., Item Number 6. and enter the number here.</p>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[8px] font-bold">TOTAL: $</span>
              <div className="border border-slate-500 w-20 h-[18px] bg-white" />
            </div>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

// ── Page 8 ────────────────────────────────────────────────────────────────────
function Page8({ f, a }: { f: Fields; a: string | null }) {
  return (
    <PageWrap page={8}>
      <SectionBar text="Part 8. Sponsor's Contract, Contact Information, Certification, and Signature" />
      <p className="text-[7.5px] font-bold mb-1">NOTE: Read the Penalties section of the Form I-864 Instructions before completing this part.</p>
      <p className="text-[8.5px] font-bold italic mb-1">Sponsor's Contract</p>
      <p className="text-[8px] mb-1">Please note that, by signing this Form I-864, you agree to assume certain specific obligations under the Immigration and Nationality Act (INA) and other Federal laws.</p>
      <p className="text-[8.5px] font-bold mb-0.5">What is the Legal Effect of My Signing Form I-864?</p>
      <p className="text-[8px] mb-1">If you sign Form I-864 on behalf of any person (called the intending immigrant) who is applying for an immigrant visa or for adjustment of status to a lawful permanent resident, and that intending immigrant submits Form I-864 to the U.S. Government with his or her application for an immigrant visa or adjustment of status, under INA section 213A, these actions create a contract between you and the U.S. Government.</p>
      <p className="text-[8.5px] font-bold mb-0.5">What If I Choose Not to Sign Form I-864?</p>
      <p className="text-[8px] mb-1">The U.S. Government cannot make you sign Form 1-864 if you do not want to do so. But if you do not sign Form I-864, the intending immigrant may not become a lawful permanent resident in the United States.</p>
      <p className="text-[8.5px] font-bold mb-0.5">What Does Signing Form I-864 Require Me To Do?</p>
      <p className="text-[8px] mb-0.5">If an intending immigrant becomes a lawful permanent resident in the United States based on a Form I-864 that you have signed, then, until your obligations under Form I-864 terminate, you must:</p>
      <div className="ml-3 mb-1 space-y-0.5">
        <p className="text-[8px]"><strong>A.</strong> Provide the intending immigrant any support necessary to maintain him or her at an income that is at least 125 percent of the Federal Poverty Guidelines for his or her household size; and</p>
        <p className="text-[8px]"><strong>B.</strong> Notify U.S. Citizenship and Immigration Services (USCIS) of any change in your address, within 30 days of the change, by filing Form I-865.</p>
      </div>
    </PageWrap>
  );
}

// ── Page 9 ────────────────────────────────────────────────────────────────────
function Page9({ f, a }: { f: Fields; a: string | null }) {
  return (
    <PageWrap page={9}>
      <SectionBar text="Part 8. Sponsor's Contract, Contact Information, Certification, and Signature (continued)" />
      <p className="text-[8.5px] font-bold mb-0.5">What Other Consequences Are There?</p>
      <p className="text-[8px] mb-1">If an intending immigrant becomes a lawful permanent resident in the United States based on a Form I-864 that you have signed, then, until your obligations under Form I-864 terminate, the U.S. Government may consider (deem) your income and assets as available to that person, in determining whether he or she is eligible for certain Federal means-tested public benefits.</p>
      <p className="text-[8.5px] font-bold mb-0.5">What If I Do Not Fulfill My Obligations?</p>
      <p className="text-[8px] mb-1">If you do not provide sufficient support to the person who becomes a lawful permanent resident based on a Form I-864 that you signed, that person may sue you for this support.</p>
      <p className="text-[8.5px] font-bold mb-0.5">When Will These Obligations End?</p>
      <p className="text-[8px] mb-0.5">Your obligations under a Form I-864 that you signed will end if the person who becomes a lawful permanent resident based on that affidavit:</p>
      <div className="ml-3 mb-1 space-y-0.5">
        {["A. Becomes a U.S. citizen;","B. Has worked, or can receive credit for, 40 quarters of coverage under the Social Security Act;","C. No longer has lawful permanent resident status and has departed the United States;","D. Is subject to removal, but applies for and obtains, in removal proceedings, a new grant of adjustment of status, based on a new affidavit of support, if one is required; or","E. Dies."].map(t => (
          <p key={t} className="text-[8px]"><strong>{t.charAt(0)}</strong>{t.slice(1)}</p>
        ))}
      </div>
      <p className="text-[7.5px] font-bold mb-1">NOTE: Divorce does <u>not</u> terminate your obligations under Form I-864.</p>
      <p className="text-[7.5px] font-bold">NOTE: Select the box for either Item A. or B. in Item Number 1. If applicable, select the box for Item Number 2.</p>
    </PageWrap>
  );
}

// ── Page 10 ───────────────────────────────────────────────────────────────────
function Page10({ f, a }: { f: Fields; a: string | null }) {
  return (
    <PageWrap page={10}>
      <SectionBar text="Part 8. Sponsor's Contract, Contact Information, Certification, and Signature (continued)" />
      <p className="text-[8.5px] font-bold italic mb-0.5">Sponsor's Statement</p>
      <p className="text-[8px] font-semibold mb-0.5">1. Sponsor's Statement Regarding the Interpreter</p>
      <CheckBox checked label="A. I can read and understand English, and I have read and understand every question and instruction on this affidavit and my answer to every question." />

      <p className="text-[8.5px] font-bold italic mt-2 mb-0.5">Sponsor's Contact Information</p>
      <div className="grid grid-cols-3 gap-1 mb-2">
        <FormField id="sponsor_daytime_phone" label="3. Sponsor's Daytime Telephone Number" value={f.sponsor_daytime_phone} active={a === "sponsor_daytime_phone"} />
        <FormField id="sponsor_mobile_phone" label="4. Sponsor's Mobile Telephone Number (if any)" value={f.sponsor_mobile_phone} active={a === "sponsor_mobile_phone"} />
        <FormField id="sponsor_email" label="5. Sponsor's Email Address (if any)" value={f.sponsor_email} active={a === "sponsor_email"} />
      </div>

      <p className="text-[8.5px] font-bold italic mb-0.5">Sponsor's Declaration and Certification</p>
      <p className="text-[7.5px] mb-1">I certify, under penalty of perjury, that all of the information in my affidavit and any document submitted with it were provided or authorized by me, that I reviewed and understand all of the information contained in, and submitted with, my affidavit, and that all of this information is complete, true, and correct.</p>
      <div className="ml-2 space-y-0.5 mb-2">
        {["A. I know the contents of this affidavit of support that I signed;","B. I have read and I understand each of the obligations described in Part 8., and I agree to accept each of those obligations;","C. I agree to submit to the personal jurisdiction of any Federal or state court that has subject matter jurisdiction;","D. Each of the Federal income tax returns submitted in support of this affidavit are true copies;","E. I understand that, if I am related to the sponsored immigrant by marriage, termination of the marriage will not relieve me of my obligations;","F. I authorize the Social Security Administration to release information about me to USCIS and DOS."].map(t => (
          <p key={t} className="text-[7.5px]"><strong>{t.charAt(0)}</strong>{t.slice(1)}</p>
        ))}
      </div>

      <p className="text-[8.5px] font-bold italic mb-0.5">Sponsor's Signature</p>
      <div className="grid grid-cols-2 gap-1">
        <div>
          <p className="text-[7.5px] text-slate-600 mb-0.5">6. Sponsor's Signature</p>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-bold">➡</span>
            <div className="border border-slate-500 flex-1 h-[22px] bg-white" />
          </div>
        </div>
        <FormField label="Date of Signature (mm/dd/yyyy)" value={undefined} active={false} />
      </div>
      <p className="text-[7.5px] font-bold mt-2">NOTE TO ALL SPONSORS: If you do not completely fill out this affidavit or fail to submit required documents listed in the Instructions, USCIS or DOS may deny your request.</p>
    </PageWrap>
  );
}

// ── Page 11 ───────────────────────────────────────────────────────────────────
function Page11({ f, a }: { f: Fields; a: string | null }) {
  return (
    <PageWrap page={11}>
      <SectionBar text="Part 9. Interpreter's Contact Information, Certification, and Signature" />
      <p className="text-[8.5px] font-bold italic mb-0.5">Interpreter's Full Name</p>
      <div className="grid grid-cols-2 gap-1 mb-1">
        <FormField label="1. Interpreter's Family Name (Last Name)" value={undefined} active={false} />
        <FormField label="Interpreter's Given Name (First Name)" value={undefined} active={false} />
      </div>
      <FormField label="2. Interpreter's Business or Organization Name" value={undefined} active={false} />
      <p className="text-[8.5px] font-bold italic mt-2 mb-0.5">Interpreter's Contact Information</p>
      <div className="grid grid-cols-3 gap-1 mb-1">
        <FormField label="3. Interpreter's Daytime Telephone Number" value={undefined} active={false} />
        <FormField label="4. Interpreter's Mobile Telephone Number (if any)" value={undefined} active={false} />
        <FormField label="5. Interpreter's Email Address (if any)" value={undefined} active={false} />
      </div>
      <div className="grid grid-cols-2 gap-1 mt-2">
        <div>
          <p className="text-[7.5px] text-slate-600 mb-0.5">6. Interpreter's Signature</p>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-bold">➡</span>
            <div className="border border-slate-500 flex-1 h-[22px] bg-white" />
          </div>
        </div>
        <FormField label="Date of Signature (mm/dd/yyyy)" value={undefined} active={false} />
      </div>

      <SectionBar text="Part 10. Contact Information, Declaration, and Signature of the Person Preparing this Affidavit, if Other Than the Sponsor" />
      <p className="text-[8.5px] font-bold italic mb-0.5">Preparer's Full Name</p>
      <div className="grid grid-cols-2 gap-1 mb-1">
        <FormField label="1. Preparer's Family Name (Last Name)" value={undefined} active={false} />
        <FormField label="Preparer's Given Name (First Name)" value={undefined} active={false} />
      </div>
      <FormField label="2. Preparer's Business or Organization Name" value={undefined} active={false} />
      <p className="text-[8.5px] font-bold italic mt-2 mb-0.5">Preparer's Contact Information</p>
      <div className="grid grid-cols-3 gap-1 mb-2">
        <FormField label="3. Preparer's Daytime Telephone Number" value={undefined} active={false} />
        <FormField label="4. Preparer's Mobile Telephone Number (if any)" value={undefined} active={false} />
        <FormField label="5. Preparer's Email Address (if any)" value={undefined} active={false} />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div>
          <p className="text-[7.5px] text-slate-600 mb-0.5">6. Preparer's Signature</p>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-bold">➡</span>
            <div className="border border-slate-500 flex-1 h-[22px] bg-white" />
          </div>
        </div>
        <FormField label="Date of Signature (mm/dd/yyyy)" value={undefined} active={false} />
      </div>
    </PageWrap>
  );
}

// ── Page 12 ───────────────────────────────────────────────────────────────────
function Page12({ f, a }: { f: Fields; a: string | null }) {
  return (
    <PageWrap page={12}>
      <SectionBar text="Part 11. Additional Information" />
      <p className="text-[8px] mb-2">If you need extra space to provide any additional information within this contract, use the space below. If you need more space than what is provided, you may make copies of this page to complete and file with this contract or attach a separate sheet of paper. Type or print your name and A-Number (if any) at the top of each sheet; indicate the Page Number, Part Number, and Item Number to which your answer refers; and sign and date each sheet.</p>
      <div className="grid grid-cols-3 gap-1 mb-2">
        <FormField label="1. Family Name (Last Name)" value={f.sponsor_family_name} active={false} />
        <FormField label="Given Name (First Name)" value={f.sponsor_given_name} active={false} />
        <FormField label="Middle Name (if applicable)" value={f.sponsor_middle_name} active={false} />
      </div>
      <div className="flex items-center gap-1 mb-2">
        <span className="text-[8px] font-bold">2. A-Number (if any) ► A-</span>
        <div className="border border-slate-500 w-32 h-[18px] bg-white" />
      </div>
      <div className="grid grid-cols-3 gap-1 mb-1 text-[8px]">
        <span className="font-bold">3. Page Number</span>
        <span className="font-bold">Part Number</span>
        <span className="font-bold">Item Number</span>
      </div>
      {[3, 4, 5, 6].map(n => (
        <div key={n} className="mb-3">
          <div className="grid grid-cols-3 gap-1 mb-1">
            <div className="border border-slate-500 h-[18px] bg-white" />
            <div className="border border-slate-500 h-[18px] bg-white" />
            <div className="border border-slate-500 h-[18px] bg-white" />
          </div>
          {[1,2,3,4].map(i => <div key={i} className="border-b border-slate-300 h-5 mb-0.5" />)}
        </div>
      ))}
    </PageWrap>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function I864FormFull({ fields, activeFieldId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeFieldId || !containerRef.current) return;
    const el = containerRef.current.querySelector(`[data-field="${activeFieldId}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeFieldId]);

  const p = { f: fields, a: activeFieldId };

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <Page1 {...p} />
      <Page2 {...p} />
      <Page3 {...p} />
      <Page4 {...p} />
      <Page5 {...p} />
      <Page6 {...p} />
      <Page7 {...p} />
      <Page8 {...p} />
      <Page9 {...p} />
      <Page10 {...p} />
      <Page11 {...p} />
      <Page12 {...p} />
    </div>
  );
}

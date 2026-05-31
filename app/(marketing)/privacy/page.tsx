import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | VisaPilot",
  description: "How VisaPilot collects, uses, and protects your personal information.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12">
    <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h2>
    <div className="text-slate-600 leading-7 space-y-4">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b bg-slate-50">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <p className="text-sm font-medium text-blue-600 mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: May 31, 2026 &nbsp;·&nbsp; Effective: May 31, 2026</p>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-14 max-w-3xl">

        {/* Intro callout */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-12 text-sm text-blue-800 leading-6">
          <strong>Summary:</strong> We collect only what's necessary to run VisaPilot. We never sell your data.
          AI conversations are processed by Anthropic but not stored beyond your session.
          You can delete your account and data at any time.
        </div>

        <Section title="1. Who We Are">
          <p>
            VisaPilot ("we," "our," or "us") operates visapilot.app, an immigration information
            platform designed to help international students and professionals navigate the U.S.
            immigration system through checklists, AI-assisted guidance, and deadline tracking.
          </p>
          <p>
            We are not a law firm. Nothing on this platform constitutes legal advice. For
            immigration decisions specific to your situation, please consult a licensed immigration
            attorney or accredited representative.
          </p>
          <p>
            If you have questions about this policy, contact us at{" "}
            <a href="mailto:privacy@visapilot.app" className="text-blue-600 hover:underline">privacy@visapilot.app</a>.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <h3 className="font-semibold text-slate-800 mt-4">2.1 Information You Provide Directly</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-slate-800">Account registration:</strong> When you create an account via Clerk,
              we collect your name, email address, and optionally a profile photo if you sign in with Google.
            </li>
            <li>
              <strong className="text-slate-800">AI Assistant conversations:</strong> Messages you send to the AI
              Assistant are transmitted to Anthropic's Claude API. We do not permanently store your conversation
              history on our servers unless you use a Save feature. Anthropic may retain messages per their
              own privacy policy.
            </li>
            <li>
              <strong className="text-slate-800">Checklist & tool data:</strong> If you are signed in, we save
              your checklist completion state, OPT tracker dates, and tool preferences to your account.
            </li>
            <li>
              <strong className="text-slate-800">Community content:</strong> Any posts or comments you submit
              in the Community section are stored and may be publicly visible.
            </li>
            <li>
              <strong className="text-slate-800">Support communications:</strong> If you contact us by email,
              we keep a record of that correspondence.
            </li>
          </ul>

          <h3 className="font-semibold text-slate-800 mt-6">2.2 Information Collected Automatically</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-slate-800">Log data:</strong> Server logs include IP address, browser type,
              operating system, referring URL, pages visited, and timestamps.
            </li>
            <li>
              <strong className="text-slate-800">Usage data:</strong> We track feature interactions (e.g., which
              tools you use, which guides you read) to understand how the product is used and improve it.
            </li>
            <li>
              <strong className="text-slate-800">Device information:</strong> We collect device type, screen
              resolution, and browser version for debugging and compatibility.
            </li>
            <li>
              <strong className="text-slate-800">Cookies and local storage:</strong> We use session cookies for
              authentication, preference cookies to remember your settings, and analytics cookies to measure
              usage (see Section 7).
            </li>
          </ul>

          <h3 className="font-semibold text-slate-800 mt-6">2.3 Payment Information</h3>
          <p>
            Payments are processed by Stripe, Inc. We never see or store your full credit card number, CVV,
            or billing address on our servers. Stripe provides us with a tokenized reference and basic
            billing details (last 4 digits, card brand, expiration). Stripe's privacy policy governs
            how they handle payment data.
          </p>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul className="list-disc pl-5 space-y-2">
            <li>To create and manage your account and authenticate your identity</li>
            <li>To save and sync your checklist progress, tool data, and preferences across devices</li>
            <li>To generate AI responses to your immigration questions via the Claude API</li>
            <li>To process payments and send receipts and billing notifications</li>
            <li>To send transactional emails such as password resets and important account notices</li>
            <li>To improve VisaPilot by analyzing aggregate, anonymized usage patterns</li>
            <li>To debug errors, investigate abuse, and maintain platform security</li>
            <li>To respond to your support inquiries and feedback</li>
            <li>To comply with legal obligations and enforce our Terms of Service</li>
          </ul>
          <p>
            We do <strong className="text-slate-800">not</strong> use your data to train AI models,
            sell to third-party marketers, or send unsolicited marketing emails without your consent.
          </p>
        </Section>

        <Section title="4. Legal Bases for Processing (GDPR)">
          <p>
            If you are in the European Economic Area (EEA) or UK, we process your data under the
            following legal bases:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-slate-800">Contractual necessity:</strong> Processing required to provide the Service you signed up for (account management, checklist syncing, payments).</li>
            <li><strong className="text-slate-800">Legitimate interests:</strong> Analytics and product improvement, security monitoring, fraud prevention — balanced against your privacy rights.</li>
            <li><strong className="text-slate-800">Consent:</strong> Marketing communications and non-essential cookies, which you can withdraw at any time.</li>
            <li><strong className="text-slate-800">Legal obligation:</strong> Compliance with applicable laws and regulations.</li>
          </ul>
        </Section>

        <Section title="5. Sharing Your Information">
          <p>We share data only in the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-slate-800">Service providers:</strong> We share data with vendors who help
              operate VisaPilot (see Section 6). These vendors are contractually bound to use data only to
              provide services to us.
            </li>
            <li>
              <strong className="text-slate-800">Legal requirements:</strong> We may disclose data if required by
              law, court order, or government request, or to protect the rights and safety of VisaPilot,
              our users, or the public.
            </li>
            <li>
              <strong className="text-slate-800">Business transfers:</strong> If VisaPilot is acquired or merges
              with another company, your data may be transferred as part of that transaction. We will notify
              you before your data is subject to a materially different privacy policy.
            </li>
            <li>
              <strong className="text-slate-800">With your consent:</strong> We may share data in other ways with
              your explicit permission.
            </li>
          </ul>
          <p>We do <strong className="text-slate-800">not</strong> sell your personal data.</p>
        </Section>

        <Section title="6. Third-Party Services We Use">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-2">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-3 border border-slate-200 font-semibold text-slate-800">Service</th>
                  <th className="text-left p-3 border border-slate-200 font-semibold text-slate-800">Purpose</th>
                  <th className="text-left p-3 border border-slate-200 font-semibold text-slate-800">Data Shared</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Clerk", "Authentication & user management", "Name, email, login activity"],
                  ["Supabase", "Database & file storage", "Account data, checklist state"],
                  ["Anthropic (Claude API)", "AI Assistant responses", "Chat messages you send"],
                  ["Stripe", "Payment processing", "Billing info (tokenized)"],
                  ["Vercel", "Hosting & edge functions", "Request logs, IP address"],
                ].map(([service, purpose, data]) => (
                  <tr key={service} className="border-b border-slate-100">
                    <td className="p-3 border border-slate-200 font-medium text-slate-700">{service}</td>
                    <td className="p-3 border border-slate-200">{purpose}</td>
                    <td className="p-3 border border-slate-200">{data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="7. Cookies">
          <p>We use three categories of cookies:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-slate-800">Strictly necessary:</strong> Session and authentication cookies
              required for you to log in and use the Service. These cannot be disabled.
            </li>
            <li>
              <strong className="text-slate-800">Functional:</strong> Cookies that remember your preferences
              (e.g., dark/light mode, checklist state for guest users). Disabling them may reduce
              functionality.
            </li>
            <li>
              <strong className="text-slate-800">Analytics:</strong> Cookies from Vercel Analytics that help us
              understand aggregate usage. No cross-site tracking or advertising profiles are built.
            </li>
          </ul>
          <p>
            You can manage cookies through your browser settings. Blocking all cookies will prevent you
            from signing in.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-slate-800">Account data:</strong> Retained while your account is active.</li>
            <li><strong className="text-slate-800">Checklist & tool data:</strong> Retained while your account is active; deleted within 30 days of account deletion.</li>
            <li><strong className="text-slate-800">AI chat messages:</strong> Not stored on our servers beyond the active session. Anthropic retains messages per their policy.</li>
            <li><strong className="text-slate-800">Billing records:</strong> Retained for 7 years to comply with tax and accounting laws.</li>
            <li><strong className="text-slate-800">Support emails:</strong> Retained for 2 years after the issue is resolved.</li>
            <li><strong className="text-slate-800">Server logs:</strong> Retained for 90 days, then automatically deleted.</li>
          </ul>
        </Section>

        <Section title="9. Your Rights and Choices">
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-slate-800">Access:</strong> Request a copy of personal data we hold about you.</li>
            <li><strong className="text-slate-800">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong className="text-slate-800">Deletion:</strong> Request deletion of your account and associated personal data (right to be forgotten).</li>
            <li><strong className="text-slate-800">Portability:</strong> Request your data in a machine-readable format.</li>
            <li><strong className="text-slate-800">Restriction:</strong> Object to or request restriction of certain processing.</li>
            <li><strong className="text-slate-800">Withdraw consent:</strong> Opt out of marketing emails or analytics cookies at any time.</li>
          </ul>
          <p>
            California residents may also exercise rights under the CCPA, including the right to know,
            delete, and opt out of the sale of personal information (we do not sell personal information).
          </p>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:privacy@visapilot.app" className="text-blue-600 hover:underline">privacy@visapilot.app</a>.
            We will respond within 30 days. We may need to verify your identity before processing the request.
          </p>
        </Section>

        <Section title="10. Data Security">
          <p>
            We implement industry-standard security measures including TLS encryption in transit,
            AES-256 encryption at rest (via Supabase), access controls, and regular security reviews.
            Clerk handles authentication with industry-leading security practices including MFA support.
          </p>
          <p>
            No system is 100% secure. If we become aware of a data breach that affects your rights,
            we will notify affected users within 72 hours as required by applicable law.
          </p>
        </Section>

        <Section title="11. International Data Transfers">
          <p>
            VisaPilot is operated from the United States. If you access the Service from outside the U.S.,
            your data will be transferred to and processed in the U.S. For users in the EEA, UK, or
            Switzerland, such transfers are made under Standard Contractual Clauses or other appropriate
            safeguards.
          </p>
        </Section>

        <Section title="12. Children's Privacy">
          <p>
            VisaPilot is intended for users 13 and older. We do not knowingly collect personal data from
            children under 13. If you believe a child under 13 has created an account, please contact us
            and we will delete the account and associated data promptly.
          </p>
        </Section>

        <Section title="13. Changes to This Policy">
          <p>
            We may update this Privacy Policy periodically. When we do, we will update the "Last updated"
            date at the top. For material changes, we will notify you by email or by posting a prominent
            notice on the site at least 14 days before changes take effect. Continued use of VisaPilot
            after the effective date constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="14. Contact Us">
          <p>For privacy-related questions, requests, or complaints:</p>
          <div className="bg-slate-50 rounded-lg p-5 text-sm space-y-1">
            <p><strong className="text-slate-800">VisaPilot — Privacy Team</strong></p>
            <p>Email: <a href="mailto:privacy@visapilot.app" className="text-blue-600 hover:underline">privacy@visapilot.app</a></p>
            <p>General support: <a href="mailto:support@visapilot.app" className="text-blue-600 hover:underline">support@visapilot.app</a></p>
          </div>
          <p className="text-sm text-slate-500">
            If you are in the EEA and are not satisfied with our response, you have the right to lodge
            a complaint with your local data protection authority.
          </p>
        </Section>

        <div className="mt-10 pt-8 border-t border-slate-100 text-sm text-slate-400">
          <Link href="/terms" className="text-blue-600 hover:underline mr-4">Terms of Service</Link>
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

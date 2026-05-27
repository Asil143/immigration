"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { VisaType } from "@/types";
import { CheckCircle2, ArrowRight, Bot } from "lucide-react";

const visaOptions: { value: VisaType; label: string; desc: string }[] = [
  { value: "F-1", label: "F-1 Student", desc: "Currently enrolled as an international student" },
  { value: "OPT", label: "OPT", desc: "Post-graduation work authorization" },
  { value: "STEM-OPT", label: "STEM OPT", desc: "24-month STEM OPT extension" },
  { value: "H-1B", label: "H-1B", desc: "Specialty occupation work visa" },
  { value: "H-4", label: "H-4", desc: "Dependent of H-1B holder" },
  { value: "J-1", label: "J-1 Exchange", desc: "Exchange visitor program" },
  { value: "EB-1", label: "EB-1", desc: "Priority workers green card" },
  { value: "EB-2", label: "EB-2", desc: "Advanced degree / NIW green card" },
  { value: "EB-3", label: "EB-3", desc: "Skilled workers green card" },
  { value: "Other", label: "Other", desc: "Another visa type or exploring" },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [visa, setVisa] = useState<VisaType | null>(null);
  const [nationality, setNationality] = useState("");
  const [institution, setInstitution] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_visa: visa,
          nationality,
          school_or_employer: institution,
          onboarding_complete: true,
        }),
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white mx-auto mb-4">
            <Bot className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about your situation so we can personalize your experience.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s <= step ? "w-8 bg-primary" : "w-4 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "What is your current visa status?"}
              {step === 2 && "Where are you from?"}
              {step === 3 && "School or employer?"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Select the option that best describes your current immigration status."}
              {step === 2 && "Your country of birth affects visa bulletin priority dates."}
              {step === 3 && "We'll use this to personalize your guides and reminders."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {visaOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setVisa(opt.value)}
                    className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                      visa === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/40"
                    }`}
                  >
                    <CheckCircle2
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        visa === opt.value ? "text-primary" : "text-slate-300"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Input
                  placeholder="e.g. India, China, Brazil..."
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Used only for priority date tracking. We never share your data.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Input
                  placeholder={
                    visa && ["F-1", "J-1", "OPT", "STEM-OPT"].includes(visa)
                      ? "e.g. University of Texas Austin"
                      : "e.g. Google, Microsoft..."
                  }
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="text-base"
                />
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">You are all set!</p>
                  <p className="mt-1 text-sm text-blue-700">
                    Your personalized dashboard and deadline tracker are ready. You can update
                    these details anytime in Settings.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              {step > 1 ? (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !visa}
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={loading}>
                  {loading ? "Setting up..." : "Go to Dashboard"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <button
            className="underline hover:text-foreground"
            onClick={() => router.push("/dashboard")}
          >
            Skip for now
          </button>
        </p>
      </div>
    </div>
  );
}

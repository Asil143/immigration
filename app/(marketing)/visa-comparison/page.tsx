import { GitCompare } from "lucide-react";
import { VisaComparisonTool } from "@/components/visa-comparison/visa-comparison-tool";

export const metadata = {
  title: "Visa Comparison | VisaPilot",
  description: "Compare F-1 OPT, H-1B, O-1A, L-1A, EB-2 NIW, and TN visas side by side.",
};

export default function VisaComparisonPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="py-14 border-b" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#ede9fe", color: "#6d28d9" }}>
            <GitCompare className="h-4 w-4" />
            Side-by-Side Comparison
          </div>
          <h1 className="text-4xl font-bold mb-3">Visa Comparison Tool</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
            Compare up to 4 visa types side by side — work authorization, spouse rights, green card path, and more.
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-10">
        <VisaComparisonTool />
      </div>
    </div>
  );
}

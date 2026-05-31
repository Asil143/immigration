import { GitCompare } from "lucide-react";
import { VisaComparisonTool } from "@/components/visa-comparison/visa-comparison-tool";

export default function VisaComparisonDashboardPage() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <GitCompare className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Visa Comparison</h1>
        </div>
        <p className="text-muted-foreground">Compare up to 4 visa types side by side — work auth, spouse rights, green card path, and more.</p>
      </div>
      <VisaComparisonTool />
    </div>
  );
}

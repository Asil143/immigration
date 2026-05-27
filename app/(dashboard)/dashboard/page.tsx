import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Calendar,
  FileText,
  FolderOpen,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default async function DashboardPage() {
  let user: Awaited<ReturnType<typeof currentUser>> | null = null;
  try { user = await currentUser(); } catch { /* no-op in UI-first dev mode */ }

  const quickActions = [
    {
      title: "Ask AI Assistant",
      description: "Get instant answers to your immigration questions",
      href: "/ai-assistant",
      icon: Bot,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "View Timeline",
      description: "Check your upcoming deadlines",
      href: "/dashboard/timeline",
      icon: Calendar,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Upload Document",
      description: "Analyze your immigration documents with AI",
      href: "/dashboard/documents",
      icon: FileText,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Manage Cases",
      description: "Track your active visa applications",
      href: "/dashboard/cases",
      icon: FolderOpen,
      color: "text-orange-600 bg-orange-50",
    },
  ];

  const sampleDeadlines = [
    {
      title: "OPT Application Window Opens",
      daysLeft: 14,
      priority: "critical" as const,
      description: "90 days before graduation date",
    },
    {
      title: "STEM OPT Extension Filing",
      daysLeft: 45,
      priority: "high" as const,
      description: "File I-765 extension 90 days before OPT expiry",
    },
    {
      title: "Passport Renewal",
      daysLeft: 120,
      priority: "medium" as const,
      description: "Passport expires in 6 months",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Good morning{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here is your immigration overview for today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className={`inline-flex rounded-lg p-2.5 ${action.color} mb-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Deadlines */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/timeline">
                  View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleDeadlines.map((d) => (
                <div key={d.title} className="flex items-start gap-3 rounded-lg border p-3">
                  {d.priority === "critical" ? (
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  ) : d.priority === "high" ? (
                    <Clock className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{d.title}</p>
                      <Badge
                        variant={
                          d.priority === "critical"
                            ? "destructive"
                            : d.priority === "high"
                            ? "warning"
                            : "info"
                        }
                        className="ml-2 shrink-0"
                      >
                        {d.daysLeft}d
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{d.description}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/dashboard/timeline">Add Deadline</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Promo */}
        <div>
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 mb-4">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">AI Assistant</h3>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Ask any immigration question and get an instant answer with USCIS citations.
              </p>
              <Button
                variant="secondary"
                className="mt-4 w-full"
                asChild
              >
                <Link href="/ai-assistant">
                  Ask a Question <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Policy Alert */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Policy Update</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    USCIS updated H-1B lottery selection process for FY2026.
                  </p>
                  <Link
                    href="/guides/h1b-visa"
                    className="text-xs text-primary hover:underline mt-1 inline-block"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Bot, Crown, Zap, ChevronDown } from "lucide-react";
import { dashboardNav, toolsNav, settingsNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [toolsOpen, setToolsOpen] = useState(
    pathname.includes("/tools") || pathname.includes("/rfe-assistant") || pathname.includes("/generate")
  );

  // Mock plan — will come from DB later
  const plan = "free";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background">
      {/* Logo */}
      <Link href="/" className="flex h-16 items-center gap-2 border-b px-6 hover:opacity-80 transition-opacity">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <Bot className="h-5 w-5" />
        </div>
        <span className="font-bold text-xl text-primary">VisaPilot</span>
        <Badge variant="secondary" className="ml-auto text-[10px] px-1.5">BETA</Badge>
      </Link>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {dashboardNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
                {item.href === "/ai-assistant" && !isActive && (
                  <Zap className="ml-auto h-3 w-3 text-yellow-500 opacity-70" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Tools collapsible section */}
        <div className="mt-4 border-t pt-4">
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            <span>Tools & Generators</span>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", toolsOpen && "rotate-180")} />
          </button>
          {toolsOpen && (
            <div className="space-y-0.5 mt-1">
              {toolsNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.badge}</Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 border-t pt-4 space-y-0.5">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Account</p>
          {settingsNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Upgrade CTA — only for free plan */}
        {plan === "free" && (
          <div className="mt-4 mx-1 rounded-xl bg-gradient-to-br from-primary/10 to-purple-100 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-primary" />
              <p className="font-semibold text-sm">Upgrade to Pro</p>
            </div>
            <p className="text-xs text-muted-foreground leading-4">
              Unlimited AI queries, SMS reminders, and document analysis.
            </p>
            <Link
              href="/pricing"
              className="mt-3 flex w-full items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              View Plans — from $19/mo
            </Link>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <UserButton />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Badge variant={plan === "free" ? "secondary" : "info"} className="text-[10px] px-1.5 py-0 capitalize">
                {plan}
              </Badge>
              <span className="text-[10px] text-muted-foreground truncate">{user?.emailAddresses[0]?.emailAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

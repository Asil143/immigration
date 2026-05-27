"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";

const publicLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/community", label: "Community" },
  { href: "/lawyers", label: "Find a Lawyer" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Bot className="h-5 w-5" />
          </div>
          VisaPilot
          <Badge variant="info" className="text-[10px] px-1.5 py-0">BETA</Badge>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith(link.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Get Started Free</Button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {isSignedIn ? (
              <Button asChild><Link href="/dashboard">Dashboard</Link></Button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">Get Started Free</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

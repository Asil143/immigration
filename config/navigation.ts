import {
  LayoutDashboard,
  Bot,
  FileText,
  Users,
  Scale,
  Calendar,
  Settings,
  Bell,
  FolderOpen,
  Timer,
  BarChart3,
  Search,
  FilePlus2,
  AlertTriangle,
  Newspaper,
  Wrench,
  Calculator,
  Trophy,
  UserCircle,
  ScanLine,
  ClipboardList,
  ListChecks,
  GitCompare,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  description?: string;
}

export const dashboardNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and quick actions",
  },
  {
    title: "My Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
    description: "Your visa status & key dates",
    badge: "New",
  },
  {
    title: "AI Assistant",
    href: "/ai-assistant",
    icon: Bot,
    description: "Ask any immigration question",
  },
  {
    title: "My Cases",
    href: "/dashboard/cases",
    icon: FolderOpen,
    description: "Manage your visa applications",
  },
  {
    title: "Timeline",
    href: "/dashboard/timeline",
    icon: Calendar,
    description: "Deadlines and reminders",
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
    description: "Upload and analyze documents",
  },
  {
    title: "Community",
    href: "/community",
    icon: Users,
    description: "Forum and peer support",
  },
  {
    title: "Find a Lawyer",
    href: "/lawyers",
    icon: Scale,
    description: "Verified immigration attorneys",
  },
];

export const toolsNav: NavItem[] = [
  {
    title: "Visa Checklists",
    href: "/dashboard/tools/checklists",
    icon: ListChecks,
    description: "Step-by-step guides for OPT, H-1B, Green Card & more",
    badge: "New",
  },
  {
    title: "Visa Comparison",
    href: "/dashboard/tools/visa-comparison",
    icon: GitCompare,
    description: "Compare F-1, H-1B, Green Card & more",
  },
  {
    title: "OPT Day Counter",
    href: "/dashboard/tools/opt-tracker",
    icon: Timer,
    description: "Track OPT unemployment days",
  },
  {
    title: "Visa Bulletin",
    href: "/dashboard/tools/visa-bulletin",
    icon: BarChart3,
    description: "Priority date tracker",
  },
  {
    title: "Case Status",
    href: "/dashboard/tools/case-status",
    icon: Search,
    description: "Check USCIS case status",
  },
  {
    title: "Processing Times",
    href: "/dashboard/tools/processing-times",
    icon: BarChart3,
    description: "USCIS form processing times",
  },
  {
    title: "Generate Document",
    href: "/dashboard/documents/generate",
    icon: FilePlus2,
    description: "AI document generation",
    badge: "Pro",
  },
  {
    title: "RFE Assistant",
    href: "/rfe-assistant",
    icon: AlertTriangle,
    description: "Build your RFE response",
    badge: "Pro",
  },
  {
    title: "Smart Import",
    href: "/dashboard/documents/smart-import",
    icon: ScanLine,
    description: "AI reads your I-797, EAD, I-20",
    badge: "AI",
  },
  {
    title: "Fee Calculator",
    href: "/dashboard/tools/fee-calculator",
    icon: Calculator,
    description: "Calculate USCIS filing fees",
  },
  {
    title: "H-1B Tracker",
    href: "/dashboard/tools/h1b-tracker",
    icon: Trophy,
    description: "Lottery odds & timeline",
  },
];

export const moreNav: NavItem[] = [
  {
    title: "Blog & News",
    href: "/blog",
    icon: Newspaper,
    description: "Immigration policy updates",
  },
  {
    title: "All Tools",
    href: "/dashboard/tools",
    icon: Wrench,
    description: "Immigration tools hub",
  },
];

export const settingsNav: NavItem[] = [
  {
    title: "Notifications",
    href: "/dashboard/reminders",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const visaGuides = [
  {
    slug: "f1-visa",
    title: "F-1 Student Visa",
    subtitle: "Entry, maintenance, and status rules",
    icon: "🎓",
    color: "bg-blue-50 text-blue-700",
  },
  {
    slug: "opt-stem-opt",
    title: "OPT & STEM OPT",
    subtitle: "Work authorization after graduation",
    icon: "💼",
    color: "bg-purple-50 text-purple-700",
  },
  {
    slug: "h1b-visa",
    title: "H-1B Work Visa",
    subtitle: "Specialty occupation visa guide",
    icon: "🏢",
    color: "bg-green-50 text-green-700",
  },
  {
    slug: "green-card",
    title: "Green Card",
    subtitle: "Employment & family-based paths",
    icon: "🌿",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    slug: "j1-visa",
    title: "J-1 Exchange Visitor",
    subtitle: "Exchange programs & two-year bar",
    icon: "🌍",
    color: "bg-orange-50 text-orange-700",
  },
  {
    slug: "travel-advisory",
    title: "Travel Advisory",
    subtitle: "Safe travel on a visa, re-entry rules & stamps",
    icon: "✈️",
    color: "bg-sky-50 text-sky-700",
  },
] as const;

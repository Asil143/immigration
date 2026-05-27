// ─── User & Profile ──────────────────────────────────────────────────────────

export type SubscriptionPlan = "free" | "pro" | "premium";

export type VisaType =
  | "F-1"
  | "OPT"
  | "STEM-OPT"
  | "H-1B"
  | "H-4"
  | "J-1"
  | "L-1"
  | "O-1"
  | "EB-1"
  | "EB-2"
  | "EB-3"
  | "B-1/B-2"
  | "Other";

export interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  nationality: string | null;
  current_visa: VisaType | null;
  school_or_employer: string | null;
  onboarding_complete: boolean;
  subscription_plan: SubscriptionPlan;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Visa Cases ───────────────────────────────────────────────────────────────

export type CaseStatus =
  | "active"
  | "pending"
  | "approved"
  | "denied"
  | "expired"
  | "archived";

export interface VisaCase {
  id: string;
  user_id: string;
  visa_type: VisaType;
  title: string;
  status: CaseStatus;
  receipt_number: string | null;
  start_date: string | null;
  expiry_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Deadlines ────────────────────────────────────────────────────────────────

export type DeadlinePriority = "critical" | "high" | "medium" | "low";

export interface Deadline {
  id: string;
  user_id: string;
  case_id: string | null;
  title: string;
  description: string | null;
  due_date: string;
  priority: DeadlinePriority;
  is_completed: boolean;
  reminder_days: number[];
  created_at: string;
}

// ─── Documents ────────────────────────────────────────────────────────────────

export type DocumentType =
  | "I-20"
  | "I-94"
  | "I-797"
  | "I-765"
  | "I-131"
  | "Passport"
  | "Visa Stamp"
  | "EAD"
  | "Other";

export interface Document {
  id: string;
  user_id: string;
  case_id: string | null;
  name: string;
  document_type: DocumentType;
  storage_path: string;
  file_size: number;
  ai_analysis: DocumentAnalysis | null;
  created_at: string;
}

export interface DocumentAnalysis {
  summary: string;
  extracted_fields: Record<string, string>;
  issues: string[];
  recommendations: string[];
  expiry_date: string | null;
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  sources?: string[];
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

// ─── Lawyers ─────────────────────────────────────────────────────────────────

export type LawyerSpecialization =
  | "F-1/Student Visas"
  | "H-1B/Work Visas"
  | "Green Card"
  | "Family Immigration"
  | "Deportation Defense"
  | "Asylum"
  | "Naturalization"
  | "Business Immigration";

export interface Lawyer {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bar_number: string;
  state_licensed: string[];
  specializations: LawyerSpecialization[];
  bio: string;
  hourly_rate: number;
  consultation_fee: number;
  years_experience: number;
  languages: string[];
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_featured: boolean;
  calendly_url: string | null;
  created_at: string;
}

export interface Consultation {
  id: string;
  user_id: string;
  lawyer_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  meeting_url: string | null;
  notes: string | null;
  amount_cents: number;
  stripe_payment_intent_id: string | null;
  created_at: string;
}

// ─── Community ────────────────────────────────────────────────────────────────

export type ForumCategory =
  | "f1-students"
  | "opt-stem-opt"
  | "h1b-work-visa"
  | "green-card"
  | "family-visas"
  | "general"
  | "success-stories"
  | "lawyer-ama";

export interface ForumPost {
  id: string;
  author_id: string;
  author: Pick<UserProfile, "full_name" | "avatar_url" | "current_visa">;
  category: ForumCategory;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  reply_count: number;
  is_pinned: boolean;
  is_answered: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  post_id: string;
  author_id: string;
  author: Pick<UserProfile, "full_name" | "avatar_url" | "current_visa">;
  body: string;
  upvotes: number;
  is_verified_answer: boolean;
  created_at: string;
}

// ─── Guides ───────────────────────────────────────────────────────────────────

export interface GuideStep {
  title: string;
  description: string;
  action_items: string[];
  uscis_link?: string;
  estimated_time?: string;
}

export interface Guide {
  slug: string;
  visa_type: VisaType;
  title: string;
  subtitle: string;
  overview: string;
  steps: GuideStep[];
  faq: Array<{ question: string; answer: string }>;
  processing_times: string;
  fees: string;
  last_updated: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: "deadline" | "case_update" | "policy_change" | "system";
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

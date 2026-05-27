-- VisaPilot Database Schema
-- Run this in Supabase SQL Editor

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── Users / Profiles ────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  clerk_id text unique not null,
  email text unique not null,
  full_name text,
  avatar_url text,
  nationality text,
  current_visa text,
  school_or_employer text,
  onboarding_complete boolean default false,
  subscription_plan text default 'free' check (subscription_plan in ('free', 'pro', 'premium')),
  stripe_customer_id text,
  ai_queries_used_today integer default 0,
  ai_queries_reset_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Visa Cases ───────────────────────────────────────────────────────────────

create table if not exists public.visa_cases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  visa_type text not null,
  title text not null,
  status text default 'active' check (status in ('active', 'pending', 'approved', 'denied', 'expired', 'archived')),
  receipt_number text,
  start_date date,
  expiry_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Deadlines ────────────────────────────────────────────────────────────────

create table if not exists public.deadlines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  case_id uuid references public.visa_cases(id) on delete set null,
  title text not null,
  description text,
  due_date date not null,
  priority text default 'medium' check (priority in ('critical', 'high', 'medium', 'low')),
  is_completed boolean default false,
  reminder_days integer[] default array[30, 7, 1],
  created_at timestamptz default now()
);

-- ─── Documents ────────────────────────────────────────────────────────────────

create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  case_id uuid references public.visa_cases(id) on delete set null,
  name text not null,
  document_type text not null,
  storage_path text not null,
  file_size integer not null,
  ai_analysis jsonb,
  created_at timestamptz default now()
);

-- ─── Chat Sessions ────────────────────────────────────────────────────────────

create table if not exists public.chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default 'New conversation',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  sources jsonb,
  created_at timestamptz default now()
);

-- ─── Lawyers ─────────────────────────────────────────────────────────────────

create table if not exists public.lawyers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  full_name text not null,
  avatar_url text,
  bar_number text not null,
  state_licensed text[] not null,
  specializations text[] not null,
  bio text,
  hourly_rate numeric(10, 2),
  consultation_fee numeric(10, 2) not null,
  years_experience integer,
  languages text[] default array['English'],
  rating numeric(3, 2) default 0,
  review_count integer default 0,
  is_verified boolean default false,
  is_featured boolean default false,
  calendly_url text,
  created_at timestamptz default now()
);

create table if not exists public.consultations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  lawyer_id uuid references public.lawyers(id) on delete cascade not null,
  scheduled_at timestamptz not null,
  duration_minutes integer default 30,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  meeting_url text,
  notes text,
  amount_cents integer not null,
  stripe_payment_intent_id text,
  created_at timestamptz default now()
);

-- ─── Community / Forum ────────────────────────────────────────────────────────

create table if not exists public.forum_posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references public.profiles(id) on delete cascade not null,
  category text not null,
  title text not null,
  body text not null,
  tags text[] default array[]::text[],
  upvotes integer default 0,
  reply_count integer default 0,
  is_pinned boolean default false,
  is_answered boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.forum_replies (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.forum_posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  upvotes integer default 0,
  is_verified_answer boolean default false,
  created_at timestamptz default now()
);

-- ─── Notifications ────────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  body text not null,
  type text not null check (type in ('deadline', 'case_update', 'policy_change', 'system')),
  is_read boolean default false,
  action_url text,
  created_at timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.visa_cases enable row level security;
alter table public.deadlines enable row level security;
alter table public.documents enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.consultations enable row level security;
alter table public.notifications enable row level security;

-- Profiles: users can only read/update their own
create policy "Users can view own profile" on public.profiles for select using (clerk_id = current_setting('app.clerk_user_id', true));
create policy "Users can update own profile" on public.profiles for update using (clerk_id = current_setting('app.clerk_user_id', true));

-- Visa cases: own data only
create policy "Users can CRUD own cases" on public.visa_cases for all using (user_id = (select id from public.profiles where clerk_id = current_setting('app.clerk_user_id', true)));

-- Deadlines
create policy "Users can CRUD own deadlines" on public.deadlines for all using (user_id = (select id from public.profiles where clerk_id = current_setting('app.clerk_user_id', true)));

-- Documents
create policy "Users can CRUD own documents" on public.documents for all using (user_id = (select id from public.profiles where clerk_id = current_setting('app.clerk_user_id', true)));

-- Chat
create policy "Users can CRUD own sessions" on public.chat_sessions for all using (user_id = (select id from public.profiles where clerk_id = current_setting('app.clerk_user_id', true)));
create policy "Users can CRUD own messages" on public.chat_messages for all using (user_id = (select id from public.profiles where clerk_id = current_setting('app.clerk_user_id', true)));

-- Lawyers: public read, own write
alter table public.lawyers enable row level security;
create policy "Lawyers are publicly readable" on public.lawyers for select using (true);

-- Forum: public read
alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;
create policy "Forum posts are publicly readable" on public.forum_posts for select using (true);
create policy "Forum replies are publicly readable" on public.forum_replies for select using (true);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index idx_profiles_clerk_id on public.profiles(clerk_id);
create index idx_visa_cases_user_id on public.visa_cases(user_id);
create index idx_deadlines_user_id_due on public.deadlines(user_id, due_date);
create index idx_documents_user_id on public.documents(user_id);
create index idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index idx_chat_messages_session_id on public.chat_messages(session_id);
create index idx_forum_posts_category on public.forum_posts(category, created_at desc);
create index idx_notifications_user_id on public.notifications(user_id, is_read);

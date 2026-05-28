-- VisaPilot Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/kxgumnuqpgecutwaocns/sql/new

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id                    uuid primary key default uuid_generate_v4(),
  clerk_id              text unique not null,
  email                 text,
  full_name             text,
  avatar_url            text,
  -- Current immigration status
  visa_type             text,
  country_of_birth      text,
  employer              text,
  -- Key expiry dates
  ead_expiry            date,
  i94_expiry            date,
  visa_stamp_expiry     date,
  passport_expiry       date,
  h1b_start_date        date,
  opt_start_date        date,
  opt_end_date          date,
  stem_opt_start_date   date,
  stem_opt_end_date     date,
  visa_start_date       date,
  passport_issue_date   date,
  i94_is_ds             boolean default false,
  i20_end_date          date,
  h1b_expiry            date,
  advance_parole_issue_date date,
  advance_parole_expiry date,
  i140_approval_date    date,
  h4_ead_issue_date     date,
  h4_ead_expiry         date,
  j1_end_date           date,
  tn_start_date         date,
  tn_expiry             date,
  l1_start_date         date,
  l1_expiry             date,
  perm_filing_date      date,
  priority_date         date,
  -- Green card
  green_card_stage      text,
  green_card_category   text,
  -- Goals selected during onboarding
  goals                 text[] default array[]::text[],
  -- App state
  onboarding_complete   boolean default false,
  subscription_plan     text default 'free',
  ai_queries_used_today integer default 0,
  ai_queries_reset_at   timestamptz default now(),
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ─── Monitored USCIS Cases ────────────────────────────────────────────────────

create table if not exists public.monitored_cases (
  id              uuid primary key default uuid_generate_v4(),
  clerk_id        text not null references public.profiles(clerk_id) on delete cascade,
  receipt_number  text not null,
  form_type       text,
  label           text,
  last_status     text,
  last_checked_at timestamptz,
  created_at      timestamptz default now()
);

-- ─── Visa Cases (applications tracker) ───────────────────────────────────────

create table if not exists public.visa_cases (
  id             uuid primary key default uuid_generate_v4(),
  clerk_id       text not null references public.profiles(clerk_id) on delete cascade,
  visa_type      text not null,
  title          text not null,
  status         text default 'active',
  receipt_number text,
  start_date     date,
  expiry_date    date,
  notes          text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ─── Deadlines ────────────────────────────────────────────────────────────────

create table if not exists public.deadlines (
  id           uuid primary key default uuid_generate_v4(),
  clerk_id     text not null references public.profiles(clerk_id) on delete cascade,
  title        text not null,
  description  text,
  due_date     date not null,
  priority     text default 'medium',
  is_completed boolean default false,
  created_at   timestamptz default now()
);

-- ─── Documents ────────────────────────────────────────────────────────────────

create table if not exists public.documents (
  id            uuid primary key default uuid_generate_v4(),
  clerk_id      text not null references public.profiles(clerk_id) on delete cascade,
  name          text not null,
  document_type text not null,
  storage_path  text,
  file_size     integer default 0,
  extracted_data jsonb,
  created_at    timestamptz default now()
);

-- ─── Chat Sessions ────────────────────────────────────────────────────────────

create table if not exists public.chat_sessions (
  id         uuid primary key default uuid_generate_v4(),
  clerk_id   text not null references public.profiles(clerk_id) on delete cascade,
  title      text default 'New conversation',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id         uuid primary key default uuid_generate_v4(),
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  clerk_id   text not null,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz default now()
);

-- ─── Notifications ────────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  clerk_id   text not null references public.profiles(clerk_id) on delete cascade,
  title      text not null,
  body       text not null,
  type       text not null,
  is_read    boolean default false,
  action_url text,
  created_at timestamptz default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index if not exists idx_profiles_clerk_id        on public.profiles(clerk_id);
create index if not exists idx_monitored_cases_clerk_id  on public.monitored_cases(clerk_id);
create index if not exists idx_visa_cases_clerk_id       on public.visa_cases(clerk_id);
create index if not exists idx_deadlines_clerk_id        on public.deadlines(clerk_id, due_date);
create index if not exists idx_documents_clerk_id        on public.documents(clerk_id);
create index if not exists idx_chat_sessions_clerk_id    on public.chat_sessions(clerk_id);
create index if not exists idx_chat_messages_session     on public.chat_messages(session_id);
create index if not exists idx_notifications_clerk_id    on public.notifications(clerk_id, is_read);

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique not null,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company_name text default 'Generic',
  category text not null,
  difficulty text not null check (difficulty in ('Junior', 'Mid', 'Senior')),
  description text,
  job_description text not null,
  interview_focus text default 'mixed',
  created_at timestamptz default now()
);

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  role text not null,
  company_name text,
  vapi_call_id text,
  raw_transcript text,
  duration_seconds integer,
  status text default 'completed',
  created_at timestamptz default now()
);

create table if not exists public.interview_summaries (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid unique references public.interviews(id) on delete cascade,
  qa_pairs jsonb not null,
  overall_summary text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.jobs enable row level security;
alter table public.interviews enable row level security;
alter table public.interview_summaries enable row level security;

drop policy if exists "users can read own profile" on public.users;
create policy "users can read own profile"
  on public.users
  for select
  using (auth.uid() = id);

drop policy if exists "users can insert own profile" on public.users;
create policy "users can insert own profile"
  on public.users
  for insert
  with check (auth.uid() = id);

drop policy if exists "users can update own profile" on public.users;
create policy "users can update own profile"
  on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "jobs are readable by authenticated users" on public.jobs;
create policy "jobs are readable by authenticated users"
  on public.jobs
  for select
  to authenticated
  using (true);

drop policy if exists "users can read own interviews" on public.interviews;
create policy "users can read own interviews"
  on public.interviews
  for select
  using (auth.uid() = user_id);

drop policy if exists "users can insert own interviews" on public.interviews;
create policy "users can insert own interviews"
  on public.interviews
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "users can update own interviews" on public.interviews;
create policy "users can update own interviews"
  on public.interviews
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users can read own summaries" on public.interview_summaries;
create policy "users can read own summaries"
  on public.interview_summaries
  for select
  using (
    exists (
      select 1
      from public.interviews i
      where i.id = interview_id
        and i.user_id = auth.uid()
    )
  );

drop policy if exists "users can insert own summaries" on public.interview_summaries;
create policy "users can insert own summaries"
  on public.interview_summaries
  for insert
  with check (
    exists (
      select 1
      from public.interviews i
      where i.id = interview_id
        and i.user_id = auth.uid()
    )
  );

insert into public.jobs (title, company_name, category, difficulty, description, job_description, interview_focus)
values
  ('Software Engineer', 'Generic', 'Engineering', 'Junior', 'Build scalable web features and APIs.', 'Design and ship full-stack features, write tests, and collaborate with cross-functional teams.', 'mixed'),
  ('Product Manager', 'Generic', 'Product', 'Mid', 'Define roadmap and drive product execution.', 'Lead product discovery, prioritization, stakeholder communication, and KPI tracking.', 'mixed'),
  ('Data Analyst', 'Generic', 'Data', 'Junior', 'Transform business questions into data insights.', 'Create dashboards, run SQL analysis, and communicate findings to teams.', 'analytical'),
  ('UX Designer', 'Generic', 'Design', 'Mid', 'Design user-centered digital experiences.', 'Run user research, build wireframes, test prototypes, and collaborate with PM/Eng.', 'behavioral'),
  ('Growth Marketer', 'Generic', 'Marketing', 'Senior', 'Drive acquisition and conversion strategy.', 'Plan experiments across channels, measure lift, and optimize funnel performance.', 'mixed')
on conflict do nothing;

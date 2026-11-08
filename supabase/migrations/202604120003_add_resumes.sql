create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  file_name text not null,
  file_url text,
  file_path text,
  score integer check (score >= 0 and score <= 100),
  summary text,
  strengths jsonb default '[]'::jsonb,
  improvements jsonb default '[]'::jsonb,
  section_scores jsonb default '[]'::jsonb,
  raw_analysis jsonb,
  created_at timestamptz default now()
);

alter table public.resumes enable row level security;

drop policy if exists "users can read own resumes" on public.resumes;
create policy "users can read own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

drop policy if exists "users can insert own resumes" on public.resumes;
create policy "users can insert own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

drop policy if exists "users can delete own resumes" on public.resumes;
create policy "users can delete own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

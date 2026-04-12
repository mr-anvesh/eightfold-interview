alter table public.interview_summaries
  add column if not exists strengths jsonb,
  add column if not exists improvements jsonb;

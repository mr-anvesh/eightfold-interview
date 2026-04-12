import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { InterviewRecord, JobRecord } from "@/lib/types";

type SearchParams = {
  tab?: string;
  job?: string;
  interview?: string;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from("users").upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
    });
  }

  const [{ data: jobs = [] }, { data: interviews = [] }] = await Promise.all([
    supabase.from("jobs").select("*").order("created_at", { ascending: false }),
    supabase
      .from("interviews")
      .select(
        "id, role, company_name, duration_seconds, status, created_at, job_id, jobs(id, title, company_name), interview_summaries(qa_pairs, overall_summary)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const normalizedInterviews: InterviewRecord[] = (interviews ?? []).map((item) => {
    const normalizedJob = Array.isArray(item.jobs) ? item.jobs[0] ?? null : item.jobs;
    const normalizedSummaries = Array.isArray(item.interview_summaries)
      ? item.interview_summaries
      : item.interview_summaries
        ? [item.interview_summaries]
        : null;

    return {
      id: item.id,
      role: item.role,
      company_name: item.company_name,
      duration_seconds: item.duration_seconds,
      status: item.status,
      created_at: item.created_at,
      job_id: item.job_id,
      jobs: normalizedJob,
      interview_summaries: normalizedSummaries,
    };
  });

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email ?? profile?.email ?? "unknown",
        full_name: profile?.full_name ?? user.user_metadata?.full_name ?? "Candidate",
      }}
      jobs={jobs as JobRecord[]}
      interviews={normalizedInterviews}
      initialTab={params.tab}
      initialJobId={params.job}
      initialInterviewId={params.interview}
    />
  );
}

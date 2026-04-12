"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Clock3, LogOut, Mic, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { InterviewRecord, JobRecord, QAPair } from "@/lib/types";

type TabKey = "start" | "history" | "jobs";

type DashboardShellProps = {
  user: {
    id: string;
    email: string;
    full_name: string;
  };
  jobs: JobRecord[];
  interviews: InterviewRecord[];
  initialTab?: string;
  initialJobId?: string;
  initialInterviewId?: string;
};

function formatDuration(seconds: number | null): string {
  if (!seconds || Number.isNaN(seconds)) {
    return "--";
  }
  const minutes = Math.floor(seconds / 60);
  const remain = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remain}`;
}

export function DashboardShell({
  user,
  jobs,
  interviews,
  initialTab,
  initialJobId,
  initialInterviewId,
}: DashboardShellProps) {
  const router = useRouter();
  const getSupabase = () => getSupabaseBrowserClient();

  const [activeTab, setActiveTab] = useState<TabKey>(
    initialTab === "history" || initialTab === "jobs" ? initialTab : "start",
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId ?? jobs[0]?.id ?? "");
  const [selectedInterviewId, setSelectedInterviewId] = useState<string>(
    initialInterviewId ?? interviews[0]?.id ?? "",
  );
  const [roleInput, setRoleInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");
  const [interviewFocusInput, setInterviewFocusInput] = useState("");

  const [statusText, setStatusText] = useState<string>("Ready to begin");

  const selectedInterview = interviews.find((item) => item.id === selectedInterviewId) ?? null;
  const selectedSkills = skillsInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const resolvedRole = roleInput.trim();
  const resolvedCompany = companyInput.trim() || "Generic";
  const resolvedJobDescription =
    jobDescriptionInput.trim() ||
    `Interview simulation for ${resolvedRole || "the selected role"}. Focus on ${selectedSkills.join(", ") || "mixed"}.`;
  const resolvedInterviewFocus = interviewFocusInput.trim() || selectedSkills.join(", ") || "mixed";

  const changeTab = (tab: TabKey) => {
    setActiveTab(tab);
    const params = new URLSearchParams();
    params.set("tab", tab);
    if (selectedJobId) {
      params.set("job", selectedJobId);
    }
    if (selectedInterviewId) {
      params.set("interview", selectedInterviewId);
    }
    router.replace(`/dashboard?${params.toString()}`);
  };

  const onLogout = async () => {
    await getSupabase().auth.signOut();
    router.push("/");
    router.refresh();
  };

  const beginInterview = async () => {
    if (!resolvedRole) {
      setStatusText("Enter the role before starting the interview.");
      return;
    }

    if (selectedSkills.length === 0) {
      setStatusText("Enter at least one interview skill.");
      return;
    }

    const params = new URLSearchParams();
    params.set("role", resolvedRole);
    params.set("company", resolvedCompany);
    params.set("skills", selectedSkills.join(", "));
    params.set("focus", resolvedInterviewFocus);
    params.set("description", resolvedJobDescription);
    router.push(`/dashboard/call?${params.toString()}`);
  };

  return (
    <div className="grain flex min-h-screen flex-col bg-cream">
      <header className="flex items-center justify-between border-b border-oat px-5 py-4 sm:px-7">
        <Link href="/" className="label-mono text-xs text-fin">
          InterviewAI
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <div className="hidden text-right sm:block">
            <p className="font-semibold">{user.full_name}</p>
            <p className="text-muted">{user.email}</p>
          </div>
          <button onClick={onLogout} className="btn btn-outline flex items-center gap-2 px-3 py-2 text-xs font-semibold">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="border-b border-oat p-4 md:w-64 md:border-b-0 md:border-r md:p-5">
          <p className="label-mono mb-3 text-xs text-muted">Workspace</p>
          <nav className="grid gap-2">
            {[
              { key: "start", label: "Start Interview", icon: Mic },
              { key: "history", label: "History", icon: Clock3 },
              { key: "jobs", label: "Apply for Jobs", icon: BriefcaseBusiness },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => changeTab(item.key as TabKey)}
                  className={clsx(
                    "btn flex items-center gap-2 border px-3 py-2 text-sm text-left",
                    activeTab === item.key
                      ? "btn-primary border-ink"
                      : "border-oat bg-paper text-ink hover:border-ink",
                  )}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-5 sm:p-8">
          {activeTab === "start" ? (
            <section className="panel fade-up space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="label-mono text-xs text-muted">Start Interview</p>
                  <h2 className="mt-1 text-4xl">Voice Simulation</h2>
                </div>
                <span className="rounded-sm border border-oat bg-paper px-3 py-1 text-xs">{statusText}</span>
              </div>

              <label className="block text-sm font-medium">
                Enter role
                <input
                  value={roleInput}
                  onChange={(event) => setRoleInput(event.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
                />
              </label>

              <label className="block text-sm font-medium">
                Enter company name
                <input
                  value={companyInput}
                  onChange={(event) => setCompanyInput(event.target.value)}
                  placeholder="e.g. Eightfold AI"
                  className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
                />
              </label>

              <label className="block text-sm font-medium">
                Enter interview skills (comma separated)
                <input
                  value={skillsInput}
                  onChange={(event) => setSkillsInput(event.target.value)}
                  placeholder="e.g. TypeScript, ReactJS, System Design"
                  className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
                />
              </label>

              <label className="block text-sm font-medium">
                Enter interview focus (optional)
                <input
                  value={interviewFocusInput}
                  onChange={(event) => setInterviewFocusInput(event.target.value)}
                  placeholder="e.g. frontend architecture and debugging"
                  className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
                />
              </label>

              <label className="block text-sm font-medium">
                Enter job description context (optional)
                <textarea
                  value={jobDescriptionInput}
                  onChange={(event) => setJobDescriptionInput(event.target.value)}
                  rows={4}
                  placeholder="Paste job description or interview context"
                  className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
                />
              </label>

              <button onClick={beginInterview} className="btn btn-primary border border-ink px-5 py-3 text-sm font-semibold">
                Begin Interview
              </button>
            </section>
          ) : null}

          {activeTab === "jobs" ? (
            <section className="fade-up space-y-4">
              <div>
                <p className="label-mono text-xs text-muted">Marketplace</p>
                <h2 className="mt-1 text-4xl">Interview Templates</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job, index) => (
                  <article
                    key={job.id}
                    className="panel relative overflow-hidden p-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-fin/10" />
                    <p className="label-mono text-[10px] text-muted">{job.category}</p>
                    <h3 className="mt-2 text-2xl">{job.title}</h3>
                    <p className="mt-1 text-sm text-muted">{job.company_name}</p>
                    <p className="mt-3 text-sm">{job.description || job.job_description.slice(0, 120)}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-sm border border-oat bg-paper px-2 py-1 text-xs">{job.difficulty}</span>
                      <button
                        onClick={() => {
                          setSelectedJobId(job.id);
                          changeTab("start");
                        }}
                        className="btn btn-outline px-3 py-1 text-xs font-semibold"
                      >
                        Practice this role
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "history" ? (
            <section className="fade-up grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="panel p-4 sm:p-5">
                <p className="label-mono text-xs text-muted">Interview History</p>
                <div className="mt-4 grid gap-3">
                  {interviews.length === 0 ? (
                    <p className="text-sm text-muted">No interviews yet. Start one from the Start Interview tab.</p>
                  ) : null}

                  {interviews.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedInterviewId(item.id)}
                      className={clsx(
                        "btn panel w-full p-3 text-left",
                        selectedInterviewId === item.id ? "border-ink" : "border-oat",
                      )}
                    >
                      <p className="font-semibold">{item.role}</p>
                      <p className="text-sm text-muted">{item.company_name || item.jobs?.company_name || "Generic"}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted">
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        <span>{formatDuration(item.duration_seconds)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <p className="label-mono text-xs text-muted">Structured Q&A Summary</p>
                </div>
                {selectedInterview ? (
                  <div className="mt-4 space-y-4">
                    <h3 className="text-3xl">{selectedInterview.role}</h3>
                    <p className="text-sm text-muted">
                      {selectedInterview.interview_summaries?.[0]?.overall_summary ||
                        "Summary will appear here after interview processing."}
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <article className="panel bg-cream p-3">
                        <p className="label-mono text-[10px] text-muted">Strong Areas</p>
                        <ul className="mt-2 space-y-2 text-sm">
                          {(selectedInterview.interview_summaries?.[0]?.strengths || []).map((item, index) => (
                            <li key={`strength-${index}`}>• {item}</li>
                          ))}
                        </ul>
                      </article>
                      <article className="panel bg-cream p-3">
                        <p className="label-mono text-[10px] text-muted">Where To Improve</p>
                        <ul className="mt-2 space-y-2 text-sm">
                          {(selectedInterview.interview_summaries?.[0]?.improvements || []).map((item, index) => (
                            <li key={`improvement-${index}`}>• {item}</li>
                          ))}
                        </ul>
                      </article>
                    </div>

                    <div className="max-h-[55vh] space-y-3 overflow-auto pr-1">
                      {(selectedInterview.interview_summaries?.[0]?.qa_pairs as QAPair[] | undefined)?.map(
                        (qa, index) => (
                          <article key={`${qa.question}-${index}`} className="panel bg-cream p-3">
                            <p className="text-sm font-semibold">Q: {qa.question}</p>
                            <p className="mt-2 text-sm text-[#2e2d2a]">A: {qa.answer}</p>
                            <span className="mt-3 inline-block rounded-sm border border-oat bg-paper px-2 py-1 text-[11px] uppercase tracking-wide text-muted">
                              {qa.score}
                            </span>
                          </article>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">Select a completed interview to inspect details.</p>
                )}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

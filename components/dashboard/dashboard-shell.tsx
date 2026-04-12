"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Clock3, LogOut, Mic, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import Vapi from "@vapi-ai/web";
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

  const [callActive, setCallActive] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [manualTranscript, setManualTranscript] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [pending, setPending] = useState(false);
  const [statusText, setStatusText] = useState<string>("Ready to begin");

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;
  const selectedInterview = interviews.find((item) => item.id === selectedInterviewId) ?? null;

  const vapi = useMemo(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      return null;
    }

    try {
      return new Vapi(publicKey);
    } catch {
      return null;
    }
  }, []);

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
    if (!selectedJob) {
      setStatusText("Pick a job before starting the interview.");
      return;
    }

    setStatusText("Connecting to interviewer...");
    setLiveTranscript("");
    setManualTranscript("");
    setCallActive(true);
    setStartedAt(Date.now());

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

    if (vapi && assistantId) {
      vapi.on("message", (message: unknown) => {
        const transcriptChunk =
          typeof message === "object" &&
          message !== null &&
          "transcript" in message &&
          typeof (message as { transcript: unknown }).transcript === "string"
            ? (message as { transcript: string }).transcript
            : "";

        if (transcriptChunk) {
          setLiveTranscript((current) => `${current}\n${transcriptChunk}`.trim());
        }
      });

      vapi.on("error", () => {
        setStatusText("VAPI connection issue. You can still paste transcript manually.");
      });

      vapi.on("call-end", () => {
        setStatusText("Call ended. Saving interview...");
      });

      await vapi.start(assistantId, {
        variableValues: {
          company_name: selectedJob.company_name,
          role: selectedJob.title,
          candidate_name: user.full_name,
          job_description: selectedJob.job_description,
          interview_focus: selectedJob.interview_focus || "mixed",
        },
      });
      setStatusText("Live interview in progress");
      return;
    }

    setStatusText(
      assistantId
        ? "VAPI unavailable in this browser session. Paste transcript below and end the interview to continue."
        : "VAPI key not configured. Paste transcript below and end the interview to continue.",
    );
  };

  const endInterview = async () => {
    if (!selectedJob) {
      return;
    }

    setPending(true);
    try {
      if (vapi) {
        await vapi.stop();
      }

      const durationSeconds = startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0;
      const transcript = (liveTranscript || manualTranscript).trim();

      const response = await fetch("/api/interviews/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: selectedJob.id,
          rawTranscript:
            transcript ||
            `Interviewer: Tell me about your background. Candidate: I worked on core ${selectedJob.title} projects and improved product outcomes using measurable goals.`,
          durationSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save interview.");
      }

      setStatusText("Interview processed. Refreshing history...");
      router.refresh();
      setCallActive(false);
      setStartedAt(null);
      setManualTranscript("");
      setLiveTranscript("");
      setActiveTab("history");
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Unable to complete interview");
    } finally {
      setPending(false);
    }
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
                Select role
                <select
                  value={selectedJobId}
                  onChange={(event) => setSelectedJobId(event.target.value)}
                  className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} · {job.company_name}
                    </option>
                  ))}
                </select>
              </label>

              {selectedJob ? (
                <div className="panel bg-cream p-4 text-sm">
                  <p className="font-semibold text-ink">
                    {selectedJob.title} · {selectedJob.company_name}
                  </p>
                  <p className="mt-1 text-muted">{selectedJob.description || selectedJob.job_description}</p>
                </div>
              ) : null}

              {callActive ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-md border border-fin/30 bg-fin/10 p-3 text-sm">
                    <span className="pulse-dot" />
                    Interview in progress
                  </div>

                  <label className="block text-sm">
                    Transcript fallback (used when SDK transcript is unavailable)
                    <textarea
                      value={manualTranscript}
                      onChange={(event) => setManualTranscript(event.target.value)}
                      rows={7}
                      placeholder="Paste transcript here if needed"
                      className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
                    />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={endInterview}
                      disabled={pending}
                      className="btn btn-fin border border-fin px-4 py-2 text-sm font-semibold disabled:opacity-60"
                    >
                      {pending ? "Saving..." : "End Call"}
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={beginInterview} className="btn btn-primary border border-ink px-5 py-3 text-sm font-semibold">
                  Begin Interview
                </button>
              )}
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

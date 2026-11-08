"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Clock3,
  LogOut,
  Mic,
  UserCircle,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Search,
  ArrowRight,
} from "lucide-react";
import { clsx } from "clsx";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { InterviewRecord, JobRecord } from "@/lib/types";
import { getSkillsForJob } from "@/lib/job-templates";
import { ProfilePanel } from "@/components/dashboard/profile-panel";
import { ResumeAnalysisPanel } from "@/components/dashboard/resume-analysis-panel";
import { HistoryView } from "@/components/dashboard/history-view";

type TabKey = "start" | "history" | "jobs" | "resume" | "profile";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const [activeTab, setActiveTab] = useState<TabKey>(
    initialTab === "history" || initialTab === "jobs" || initialTab === "resume" || initialTab === "profile" ? initialTab : "start",
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId ?? jobs[0]?.id ?? "");
  const [selectedInterviewId, setSelectedInterviewId] = useState<string>(
    initialInterviewId ?? "",
  );

  // Initialize with initial matched job details if initialJobId is provided
  const initialMatchedJob = initialJobId ? jobs.find((j) => j.id === initialJobId) : null;
  const [roleInput, setRoleInput] = useState(initialMatchedJob?.title ?? "");
  const [companyInput, setCompanyInput] = useState(initialMatchedJob?.company_name ?? "");
  const [skillsInput, setSkillsInput] = useState(initialMatchedJob ? getSkillsForJob(initialMatchedJob) : "");
  const [jobDescriptionInput, setJobDescriptionInput] = useState(initialMatchedJob?.job_description ?? "");
  const [interviewFocusInput, setInterviewFocusInput] = useState(initialMatchedJob?.interview_focus ?? "");

  // Template marketplace state
  const [templateCategory, setTemplateCategory] = useState<string>("all");
  const [templateSearch, setTemplateSearch] = useState<string>("");

  const [statusText, setStatusText] = useState<string>(
    initialMatchedJob ? `Template loaded: ${initialMatchedJob.title}` : "Ready to begin",
  );

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

  /**
   * Loads all details from an interview template into the Start Interview Page
   * and switches the view to "start" so the user can begin immediately.
   */
  const handleSelectTemplate = (job: JobRecord) => {
    setSelectedJobId(job.id);
    setRoleInput(job.title);
    setCompanyInput(job.company_name || "General Tech");
    const skills = getSkillsForJob(job);
    setSkillsInput(skills);
    setInterviewFocusInput(job.interview_focus || "Technical problem-solving and architectural depth");
    setJobDescriptionInput(job.job_description || job.description || "");
    setStatusText(`Template loaded: ${job.title}. Ready to begin.`);

    // Switch to start tab
    setActiveTab("start");
    const params = new URLSearchParams();
    params.set("tab", "start");
    params.set("job", job.id);
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

  // Filter templates for the marketplace
  const engineeringCount = jobs.filter((j) => j.category.toLowerCase() === "engineering").length;
  const filteredTemplates = jobs.filter((job) => {
    const matchesCategory =
      templateCategory === "all" ||
      job.category.toLowerCase() === templateCategory.toLowerCase();
    const q = templateSearch.toLowerCase().trim();
    if (!q) return matchesCategory;
    const skills = getSkillsForJob(job).toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(q) ||
      (job.company_name && job.company_name.toLowerCase().includes(q)) ||
      skills.includes(q) ||
      (job.description && job.description.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grain flex min-h-screen flex-col bg-cream">
      <header className="flex items-center justify-between border-b border-oat px-5 py-4 sm:px-7">
        <Link href="/" className="label-mono text-xs text-fin">
          InterviewAI
        </Link>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-cream hover:opacity-80 transition-opacity"
            aria-label="User menu"
          >
            {(user.full_name || user.email)
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </button>
          {menuOpen ? (
            <div className="panel absolute right-0 top-12 z-50 w-56 overflow-hidden shadow-lg">
              <div className="border-b border-oat px-4 py-3">
                <p className="truncate text-sm font-semibold">{user.full_name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { setMenuOpen(false); changeTab("profile"); }}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs hover:bg-cream"
                >
                  <UserCircle size={14} /> Profile
                </button>
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs text-danger hover:bg-cream"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={clsx(
            "flex flex-col border-r border-oat bg-cream p-3 transition-all duration-200",
            sidebarOpen ? "w-64" : "w-16 items-center",
          )}
        >
          <div
            className={clsx(
              "mb-4 flex items-center pt-1",
              sidebarOpen ? "justify-between px-2" : "justify-center",
            )}
          >
            {sidebarOpen ? <p className="label-mono text-xs text-muted">Workspace</p> : null}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              className="hidden md:flex btn border border-oat bg-paper p-1.5 hover:border-ink"
            >
              {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
            </button>
          </div>

          <nav className="grid gap-1.5">
            {[
              { key: "start", label: "Start Interview", icon: Mic },
              { key: "history", label: "History", icon: Clock3 },
              { key: "jobs", label: "Interview Templates", icon: BriefcaseBusiness },
              { key: "resume", label: "Resume Analysis", icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => changeTab(item.key as TabKey)}
                  title={!sidebarOpen ? item.label : undefined}
                  className={clsx(
                    "btn flex w-full items-center gap-2 border py-2 text-sm",
                    sidebarOpen ? "px-3 text-left" : "justify-center px-0",
                    activeTab === item.key
                      ? "btn-primary border-ink"
                      : "border-oat bg-paper text-ink hover:border-ink",
                  )}
                >
                  <Icon size={16} className="shrink-0" />
                  {sidebarOpen ? <span className="truncate">{item.label}</span> : null}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-oat pt-3">
            <button
              onClick={() => changeTab("profile")}
              title={!sidebarOpen ? "Profile" : undefined}
              className={clsx(
                "btn flex w-full items-center gap-2 border py-2 text-sm",
                sidebarOpen ? "px-3 text-left" : "justify-center px-0",
                activeTab === "profile"
                  ? "btn-primary border-ink"
                  : "border-oat bg-paper text-ink hover:border-ink",
              )}
            >
              <User size={16} className="shrink-0" />
              {sidebarOpen ? <span className="truncate">Profile</span> : null}
            </button>
          </div>
        </aside>

        <main className="flex-1 p-5 sm:p-8">
          {activeTab === "start" ? (
            <section className="panel fade-up space-y-6 p-6 sm:p-8 bg-paper">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-oat pb-5">
                <div>
                  <p className="label-mono text-xs text-fin font-semibold">Start Interview</p>
                  <h2 className="mt-1 text-3xl sm:text-4xl font-normal text-ink">Voice Simulation</h2>
                  <p className="text-serif mt-1.5 text-sm text-muted">
                    Configure your mock interview role, skills, and focus before starting the audio session with Neha.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-[4px] border border-oat bg-[#faf9f6] px-3 py-1 text-xs font-mono text-ink">
                    {statusText}
                  </span>
                  <button
                    onClick={() => changeTab("jobs")}
                    className="btn btn-outline px-3 py-1 text-xs font-semibold bg-white hover:border-ink"
                  >
                    Browse Templates &rarr;
                  </button>
                </div>
              </div>

              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider">
                    Role Title
                    <input
                      value={roleInput}
                      onChange={(event) => setRoleInput(event.target.value)}
                      placeholder="e.g. Distributed Systems Engineer"
                      className="mt-1.5 w-full rounded-[4px] border border-oat bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink font-normal"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider">
                    Target Company
                    <input
                      value={companyInput}
                      onChange={(event) => setCompanyInput(event.target.value)}
                      placeholder="e.g. Google, Stripe, Meta"
                      className="mt-1.5 w-full rounded-[4px] border border-oat bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink font-normal"
                    />
                  </label>
                </div>

                <label className="block text-xs font-semibold text-ink uppercase tracking-wider">
                  Target Interview Skills (comma separated)
                  <input
                    value={skillsInput}
                    onChange={(event) => setSkillsInput(event.target.value)}
                    placeholder="e.g. Go, Raft, Distributed Storage, Fault Tolerance, Kafka"
                    className="mt-1.5 w-full rounded-[4px] border border-oat bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink font-normal font-mono"
                  />
                  <span className="mt-1 block text-[11px] text-muted font-normal lowercase tracking-normal">
                    Neha will evaluate your responses based on these specific technical competencies.
                  </span>
                </label>

                <label className="block text-xs font-semibold text-ink uppercase tracking-wider">
                  Interview Focus & Evaluation Rubric (optional)
                  <input
                    value={interviewFocusInput}
                    onChange={(event) => setInterviewFocusInput(event.target.value)}
                    placeholder="e.g. Consensus protocols, replication, and failover under network partitions"
                    className="mt-1.5 w-full rounded-[4px] border border-oat bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink font-normal"
                  />
                </label>

                <label className="block text-xs font-semibold text-ink uppercase tracking-wider">
                  Job Description Context (optional)
                  <textarea
                    value={jobDescriptionInput}
                    onChange={(event) => setJobDescriptionInput(event.target.value)}
                    rows={4}
                    placeholder="Paste job description or requirements to give Neha realistic context on your role."
                    className="mt-1.5 w-full rounded-[4px] border border-oat bg-paper p-3.5 text-xs text-ink outline-none focus:border-ink font-normal leading-relaxed"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-oat">
                <span className="text-xs text-muted font-mono">
                  Engine: Vapi Real-Time Voice + Groq LLaMA 3
                </span>
                <button
                  onClick={beginInterview}
                  className="btn btn-primary px-7 py-3 text-sm font-semibold flex items-center gap-2 shadow-xs"
                >
                  <span>Begin Interview</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </section>
          ) : null}

          {activeTab === "jobs" ? (
            <section className="fade-up space-y-6">
              {/* Header */}
              <div className="panel p-6 sm:p-8 bg-paper">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="label-mono text-xs text-fin font-semibold">ROLE TEMPLATES & BENCHMARKS</p>
                    <h2 className="mt-1 text-3xl sm:text-4xl font-normal text-ink">Interview Templates</h2>
                    <p className="text-serif mt-2 text-sm text-muted max-w-2xl leading-relaxed">
                      Select any engineering or technical role to automatically fill the Start Interview Page with calibrated skills, evaluation focus, and benchmark questions.
                    </p>
                  </div>

                  <span className="label-mono text-xs text-muted">
                    {filteredTemplates.length} {filteredTemplates.length === 1 ? "template available" : "templates available"}
                  </span>
                </div>

                {/* Search & Category Filter Bar */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-oat">
                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-[#faf9f6] p-1 rounded-[4px] border border-oat">
                    {[
                      { key: "all", label: `All (${jobs.length})` },
                      { key: "engineering", label: `Engineering (${engineeringCount})` },
                      { key: "product", label: "Product" },
                      { key: "data", label: "Data" },
                      { key: "design", label: "Design" },
                      { key: "marketing", label: "Marketing" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setTemplateCategory(tab.key)}
                        className={clsx(
                          "rounded-[3px] px-2.5 py-1 text-xs font-mono transition-all",
                          templateCategory === tab.key
                            ? "bg-ink text-white font-semibold"
                            : "text-muted hover:text-ink",
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Search roles, tech stack, skills..."
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      className="w-full rounded-[4px] border border-oat bg-paper pl-9 pr-3.5 py-1.5 text-xs text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Templates Grid */}
              {filteredTemplates.length === 0 ? (
                <div className="panel p-12 text-center text-xs text-muted bg-paper">
                  No interview templates matched your criteria.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredTemplates.map((job, index) => {
                    const skillsList = getSkillsForJob(job).split(",").map((s) => s.trim());
                    return (
                      <article
                        key={job.id}
                        onClick={() => handleSelectTemplate(job)}
                        className="panel p-5 bg-paper hover:border-ink transition-all cursor-pointer group shadow-xs hover:shadow-sm flex flex-col justify-between"
                        style={{ animationDelay: `${(index % 12) * 35}ms` }}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="rounded-[3px] border border-oat bg-[#faf9f6] px-2 py-0.5 text-[10px] font-mono text-muted uppercase">
                                {job.category}
                              </span>
                              <span className="rounded-[3px] border border-oat bg-[#faf9f6] px-2 py-0.5 text-[10px] font-mono text-ink">
                                {job.company_name}
                              </span>
                            </div>

                            <span
                              className={clsx(
                                "shrink-0 rounded-[3px] px-2 py-0.5 text-[10px] font-mono font-bold",
                                job.difficulty === "Senior"
                                  ? "bg-[#fe4c02]/15 text-[#fe4c02]"
                                  : job.difficulty === "Mid"
                                  ? "bg-[#0bdf50]/15 text-[#0b6b29]"
                                  : "bg-[#65b5ff]/15 text-[#004ba0]",
                              )}
                            >
                              {job.difficulty}
                            </span>
                          </div>

                          <h3 className="mt-3 text-lg font-medium text-ink group-hover:text-fin transition-colors">
                            {job.title}
                          </h3>

                          <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2 text-serif">
                            {job.description || job.job_description.slice(0, 140)}
                          </p>

                          {/* Skills preview tags */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {skillsList.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="rounded-[3px] border border-oat/70 bg-[#faf9f6] px-1.5 py-0.5 text-[10px] font-mono text-ink/80"
                              >
                                {skill}
                              </span>
                            ))}
                            {skillsList.length > 3 && (
                              <span className="text-[10px] font-mono text-muted self-center">
                                +{skillsList.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-oat/70 flex items-center justify-between">
                          <span className="text-[11px] text-muted font-mono truncate max-w-[160px]">
                            {job.interview_focus ? job.interview_focus.split(",")[0] : "Standard Rubric"}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTemplate(job);
                            }}
                            className="btn btn-primary px-3 py-1.5 text-xs font-semibold group-hover:bg-fin transition-colors flex items-center gap-1"
                          >
                            <span>Practice Role</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          ) : null}

          {activeTab === "history" ? (
            <HistoryView
              interviews={interviews}
              selectedInterviewId={selectedInterviewId}
              onSelectInterview={(id) => setSelectedInterviewId(id)}
              onStartRoleAgain={(role, company) => {
                const matched = jobs.find(
                  (j) =>
                    j.title.toLowerCase() === role.toLowerCase() ||
                    role.toLowerCase().includes(j.title.toLowerCase()),
                );
                if (matched) {
                  handleSelectTemplate(matched);
                } else {
                  setRoleInput(role);
                  setCompanyInput(company);
                  setSkillsInput("System Architecture, Problem Solving, Communication");
                  changeTab("start");
                }
              }}
              onNavigateToStart={() => changeTab("start")}
            />
          ) : null}

          {activeTab === "resume" ? (
            <ResumeAnalysisPanel
              onStartInterviewWithRole={(role) => {
                const matched = jobs.find(
                  (j) =>
                    j.title.toLowerCase().includes(role.toLowerCase()) ||
                    role.toLowerCase().includes(j.title.toLowerCase()),
                );
                if (matched) {
                  handleSelectTemplate(matched);
                } else {
                  setRoleInput(role);
                  setCompanyInput("Target Tech Company");
                  setSkillsInput("System Design, Coding & Data Structures, Technical Communication");
                  changeTab("start");
                }
              }}
            />
          ) : null}

          {activeTab === "profile" ? (
            <section className="fade-up">
              <ProfilePanel user={user} />
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

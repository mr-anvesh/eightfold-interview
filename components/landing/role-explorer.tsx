"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface JobTemplate {
  id: string;
  title: string;
  company: string;
  category: "Engineering" | "Product" | "Data" | "Design" | "Marketing";
  difficulty: "Junior" | "Mid" | "Senior";
  focus: string;
  description: string;
  sampleQuestion: string;
}

const jobs: JobTemplate[] = [
  {
    id: "eng-distributed",
    title: "Staff Distributed Systems Engineer",
    company: "Stripe-caliber",
    category: "Engineering",
    difficulty: "Senior",
    focus: "Consensus protocols, partition tolerance & high throughput",
    description: "Design fault-tolerant payment ledgers, implement Raft consensus, and manage multi-region active-active replicas.",
    sampleQuestion: "How do you prevent split-brain states during a transatlantic fiber cut while maintaining sub-100ms commit latencies?",
  },
  {
    id: "eng-frontend",
    title: "Senior Full-Stack Web Engineer",
    company: "Linear-caliber",
    category: "Engineering",
    difficulty: "Mid",
    focus: "Optimistic UI mutations, streaming SSR & CRDT state",
    description: "Architect instant, fluid web experiences with local SQLite caching, WebSocket sync, and responsive interaction design.",
    sampleQuestion: "Walk me through how your optimistic mutation pipeline rolls back invalid server validation states without flickering the client canvas.",
  },
  {
    id: "pm-core",
    title: "Lead Product Manager, Core Platform",
    company: "Uber-caliber",
    category: "Product",
    difficulty: "Senior",
    focus: "Marketplace liquidity, surge algorithms & cross-functional trade-offs",
    description: "Own core platform KPIs, balance driver supply elasticity against rider churn, and prioritize developer platform APIs.",
    sampleQuestion: "If driver cancellations spike 12% in rainy conditions despite a 1.4x surge boost, what exact diagnostic telemetry would you inspect first?",
  },
  {
    id: "data-ml",
    title: "Senior Machine Learning & Data Analyst",
    company: "Netflix-caliber",
    category: "Data",
    difficulty: "Senior",
    focus: "A/B test variance reduction, causal inference & ranking loss",
    description: "Formulate ranking hypotheses, design multi-variant experimentation guardrails, and evaluate churn propensity.",
    sampleQuestion: "When network effects contaminate your treatment and control clusters in an A/B test, how do you adjust your CUPED variance estimates?",
  },
  {
    id: "ux-design",
    title: "Staff Design Systems Architect",
    company: "Figma-caliber",
    category: "Design",
    difficulty: "Mid",
    focus: "Token architecture, WCAG AAA accessibility & component APIs",
    description: "Lead multi-brand design token specifications, design composable component primitives, and conduct behavioral usability loops.",
    sampleQuestion: "How do you architect polymorphic slot components in a shared design system without exposing brittle DOM layout dependencies to product teams?",
  },
  {
    id: "growth-lead",
    title: "Growth Marketing & Lifecycle Lead",
    company: "Vercel-caliber",
    category: "Marketing",
    difficulty: "Senior",
    focus: "PLG acquisition loops, self-serve conversion & CAC payback",
    description: "Optimize bottom-up developer onboarding funnels, design automated lifecycle triggers, and drive enterprise pipeline expansion.",
    sampleQuestion: "How do you evaluate whether a free-tier usage surge is generating high-intent enterprise pipeline vs subsidizing non-commercial hobbyists?",
  },
];

const categories = ["All", "Engineering", "Product", "Data", "Design", "Marketing"] as const;

export function RoleExplorer() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>("All");

  const filteredJobs =
    activeCategory === "All"
      ? jobs
      : jobs.filter((job) => job.category === activeCategory);

  return (
    <section id="roles" className="py-20 sm:py-28 border-t border-oat scroll-mt-16 bg-[#faf9f6]/40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="label-mono text-fin font-semibold">Job Marketplace</p>
            <h2 className="section-title mt-3 text-ink">
              Calibrated to actual hiring bars.
            </h2>
            <p className="text-serif mt-4 text-lg text-muted">
              Select any pre-configured role template with deep system prompts, or bring your own job description to rehearse before interview day.
            </p>
          </div>

          <Link
            href="/auth"
            className="btn btn-outline px-4 py-2.5 text-xs font-semibold bg-white"
          >
            <span>Custom JD Import</span>
            <ArrowRight size={13} className="ml-1.5" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-[4px] px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeCategory === category
                  ? "bg-ink text-white shadow-xs"
                  : "border border-oat bg-paper text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Roles Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="panel flex flex-col justify-between p-6 bg-paper transition-all hover:border-ink/50 group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between border-b border-oat pb-3">
                  <span className="label-mono text-[10px] text-muted">
                    {job.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-[4px] px-2 py-0.5 text-[10px] font-mono font-semibold ${
                        job.difficulty === "Senior"
                          ? "bg-ink text-white"
                          : "border border-oat bg-cream text-muted"
                      }`}
                    >
                      {job.difficulty}
                    </span>
                    <span className="rounded-[4px] border border-oat bg-cream px-2 py-0.5 text-[10px] font-mono text-ink">
                      {job.company}
                    </span>
                  </div>
                </div>

                <h3 className="card-title mt-4 text-xl font-medium text-ink group-hover:text-fin transition-colors">
                  {job.title}
                </h3>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  {job.description}
                </p>

                {/* Sample Probing Question */}
                <div className="mt-5 rounded-[4px] border border-oat/70 bg-[#faf9f6] p-3">
                  <span className="label-mono text-[9px] text-fin block mb-1">
                    Sample Neha Question
                  </span>
                  <p className="text-xs italic text-[#313130] leading-snug">
                    &ldquo;{job.sampleQuestion}&rdquo;
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-oat flex items-center justify-between">
                <span className="text-[11px] text-muted font-mono">
                  Focus: {job.focus.split(",")[0]}
                </span>
                <Link
                  href="/auth"
                  className="btn btn-primary px-3 py-1.5 text-xs font-semibold"
                >
                  <span>Practice</span>
                  <ArrowRight size={12} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
} from "lucide-react";

interface EvaluationItem {
  id: number;
  question: string;
  answer: string;
  score: "strong" | "adequate" | "weak";
  scoreBadge: string;
  evaluatorNotes: string;
  category: string;
}

const reportItems: EvaluationItem[] = [
  {
    id: 1,
    category: "System Design & Scalability",
    question:
      "When designing your payment ledger's multi-region idempotency key store, how do you prevent race conditions between two concurrent webhooks with the same payload?",
    answer:
      "We generate an HMAC-SHA256 digest of the raw payload and store it in Redis with SETNX and a 120-second lease. If the key exists, subsequent requests immediately poll the persisted transaction record instead of re-executing ledger writes.",
    score: "strong",
    scoreBadge: "STRONG",
    evaluatorNotes:
      "Candidate clearly separated the deduplication lock (Redis SETNX with explicit TTL) from the durable ledger store, preventing both double-charges and deadlocks.",
  },
  {
    id: 2,
    category: "Behavioral & Conflict Management",
    question:
      "Describe a situation where a staff engineer strongly disagreed with your proposed schema migration. How did you resolve the deadlock?",
    answer:
      "We wrote two competing RFC benchmarks over the weekend to measure write amplification under load. The data showed my approach had 18% less disk latency, so the team adopted it and we moved on smoothly.",
    score: "adequate",
    scoreBadge: "ADEQUATE",
    evaluatorNotes:
      "Good use of empirical benchmarking to de-escalate subjective technical debate. However, the answer lacked empathy for the peer's underlying architectural concerns.",
  },
  {
    id: 3,
    category: "Failure Modes & Edge Cases",
    question:
      "What happens when your distributed background queue experiences a network partition while holding 40,000 unacknowledged worker jobs?",
    answer:
      "The workers just restart when the network comes back up. We have standard timeout settings in Kubernetes.",
    score: "weak",
    scoreBadge: "WEAK",
    evaluatorNotes:
      "Failed to address at-least-once message delivery semantics, redelivery loops, poisoned pill messages, or dead-letter queues. Too vague on cluster recovery.",
  },
];

export function ScoredReportPreview() {
  const [activeTab, setActiveTab] = useState(1);

  const selectedItem =
    reportItems.find((item) => item.id === activeTab) || reportItems[0];

  return (
    <section id="rubric" className="py-20 sm:py-28 border-t border-oat scroll-mt-16 bg-[#faf9f6]/20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="label-mono text-fin font-semibold">Post-Interview Intelligence</p>
          <h2 className="section-title mt-3 text-ink">
            Granular feedback. Zero generic praise.
          </h2>
          <p className="text-serif mt-5 text-lg text-muted leading-relaxed">
            Most mock interview tools reply with polite generic encouragement. InterviewAI parses your verbatim voice stream into scored STAR-method evaluations with specific coaching suggestions.
          </p>
        </div>

        {/* The Report Artifact Showcase */}
        <div className="mt-14 panel overflow-hidden border border-oat bg-paper shadow-sm">
          {/* Artifact Header Banner */}
          <div className="flex flex-wrap items-center justify-between border-b border-oat bg-[#faf9f6] p-6 sm:px-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="label-mono text-[10px] text-muted">
                  SAMPLE CANDIDATE AUDIT
                </span>
                <span className="rounded-[4px] border border-oat bg-white px-2 py-0.5 text-[10px] font-mono text-ink">
                  Staff Backend Loop
                </span>
              </div>
              <h3 className="card-title text-2xl font-medium text-ink">
                Summary Scorecard: 88 / 100
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-[4px] badge-strong px-3 py-1 text-xs font-mono font-bold tracking-wider">
                RECOMMENDATION: STRONG HIRE
              </span>
            </div>
          </div>

          {/* Metric Bar Row */}
          <div className="grid grid-cols-2 border-b border-oat bg-white sm:grid-cols-4">
            <div className="border-r border-oat p-5 text-center">
              <span className="label-mono text-[10px] text-muted block">
                Technical Depth
              </span>
              <span className="mt-1 block font-mono text-2xl font-bold text-ink">
                9.4<span className="text-xs text-muted font-normal">/10</span>
              </span>
              <span className="text-[11px] text-[#0b6b29] font-medium">Top 5% quartile</span>
            </div>

            <div className="border-r border-oat p-5 text-center">
              <span className="label-mono text-[10px] text-muted block">
                STAR Structure
              </span>
              <span className="mt-1 block font-mono text-2xl font-bold text-ink">
                8.8<span className="text-xs text-muted font-normal">/10</span>
              </span>
              <span className="text-[11px] text-[#0b6b29] font-medium">Clear Action / Impact</span>
            </div>

            <div className="border-r border-oat p-5 text-center">
              <span className="label-mono text-[10px] text-muted block">
                Edge Case Handling
              </span>
              <span className="mt-1 block font-mono text-2xl font-bold text-ink">
                7.2<span className="text-xs text-muted font-normal">/10</span>
              </span>
              <span className="text-[11px] text-[#fe4c02] font-medium">Review partition logic</span>
            </div>

            <div className="p-5 text-center">
              <span className="label-mono text-[10px] text-muted block">
                Speech Cadence
              </span>
              <span className="mt-1 block font-mono text-2xl font-bold text-ink">
                142<span className="text-xs text-muted font-normal">wpm</span>
              </span>
              <span className="text-[11px] text-[#0b6b29] font-medium">Optimal fluency</span>
            </div>
          </div>

          {/* Tabbed Question Breakdown */}
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Tab Selectors */}
            <div className="mb-6 flex flex-wrap gap-2 border-b border-oat pb-4">
              {reportItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 rounded-[4px] px-3.5 py-2 text-xs font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-ink text-white shadow-xs"
                      : "border border-oat bg-[#faf9f6] text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  <span>Q{item.id}: {item.category}</span>
                  <span
                    className={`rounded-[3px] px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                      item.score === "strong"
                        ? "bg-[#0bdf50]/20 text-[#0bdf50]"
                        : item.score === "adequate"
                        ? "bg-[#65b5ff]/20 text-[#65b5ff]"
                        : "bg-[#c41c1c]/20 text-[#ff7070]"
                    }`}
                  >
                    {item.scoreBadge}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Question Content */}
            <div className="space-y-6">
              {/* Question */}
              <div className="rounded-[6px] border border-oat bg-[#faf9f6] p-5">
                <span className="label-mono text-[10px] text-muted block mb-1">
                  Question Asked by Neha
                </span>
                <p className="text-sm font-semibold text-ink leading-relaxed">
                  &ldquo;{selectedItem.question}&rdquo;
                </p>
              </div>

              {/* Verbatim Candidate Answer */}
              <div className="rounded-[6px] border border-oat bg-white p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="label-mono text-[10px] text-muted">
                    Candidate Verbatim Transcript
                  </span>
                  <span
                    className={`rounded-[4px] px-2.5 py-0.5 text-xs font-mono font-bold ${
                      selectedItem.score === "strong"
                        ? "badge-strong"
                        : selectedItem.score === "adequate"
                        ? "badge-adequate"
                        : "badge-weak"
                    }`}
                  >
                    SCORE: {selectedItem.scoreBadge}
                  </span>
                </div>
                <p className="text-sm text-[#313130] leading-relaxed">
                  &ldquo;{selectedItem.answer}&rdquo;
                </p>
              </div>

              {/* Evaluator Notes & Coaching */}
              <div className="rounded-[6px] border border-dashed border-oat bg-[#faf9f6] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={15} className="text-fin" />
                  <span className="label-mono text-[10px] font-bold text-ink">
                    STAR Evaluator Notes & Recommendations
                  </span>
                </div>
                <p className="text-xs text-[#313130] leading-relaxed pl-6">
                  {selectedItem.evaluatorNotes}
                </p>
              </div>
            </div>

            {/* Overall Recommendation Summary */}
            <div className="mt-8 border-t border-oat pt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-muted max-w-xl">
                Ready to review your own structured transcripts? All sessions are permanently preserved in your private history dashboard.
              </p>
              <Link
                href="/auth"
                className="btn btn-primary px-5 py-2.5 text-xs font-semibold"
              >
                <span>Get your baseline score</span>
                <ArrowRight size={13} className="ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

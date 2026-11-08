"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mic,
  CheckCircle2,
  Play,
  Pause,
  Cpu,
} from "lucide-react";

interface RoleScenario {
  id: string;
  role: string;
  company: string;
  focus: string;
  interviewerQuestion: string;
  candidateResponse: string;
  groqScore: "strong" | "adequate";
  scoreText: string;
  rubricNotes: string;
  duration: string;
}

const scenarios: RoleScenario[] = [
  {
    id: "systems",
    role: "Senior Distributed Systems Engineer",
    company: "Stripe-caliber",
    focus: "Consensus, backpressure & partition tolerance",
    interviewerQuestion:
      "When your payment webhook processor encounters downstream database write saturation, what specific backpressure policy guarantees zero data loss without unbounded memory queues?",
    candidateResponse:
      "We decouple ingestion via Kafka with partition replication factor 3. If consumers lag beyond a 500ms SLA, we trigger adaptive flow-control at the ingress proxy, returning HTTP 429 with Retry-After while persisting idempotent ledger events to disk-backed write-ahead logs.",
    groqScore: "strong",
    scoreText: "STRONG (9.6/10)",
    rubricNotes:
      "Exact architectural trade-offs articulated (Kafka disk WAL vs memory queue, client throttling semantics, idempotency guarantees).",
    duration: "03:42",
  },
  {
    id: "frontend",
    role: "Staff Frontend Architect",
    company: "Linear-caliber",
    focus: "Optimistic UI, offline sync & state reconciliation",
    interviewerQuestion:
      "How do you resolve conflicting CRDT mutations when two remote clients concurrently reorder tasks inside an offline Kanban board?",
    candidateResponse:
      "We use fractional indexing paired with a state-based CRDT where each operation embeds a logical Lamport timestamp and client UUID. Concurrent updates are resolved deterministically by comparing timestamps, rolling back local optimistic state only if a causal conflict is detected.",
    groqScore: "strong",
    scoreText: "STRONG (9.3/10)",
    rubricNotes:
      "Concrete conflict resolution algorithm cited (fractional indexing + Lamport clocks) with clear client-side optimistic rollbacks.",
    duration: "04:15",
  },
  {
    id: "pm",
    role: "Group Product Manager",
    company: "Uber-caliber",
    focus: "Marketplace dynamics, pricing elasticity & cannibalization",
    interviewerQuestion:
      "Surge pricing revenue is up 18%, but rider cancellation rates in airport queues rose by 7%. How do you diagnose whether this is healthy profit-taking or structural churn?",
    candidateResponse:
      "I'd segment the telemetry into corporate vs leisure cohorts and measure repeat booking intent at 14 and 30-day horizons. Then I'd compare driver acceptance rates against rider wait elasticity to calculate true deadhead dispatch costs before tweaking the multiplier.",
    groqScore: "adequate",
    scoreText: "ADEQUATE (8.1/10)",
    rubricNotes:
      "Good cohort segmentation strategy, but lacked an explicit North Star trade-off rule for whether airport airport wait reliability supersedes short-term take rate.",
    duration: "02:58",
  },
];

export function HeroShowcase() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scenario = scenarios[selectedScenarioIndex];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Background warm radiant tints */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[640px] w-full max-w-7xl overflow-hidden opacity-60">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#fff0e0] blur-3xl" />
        <div className="absolute top-12 right-1/4 h-80 w-80 rounded-full bg-[#edf5ff] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Top Eyebrow Tag */}
        <div className="fade-up text-center">
          <div className="label-mono inline-flex items-center gap-2 rounded-full border border-oat bg-paper px-4 py-1.5 text-[11px] text-[#111111] shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00da00] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00da00]"></span>
            </span>
            <span className="font-medium">ADAPTIVE VOICE AGENT &bull; CALIBRATED HIRING BARS</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="fade-up mt-8 text-center">
          <h1 className="display-hero mx-auto max-w-5xl text-ink font-normal">
            The mock interview that <br className="hidden sm:inline" />
            <span className="text-fin">refuses to let you ramble.</span>
          </h1>
          <p className="text-serif mx-auto mt-6 max-w-2xl text-xl text-[#313130] leading-relaxed">
            Neha isn&apos;t a passive chatbot you type into. It&apos;s an adaptive voice interviewer that probes your architectural trade-offs, challenges vague reasoning in 180ms, and grades your answers against Tier-1 hiring rubrics.
          </p>

          {/* Action CTAs with sharp 4px border radius */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/auth"
              className="btn btn-primary px-8 py-3.5 text-sm font-semibold shadow-xs"
            >
              <span>Start practicing free</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link
              href="#simulator"
              className="btn btn-outline px-7 py-3.5 text-sm font-semibold bg-paper"
            >
              Test live voice simulator &darr;
            </Link>
          </div>

          {/* Quality Proof Points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium text-[#626260]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#00da00]" /> 180ms conversational turn-latency
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#00da00]" /> Follow-ups probe your exact words
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#00da00]" /> Instant STAR rubric scorecards
            </span>
          </div>
        </div>

        {/* Interactive Voice Simulator Studio */}
        <div id="simulator" className="fade-up mt-16 scroll-mt-24">
          <div className="panel overflow-hidden border border-oat bg-paper shadow-sm">
            {/* Top Bar: Studio Console */}
            <div className="flex flex-wrap items-center justify-between border-b border-oat bg-[#faf9f6] px-5 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00da00]" />
                  <span className="label-mono text-[10px] text-ink font-semibold">
                    LIVE VOICE SIMULATOR
                  </span>
                </div>
                <span className="text-oat">|</span>
                <span className="text-xs text-muted font-mono hidden sm:inline">
                  Latency: <span className="text-ink font-medium">182ms</span>
                </span>
                <span className="text-oat hidden sm:inline">|</span>
                <span className="text-xs text-muted font-mono hidden md:inline">
                  Audio: <span className="text-ink font-medium">Studio Quality Voice</span>
                </span>
              </div>

              {/* Role Scenario Switcher */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <span className="text-[11px] text-muted font-mono hidden md:inline mr-1">
                  Scenario:
                </span>
                {scenarios.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedScenarioIndex(idx)}
                    className={`rounded-[4px] px-3 py-1 text-xs font-medium transition-all ${
                      selectedScenarioIndex === idx
                        ? "bg-ink text-white shadow-2xs"
                        : "border border-oat/70 bg-white text-muted hover:border-ink hover:text-ink"
                    }`}
                  >
                    {item.role.split(" ")[0]} ({item.company.replace("-caliber", "")})
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Stage */}
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Active Role Meta */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-oat pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-medium text-ink">{scenario.role}</h3>
                    <span className="rounded-[4px] border border-oat bg-[#faf9f6] px-2 py-0.5 text-[11px] font-mono text-muted">
                      {scenario.company}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Focus: <span className="text-ink font-medium">{scenario.focus}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="label-mono text-[11px] text-muted">
                    Session Duration: <span className="font-mono text-ink">{scenario.duration}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-8 items-center gap-1.5 rounded-[4px] border border-ink bg-white px-3 text-xs font-medium text-ink transition-all hover:bg-cream active:scale-95"
                    aria-label={isPlaying ? "Pause audio waveform" : "Play audio waveform"}
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                    <span>{isPlaying ? "Pause Stream" : "Simulate Stream"}</span>
                  </button>
                </div>
              </div>

              {/* Transcript Exchange: Interviewer Neha vs Candidate */}
              <div className="space-y-6">
                {/* Turn 1: Interviewer Neha */}
                <div className="relative rounded-[6px] border border-oat bg-[#faf9f6] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-fin text-white">
                        <Mic size={13} />
                      </div>
                      <span className="font-medium text-xs text-ink">Neha (AI Interviewer)</span>
                      <span className="label-mono text-[10px] text-muted font-mono">
                        AI Voice Agent
                      </span>
                    </div>

                    {/* Animated sound wave bars */}
                    <div className="flex items-end gap-1 h-5 px-2">
                      <span
                        className={`w-1 rounded-full bg-fin ${
                          isPlaying ? "animate-wave-1" : "h-2"
                        }`}
                      />
                      <span
                        className={`w-1 rounded-full bg-fin ${
                          isPlaying ? "animate-wave-2" : "h-3"
                        }`}
                      />
                      <span
                        className={`w-1 rounded-full bg-fin ${
                          isPlaying ? "animate-wave-3" : "h-1.5"
                        }`}
                      />
                      <span
                        className={`w-1 rounded-full bg-fin ${
                          isPlaying ? "animate-wave-4" : "h-4"
                        }`}
                      />
                      <span
                        className={`w-1 rounded-full bg-fin ${
                          isPlaying ? "animate-wave-2" : "h-2.5"
                        }`}
                      />
                    </div>
                  </div>

                  <p className="text-sm font-medium text-ink leading-relaxed pl-8">
                    &ldquo;{scenario.interviewerQuestion}&rdquo;
                  </p>
                </div>

                {/* Turn 2: Candidate */}
                <div className="relative rounded-[6px] border border-oat bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-ink text-white">
                        <span className="text-[11px] font-bold">YOU</span>
                      </div>
                      <span className="font-medium text-xs text-ink">Candidate Voice Feed</span>
                      <span className="label-mono text-[10px] text-muted">Verbatim Audio-to-Text</span>
                    </div>

                    <span className="label-mono text-[10px] text-muted">
                      Speech rate: 142 wpm
                    </span>
                  </div>

                  <p className="text-sm text-[#313130] leading-relaxed pl-8">
                    &ldquo;{scenario.candidateResponse}&rdquo;
                  </p>
                </div>

                {/* Turn 3: Real-Time Rubric Evaluation */}
                <div className="rounded-[6px] border border-dashed border-oat bg-[#faf9f6]/80 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Cpu size={14} className="text-fin" />
                      <span className="label-mono text-[11px] font-semibold text-ink">
                        STAR Rubric Evaluation:
                      </span>
                      <span
                        className={`rounded-[4px] px-2 py-0.5 text-[11px] font-mono font-bold tracking-wide ${
                          scenario.groqScore === "strong"
                            ? "badge-strong"
                            : "badge-adequate"
                        }`}
                      >
                        {scenario.scoreText}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted font-mono">
                      Inference Time: 34ms
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-muted pl-6 leading-relaxed">
                    <span className="font-semibold text-[#313130]">Rubric Notes:</span>{" "}
                    {scenario.rubricNotes}
                  </p>
                </div>
              </div>

              {/* Bottom callout */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-oat">
                <p className="text-xs text-muted">
                  Ready to test your vocal delivery under real-time pressure?
                </p>
                <Link
                  href="/auth"
                  className="btn btn-primary px-4 py-2 text-xs font-semibold"
                >
                  Start real voice session
                  <ArrowRight size={13} className="ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

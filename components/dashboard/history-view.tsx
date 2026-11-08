"use client";

import { useState } from "react";
import {
  Mic,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { InterviewRecord, QAPair } from "@/lib/types";
import {
  sanitizeQAPairs,
  parseRawTranscriptToBubbles,
} from "@/lib/transcript-cleaner";

interface HistoryViewProps {
  interviews: InterviewRecord[];
  selectedInterviewId: string;
  onSelectInterview: (id: string) => void;
  onStartRoleAgain: (role: string, company: string) => void;
  onNavigateToStart: () => void;
}

function formatDuration(seconds: number | null): string {
  if (!seconds || Number.isNaN(seconds)) return "--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export function HistoryView({
  interviews,
  selectedInterviewId,
  onSelectInterview,
  onStartRoleAgain,
  onNavigateToStart,
}: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterScore, setFilterScore] = useState<"all" | "strong" | "adequate" | "weak">("all");
  const [viewMode, setViewMode] = useState<"dialogue" | "raw">("dialogue");

  const handleOpenSession = (id: string) => {
    onSelectInterview(id);
  };

  const handleBackToList = () => {
    onSelectInterview("");
  };

  const filteredInterviews = interviews.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.role.toLowerCase().includes(q) ||
      (item.company_name && item.company_name.toLowerCase().includes(q)) ||
      (item.jobs?.title && item.jobs.title.toLowerCase().includes(q))
    );
  });

  const selectedInterview = selectedInterviewId
    ? interviews.find((item) => item.id === selectedInterviewId) || null
    : null;

  const summary = selectedInterview?.interview_summaries?.[0];
  const rawQaPairs = (summary?.qa_pairs as QAPair[] | undefined) || [];
  const qaPairs = sanitizeQAPairs(rawQaPairs, selectedInterview?.raw_transcript);

  const rawTranscriptData = parseRawTranscriptToBubbles(
    selectedInterview?.raw_transcript,
    rawQaPairs,
  );
  const rawBubbles = rawTranscriptData.bubbles;
  const rawSkillsFooter = rawTranscriptData.skillsFooter;

  // Filter dialogue turns if filterScore is active
  const displayedTurns = qaPairs.filter((turn) => {
    if (filterScore === "all") return true;
    return turn.score === filterScore;
  });

  // Calculate score breakdown
  const strongCount = qaPairs.filter((t) => t.score === "strong").length;
  const adequateCount = qaPairs.filter((t) => t.score === "adequate").length;
  const weakCount = qaPairs.filter((t) => t.score === "weak").length;
  const totalTurns = qaPairs.length;

  return (
    <div className="fade-up space-y-6">
      {/* =========================================================================
          VIEW 1: FULL-PAGE SESSION DETAIL (When a session is clicked / selected)
         ========================================================================= */}
      {selectedInterview ? (
        <div className="space-y-6">
          {/* Top Navigation & Actions Bar */}
          <div className="panel p-4 sm:p-5 bg-paper flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleBackToList}
              className="btn btn-outline px-3.5 py-1.5 text-xs font-semibold bg-white hover:border-ink flex items-center gap-2 group transition-colors"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to all sessions</span>
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() =>
                  onStartRoleAgain(
                    selectedInterview.role,
                    selectedInterview.company_name || "Generic",
                  )
                }
                className="btn btn-outline px-4 py-1.5 text-xs font-semibold bg-white"
              >
                <span>Practice this role again</span>
                <ArrowRight size={12} className="ml-1.5 text-fin" />
              </button>

              <button
                onClick={onNavigateToStart}
                className="btn btn-primary px-4 py-1.5 text-xs font-semibold"
              >
                Start New Session &rarr;
              </button>
            </div>
          </div>

          {/* Full-Width Session Meta & Summary Card */}
          <div className="panel p-6 sm:p-8 bg-paper">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-oat pb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="label-mono text-[10px] text-muted">
                    SESSION ARCHIVE
                  </span>
                  <span className="rounded-[4px] border border-oat bg-[#faf9f6] px-2.5 py-0.5 text-[11px] font-mono text-ink">
                    {selectedInterview.company_name || "General Benchmark"}
                  </span>
                </div>
                <h2 className="section-title text-3xl sm:text-4xl font-normal text-ink">
                  {selectedInterview.role}
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {new Date(selectedInterview.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Score & Timing Metrics Row */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="rounded-[4px] border border-oat bg-[#faf9f6] p-4 text-center">
                <span className="label-mono text-[9px] text-muted block">Duration</span>
                <span className="font-mono text-lg font-bold text-ink mt-0.5 block">
                  {formatDuration(selectedInterview.duration_seconds)}
                </span>
              </div>

              <div className="rounded-[4px] border border-oat bg-[#faf9f6] p-4 text-center">
                <span className="label-mono text-[9px] text-muted block">Total Turns</span>
                <span className="font-mono text-lg font-bold text-ink mt-0.5 block">
                  {totalTurns} {totalTurns === 1 ? "Turn" : "Turns"}
                </span>
              </div>

              <div className="rounded-[4px] border border-oat bg-[#faf9f6] p-4 text-center">
                <span className="label-mono text-[9px] text-muted block">Strong Answers</span>
                <span className="font-mono text-lg font-bold text-[#0b6b29] mt-0.5 block">
                  {strongCount} / {totalTurns}
                </span>
              </div>

              <div className="rounded-[4px] border border-oat bg-[#faf9f6] p-4 text-center">
                <span className="label-mono text-[9px] text-muted block">Overall Status</span>
                <span className="font-mono text-xs font-bold text-ink mt-1.5 flex items-center justify-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00da00]" />
                  Completed
                </span>
              </div>
            </div>

            {/* Executive Summary */}
            {summary?.overall_summary && (
              <div className="mt-6 rounded-[6px] border border-oat/80 bg-[#faf9f6] p-5">
                <span className="label-mono text-[10px] text-muted block mb-1.5 font-semibold">
                  EXECUTIVE ASSESSMENT
                </span>
                <p className="text-serif text-sm text-[#313130] leading-relaxed">
                  {summary.overall_summary}
                </p>
              </div>
            )}

            {/* Strengths & Improvements */}
            {((summary?.strengths && summary.strengths.length > 0) ||
              (summary?.improvements && summary.improvements.length > 0)) && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 border-t border-oat/70 pt-6">
                {summary?.strengths && summary.strengths.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-[#0b6b29]" />
                      <span className="label-mono text-[11px] font-semibold text-ink">
                        Demonstrated Strengths
                      </span>
                    </div>
                    <ul className="space-y-2 text-xs text-[#313130]">
                      {summary.strengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0bdf50] shrink-0 mt-1.5" />
                          <span className="leading-relaxed">{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary?.improvements && summary.improvements.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle size={15} className="text-fin" />
                      <span className="label-mono text-[11px] font-semibold text-ink">
                        Improvement Opportunities
                      </span>
                    </div>
                    <ul className="space-y-2 text-xs text-[#313130]">
                      {summary.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-fin shrink-0 mt-1.5" />
                          <span className="leading-relaxed">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conversational Message Stream Section (Full Width, No Exchange Dividers) */}
          <div className="panel p-6 sm:p-8 bg-paper space-y-6">
            {/* Stream Header & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-oat pb-5">
              <div className="flex items-center gap-2.5">
                <Sparkles size={17} className="text-fin" />
                <h3 className="text-lg font-medium text-ink">
                  {viewMode === "dialogue" ? "Conversational Dialogue Stream" : "Full Raw Transcript"}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Filter Score Buttons */}
                {viewMode === "dialogue" && totalTurns > 0 && (
                  <div className="flex items-center gap-1 bg-[#faf9f6] p-0.5 rounded-[4px] border border-oat">
                    <button
                      onClick={() => setFilterScore("all")}
                      className={`rounded-[3px] px-2.5 py-1 text-[10px] font-mono transition-all ${
                        filterScore === "all"
                          ? "bg-ink text-white font-semibold"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      All ({totalTurns})
                    </button>
                    <button
                      onClick={() => setFilterScore("strong")}
                      className={`rounded-[3px] px-2.5 py-1 text-[10px] font-mono transition-all ${
                        filterScore === "strong"
                          ? "bg-[#0bdf50]/20 text-[#0b6b29] font-bold"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      Strong ({strongCount})
                    </button>
                    <button
                      onClick={() => setFilterScore("adequate")}
                      className={`rounded-[3px] px-2.5 py-1 text-[10px] font-mono transition-all ${
                        filterScore === "adequate"
                          ? "bg-[#65b5ff]/20 text-[#004ba0] font-bold"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      Adequate ({adequateCount})
                    </button>
                    {weakCount > 0 && (
                      <button
                        onClick={() => setFilterScore("weak")}
                        className={`rounded-[3px] px-2.5 py-1 text-[10px] font-mono transition-all ${
                          filterScore === "weak"
                            ? "bg-[#c41c1c]/20 text-[#c41c1c] font-bold"
                            : "text-muted hover:text-ink"
                        }`}
                      >
                        Weak ({weakCount})
                      </button>
                    )}
                  </div>
                )}

                {/* View mode toggle */}
                {selectedInterview.raw_transcript && (
                  <button
                    onClick={() => setViewMode(viewMode === "dialogue" ? "raw" : "dialogue")}
                    className="rounded-[4px] border border-oat bg-[#faf9f6] px-3 py-1 text-xs text-muted hover:text-ink font-mono transition-colors"
                  >
                    {viewMode === "dialogue" ? "View Raw Transcript" : "View Scored Stream"}
                  </button>
                )}
              </div>
            </div>

            {/* Raw Transcript View Mode: Left Blue (AI) & Right Green (User) Bubbles */}
            {viewMode === "raw" && selectedInterview.raw_transcript && (
              <div className="space-y-5 max-h-[700px] overflow-y-auto pr-1">
                {rawBubbles.length === 0 ? (
                  <div className="p-10 text-center text-xs text-muted">
                    No transcript content recorded for this session.
                  </div>
                ) : (
                  rawBubbles.map((bubble, index) => {
                    const isAI = bubble.speaker === "ai";
                    return (
                      <div key={index} className="space-y-4">
                        {isAI ? (
                          /* AI Speech: Left-aligned Blue Bubble */
                          <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[78%]">
                            {/* Blue Avatar */}
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#2563eb] text-white shadow-2xs">
                              <Mic size={15} />
                            </div>

                            {/* Blue Bubble */}
                            <div className="rounded-xl rounded-tl-xs border border-[#60a5fa]/40 bg-gradient-to-br from-[#eff6ff] via-[#f0f9ff] to-[#e0f2fe] p-4 sm:p-5 shadow-2xs space-y-1.5">
                              <div className="mb-1 flex items-center gap-2">
                                <span className="text-xs font-semibold text-[#1d4ed8]">
                                  Neha
                                </span>
                              </div>
                              <p className="text-sm text-[#1e3a8a] leading-relaxed font-normal whitespace-pre-wrap">
                                {bubble.text}
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* User Speech: Right-aligned Green Bubble */
                          <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[78%] ml-auto flex-row-reverse">
                            {/* Green Avatar */}
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#059669] text-white shadow-2xs">
                              <span className="text-[10px] font-bold">YOU</span>
                            </div>

                            {/* Green Bubble */}
                            <div className="rounded-xl rounded-tr-xs border border-[#34d399]/40 bg-gradient-to-br from-[#ecfdf5] via-[#f0fdfa] to-[#ecfdf5] p-4 sm:p-5 shadow-2xs space-y-1.5">
                              <div className="mb-1 flex items-center justify-between gap-3">
                                <span className="text-xs font-semibold text-[#065f46]">
                                  You
                                </span>
                              </div>
                              <p className="text-sm text-[#064e3b] leading-relaxed font-normal whitespace-pre-wrap">
                                {bubble.text}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {rawSkillsFooter && (
                  <div className="mt-5 pt-4 border-t border-oat/70 flex items-center gap-2 text-xs text-muted font-mono">
                    <span className="label-mono text-[10px] text-muted">Interview Target Skills:</span>
                    <span className="text-ink font-semibold">{rawSkillsFooter}</span>
                  </div>
                )}
              </div>
            )}

            {/* Conversational Chat Stream (Clean dialogue messages without exchange dividers) */}
            {viewMode === "dialogue" && (
              <div className="space-y-6">
                {displayedTurns.length === 0 ? (
                  <div className="p-12 text-center text-xs text-muted">
                    No dialogue turns match the selected filter.
                  </div>
                ) : (
                  displayedTurns.map((turn, index) => (
                    <div key={index} className="space-y-4">
                      {/* Message 1: Neha (Interviewer) */}
                      <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%]">
                        {/* Avatar */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-fin text-white shadow-2xs">
                          <Mic size={15} />
                        </div>

                        {/* Chat Bubble */}
                        <div className="rounded-lg rounded-tl-xs border border-oat bg-[#faf9f6] p-4 sm:p-5 shadow-2xs">
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="text-xs font-semibold text-ink">
                              Neha
                            </span>
                          </div>
                          <p className="text-sm text-ink leading-relaxed font-normal">
                            {turn.question}
                          </p>
                        </div>
                      </div>

                      {/* Message 2: Candidate (You) */}
                      <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%] ml-auto flex-row-reverse">
                        {/* Avatar */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-ink text-white shadow-2xs">
                          <span className="text-[10px] font-bold">YOU</span>
                        </div>

                        {/* Chat Bubble */}
                        <div className="rounded-lg rounded-tr-xs border border-oat bg-white p-4 sm:p-5 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-ink">
                              Your Response
                            </span>
                            <span
                              className={`rounded-[3px] px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider ${
                                turn.score === "strong"
                                  ? "badge-strong"
                                  : turn.score === "adequate"
                                  ? "badge-adequate"
                                  : "badge-weak"
                              }`}
                            >
                              {turn.score.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-[#2b2a28] leading-relaxed">
                            {turn.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW 2: FULL-PAGE SESSION LIST (Grid of all past mock interview sessions)
           ========================================================================= */
        <div className="space-y-6">
          {/* Top Header */}
          <div className="panel p-6 sm:p-8 bg-paper">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="label-mono text-xs text-fin font-semibold">Interview Archive</p>
                <h2 className="mt-1 text-3xl sm:text-4xl font-normal text-ink">
                  Interview History & Transcripts
                </h2>
                <p className="text-serif mt-2 text-sm text-muted max-w-2xl leading-relaxed">
                  Review your full conversational dialogue with Neha, inspect turn-by-turn scored responses, and track your interview preparedness over time.
                </p>
              </div>

              <button
                onClick={onNavigateToStart}
                className="btn btn-primary px-4 py-2 text-xs font-semibold"
              >
                Start New Session &rarr;
              </button>
            </div>
          </div>

          {interviews.length === 0 ? (
            <div className="panel p-12 text-center bg-paper">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[4px] border border-oat bg-[#faf9f6] text-ink mb-4">
                <Mic size={20} className="text-fin" />
              </div>
              <h3 className="card-title text-xl font-medium text-ink">No Mock Interviews Recorded</h3>
              <p className="text-serif mx-auto mt-2 max-w-md text-sm text-muted">
                You haven&apos;t conducted any voice mock interviews yet. Launch your first session to receive structured conversational transcripts and scoring.
              </p>
              <button
                onClick={onNavigateToStart}
                className="btn btn-primary mt-6 px-5 py-2.5 text-xs font-semibold"
              >
                Start First Interview
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search & Results Count Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Search sessions by role or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-[4px] border border-oat bg-paper pl-9 pr-3.5 py-2.5 text-xs text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                  />
                </div>

                <span className="label-mono text-xs text-muted">
                  Showing {filteredInterviews.length} {filteredInterviews.length === 1 ? "session" : "sessions"}
                </span>
              </div>

              {/* Sessions Responsive Grid */}
              {filteredInterviews.length === 0 ? (
                <div className="panel p-8 text-center text-xs text-muted bg-paper">
                  No interviews match your search query.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredInterviews.map((item) => {
                    const itemSummary = item.interview_summaries?.[0];
                    const itemRawQAs = (itemSummary?.qa_pairs as QAPair[] | undefined) || [];
                    const itemQAs = sanitizeQAPairs(itemRawQAs, item.raw_transcript);
                    const strong = itemQAs.filter((q) => q.score === "strong").length;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenSession(item.id)}
                        className="panel p-5 bg-paper hover:border-ink transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-sm"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 min-w-0">
                              <span className="inline-block rounded-[3px] border border-oat bg-[#faf9f6] px-2 py-0.5 text-[10px] font-mono text-muted uppercase">
                                {item.company_name || item.jobs?.company_name || "General Benchmark"}
                              </span>
                              <h3 className="font-medium text-lg text-ink truncate group-hover:text-fin transition-colors">
                                {item.role}
                              </h3>
                            </div>

                            {itemQAs.length > 0 && (
                              <span
                                className={`shrink-0 rounded-[3px] px-2 py-1 text-[10px] font-mono font-bold ${
                                  strong / itemQAs.length >= 0.6
                                    ? "bg-[#0bdf50]/15 text-[#0b6b29]"
                                    : "bg-[#65b5ff]/15 text-[#004ba0]"
                                }`}
                              >
                                {strong}/{itemQAs.length} Strong
                              </span>
                            )}
                          </div>

                          {/* Executive summary preview if present */}
                          {itemSummary?.overall_summary && (
                            <p className="mt-3 text-xs text-muted line-clamp-2 text-serif leading-relaxed">
                              {itemSummary.overall_summary}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-oat/70 flex items-center justify-between text-xs text-muted font-mono">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(item.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatDuration(item.duration_seconds)}
                            </span>
                          </div>

                          <span className="flex items-center gap-1 text-ink font-semibold group-hover:translate-x-0.5 transition-transform text-xs">
                            <span>Open</span>
                            <ArrowRight size={13} className="text-fin" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

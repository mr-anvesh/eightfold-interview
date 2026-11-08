"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ResumeAnalysisResult } from "@/lib/types";

interface ResumeAnalysisPanelProps {
  onStartInterviewWithRole?: (role: string) => void;
}

export function ResumeAnalysisPanel({ onStartInterviewWithRole }: ResumeAnalysisPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("interviewai_latest_resume_analysis");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed.score === "number") {
            return parsed;
          }
        }
      } catch {
        // Ignore cache parse error
      }
    }
    return null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch previous resume analysis from database to keep in sync
  useEffect(() => {
    let isMounted = true;
    async function loadLatestAnalysis() {
      try {
        const res = await fetch("/api/resume/analyze");
        if (res.ok) {
          const data = await res.json();
          if (data.analysis && isMounted) {
            setAnalysis(data.analysis);
            try {
              localStorage.setItem(
                "interviewai_latest_resume_analysis",
                JSON.stringify(data.analysis),
              );
            } catch {
              // Ignore storage quotas
            }
          }
        }
      } catch {
        // Non-fatal if fetch fails
      }
    }
    loadLatestAnalysis();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file && !pastedText.trim()) {
      setError("Please select a resume file (PDF, TXT, LaTeX, Markdown) or paste your resume text.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (pastedText.trim()) {
        formData.append("text", pastedText.trim());
      }

      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      setAnalysis(data.analysis);
      setIsUploadingNew(false);
      setFile(null);
      setPastedText("");

      try {
        localStorage.setItem(
          "interviewai_latest_resume_analysis",
          JSON.stringify(data.analysis),
        );
      } catch {
        // Non-fatal storage quota
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during resume analysis.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 88) {
      return {
        label: "TIER-1 ONSITE READY",
        colorClass: "bg-[#0bdf50]/15 text-[#0b6b29] border-[#0bdf50]/40",
      };
    }
    if (score >= 75) {
      return {
        label: "COMPETITIVE CANDIDATE",
        colorClass: "bg-[#65b5ff]/15 text-[#004ba0] border-[#65b5ff]/40",
      };
    }
    if (score >= 60) {
      return {
        label: "NEEDS REFINEMENT",
        colorClass: "bg-[#fe4c02]/15 text-[#fe4c02] border-[#fe4c02]/40",
      };
    }
    return {
      label: "HIGH REVISION PRIORITY",
      colorClass: "bg-[#c41c1c]/15 text-[#c41c1c] border-[#c41c1c]/40",
    };
  };

  const showUploadBox = !analysis || isUploadingNew;

  return (
    <section className="fade-up space-y-6">
      {/* Top Header */}
      <div className="panel p-6 bg-paper">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label-mono text-xs text-fin font-semibold">Resume Intelligence</p>
            <h2 className="mt-1 text-3xl sm:text-4xl font-normal text-ink">
              Resume Analysis & Scoring
            </h2>
            <p className="text-serif mt-2 text-sm text-muted max-w-2xl leading-relaxed">
              Upload your resume to run a comprehensive Groq evaluation calibrated against top-tier tech hiring standards.
            </p>
          </div>

          {analysis && (
            <button
              onClick={() => {
                setIsUploadingNew(!isUploadingNew);
                setError(null);
              }}
              className="btn btn-outline px-4 py-2 text-xs font-semibold bg-white hover:border-ink flex items-center gap-1.5 transition-colors"
            >
              {isUploadingNew ? (
                <>
                  <RotateCcw size={13} className="text-fin" />
                  <span>Cancel & View Analysis</span>
                </>
              ) : (
                <>
                  <Upload size={13} className="text-fin" />
                  <span>Upload New Resume</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Upload Box (Shown when no analysis exists OR user toggles Upload New Resume) */}
      {showUploadBox && (
        <div className="panel p-6 sm:p-8 bg-paper space-y-6">
          {analysis && isUploadingNew && (
            <div className="flex items-center justify-between pb-3 border-b border-oat">
              <span className="label-mono text-xs text-fin font-semibold">UPLOAD NEW RESUME</span>
              <button
                type="button"
                onClick={() => {
                  setIsUploadingNew(false);
                  setFile(null);
                  setPastedText("");
                  setError(null);
                }}
                className="text-xs text-muted hover:text-ink font-mono"
              >
                &larr; Back to current analysis
              </button>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer rounded-lg border-2 border-dashed border-oat bg-[#faf9f6] p-8 text-center transition-all hover:border-ink hover:bg-white"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.txt,.tex,.md,.rtf,.docx,.json"
              className="hidden"
            />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[4px] border border-oat bg-white text-ink transition-transform group-hover:scale-105">
              <Upload size={24} className="text-fin" />
            </div>

            <h3 className="mt-4 text-base font-medium text-ink">
              {file ? file.name : "Click to upload or drag & drop your resume"}
            </h3>
            <p className="mt-1 text-xs text-muted">
              Supports PDF, LaTeX (.tex), Markdown (.md), and Plain Text (.txt) up to 10MB
            </p>

            {file && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-[4px] border border-oat bg-white px-3 py-1 text-xs text-ink">
                <FileText size={14} className="text-fin" />
                <span className="font-mono">{file.name}</span>
                <span className="text-muted">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {/* Toggle Text Paste Area */}
          <div>
            <button
              type="button"
              onClick={() => setShowPasteArea(!showPasteArea)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition-colors"
            >
              <span>{showPasteArea ? "Hide raw text input" : "Or paste resume text directly"}</span>
              {showPasteArea ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showPasteArea && (
              <div className="mt-3">
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your resume content, LaTeX source, or markdown here..."
                  className="w-full rounded-[4px] border border-oat bg-[#faf9f6] p-3 text-xs font-mono text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-[4px] border border-[#c41c1c]/30 bg-[#c41c1c]/10 p-3 text-xs text-[#c41c1c] flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Analyze Button */}
          <div className="flex items-center justify-between pt-2 border-t border-oat">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || (!file && !pastedText.trim())}
              className="btn btn-primary px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="pulse-dot" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {analysis ? "Analyze & Replace" : "Analyze Resume"}
                  <ArrowRight size={14} />
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Analysis Results View (Always shown until a new resume is uploaded and Groq returns a response) */}
      {analysis && !isUploadingNew && (
        <div className="space-y-6">
          {/* Main Score & Overview Card */}
          <div className="panel p-6 sm:p-8 bg-paper">
            <div className="grid gap-6 md:grid-cols-3 items-center">
              {/* Score Indicator */}
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-oat pb-6 md:pb-0 md:pr-6 text-center">
                <span className="label-mono text-[11px] text-muted">RESUME BENCHMARK SCORE</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-mono text-6xl font-bold tracking-tight text-ink">
                    {analysis.score}
                  </span>
                  <span className="font-mono text-lg text-muted">/100</span>
                </div>
                <div className="mt-3">
                  <span
                    className={`rounded-[4px] border px-2.5 py-1 text-[11px] font-mono font-bold tracking-wide ${
                      getScoreBadge(analysis.score).colorClass
                    }`}
                  >
                    {getScoreBadge(analysis.score).label}
                  </span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="label-mono text-[10px] text-muted">EXECUTIVE ASSESSMENT</span>
                  <p className="text-serif mt-2 text-base text-ink leading-relaxed">
                    {analysis.overallSummary}
                  </p>
                </div>

                {/* Target Role Matches */}
                {analysis.targetRoles && analysis.targetRoles.length > 0 && (
                  <div className="border-t border-oat/70 pt-3">
                    <span className="label-mono text-[10px] text-muted block mb-2">
                      OPTIMAL ROLE MATCHES
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.targetRoles.map((role) => (
                        <button
                          key={role}
                          onClick={() => onStartInterviewWithRole?.(role)}
                          className="inline-flex items-center gap-1.5 rounded-[4px] border border-oat bg-[#faf9f6] px-2.5 py-1 text-xs font-medium text-ink hover:border-ink hover:bg-white transition-all"
                        >
                          <Briefcase size={12} className="text-fin" />
                          <span>{role}</span>
                          <span className="text-[10px] text-muted font-mono">&rarr; Practice</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Scores Breakdown */}
          {analysis.sectionScores && analysis.sectionScores.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {analysis.sectionScores.map((sec) => (
                <div key={sec.name} className="panel p-5 bg-paper flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-ink">{sec.name}</span>
                      <span className="font-mono text-sm font-bold text-ink">{sec.score}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 w-full rounded-full bg-oat/50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-ink transition-all duration-500"
                        style={{ width: `${sec.score}%` }}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-muted leading-relaxed">
                    {sec.feedback}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Strengths & Improvements Editorial Columns */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Strengths */}
            <div className="panel p-6 bg-paper space-y-4">
              <div className="flex items-center gap-2 border-b border-oat pb-3">
                <CheckCircle2 size={16} className="text-[#0b6b29]" />
                <h3 className="card-title text-lg font-medium text-ink">
                  Identified Strengths
                </h3>
              </div>
              <ul className="space-y-3">
                {analysis.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#313130] leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0bdf50] shrink-0 mt-1.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Improvements */}
            <div className="panel p-6 bg-paper space-y-4">
              <div className="flex items-center gap-2 border-b border-oat pb-3">
                <Sparkles size={16} className="text-fin" />
                <h3 className="card-title text-lg font-medium text-ink">
                  Recommended Improvements
                </h3>
              </div>
              <ul className="space-y-3">
                {analysis.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#313130] leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-fin shrink-0 mt-1.5" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

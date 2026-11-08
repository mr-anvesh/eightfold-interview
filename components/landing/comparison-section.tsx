import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";

const comparisons = [
  {
    capability: "Real-time Voice Pressure",
    chatgpt: "Typing into a text prompt; unlimited time to edit and polish.",
    cannedQuestions: "Reading a static question list out loud to yourself.",
    interviewai: "Adaptive voice agent that responds in 180ms with conversational barge-in.",
  },
  {
    capability: "Dynamic Follow-up Probing",
    chatgpt: "Only answers what you ask it; cannot probe unmentioned flaws.",
    cannedQuestions: "Zero follow-ups; moves immediately to unrelated question 2.",
    interviewai: "Picks up on vague architectural assertions and presses for trade-offs.",
  },
  {
    capability: "Verbatim STAR Scoring",
    chatgpt: "Generic praise: 'That is a solid answer! Looks great!'",
    cannedQuestions: "No feedback or objective grading mechanism.",
    interviewai: "Granular classification: Strong / Adequate / Weak with rubric notes.",
  },
  {
    capability: "Target Role Calibration",
    chatgpt: "Generic knowledge; misses specific company leveling bars.",
    cannedQuestions: "Static generic role categories.",
    interviewai: "Calibrated to 30+ engineering, product, data & design hiring bars.",
  },
  {
    capability: "Speech Cadence & Filler Telemetry",
    chatgpt: "Impossible to evaluate spoken fluency or filler words.",
    cannedQuestions: "Self-assessed guesswork.",
    interviewai: "Measures words per minute, hesitation pauses, and brevity.",
  },
];

export function ComparisonSection() {
  return (
    <section className="py-20 sm:py-28 border-t border-oat scroll-mt-16 bg-[#faf9f6]/20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="label-mono text-fin font-semibold">The Preparation Gap</p>
          <h2 className="section-title mt-3 text-ink">
            Why typing into chatbots fails you.
          </h2>
          <p className="text-serif mt-5 text-lg text-muted leading-relaxed">
            In a real interview, you cannot hit backspace or take two minutes to revise your thesis. InterviewAI builds actual spoken muscle memory under realistic conversational conditions.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-14 panel overflow-hidden border border-oat bg-paper shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-oat bg-[#faf9f6]">
                  <th className="p-4 sm:p-5 text-xs font-semibold text-ink w-1/4">
                    Evaluation Dimension
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-medium text-muted w-1/4 border-l border-oat">
                    Chatbot / Text AI
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-medium text-muted w-1/4 border-l border-oat hidden sm:table-cell">
                    Static Question Lists
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-bold text-ink w-1/4 border-l border-oat bg-white">
                    <div className="flex items-center gap-1.5 text-ink">
                      <span className="h-2 w-2 rounded-full bg-fin" />
                      <span>InterviewAI Voice</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oat text-xs">
                {comparisons.map((row, idx) => (
                  <tr key={row.capability} className={idx % 2 === 0 ? "bg-white" : "bg-[#faf9f6]/40"}>
                    <td className="p-4 sm:p-5 font-semibold text-ink">
                      {row.capability}
                    </td>
                    <td className="p-4 sm:p-5 text-muted border-l border-oat">
                      <div className="flex items-start gap-2">
                        <X size={14} className="text-[#c41c1c] shrink-0 mt-0.5" />
                        <span>{row.chatgpt}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-muted border-l border-oat hidden sm:table-cell">
                      <div className="flex items-start gap-2">
                        <X size={14} className="text-[#c41c1c] shrink-0 mt-0.5" />
                        <span>{row.cannedQuestions}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 font-medium text-ink border-l border-oat bg-white">
                      <div className="flex items-start gap-2">
                        <Check size={14} className="text-[#0b6b29] shrink-0 mt-0.5" />
                        <span>{row.interviewai}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between border-t border-oat bg-[#faf9f6] p-5 sm:px-6">
            <span className="text-xs text-muted">
              Stop practicing silently in your thoughts. Say it out loud to an adaptive agent.
            </span>
            <Link
              href="/auth"
              className="btn btn-primary px-4 py-2 text-xs font-semibold"
            >
              Start voice mock session
              <ArrowRight size={13} className="ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

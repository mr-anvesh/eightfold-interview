import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    tag: "Runtime Context Injection",
    title: "Calibrate target role & company bar",
    description:
      "Select a role from our curated library or paste your own job description. The system injects candidate focus, seniority rubric (Junior, Mid, Senior), and target company expectations into Neha's live system prompt.",
    details: [
      "Custom company name & focus area",
      "Dynamic candidate name personalization",
      "Calibrated difficulty thresholds",
    ],
  },
  {
    number: "02",
    tag: "Adaptive Voice Engine",
    title: "180ms conversational turn-taking",
    description:
      "Neha engages in natural spoken dialogue. Neha listens carefully, handles mid-sentence pauses, and interrupts with sharp technical follow-ups when your answers lack architectural depth.",
    details: [
      "Sub-200ms endpoint detection",
      "Natural conversational barge-in",
      "High-fidelity voice synthesis",
    ],
  },
  {
    number: "03",
    tag: "Automated Rubric Extraction",
    title: "Structured Q&A scoring & STAR audit",
    description:
      "The instant your call concludes, the raw audio transcript is processed into structured Q&A pairs. Every answer is classified as Strong, Adequate, or Weak with specific strengths and gap analysis.",
    details: [
      "Verbatim question/answer isolation",
      "STAR methodology scoring",
      "Actionable coaching suggestions",
    ],
  },
  {
    number: "04",
    tag: "Encrypted Session Vault",
    title: "Track your progression over time",
    description:
      "Interviews, transcripts, and structured scorecards are permanently saved to your private encrypted dashboard. Track score improvements across multiple mock loops before your real interview.",
    details: [
      "Full transcript archives",
      "Historical score trendlines",
      "Zero training on private voice data",
    ],
  },
];

export function PipelineArchitecture() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-t border-oat scroll-mt-16 bg-[#faf9f6]/30">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="label-mono text-fin font-semibold">Dual-Engine Architecture</p>
          <h2 className="section-title mt-3 text-ink">
            Three steps to interview-ready.
          </h2>
          <p className="text-serif mt-5 text-lg text-muted leading-relaxed">
            InterviewAI couples ultra-low latency conversational agents with high-precision rubric evaluation to deliver authentic interview rehearsal.
          </p>
        </div>

        {/* 4-Step Architecture Flow */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="panel flex flex-col justify-between p-6 bg-paper transition-all hover:border-ink/40"
            >
              <div>
                <div className="flex items-center justify-between border-b border-oat pb-3">
                  <span className="font-mono text-3xl font-bold text-oat">
                    {step.number}
                  </span>
                  <span className="label-mono text-[9px] text-muted">
                    {step.tag}
                  </span>
                </div>

                <h3 className="card-title mt-5 text-xl font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-xs text-muted leading-relaxed">
                  {step.description}
                </p>

                <div className="mt-6 space-y-2 border-t border-oat/70 pt-4">
                  {step.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-2 text-[11px] text-[#313130]">
                      <CheckCircle2 size={12} className="text-fin shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 text-[10px] font-mono text-muted">
                STAGE {step.number} &bull; PIPELINE ACTIVE
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

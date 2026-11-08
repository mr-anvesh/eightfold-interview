import {
  Mic,
  BarChart3,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const capabilities = [
  {
    icon: Mic,
    tag: "Voice Engine",
    title: "Real-time speech with natural barge-in",
    description:
      "Speak conversationally. If you pause to formulate a thought or pivot mid-sentence, Neha maintains conversational rhythm without awkward silences or robotic latency.",
    metric: "180ms roundtrip",
    metricLabel: "Speech turnaround",
  },
  {
    icon: Cpu,
    tag: "Adaptive Reasoning",
    title: "Follow-up questions based on your exact words",
    description:
      "No pre-scripted static question trees. Neha dynamically probes the technical choices, architecture decisions, and metrics you mention in your previous response.",
    metric: "100% dynamic",
    metricLabel: "Zero canned scripts",
  },
  {
    icon: BarChart3,
    tag: "Scoring Engine",
    title: "Structured Q&A evaluation rubric",
    description:
      "Every answer is parsed into structured Q&A pairs evaluated against Tier-1 hiring bars. Get immediate classification into Strong, Adequate, or Weak with concrete coaching tips.",
    metric: "1.4s analysis",
    metricLabel: "Post-call generation",
  },
  {
    icon: Layers,
    tag: "Role Specialization",
    title: "Calibrated to 30+ engineering & product bars",
    description:
      "Practice against authentic interview rubrics: System Design, Frontend Architecture, Data Modeling, Product Execution, Behavioral / Leadership, and Growth Strategy.",
    metric: "30+ templates",
    metricLabel: "Or bring custom JD",
  },
  {
    icon: Terminal,
    tag: "Verbatim Audit",
    title: "Full audio transcripts & STAR breakdowns",
    description:
      "Review the exact transcript of your answers. Identify where you rambled, where you failed to quantify metric lift, and where your technical explanations were strongest.",
    metric: "STAR method",
    metricLabel: "Strict evaluation",
  },
  {
    icon: ShieldCheck,
    tag: "Zero Risk Sandbox",
    title: "Stress test high-stakes loops in private",
    description:
      "Practice before your actual onsite. Overcome interview anxiety, build muscular conversational fluency, and eliminate verbal crutches before speaking to a hiring manager.",
    metric: "100% private",
    metricLabel: "Encrypted sessions",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 border-t border-oat scroll-mt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="label-mono text-fin font-semibold">Core Capabilities</p>
          <h2 className="section-title mt-3 text-ink">
            Engineered for realistic interview stress.
          </h2>
          <p className="text-serif mt-5 text-lg text-muted leading-relaxed">
            Standard AI chatbots let you type comfortable, rehearsed answers. InterviewAI replicates the intense real-time conversational pressure of a high-bar technical interview.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="panel group relative flex flex-col justify-between overflow-hidden p-6 transition-all hover:border-ink/40 bg-paper"
              >
                <div>
                  {/* Top Bar: Icon + Mono Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-oat bg-[#faf9f6] text-ink group-hover:bg-ink group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="label-mono text-[10px] text-muted">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="feature-title mt-6 font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Metric Strip */}
                <div className="mt-8 border-t border-oat pt-4 flex items-baseline justify-between">
                  <span className="font-mono text-xs font-bold text-ink">
                    {item.metric}
                  </span>
                  <span className="text-[11px] text-muted">
                    {item.metricLabel}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Integration Banner strip */}
        <div className="mt-12 rounded-[8px] border border-oat bg-[#faf9f6] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="label-mono text-[10px] text-muted">Architectural Standard</span>
            <h4 className="text-xl font-medium text-ink">
              Engineered for realistic conversational stress
            </h4>
            <p className="text-xs text-muted">
              Zero simulated delays. Instant conversational turn-taking with candidate role context.
            </p>
          </div>
          <Link
            href="/auth"
            className="btn btn-primary px-5 py-2.5 text-xs font-semibold"
          >
            Experience the voice engine
            <ArrowRight size={14} className="ml-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

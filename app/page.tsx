import Link from "next/link";
import { Mic, Sparkles, BarChart3, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Adaptive voice interviews",
    body: "Speak naturally. The AI follows up in real time based on what you say, just like a real interviewer would.",
  },
  {
    icon: Sparkles,
    title: "Role-specific context",
    body: "Pick from a library of real job templates or define your own role, skills, and interview focus.",
  },
  {
    icon: BarChart3,
    title: "Scored Q&A breakdown",
    body: "Every answer is scored and summarised. Spot your weak spots before the actual interview.",
  },
];

const steps = [
  { step: "01", label: "Choose a role", detail: "Pick from the marketplace or enter a custom role and company." },
  { step: "02", label: "Start the call", detail: "A voice AI conducts the interview with dynamic follow-up questions." },
  { step: "03", label: "Review your score", detail: "Get a structured Q&A summary with strengths, gaps, and tips." },
];

export default function Home() {
  return (
    <div className="grain flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-20 pt-8 sm:px-8 md:px-12">

        {/* Nav */}
        <header className="fade-up flex items-center justify-between border-b border-oat pb-5">
          <p className="label-mono text-xs text-fin">InterviewAI</p>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm text-muted hover:text-ink transition-colors">
              Sign in
            </Link>
            <Link
              href="/auth"
              className="btn btn-primary border border-ink px-4 py-2 text-sm font-semibold"
            >
              Get started
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="fade-up py-20 text-center">
          <p className="label-mono mx-auto mb-6 inline-block rounded-full border border-oat bg-paper px-4 py-1.5 text-[11px] text-fin">
            Voice-first interview prep
          </p>
          <h1 className="mx-auto max-w-4xl text-6xl sm:text-8xl">
            Interviews that sharpen you.
          </h1>
          <p className="text-serif mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-[#2b2a28]">
            InterviewAI runs adaptive voice mock interviews with role-specific context,
            then gives you a scored Q&A breakdown so you can improve before the real thing.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth"
              className="btn btn-primary flex items-center gap-2 border border-ink px-6 py-3 text-sm font-semibold"
            >
              Start practicing free <ArrowRight size={15} />
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-outline px-6 py-3 text-sm font-semibold"
            >
              View dashboard
            </Link>
          </div>
        </section>

        {/* Social proof strip */}
        <div className="fade-up mb-16 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
          {["No credit card required", "Works on any role or level", "Results in minutes"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle size={13} className="text-fin" /> {item}
            </span>
          ))}
        </div>

        {/* Features */}
        <section className="fade-up mb-20">
          <div className="mb-10 text-center">
            <p className="label-mono text-xs text-muted">What you get</p>
            <h2 className="mt-2 text-4xl sm:text-5xl">Everything you need to prepare</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <article key={title} className="panel relative overflow-hidden p-6">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-fin/10 blur-2xl" />
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-oat bg-paper">
                  <Icon size={18} className="text-fin" />
                </div>
                <h3 className="text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="fade-up mb-20">
          <div className="mb-10 text-center">
            <p className="label-mono text-xs text-muted">How it works</p>
            <h2 className="mt-2 text-4xl sm:text-5xl">Three steps to interview-ready</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map(({ step, label, detail }) => (
              <div key={step} className="panel flex flex-col gap-3 p-6">
                <span className="label-mono text-3xl font-bold text-oat">{step}</span>
                <h3 className="text-2xl">{label}</h3>
                <p className="text-sm leading-relaxed text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="fade-up panel relative overflow-hidden p-10 text-center">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-fin/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-[#65b5ff]/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-4xl sm:text-6xl">Ready to start?</h2>
            <p className="text-serif mx-auto mt-4 max-w-md text-lg text-muted">
              Create a free account and run your first mock interview in under two minutes.
            </p>
            <Link
              href="/auth"
              className="btn btn-primary mt-8 inline-flex items-center gap-2 border border-ink px-8 py-3 text-sm font-semibold"
            >
              Create free account <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-oat pt-5 text-sm text-muted">
          <p>Built with Next.js, Supabase, VAPI, and Groq.</p>
          <div className="flex gap-4">
            <Link href="/auth" className="underline underline-offset-4">
              Sign in
            </Link>
            <Link href="/dashboard" className="underline underline-offset-4">
              Dashboard
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="grain flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-14 pt-8 sm:px-8 md:px-12">
        <header className="fade-up flex items-center justify-between border-b border-oat pb-5">
          <p className="label-mono text-xs text-muted">InterviewAI</p>
          <Link
            href="/auth"
            className="btn btn-primary border border-ink px-4 py-2 text-sm font-semibold"
          >
            Start Practicing
          </Link>
        </header>

        <section className="fade-up grid flex-1 items-center gap-12 py-14 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-7">
            <p className="label-mono text-xs text-fin">Voice-first prep platform</p>
            <h1 className="max-w-3xl text-5xl sm:text-7xl">
              Practice interviews that feel like real hiring conversations.
            </h1>
            <p className="text-serif max-w-xl text-lg leading-relaxed text-[#2b2a28]">
              InterviewAI simulates adaptive voice interviews with role-specific context,
              then scores your responses and stores a structured Q&A history you can review
              before your next application.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth"
                className="btn btn-primary border border-ink px-5 py-3 text-sm font-semibold"
              >
                Start Practicing
              </Link>
              <Link
                href="/dashboard"
                className="btn btn-outline px-5 py-3 text-sm font-semibold"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="panel relative overflow-hidden p-6 sm:p-8">
            <div className="absolute -right-12 -top-10 h-36 w-36 rounded-full bg-fin/20 blur-2xl" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#65b5ff]/30 blur-2xl" />
            <div className="relative space-y-4">
              <p className="label-mono text-xs text-muted">Feature Snapshot</p>
              <ul className="space-y-3 text-sm">
                <li className="panel bg-cream px-4 py-3">AI voice interview with dynamic follow-ups</li>
                <li className="panel bg-cream px-4 py-3">Live interview marketplace by role and level</li>
                <li className="panel bg-cream px-4 py-3">Detailed history with scored Q&A summaries</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-oat pt-5 text-sm text-muted">
          <p>Built with Next.js, Supabase, VAPI, and Groq.</p>
          <div className="flex gap-4">
            <Link href="/auth" className="underline underline-offset-4">
              Sign In
            </Link>
            <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="underline underline-offset-4">
              Docs
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

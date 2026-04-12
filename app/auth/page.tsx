import Link from "next/link";
import { AuthPanel } from "@/components/auth/auth-panel";

export default function AuthPage() {
  return (
    <main className="grain flex min-h-screen items-center justify-center px-5 py-10">
      <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[1fr_1fr]">
        <section className="panel hidden p-8 md:flex md:flex-col md:justify-between">
          <div>
            <p className="label-mono text-xs text-fin">InterviewAI</p>
            <h1 className="mt-4 text-5xl">Train for the role you actually want.</h1>
            <p className="text-serif mt-4 text-lg text-[#2f2e2c]">
              Sign in to launch an adaptive voice interview, then review a structured
              analysis of each answer.
            </p>
          </div>
          <div className="space-y-3 text-sm text-muted">
            <p>Role-based mock interviews</p>
            <p>AI-generated dynamic follow-ups</p>
            <p>Q&A summary and performance tracking</p>
          </div>
        </section>

        <section className="panel p-6 sm:p-8">
          <AuthPanel />
          <p className="mt-6 text-center text-sm text-muted">
            Prefer browsing first?{" "}
            <Link href="/" className="underline underline-offset-4">
              Back to landing page
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

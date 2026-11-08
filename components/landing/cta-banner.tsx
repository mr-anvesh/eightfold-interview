import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-20 sm:py-28 border-t border-oat bg-[#faf9f6]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="panel relative overflow-hidden border border-oat bg-paper p-8 sm:p-12 lg:p-16 text-center shadow-xs">
          {/* Subtle warm corner glow */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-fin/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#65b5ff]/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="label-mono inline-flex items-center gap-2 rounded-full border border-oat bg-[#faf9f6] px-3.5 py-1 text-[11px] text-[#313130] mb-6">
              <span className="h-2 w-2 rounded-full bg-fin" />
              <span>Zero Risk · Instant Audio Setup</span>
            </div>

            <h2 className="section-title text-ink font-normal">
              Stop practicing in your head. Say it out loud.
            </h2>

            <p className="text-serif mx-auto mt-5 max-w-xl text-lg text-muted leading-relaxed">
              Run your first adaptive voice interview with Neha in under two minutes. Receive your structured evaluation and STAR scorecard the moment you hang up.
            </p>

            {/* Actions */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/auth"
                className="btn btn-primary px-7 py-3.5 text-sm font-semibold shadow-xs"
              >
                <span>Create free account</span>
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                href="#roles"
                className="btn btn-outline px-6 py-3.5 text-sm font-semibold bg-white"
              >
                Browse role library
              </Link>
            </div>

            {/* Checklist */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-fin" /> Free practice session included
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-fin" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-fin" /> Encrypted & private transcripts
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

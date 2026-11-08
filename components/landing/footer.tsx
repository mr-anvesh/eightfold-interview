import Link from "next/link";
import { Mic } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#262624] bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-16 pb-12">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-[#262624]">
          {/* Column 1: Brand & Operational Status */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-fin text-white">
                <Mic size={15} />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Interview<span className="text-fin">AI</span>
              </span>
            </Link>

            <p className="text-serif text-sm text-white max-w-sm leading-relaxed">
              Adaptive voice mock interviews for engineers, product managers, and leaders. Rehearse out loud with Neha and receive structured STAR scorecards before speaking with hiring teams.
            </p>

            {/* Operational Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00da00]/30 bg-[#00da00]/10 px-3 py-1.5 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00da00] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00da00]"></span>
              </span>
              <span className="label-mono text-[10px] text-[#00da00] tracking-wider font-medium">
                All voice systems operational <span className="text-white/80 font-normal">(182ms)</span>
              </span>
            </div>

            <div className="pt-2 text-xs text-white">
              Designed for high-performance interview preparation.
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <p className="label-mono text-xs font-semibold text-fin">Platform</p>
            <ul className="space-y-2.5 text-sm text-white">
              <li>
                <Link href="#simulator" className="hover:text-fin transition-colors flex items-center gap-1.5">
                  <span>Voice Simulator</span>
                  <span className="label-mono text-[9px] text-fin bg-fin/15 border border-fin/30 px-1.5 py-0.2 rounded-[3px]">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-fin transition-colors">
                  Core Capabilities
                </Link>
              </li>
              <li>
                <Link href="#roles" className="hover:text-fin transition-colors">
                  Role Marketplace
                </Link>
              </li>
              <li>
                <Link href="#rubric" className="hover:text-fin transition-colors">
                  Scoring Rubric
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-fin transition-colors">
                  Dual-Engine Architecture
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-fin transition-colors">
                  Sign In & Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Roles & Frameworks */}
          <div className="space-y-3">
            <p className="label-mono text-xs font-semibold text-fin">Role Library</p>
            <ul className="space-y-2.5 text-sm text-white">
              <li>
                <Link href="#roles" className="hover:text-fin transition-colors">
                  Distributed Systems
                </Link>
              </li>
              <li>
                <Link href="#roles" className="hover:text-fin transition-colors">
                  Frontend Architecture
                </Link>
              </li>
              <li>
                <Link href="#roles" className="hover:text-fin transition-colors">
                  Product Management
                </Link>
              </li>
              <li>
                <Link href="#roles" className="hover:text-fin transition-colors">
                  Data Science & ML
                </Link>
              </li>
              <li>
                <Link href="#roles" className="hover:text-fin transition-colors">
                  Design Systems (UX)
                </Link>
              </li>
              <li>
                <Link href="#roles" className="hover:text-fin transition-colors">
                  Growth Marketing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom fine print & copyright */}
        <div className="mt-8 text-center text-xs text-white">
          <p>
            © {new Date().getFullYear()} Anvesh Mishra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

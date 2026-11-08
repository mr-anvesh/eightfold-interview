"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-oat bg-[#faf9f6]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-ink transition-opacity hover:opacity-90"
        >
          <span className="font-display text-xl tracking-tight text-ink">
            Interview<span className="text-fin">AI</span>
          </span>
        </Link>

        {/* Clean, Minimalist Desktop Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#simulator"
            className="text-base text-[#626260] transition-colors hover:text-ink"
          >
            Preview
          </Link>
          <Link
            href="#features"
            className="text-base text-[#626260] transition-colors hover:text-ink"
          >
            Capabilities
          </Link>
          <Link
            href="#roles"
            className="text-base text-[#626260] transition-colors hover:text-ink"
          >
            Marketplace
          </Link>
          <Link
            href="#rubric"
            className="text-base text-[#626260] transition-colors hover:text-ink"
          >
            Evaluation
          </Link>
          <Link
            href="#how-it-works"
            className="text-base text-[#626260] transition-colors hover:text-ink"
          >
            How it works
          </Link>
          <Link
            href="#faq"
            className="text-base text-[#626260] transition-colors hover:text-ink"
          >
            FAQ
          </Link>
        </nav>

        {/* Right Actions: Minimal Sign in + Sharp 4px Button */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/auth"
            className="text-base text-[#626260] transition-colors hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/auth"
            className="btn btn-primary px-4 py-2 text-sm font-normal"
          >
            Start practicing
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-oat bg-paper text-ink transition-colors hover:bg-cream md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-oat bg-paper px-6 py-6 shadow-sm md:hidden animate-fade-up">
          <div className="flex flex-col gap-4 text-base">
            <Link
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#626260] hover:text-ink"
            >
              Preview
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#626260] hover:text-ink"
            >
              Capabilities
            </Link>
            <Link
              href="#roles"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#626260] hover:text-ink"
            >
              Marketplace
            </Link>
            <Link
              href="#rubric"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#626260] hover:text-ink"
            >
              Evaluation
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#626260] hover:text-ink"
            >
              How it works
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#626260] hover:text-ink"
            >
              FAQ
            </Link>

            <div className="mt-4 flex flex-col gap-2.5 pt-4 border-t border-oat">
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline w-full py-2.5 text-sm font-normal justify-center"
              >
                Sign in
              </Link>
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary w-full py-2.5 text-sm font-normal justify-center"
              >
                Start practicing
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

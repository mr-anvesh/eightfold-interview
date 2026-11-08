"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does Neha generate follow-up questions without a pre-written script?",
    answer:
      "Neha is an autonomous voice agent built for dynamic conversation. Rather than reading from a rigid list of LeetCode or Glassdoor questions, Neha listens to your actual words, identifies ambiguous statements or unstated assumptions, and asks contextual follow-ups in real time—just like an experienced hiring manager.",
  },
  {
    question: "Is my voice recording stored or used to train public AI models?",
    answer:
      "Never. Your voice streams are transmitted over secure, encrypted audio channels and processed solely for real-time transcription. We do not sell your audio, share it with recruiters, or use your interview sessions to train public AI models. All interview summaries remain strictly private to your authenticated account.",
  },
  {
    question: "Can I bring my own target job description or company name?",
    answer:
      "Yes. In addition to our pre-configured marketplace of 30+ role templates (Software Engineering, System Architecture, Product Management, Data Analytics, Design, and Marketing), you can input any custom company name, job description, or interview focus. The engine calibrates its question bank to match.",
  },
  {
    question: "How does the evaluation engine score my answers?",
    answer:
      "Immediately after you hang up, the full transcript is analyzed by our automated evaluation engine. It parses the dialogue into discrete Question-Answer pairs, scores each answer as Strong, Adequate, or Weak based on the STAR framework, and highlights concrete architectural gaps and communication improvements.",
  },
  {
    question: "What equipment do I need to conduct a voice mock interview?",
    answer:
      "All you need is a working microphone on your laptop, desktop, or mobile device and a modern web browser. There is no software to install and no external plugins required. Just grant microphone permissions in your browser and you're ready to speak.",
  },
  {
    question: "Can I track my score improvements across multiple practice sessions?",
    answer:
      "Yes. Every interview session is saved to your private dashboard History tab. You can review past transcripts, compare question-level scores, and monitor your progress over time before your real on-site interview.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 border-t border-oat scroll-mt-16 bg-[#faf9f6]/20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header - Centered */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-mono text-fin font-semibold">Frequently Asked Questions</p>
          <h2 className="section-title mt-3 text-ink">
            Everything you need to know.
          </h2>
          <p className="text-serif mx-auto mt-5 max-w-2xl text-lg text-muted leading-relaxed">
            Clear answers about voice privacy, role customization, real-time follow-ups, and the rubric scoring pipeline.
          </p>
        </div>

        {/* FAQ Accordion - Centered */}
        <div className="mt-14 mx-auto max-w-4xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="panel overflow-hidden border border-oat bg-paper transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-cream/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium text-ink pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-oat bg-white text-ink transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown size={15} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-oat/70 bg-[#faf9f6]/60 p-5 sm:p-6 pt-4">
                    <p className="text-sm text-muted leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

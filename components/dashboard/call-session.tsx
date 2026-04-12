"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mic, PhoneOff } from "lucide-react";
import Vapi from "@vapi-ai/web";

type CallSessionProps = {
  candidateName: string;
  context: {
    role: string;
    company: string;
    skills: string;
    focus: string;
    description: string;
  };
};

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remain = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remain}`;
}

export function CallSession({ candidateName, context }: CallSessionProps) {
  const router = useRouter();
  const vapi = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!key) {
      return null;
    }

    try {
      return new Vapi(key);
    } catch {
      return null;
    }
  }, []);

  const [status, setStatus] = useState("Initializing call...");
  const [pending, setPending] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [manualTranscript, setManualTranscript] = useState("");

  useEffect(() => {
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

    async function startCall() {
      if (!vapi || !assistantId) {
        setStatus("VAPI not configured. Paste transcript manually and end call.");
        setStartedAt(Date.now());
        return;
      }

      try {
        setStartedAt(Date.now());
        setStatus("Connecting to AI interviewer...");

        vapi.on("message", (message: unknown) => {
          const transcriptChunk =
            typeof message === "object" &&
            message !== null &&
            "transcript" in message &&
            typeof (message as { transcript: unknown }).transcript === "string"
              ? (message as { transcript: string }).transcript
              : "";

          if (transcriptChunk) {
            setLiveTranscript((current) => `${current}\n${transcriptChunk}`.trim());
          }
        });

        vapi.on("error", () => {
          setStatus("Connection issue detected. You can still end and save manually.");
        });

        vapi.on("call-end", () => {
          setStatus("Call ended. Saving transcript...");
        });

        await vapi.start(assistantId, {
          variableValues: {
            company_name: context.company,
            role: context.role,
            candidate_name: candidateName,
            job_description: context.description,
            interview_focus: context.focus,
            skills: context.skills,
          },
        });

        setStatus("Interview live");
      } catch {
        setStatus("Unable to start VAPI call. Paste transcript manually and end call.");
      }
    }

    void startCall();

    return () => {
      if (vapi) {
        void vapi.stop();
      }
    };
  }, [candidateName, context.company, context.description, context.focus, context.role, context.skills, vapi]);

  useEffect(() => {
    if (!startedAt) {
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds(Math.round((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  const completeCall = async () => {
    setPending(true);
    try {
      if (vapi) {
        await vapi.stop();
      }

      const transcript = (liveTranscript || manualTranscript).trim();

      const response = await fetch("/api/interviews/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: null,
          role: context.role,
          companyName: context.company,
          interviewFocus: context.focus,
          skills: context.skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          rawTranscript:
            transcript ||
            `Interviewer: Tell me about your preparation for ${context.role}. Candidate: I practiced ${context.skills} and prepared real examples from previous projects.`,
          durationSeconds: elapsedSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save interview.");
      }

      const data = (await response.json()) as { interviewId?: string };
      router.push(`/dashboard?tab=history${data.interviewId ? `&interview=${data.interviewId}` : ""}`);
      router.refresh();
    } catch {
      setStatus("Could not save this interview. Please retry ending the call.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="grain flex min-h-screen items-center justify-center px-5 py-8">
      <section className="panel w-full max-w-4xl space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard?tab=start" className="btn btn-outline flex items-center gap-2 px-3 py-2 text-xs font-semibold">
            <ArrowLeft size={14} /> Back
          </Link>
          <span className="rounded-sm border border-oat bg-paper px-3 py-1 text-xs">{status}</span>
        </div>

        <div>
          <p className="label-mono text-xs text-muted">Live Interview</p>
          <h1 className="mt-1 text-4xl">{context.role}</h1>
          <p className="mt-2 text-sm text-muted">
            {context.company} · Skills: {context.skills}
          </p>
        </div>

        <div className="panel bg-cream p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Mic size={16} /> In Call
            </div>
            <p className="label-mono text-xs">{formatTime(elapsedSeconds)}</p>
          </div>
          <div className="mt-4 h-16 rounded-md bg-[linear-gradient(90deg,#ff56001f,#11111110,#ff56001f)]" />
        </div>

        <label className="block text-sm">
          Transcript fallback
          <textarea
            value={manualTranscript}
            onChange={(event) => setManualTranscript(event.target.value)}
            rows={7}
            placeholder="Paste transcript here if needed"
            className="mt-1 w-full rounded-md border border-oat bg-paper px-3 py-2 outline-none focus:border-ink"
          />
        </label>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={completeCall}
            disabled={pending}
            className="btn btn-fin flex items-center gap-2 border border-fin px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            <PhoneOff size={16} /> {pending ? "Saving..." : "End Call"}
          </button>
        </div>
      </section>
    </main>
  );
}

import { z } from "zod";
import { summarizeTranscript } from "@/lib/groq";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  jobId: z.string().uuid(),
  rawTranscript: z.string().min(1),
  durationSeconds: z.number().int().nonnegative().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);
    if (!parsed.success) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, title, company_name")
      .eq("id", parsed.data.jobId)
      .single();

    if (jobError || !job) {
      return Response.json({ error: "Selected job does not exist" }, { status: 404 });
    }

    const { data: interview, error: interviewError } = await supabase
      .from("interviews")
      .insert({
        user_id: user.id,
        job_id: job.id,
        role: job.title,
        company_name: job.company_name,
        raw_transcript: parsed.data.rawTranscript,
        duration_seconds: parsed.data.durationSeconds ?? null,
        status: "completed",
      })
      .select("id")
      .single();

    if (interviewError || !interview) {
      return Response.json({ error: "Failed to persist interview" }, { status: 500 });
    }

    const summary = await summarizeTranscript(parsed.data.rawTranscript);

    const { error: summaryError } = await supabase.from("interview_summaries").insert({
      interview_id: interview.id,
      qa_pairs: summary.qaPairs,
      overall_summary: summary.overallSummary,
    });

    if (summaryError) {
      return Response.json({ error: "Saved interview but failed to store summary" }, { status: 500 });
    }

    return Response.json({
      interviewId: interview.id,
      summary,
    });
  } catch {
    return Response.json({ error: "Failed to complete interview" }, { status: 500 });
  }
}

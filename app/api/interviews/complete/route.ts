import { z } from "zod";
import { summarizeTranscript } from "@/lib/groq";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  jobId: z.string().uuid().nullable().optional(),
  role: z.string().min(2),
  companyName: z.string().optional(),
  interviewFocus: z.string().optional(),
  skills: z.array(z.string()).optional(),
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

    let job: { id: string; title: string; company_name: string | null } | null = null;

    if (parsed.data.jobId) {
      const { data: selectedJob, error: jobError } = await supabase
        .from("jobs")
        .select("id, title, company_name")
        .eq("id", parsed.data.jobId)
        .single();

      if (jobError || !selectedJob) {
        return Response.json({ error: "Selected job does not exist" }, { status: 404 });
      }

      job = selectedJob;
    }

    const role = parsed.data.role.trim();
    const companyName = parsed.data.companyName?.trim() || job?.company_name || "Generic";
    const skillsText = parsed.data.skills?.length
      ? `\n\nInterview skills: ${parsed.data.skills.join(", ")}.`
      : "";
    const transcriptWithSkills = `${parsed.data.rawTranscript}${skillsText}`;

    const { data: interview, error: interviewError } = await supabase
      .from("interviews")
      .insert({
        user_id: user.id,
        job_id: job?.id ?? null,
        role,
        company_name: companyName,
        raw_transcript: transcriptWithSkills,
        duration_seconds: parsed.data.durationSeconds ?? null,
        status: "completed",
      })
      .select("id")
      .single();

    if (interviewError || !interview) {
      return Response.json({ error: "Failed to persist interview" }, { status: 500 });
    }

    const summary = await summarizeTranscript(transcriptWithSkills);

    const { error: summaryError } = await supabase.from("interview_summaries").insert({
      interview_id: interview.id,
      qa_pairs: summary.qaPairs,
      strengths: summary.strengths,
      improvements: summary.improvements,
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

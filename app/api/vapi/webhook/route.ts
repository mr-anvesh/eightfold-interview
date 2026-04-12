import { z } from "zod";
import { summarizeTranscript } from "@/lib/groq";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const webhookSchema = z.object({
  interview_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  job_id: z.string().uuid().nullable().optional(),
  role: z.string().optional(),
  company_name: z.string().nullable().optional(),
  transcript: z.string().min(1),
  duration_seconds: z.number().int().nonnegative().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const secret = process.env.VAPI_WEBHOOK_SECRET;
    if (secret) {
      const incoming = request.headers.get("x-webhook-secret");
      if (incoming !== secret) {
        return Response.json({ error: "Invalid webhook secret" }, { status: 401 });
      }
    }

    const payload = await request.json();
    const parsed = webhookSchema.safeParse(payload);

    if (!parsed.success) {
      return Response.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const transcript = parsed.data.transcript;
    const summary = await summarizeTranscript(transcript);

    let interviewId = parsed.data.interview_id;

    if (interviewId) {
      const { error: updateError } = await admin
        .from("interviews")
        .update({
          raw_transcript: transcript,
          duration_seconds: parsed.data.duration_seconds ?? null,
          status: "completed",
        })
        .eq("id", interviewId);

      if (updateError) {
        return Response.json({ error: "Unable to update interview" }, { status: 500 });
      }
    } else {
      if (!parsed.data.user_id || !parsed.data.role) {
        return Response.json(
          { error: "Missing user_id and role when interview_id is not provided" },
          { status: 400 },
        );
      }

      const { data: inserted, error: insertError } = await admin
        .from("interviews")
        .insert({
          user_id: parsed.data.user_id,
          job_id: parsed.data.job_id ?? null,
          role: parsed.data.role,
          company_name: parsed.data.company_name ?? "Generic",
          raw_transcript: transcript,
          duration_seconds: parsed.data.duration_seconds ?? null,
          status: "completed",
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        return Response.json({ error: "Unable to create interview" }, { status: 500 });
      }

      interviewId = inserted.id;
    }

    const { error: upsertError } = await admin.from("interview_summaries").upsert(
      {
        interview_id: interviewId,
        qa_pairs: summary.qaPairs,
        overall_summary: summary.overallSummary,
      },
      { onConflict: "interview_id" },
    );

    if (upsertError) {
      return Response.json({ error: "Unable to save summary" }, { status: 500 });
    }

    return Response.json({ ok: true, interviewId });
  } catch {
    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

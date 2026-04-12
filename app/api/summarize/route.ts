import { z } from "zod";
import { summarizeTranscript } from "@/lib/groq";

const bodySchema = z.object({
  transcript: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);

    if (!parsed.success) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    const summary = await summarizeTranscript(parsed.data.transcript);
    return Response.json(summary);
  } catch {
    return Response.json({ error: "Failed to summarize transcript" }, { status: 500 });
  }
}

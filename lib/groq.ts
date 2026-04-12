import { QAPair } from "@/lib/types";

type SummaryResult = {
  qaPairs: QAPair[];
  overallSummary: string;
};

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

function parseGroqJson(raw: string): SummaryResult {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "");

  const parsed = JSON.parse(cleaned) as Array<Record<string, unknown>>;
  const qaPairs: QAPair[] = [];
  let overallSummary = "The interview completed successfully.";

  for (const item of parsed) {
    if (typeof item.overall_summary === "string") {
      overallSummary = item.overall_summary;
      continue;
    }

    if (
      typeof item.question === "string" &&
      typeof item.answer === "string" &&
      (item.score === "strong" || item.score === "adequate" || item.score === "weak")
    ) {
      qaPairs.push({
        question: item.question,
        answer: item.answer,
        score: item.score,
      });
    }
  }

  return {
    qaPairs,
    overallSummary,
  };
}

function buildFallbackSummary(transcript: string): SummaryResult {
  const lines = transcript
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const qaPairs: QAPair[] = [];
  let pendingQuestion = "";

  for (const line of lines) {
    if (/\?$/.test(line) || line.toLowerCase().includes("interviewer:")) {
      pendingQuestion = line.replace(/^interviewer:\s*/i, "");
      continue;
    }

    if (pendingQuestion) {
      qaPairs.push({
        question: pendingQuestion,
        answer: line.replace(/^candidate:\s*/i, ""),
        score: line.length > 180 ? "strong" : line.length > 70 ? "adequate" : "weak",
      });
      pendingQuestion = "";
    }
  }

  return {
    qaPairs: qaPairs.slice(0, 12),
    overallSummary:
      qaPairs.length > 0
        ? "The candidate completed a full mock interview. Review each answer for depth and clarity."
        : "Interview transcript captured, but structured Q&A extraction requires more transcript detail.",
  };
}

export async function summarizeTranscript(rawTranscript: string): Promise<SummaryResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return buildFallbackSummary(rawTranscript);
  }

  const prompt = `You are an expert interview analyst. Below is a raw transcript of a voice interview between an AI interviewer (Alex) and a job candidate.

Your task is to extract every question asked by Alex and the corresponding answer given by the candidate. Return ONLY a valid JSON array with no extra text, markdown, or explanation.

Format:
[
  {
    "question": "...",
    "answer": "...",
    "score": "strong | adequate | weak"
  }
]

Score each answer:
- "strong" if the candidate gave a confident, detailed, and relevant answer
- "adequate" if the answer was acceptable but lacked depth
- "weak" if the candidate struggled, gave a very short answer, or said they didn't know

Also append a final object with key "overall_summary" containing a 2-3 sentence summary of the candidate's overall performance.

Transcript:
${rawTranscript}`;

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        temperature: 0.1,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return buildFallbackSummary(rawTranscript);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return buildFallbackSummary(rawTranscript);
    }

    return parseGroqJson(content);
  } catch {
    return buildFallbackSummary(rawTranscript);
  }
}

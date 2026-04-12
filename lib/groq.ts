import { QAPair } from "@/lib/types";

type SummaryResult = {
  qaPairs: QAPair[];
  strengths: string[];
  improvements: string[];
  overallSummary: string;
};

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

function parseGroqJson(raw: string): SummaryResult {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "");

  const parsed = JSON.parse(cleaned) as unknown;
  const qaPairs: QAPair[] = [];
  let strengths: string[] = [];
  let improvements: string[] = [];
  let overallSummary = "The interview completed successfully.";

  if (
    typeof parsed === "object" &&
    parsed !== null &&
    !Array.isArray(parsed) &&
    "qa_pairs" in parsed
  ) {
    const parsedObject = parsed as {
      qa_pairs?: unknown;
      strengths?: unknown;
      improvements?: unknown;
      overall_summary?: unknown;
    };

    if (Array.isArray(parsedObject.qa_pairs)) {
      for (const item of parsedObject.qa_pairs) {
        if (
          typeof item === "object" &&
          item !== null &&
          typeof (item as { question?: unknown }).question === "string" &&
          typeof (item as { answer?: unknown }).answer === "string" &&
          ((item as { score?: unknown }).score === "strong" ||
            (item as { score?: unknown }).score === "adequate" ||
            (item as { score?: unknown }).score === "weak")
        ) {
          qaPairs.push({
            question: (item as { question: string }).question,
            answer: (item as { answer: string }).answer,
            score: (item as { score: "strong" | "adequate" | "weak" }).score,
          });
        }
      }
    }

    strengths = Array.isArray(parsedObject.strengths)
      ? parsedObject.strengths.filter((item): item is string => typeof item === "string")
      : [];

    improvements = Array.isArray(parsedObject.improvements)
      ? parsedObject.improvements.filter((item): item is string => typeof item === "string")
      : [];

    if (typeof parsedObject.overall_summary === "string") {
      overallSummary = parsedObject.overall_summary;
    }

    return {
      qaPairs,
      strengths,
      improvements,
      overallSummary,
    };
  }

  const parsedArray = Array.isArray(parsed) ? (parsed as Array<Record<string, unknown>>) : [];

  for (const item of parsedArray) {
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

  const strongAnswers = qaPairs.filter((pair) => pair.score === "strong");
  const weakAnswers = qaPairs.filter((pair) => pair.score === "weak");

  strengths = strongAnswers
    .slice(0, 3)
    .map((pair) => `Strong response on: ${pair.question.slice(0, 80)}${pair.question.length > 80 ? "..." : ""}`);
  improvements = weakAnswers
    .slice(0, 3)
    .map((pair) => `Improve depth for: ${pair.question.slice(0, 80)}${pair.question.length > 80 ? "..." : ""}`);

  return {
    qaPairs,
    strengths,
    improvements,
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

  const strongCount = qaPairs.filter((pair) => pair.score === "strong").length;
  const weakCount = qaPairs.filter((pair) => pair.score === "weak").length;
  const strengths =
    strongCount > 0
      ? [
          `${strongCount} answer(s) showed confidence and relevant detail.`,
          "The candidate kept responses aligned with interview prompts.",
        ]
      : ["The candidate stayed engaged through the interview."];
  const improvements =
    weakCount > 0
      ? [
          `${weakCount} answer(s) need deeper technical detail.`,
          "Use structured STAR-style examples for behavioral prompts.",
        ]
      : ["Add more measurable outcomes to further strengthen responses."];

  return {
    qaPairs: qaPairs.slice(0, 12),
    strengths,
    improvements,
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

Your task is to extract every question asked by Alex and the corresponding answer given by the candidate. Return ONLY a valid JSON object with no extra text, markdown, or explanation.

Format:
{
  "qa_pairs": [
    {
      "question": "...",
      "answer": "...",
      "score": "strong | adequate | weak"
    }
  ],
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "overall_summary": "..."
}

Score each answer:
- "strong" if the candidate gave a confident, detailed, and relevant answer
- "adequate" if the answer was acceptable but lacked depth
- "weak" if the candidate struggled, gave a very short answer, or said they didn't know

Add 2-4 bullet-style strings in "strengths" and "improvements" each. Keep each concise and actionable.

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

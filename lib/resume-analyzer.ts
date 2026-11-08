import { ResumeAnalysisResult } from "@/lib/types";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

function cleanJsonString(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function parseResumeAnalysisJson(raw: string): ResumeAnalysisResult {
  const cleaned = cleanJsonString(raw);
  const parsed = JSON.parse(cleaned) as {
    score?: unknown;
    overall_summary?: unknown;
    strengths?: unknown;
    improvements?: unknown;
    section_scores?: unknown;
    target_roles?: unknown;
  };

  const rawScore = Number(parsed.score);
  const score = Number.isFinite(rawScore) ? Math.min(100, Math.max(0, Math.round(rawScore))) : 75;

  const overallSummary =
    typeof parsed.overall_summary === "string" && parsed.overall_summary.trim()
      ? parsed.overall_summary.trim()
      : "The resume demonstrates relevant experience. Focus on quantifying project impact and highlighting domain depth.";

  const strengths = Array.isArray(parsed.strengths)
    ? parsed.strengths.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    : [];

  const improvements = Array.isArray(parsed.improvements)
    ? parsed.improvements.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    : [];

  const sectionScores = Array.isArray(parsed.section_scores)
    ? parsed.section_scores
        .filter((sec): sec is { name: string; score: number; feedback: string } => {
          return (
            typeof sec === "object" &&
            sec !== null &&
            typeof sec.name === "string" &&
            typeof sec.score === "number" &&
            typeof sec.feedback === "string"
          );
        })
        .map((sec) => ({
          name: sec.name,
          score: Math.min(100, Math.max(0, Math.round(sec.score))),
          feedback: sec.feedback,
        }))
    : [];

  const targetRoles = Array.isArray(parsed.target_roles)
    ? parsed.target_roles.filter((r): r is string => typeof r === "string" && r.trim().length > 0)
    : [];

  return {
    score,
    overallSummary,
    strengths: strengths.length > 0 ? strengths : [
      "Clear technical skill catalog and education background.",
      "Identifiable development projects and technical tooling.",
    ],
    improvements: improvements.length > 0 ? improvements : [
      "Quantify bullet points with tangible business metrics (% latency reduced, $ saved, DAU served).",
      "Lead each project description with strong action verbs (Architected, Spearheaded, Reduced).",
      "Ensure links to live GitHub repositories or deployed demos are prominent.",
    ],
    sectionScores: sectionScores.length > 0 ? sectionScores : [
      { name: "Impact & Metrics", score: 68, feedback: "Needs more quantifiable outcomes and scale metrics." },
      { name: "Technical Depth", score: 80, feedback: "Good technology stack coverage." },
      { name: "Structure & ATS", score: 82, feedback: "Clean, parseable section headers." },
      { name: "Project Relevance", score: 75, feedback: "Tie project descriptions to commercial real-world stakes." },
    ],
    targetRoles: targetRoles.length > 0 ? targetRoles : ["Software Engineer", "Full-Stack Developer", "Backend Engineer"],
    analyzedAt: new Date().toISOString(),
  };
}

export function buildFallbackResumeAnalysis(resumeText: string): ResumeAnalysisResult {
  const text = resumeText.toLowerCase();
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;

  let baseScore = 65;

  // Metric presence check (%, $, numbers, ms, k, x)
  const metricMatches = resumeText.match(/\b\d+(?:\.\d+)?%|\$\d+|\b\d+\s*(?:ms|k|m|gb|tb|x|users|req\/s)\b/gi) || [];
  const metricCount = metricMatches.length;
  if (metricCount >= 6) baseScore += 15;
  else if (metricCount >= 3) baseScore += 8;

  // Length heuristic
  if (wordCount >= 250 && wordCount <= 750) baseScore += 10;
  else if (wordCount > 150) baseScore += 5;

  // Section heuristics
  const hasExperience = text.includes("experience") || text.includes("employment") || text.includes("work");
  const hasProjects = text.includes("project") || text.includes("built") || text.includes("developed");
  const hasSkills = text.includes("skill") || text.includes("technologies") || text.includes("languages");
  const hasEducation = text.includes("education") || text.includes("university") || text.includes("bachelor") || text.includes("degree");

  if (hasExperience) baseScore += 3;
  if (hasProjects) baseScore += 3;
  if (hasSkills) baseScore += 2;
  if (hasEducation) baseScore += 2;

  const score = Math.min(94, Math.max(50, baseScore));

  const strengths: string[] = [];
  if (metricCount >= 3) {
    strengths.push(`Effective inclusion of quantified metrics (${metricCount} quantifiable data points detected).`);
  } else {
    strengths.push("Clear listing of core programming tools and fundamental technical competencies.");
  }

  if (hasProjects) {
    strengths.push("Direct references to hands-on engineering projects and architectural deliverables.");
  }
  if (hasEducation) {
    strengths.push("Structured academic credentials with clear foundational context.");
  }

  const improvements: string[] = [];
  if (metricCount < 5) {
    improvements.push("Add concrete metrics to your bullet points (e.g. latency reduced by X%, throughput increased by Y, or users served).");
  }
  improvements.push("Frame bullet points with the XYZ formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.");
  improvements.push("Incorporate specific system design and distributed state keywords relevant to your target seniority tier.");
  improvements.push("Add concise architectural trade-off context for your key projects (e.g. why Redis vs Postgres, Kafka vs SQS).");

  return {
    score,
    overallSummary: `The resume demonstrates a solid foundation with ${wordCount} words and clear domain focus. To score in the top 5% of candidate loops, increase the density of quantified business metrics and emphasize architectural ownership.`,
    strengths,
    improvements,
    sectionScores: [
      {
        name: "Impact & Quantifiable Metrics",
        score: Math.min(95, Math.max(45, metricCount * 14 + 40)),
        feedback: metricCount >= 4 ? "Good density of numbers and percentages." : "Needs more specific percentage, latency, or throughput metrics.",
      },
      {
        name: "Technical Stack Depth",
        score: hasSkills && hasProjects ? 85 : 70,
        feedback: "Solid foundation across modern languages and frameworks.",
      },
      {
        name: "ATS Readability & Structure",
        score: hasExperience && hasEducation ? 88 : 72,
        feedback: "Standard hierarchical headings are clear and easily indexable.",
      },
      {
        name: "Action Orientation (XYZ)",
        score: 74,
        feedback: "Strengthen opening verbs to highlight decisive leadership and architectural initiative.",
      },
    ],
    targetRoles: [
      text.includes("front") || text.includes("react") ? "Frontend Engineer" : "Software Engineer",
      text.includes("data") || text.includes("sql") ? "Data / Backend Engineer" : "Full-Stack Developer",
      text.includes("cloud") || text.includes("docker") ? "DevOps / Infrastructure Engineer" : "Systems Engineer",
    ],
    analyzedAt: new Date().toISOString(),
  };
}

export async function analyzeResumeWithGroq(resumeText: string): Promise<ResumeAnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || resumeText.trim().length < 40) {
    return buildFallbackResumeAnalysis(resumeText);
  }

  const prompt = `You are a principal technical recruiter and hiring bar evaluator at top-tier tech companies (Stripe, Google, Meta).
Analyze the following candidate resume text with high precision and realistic hiring bar standards.

Your task:
1. Provide an overall score out of 100 (where 90+ is Tier-1 onsite ready, 75-89 is competitive with minor gaps, 60-74 needs significant improvement, <60 is weak).
2. Generate an overall_summary (2-3 sentences evaluating the candidate's caliber and primary trajectory).
3. Extract 3-5 specific "strengths" referencing concrete things in their resume (specific tech stack, projects, quantifiable wins).
4. Provide 4-6 specific, actionable "improvements" based directly on the things in their resume (how to reframe bullets, what specific metrics are missing, architectural depth, ATS keywords, XYZ formula).
5. Provide "section_scores": array of objects with "name", "score" (0-100), and "feedback" for:
   - "Impact & Metrics"
   - "Technical Depth & Modern Stack"
   - "Structure & ATS Compliance"
   - "Project Architecture & Evidence"
6. Provide "target_roles": 3-5 specific roles that best match this resume.

Return ONLY a valid JSON object with no markdown fences, no explanatory text.
JSON Structure:
{
  "score": 82,
  "overall_summary": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "section_scores": [
    { "name": "Impact & Metrics", "score": 75, "feedback": "..." },
    { "name": "Technical Depth & Modern Stack", "score": 88, "feedback": "..." },
    { "name": "Structure & ATS Compliance", "score": 84, "feedback": "..." },
    { "name": "Project Architecture & Evidence", "score": 80, "feedback": "..." }
  ],
  "target_roles": ["...", "..."]
}

Resume Text:
${resumeText.slice(0, 8000)}`;

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return buildFallbackResumeAnalysis(resumeText);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return buildFallbackResumeAnalysis(resumeText);
    }

    return parseResumeAnalysisJson(content);
  } catch {
    return buildFallbackResumeAnalysis(resumeText);
  }
}

import { QAPair } from "./types";

export type RawTranscriptBubble = {
  speaker: "ai" | "user";
  text: string;
};

export type RawTranscriptResult = {
  bubbles: RawTranscriptBubble[];
  skillsFooter: string;
};

/**
 * Cleans a streaming speech-to-text transcript by removing intermediate
 * partial waterfall prefixes, deduplicating repetitive chunks, and formatting
 * into clean, readable full sentences without truncating or chopping questions.
 */
export function cleanTranscriptToFullSentences(raw: string | null | undefined): string {
  if (!raw) return "";

  // Preserve any metadata or footer (like "Interview skills: ...")
  let footer = "";
  const skillsMarker = "\n\nInterview skills:";
  const skillsIndex = raw.indexOf(skillsMarker);
  let body = raw;
  if (skillsIndex !== -1) {
    footer = raw.slice(skillsIndex).trim();
    body = raw.slice(0, skillsIndex);
  }

  function normalize(s: string): string {
    return s
      .toLowerCase()
      .replace(/^(interviewer|neha|candidate|you|user|assistant):\s*/i, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const rawLines = body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length === 0) return raw;

  // Step 1: Remove streaming waterfall prefix lines
  // If line i is a strict prefix of any following line in the near window, it is an incomplete partial
  const nonPrefixLines: string[] = [];
  for (let i = 0; i < rawLines.length; i++) {
    const current = rawLines[i];
    const normCurrent = normalize(current);
    if (!normCurrent) continue;

    let isSuperseded = false;
    const windowEnd = Math.min(rawLines.length, i + 15);
    for (let j = i + 1; j < windowEnd; j++) {
      const nextNorm = normalize(rawLines[j]);
      if (nextNorm === normCurrent) {
        isSuperseded = true;
        break;
      }
      if (nextNorm.startsWith(normCurrent) && nextNorm.length > normCurrent.length) {
        isSuperseded = true;
        break;
      }
    }

    if (!isSuperseded) {
      // Avoid immediate duplicate
      if (nonPrefixLines.length > 0 && normalize(nonPrefixLines[nonPrefixLines.length - 1]) === normCurrent) {
        continue;
      }
      nonPrefixLines.push(current);
    }
  }

  let result = nonPrefixLines.join("\n\n");
  if (footer) {
    result += `\n\n---\n${footer}`;
  }

  return result || raw;
}

/**
 * Parses raw transcript text into conversational message bubbles:
 * - AI text on the left (blue/green bubble)
 * - User text on the right (black bubble)
 */
export function parseRawTranscriptToBubbles(
  raw: string | null | undefined,
  qaPairs: QAPair[] = [],
): RawTranscriptResult {
  if (!raw) return { bubbles: [], skillsFooter: "" };

  // Separate skills footer
  let skillsFooter = "";
  const skillsMarker = "\n\nInterview skills:";
  const skillsIndex = raw.indexOf(skillsMarker);
  let body = raw;
  if (skillsIndex !== -1) {
    skillsFooter = raw.slice(skillsIndex).replace(skillsMarker, "").trim();
    body = raw.slice(0, skillsIndex);
  }

  // Pre-clean waterfall duplicates
  const cleanedBody = cleanTranscriptToFullSentences(body);
  const rawLines = cleanedBody
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length === 0) return { bubbles: [], skillsFooter };

  // 1. Explicit speaker prefixes: e.g. "Neha (Interviewer):", "Candidate:"
  const hasExplicitSpeaker = rawLines.some((l) =>
    /^(neha|interviewer|assistant|candidate|user|you)(\s*\([^)]*\))?:\s*/i.test(l),
  );

  if (hasExplicitSpeaker) {
    const bubbles: RawTranscriptBubble[] = [];
    let curSpeaker: "ai" | "user" | null = null;
    let curLines: string[] = [];

    for (const line of rawLines) {
      const match = line.match(
        /^(neha|interviewer|assistant|candidate|user|you)(\s*\([^)]*\))?:\s*(.*)$/i,
      );
      if (match) {
        if (curSpeaker && curLines.length > 0) {
          bubbles.push({ speaker: curSpeaker, text: curLines.join(" ") });
        }
        const role = match[1].toLowerCase();
        curSpeaker = role === "candidate" || role === "user" || role === "you" ? "user" : "ai";
        curLines = match[3] ? [match[3]] : [];
      } else {
        if (curSpeaker) curLines.push(line);
      }
    }
    if (curSpeaker && curLines.length > 0) {
      bubbles.push({ speaker: curSpeaker, text: curLines.join(" ") });
    }
    return { bubbles, skillsFooter };
  }

  // 2. Unlabelled transcript heuristic:
  // Identify candidate answers from known Q&A pairs and candidate intent keywords
  const candidateAnswers = (qaPairs || [])
    .map((p) => p.answer.toLowerCase().trim())
    .filter(Boolean);

  const isUserLine = (line: string): boolean => {
    const l = line.toLowerCase().trim();
    // Match against candidate answers in qaPairs
    for (const ans of candidateAnswers) {
      if (ans.length > 5 && (ans.includes(l) || l.includes(ans))) return true;
    }
    // Specific candidate action / intent statements
    return (
      l.includes("i want to quit") ||
      l.includes("that was for you") ||
      l.startsWith("i would ") ||
      l.startsWith("in my previous") ||
      l.startsWith("for the interview")
    );
  };

  const bubbles: RawTranscriptBubble[] = [];
  let curSpeaker: "ai" | "user" | null = null;
  let curLines: string[] = [];

  for (const line of rawLines) {
    const speaker = isUserLine(line) ? "user" : "ai";
    if (speaker !== curSpeaker) {
      if (curSpeaker && curLines.length > 0) {
        bubbles.push({ speaker: curSpeaker, text: curLines.join(" ") });
      }
      curSpeaker = speaker;
      curLines = [line];
    } else {
      curLines.push(line);
    }
  }

  if (curSpeaker && curLines.length > 0) {
    bubbles.push({ speaker: curSpeaker, text: curLines.join(" ") });
  }

  return { bubbles, skillsFooter };
}

/**
 * Sanitizes Q&A pairs from interview summaries to ensure:
 * 1. Interviewer greetings (like "Hi, Anvesh", "Welcome...") are never attributed to the candidate.
 * 2. Questions that were truncated/cutoff have their full context restored.
 * 3. Candidate answers are strictly what the candidate actually said.
 */
export function sanitizeQAPairs(
  pairs: QAPair[] | undefined | null,
  rawTranscript?: string | null,
): QAPair[] {
  if (!pairs || pairs.length === 0) {
    return [];
  }

  const isInterviewerGreeting = (text: string): boolean => {
    const l = text.toLowerCase().trim();
    return (
      l.startsWith("hi,") ||
      l.startsWith("hi ") ||
      l.includes("anvesh") ||
      l.includes("welcome and thank you") ||
      l.includes("taking the time to chat") ||
      l.includes("glad we can have") ||
      l === "hello?" ||
      l === "hello" ||
      l.startsWith("hello ")
    );
  };

  const sanitized: QAPair[] = [];
  let prependedContext = "";

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const answerIsInterviewer = isInterviewerGreeting(pair.answer);

    if (answerIsInterviewer) {
      // This "answer" was actually Neha greeting the candidate!
      // Collect it into prependedContext to attach to the real upcoming question
      prependedContext += (prependedContext ? " " : "") + pair.question + " " + pair.answer;
      continue;
    }

    let fullQuestion = (prependedContext ? `${prependedContext} ` : "") + pair.question;
    prependedContext = "";

    // If raw transcript is present, restore any cut-off question beginning
    if (rawTranscript) {
      const qLower = pair.question.toLowerCase().trim();
      const lines = rawTranscript.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const lineLower = line.toLowerCase();
        // If line contains the question phrase and is longer, it has the full uncut prompt
        if (lineLower.includes(qLower) && line.length > pair.question.length) {
          fullQuestion = line.replace(/^(interviewer|neha):\s*/i, "");
          break;
        }
      }
    }

    sanitized.push({
      question: fullQuestion.trim(),
      answer: pair.answer.trim(),
      score: pair.score,
    });
  }

  // If all pairs were merged into prependedContext without an answer (e.g. call ended immediately)
  if (sanitized.length === 0 && prependedContext) {
    sanitized.push({
      question: prependedContext.trim(),
      answer: "No answer provided.",
      score: "weak",
    });
  }

  return sanitized;
}

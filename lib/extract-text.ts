import zlib from "zlib";

/**
 * Extracts readable plain text from uploaded resume buffer.
 * Supports .txt, .md, .tex, .rtf, .json and .pdf files.
 */
export function extractTextFromBuffer(buffer: Buffer, fileName: string): string {
  const lowerName = fileName.toLowerCase();

  // If plain text / markup formats, decode directly
  if (
    lowerName.endsWith(".txt") ||
    lowerName.endsWith(".tex") ||
    lowerName.endsWith(".md") ||
    lowerName.endsWith(".rtf") ||
    lowerName.endsWith(".json") ||
    lowerName.endsWith(".csv") ||
    lowerName.endsWith(".html") ||
    lowerName.endsWith(".htm")
  ) {
    return buffer.toString("utf-8");
  }

  // If PDF, extract text streams
  if (lowerName.endsWith(".pdf")) {
    const extracted = extractTextFromPdfBuffer(buffer);
    if (extracted.trim().length > 50) {
      return extracted;
    }
  }

  // Fallback: extract contiguous printable strings
  return extractPrintableStrings(buffer);
}

function extractTextFromPdfBuffer(buffer: Buffer): string {
  const content = buffer.toString("latin1");
  const textChunks: string[] = [];

  // Match streams between "stream" and "endstream"
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(content)) !== null) {
    const rawStream = match[1];
    const streamBuffer = Buffer.from(rawStream, "latin1");

    let decompressed: Buffer | null = null;
    try {
      decompressed = zlib.inflateSync(streamBuffer);
    } catch {
      try {
        decompressed = zlib.inflateRawSync(streamBuffer);
      } catch {
        decompressed = streamBuffer;
      }
    }

    if (decompressed) {
      const decoded = decompressed.toString("latin1");
      const text = parsePdfTextOperators(decoded);
      if (text.trim().length > 0) {
        textChunks.push(text);
      }
    }
  }

  const combined = textChunks.join("\n\n");
  if (combined.trim().length > 50) {
    return cleanExtractedText(combined);
  }

  // Fallback to searching uncompressed Tj/TJ directly in the raw content
  const directText = parsePdfTextOperators(content);
  if (directText.trim().length > 50) {
    return cleanExtractedText(directText);
  }

  return extractPrintableStrings(buffer);
}

function parsePdfTextOperators(streamText: string): string {
  const extracted: string[] = [];

  // 1. Array text operator: [(Text) 20 (more text)] TJ
  const tjArrayRegex = /\[((?:(?:\([^)]*\)|-?\d+(?:\.\d+)?)\s*)+)\]\s*TJ/g;
  let arrMatch: RegExpExecArray | null;
  while ((arrMatch = tjArrayRegex.exec(streamText)) !== null) {
    const inner = arrMatch[1];
    const itemRegex = /\(([^)]*)\)/g;
    let itemMatch: RegExpExecArray | null;
    let line = "";
    while ((itemMatch = itemRegex.exec(inner)) !== null) {
      line += itemMatch[1];
    }
    if (line.trim()) {
      extracted.push(line.trim());
    }
  }

  // 2. Single string operator: (Text here) Tj or ' or "
  const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
  let strMatch: RegExpExecArray | null;
  while ((strMatch = tjRegex.exec(streamText)) !== null) {
    const text = strMatch[1].trim();
    if (text.length > 0) {
      extracted.push(text);
    }
  }

  return extracted.join(" ");
}

function extractPrintableStrings(buffer: Buffer): string {
  const str = buffer.toString("utf-8");
  // Match sequences of printable ASCII + standard unicode characters
  const matches = str.match(/[\x20-\x7E\t\r\n]{4,}/g);
  if (!matches || matches.length === 0) {
    return buffer.toString("utf-8").slice(0, 5000);
  }
  return cleanExtractedText(matches.join(" "));
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\\([\\()])/g, "$1") // unescape \( \) \\
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\\t/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}

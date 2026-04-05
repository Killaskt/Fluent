// Pure parsing logic for Claude scorer responses.
// No SDK dependency — fully unit-testable without any mocks.

export interface ScoreResult {
  score: number;
  feedback: string;
  passed: boolean;
}

const PASS_THRESHOLD = 0.7;

// Parses Claude's JSON response, handling markdown fences Claude sometimes
// adds despite being instructed not to.
export function parseScoreResponse(raw: string): ScoreResult {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Invalid JSON from scorer: ${cleaned.slice(0, 120)}`);
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).score !== "number" ||
    typeof (parsed as Record<string, unknown>).feedback !== "string"
  ) {
    throw new Error(`Scorer response missing required fields: ${cleaned.slice(0, 120)}`);
  }

  const { score, feedback } = parsed as { score: number; feedback: string };
  return { score, feedback, passed: score >= PASS_THRESHOLD };
}

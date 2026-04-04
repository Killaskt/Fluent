import Anthropic from "@anthropic-ai/sdk";

export interface ScoreResult {
  score: number;
  feedback: string;
  passed: boolean;
}

const PASS_THRESHOLD = 0.7;

// scorePrompt evaluates a user's prompt against a rubric using Claude.
export async function scorePrompt(
  userPrompt: string,
  rubric: string
): Promise<ScoreResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 512,
    system: `You are a prompt-quality evaluator. You will be given a rubric and a user's prompt.
Evaluate the prompt against the rubric and return a JSON object with exactly these two fields:
- score: a number from 0 to 1 (1 = perfect match, 0 = completely wrong)
- feedback: a short, encouraging sentence (max 50 words) explaining the score

Rubric:
${rubric}

Respond with ONLY valid JSON. No markdown fences, no extra text.`,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const raw = message.content[0];
  if (raw.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  let parsed: { score: number; feedback: string };
  try {
    parsed = JSON.parse(raw.text) as { score: number; feedback: string };
  } catch {
    throw new Error("Claude returned invalid JSON");
  }

  if (typeof parsed.score !== "number" || typeof parsed.feedback !== "string") {
    throw new Error("Claude response missing required fields");
  }

  return {
    score: parsed.score,
    feedback: parsed.feedback,
    passed: parsed.score >= PASS_THRESHOLD,
  };
}

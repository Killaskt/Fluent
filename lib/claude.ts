import Anthropic from "@anthropic-ai/sdk";
import { log } from "@/lib/logger";
import { parseScoreResponse } from "@/lib/score-parser";

export type { ScoreResult } from "@/lib/score-parser";
export { parseScoreResponse } from "@/lib/score-parser";

// scorePrompt evaluates a user's prompt against a rubric using Claude.
export async function scorePrompt(
  userPrompt: string,
  rubric: string
): Promise<ReturnType<typeof parseScoreResponse>> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: `You are a prompt-quality evaluator. You will be given a rubric and a user's prompt.
Evaluate the prompt against the rubric and return a JSON object with exactly these two fields:
- score: a number from 0 to 1 (1 = perfect match, 0 = completely wrong)
- feedback: a short, encouraging sentence (max 50 words) explaining the score

Rubric:
${rubric}

Respond with ONLY valid JSON. No markdown fences, no extra text.`,
    messages: [{ role: "user", content: userPrompt }],
  });

  const raw = message.content[0];
  if (raw.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  log.info("scorePrompt raw response", { raw: raw.text });
  return parseScoreResponse(raw.text);
}

import { NextRequest, NextResponse } from "next/server";
import { scorePrompt } from "@/lib/claude";
import { log } from "@/lib/logger";

interface RequestBody {
  prompt: string;
  rubric: string;
  lessonId: string;
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { prompt, rubric, lessonId } = body;

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }
  if (!rubric || typeof rubric !== "string") {
    return NextResponse.json({ error: "rubric is required" }, { status: 400 });
  }
  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    log.error("ANTHROPIC_API_KEY is not set", { lessonId });
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 503 }
    );
  }

  log.info("score-prompt request", { lessonId, promptLength: prompt.length });

  try {
    const result = await scorePrompt(prompt, rubric);
    log.info("score-prompt result", { lessonId, score: result.score, passed: result.passed });
    return NextResponse.json(result);
  } catch (err) {
    log.error("score-prompt failed", {
      lessonId,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Scoring failed. Please try again." },
      { status: 500 }
    );
  }
}

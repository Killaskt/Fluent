import { NextRequest, NextResponse } from "next/server";
import { scorePrompt } from "@/lib/claude";

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
    console.error("[score-prompt] ANTHROPIC_API_KEY is not set");
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const result = await scorePrompt(prompt, rubric);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[score-prompt] Claude API error:", err);
    return NextResponse.json(
      { error: "Scoring failed. Please try again." },
      { status: 500 }
    );
  }
}

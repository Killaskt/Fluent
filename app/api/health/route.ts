import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

interface CheckResult {
  status: "ok" | "error";
  message?: string;
}

async function checkAnthropic(): Promise<CheckResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { status: "error", message: "ANTHROPIC_API_KEY is not set" };
  }
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1,
      messages: [{ role: "user", content: "hi" }],
    });
    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

async function checkSupabase(): Promise<CheckResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { status: "error", message: "Supabase env vars are not set" };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error) throw error;
    return { status: "ok" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function GET() {
  const [anthropic, supabase] = await Promise.all([
    checkAnthropic(),
    checkSupabase(),
  ]);

  const allOk = anthropic.status === "ok" && supabase.status === "ok";

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      checks: { anthropic, supabase },
    },
    { status: allOk ? 200 : 503 }
  );
}

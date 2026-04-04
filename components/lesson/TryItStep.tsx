"use client";

import { useState } from "react";
import type { TryItStep as TryItStepType } from "@/types";

interface ScoreResponse {
  score: number;
  feedback: string;
  passed: boolean;
}

interface Props {
  step: TryItStepType;
  lessonId: string;
  onComplete: (firstTry: boolean) => void;
}

type Phase = "input" | "loading" | "result";

export default function TryItStep({ step, lessonId, onComplete }: Props) {
  const [userPrompt, setUserPrompt] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isFirstTry, setIsFirstTry] = useState(true);

  // Max attempts comes from payload if available, default 3
  const maxAttempts =
    typeof step.payload.max_attempts === "number"
      ? step.payload.max_attempts
      : 3;
  const rubric =
    typeof step.payload.rubric === "string" ? step.payload.rubric : "";
  const expertPrompt =
    typeof step.payload.expert_prompt === "string"
      ? step.payload.expert_prompt
      : null;

  const attemptsLeft = maxAttempts - attempts;

  async function handleSubmit() {
    if (!userPrompt.trim()) return;
    setPhase("loading");

    const currentAttempt = attempts + 1;
    setAttempts(currentAttempt);
    if (currentAttempt > 1) setIsFirstTry(false);

    try {
      const res = await fetch("/api/score-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt, rubric, lessonId }),
      });

      if (!res.ok) {
        throw new Error("Score request failed");
      }

      const data = (await res.json()) as ScoreResponse;
      setResult(data);
      setPhase("result");
    } catch {
      setResult({
        score: 0,
        feedback: "Something went wrong. Please try again.",
        passed: false,
      });
      setPhase("result");
    }
  }

  function handleRetry() {
    setUserPrompt("");
    setResult(null);
    setPhase("input");
  }

  function handleContinue() {
    onComplete(isFirstTry && (result?.passed ?? false));
  }

  const outOfAttempts = attempts >= maxAttempts && !result?.passed;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">
          Scenario
        </p>
        <p className="text-gray-800 text-sm leading-relaxed">
          {step.instructions}
        </p>
      </div>

      {phase === "input" && (
        <>
          <div>
            <label
              htmlFor="try-it-prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Write your prompt
            </label>
            <textarea
              id="try-it-prompt"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              rows={5}
              placeholder="Type your prompt here…"
              className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            />
          </div>

          {attemptsLeft < maxAttempts && (
            <p className="text-xs text-gray-400 text-center">
              {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!userPrompt.trim()}
            className="w-full rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 text-base transition-colors"
          >
            Submit
          </button>
        </>
      )}

      {phase === "loading" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Evaluating your prompt…</p>
        </div>
      )}

      {phase === "result" && result && (
        <>
          <div
            className={`rounded-2xl border p-4 ${
              result.passed
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{result.passed ? "✅" : "❌"}</span>
              <span
                className={`font-semibold text-sm ${
                  result.passed ? "text-green-700" : "text-red-700"
                }`}
              >
                {result.passed ? "Great work!" : "Not quite"}
              </span>
              <span className="ml-auto text-xs text-gray-500">
                {Math.round(result.score * 100)}%
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {result.feedback}
            </p>
          </div>

          {result.passed && (
            <button
              onClick={handleContinue}
              className="w-full rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-4 text-base transition-colors"
            >
              Continue
            </button>
          )}

          {!result.passed && !outOfAttempts && (
            <button
              onClick={handleRetry}
              className="w-full rounded-2xl border-2 border-brand-500 text-brand-600 hover:bg-brand-50 font-semibold py-4 text-base transition-colors"
            >
              Try again ({attemptsLeft} left)
            </button>
          )}

          {outOfAttempts && expertPrompt && (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Expert example
              </p>
              <p className="text-gray-800 text-sm font-mono whitespace-pre-wrap">
                {expertPrompt}
              </p>
              <button
                onClick={handleContinue}
                className="mt-4 w-full rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-3 text-sm transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {outOfAttempts && !expertPrompt && (
            <button
              onClick={handleContinue}
              className="w-full rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-4 text-base transition-colors"
            >
              Continue
            </button>
          )}
        </>
      )}
    </div>
  );
}

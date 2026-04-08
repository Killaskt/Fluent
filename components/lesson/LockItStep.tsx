"use client";

import { useState } from "react";
import type { LockItStep as LockItStepType } from "@/types";

interface Props {
  step: LockItStepType;
  onComplete: (perfect: boolean) => void;
}

type SelectionState =
  | { kind: "idle" }
  | { kind: "correct"; index: number }
  | { kind: "wrong"; index: number; secondChance: boolean }
  | { kind: "revealed"; selectedIndex: number };

export default function LockItStep({ step, onComplete }: Props) {
  const [state, setState] = useState<SelectionState>({ kind: "idle" });

  function handleSelect(index: number) {
    if (state.kind === "correct" || state.kind === "revealed") return;

    const isCorrect = index === step.correct_index;

    if (isCorrect) {
      setState({ kind: "correct", index });
    } else if (state.kind === "idle") {
      // First wrong — give a second chance
      setState({ kind: "wrong", index, secondChance: true });
    } else {
      // Second wrong — reveal answer
      setState({ kind: "revealed", selectedIndex: index });
    }
  }

  function handleContinue() {
    const isPerfect = state.kind === "correct";
    onComplete(isPerfect);
  }

  function optionStyle(index: number): string {
    const base =
      "w-full rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-colors";

    if (state.kind === "correct" && index === state.index) {
      return `${base} bg-green-50 border-green-400 text-green-800`;
    }
    if (state.kind === "revealed" && index === step.correct_index) {
      return `${base} bg-green-50 border-green-400 text-green-800`;
    }
    if (
      (state.kind === "wrong" || state.kind === "revealed") &&
      index === (state.kind === "wrong" ? state.index : state.selectedIndex)
    ) {
      return `${base} bg-red-50 border-red-300 text-red-700`;
    }
    if (state.kind === "wrong" || state.kind === "revealed") {
      // Disable unselected options after reveal
      return `${base} bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed`;
    }
    return `${base} bg-white border-gray-200 text-gray-800 hover:border-brand-400 hover:bg-brand-50 cursor-pointer`;
  }

  const canContinue = state.kind === "correct" || state.kind === "revealed";
  const showFeedback = state.kind !== "idle";
  const feedbackText =
    state.kind === "correct"
      ? "Correct! " + step.explanation
      : state.kind === "wrong"
        ? "Not quite — try again."
        : "Here's the correct answer: " + step.explanation;
  const feedbackStyle =
    state.kind === "correct"
      ? "bg-green-50 border-green-200 text-green-800"
      : state.kind === "wrong"
        ? "bg-amber-50 border-amber-200 text-amber-800"
        : "bg-red-50 border-red-200 text-red-700";

  return (
    <div className="flex flex-col gap-5 p-6">
      <p className="text-gray-800 font-semibold text-base leading-snug">
        {step.question}
      </p>

      <div className="flex flex-col gap-3">
        {step.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={state.kind === "correct" || state.kind === "revealed"}
            className={optionStyle(i)}
          >
            {option}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className={`rounded-2xl border p-4 text-sm leading-relaxed ${feedbackStyle}`}>
          {feedbackText}
        </div>
      )}

      {canContinue && (
        <button
          onClick={handleContinue}
          className="w-full rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-4 text-base transition-colors"
        >
          Continue
        </button>
      )}
    </div>
  );
}

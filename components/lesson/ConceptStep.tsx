"use client";

import type { ConceptStep as ConceptStepType } from "@/types";

interface Props {
  step: ConceptStepType;
  onContinue: () => void;
}

export default function ConceptStep({ step, onContinue }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="prose prose-gray max-w-none">
        <h2 className="text-lg font-bold text-gray-900 mb-3">{step.heading}</h2>
        <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
          {step.body}
        </p>
      </div>

      <button
        onClick={onContinue}
        className="mt-auto w-full rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-4 text-base transition-colors"
      >
        Continue
      </button>
    </div>
  );
}

"use client";

import type { ConceptStep as ConceptStepType } from "@/types";

interface Props {
  step: ConceptStepType;
  onContinue: () => void;
}

export default function ConceptStep({ step, onContinue }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6">
      {step.visual && (
        <div className="rounded-2xl overflow-hidden bg-brand-50 flex items-center justify-center h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={step.visual}
            alt="Concept illustration"
            className="object-contain h-full w-full"
          />
        </div>
      )}

      <div className="prose prose-gray max-w-none">
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

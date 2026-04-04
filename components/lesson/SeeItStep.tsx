"use client";

import type { SeeItStep as SeeItStepType } from "@/types";

interface Props {
  step: SeeItStepType;
  onContinue: () => void;
}

export default function SeeItStep({ step, onContinue }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <p className="text-gray-700 text-base leading-relaxed">
        {step.description}
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {step.example.prompt && (
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">
              Prompt
            </p>
            <p className="text-gray-800 text-sm font-mono whitespace-pre-wrap">
              {step.example.prompt}
            </p>
          </div>
        )}

        {step.example.output && (
          <div className="p-4 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              AI Response
            </p>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">
              {step.example.output}
            </p>
          </div>
        )}

        {step.example.caption && (
          <div className="px-4 py-2 bg-brand-50 border-t border-brand-100">
            <p className="text-xs text-brand-700 italic">{step.example.caption}</p>
          </div>
        )}
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

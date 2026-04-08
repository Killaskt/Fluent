"use client";

import type { SeeItStep as SeeItStepType } from "@/types";

interface Props {
  step: SeeItStepType;
  onContinue: () => void;
}

export default function SeeItStep({ step, onContinue }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">{step.heading}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
      </div>

      {step.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={step.image_url}
          alt={step.heading}
          className="rounded-2xl w-full object-cover border border-gray-100"
        />
      )}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">
            {step.example.label}
          </p>
          <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
            {step.example.content}
          </p>
        </div>
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

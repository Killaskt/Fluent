"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Lesson } from "@/types";
import ConceptStep from "./ConceptStep";
import SeeItStep from "./SeeItStep";
import TryItStep from "./TryItStep";
import LockItStep from "./LockItStep";
import CompletionScreen from "./CompletionScreen";

interface Props {
  lesson: Lesson;
  nextLessonId: string | null;
  initialStreak: number;
  initialTotalXp: number;
}

interface BonusState {
  firstTryItSuccess: boolean;
  perfectLockIt: boolean;
}

export default function LessonShell({
  lesson,
  nextLessonId,
  initialStreak,
  initialTotalXp,
}: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXp, setTotalXp] = useState(initialTotalXp);
  const [streak, setStreak] = useState(initialStreak);
  const bonuses = useRef<BonusState>({
    firstTryItSuccess: false,
    perfectLockIt: false,
  });

  const totalSteps = lesson.steps.length;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  function advance() {
    setDirection("forward");
    if (currentStep >= totalSteps - 1) {
      handleComplete();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  async function handleComplete() {
    try {
      const res = await fetch("/api/award-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          baseXp: lesson.xp,
          bonuses: bonuses.current,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          earned: number;
          totalXp: number;
          streak: number;
        };
        setXpEarned(data.earned);
        setTotalXp(data.totalXp);
        setStreak(data.streak);
      } else {
        setXpEarned(lesson.xp);
      }
    } catch {
      setXpEarned(lesson.xp);
    }
    setCompleted(true);
  }

  if (completed) {
    return (
      <CompletionScreen
        xpEarned={xpEarned}
        totalXp={totalXp}
        streak={streak}
        nextLessonId={nextLessonId}
        onNextLesson={() =>
          nextLessonId
            ? router.push(`/learn/${nextLessonId}`)
            : router.push("/dashboard")
        }
      />
    );
  }

  const step = lesson.steps[currentStep];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          aria-label="Exit lesson"
        >
          ✕
        </button>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 shrink-0 tabular-nums">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>

      {/* Step content — slide transition */}
      <div className="flex-1 overflow-hidden">
        <div
          key={currentStep}
          className={`w-full max-w-lg mx-auto transition-transform duration-300 ease-in-out ${
            direction === "forward" ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {step.type === "concept" && (
            <ConceptStep step={step} onContinue={advance} />
          )}
          {step.type === "see-it" && (
            <SeeItStep step={step} onContinue={advance} />
          )}
          {step.type === "try-it" && (
            <TryItStep
              step={step}
              lessonId={lesson.id}
              onComplete={(firstTry) => {
                if (firstTry) bonuses.current.firstTryItSuccess = true;
                advance();
              }}
            />
          )}
          {step.type === "lock-it" && (
            <LockItStep
              step={step}
              onComplete={(perfect) => {
                if (perfect) bonuses.current.perfectLockIt = true;
                advance();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

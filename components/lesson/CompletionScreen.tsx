"use client";

import { useEffect } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import XpCounter from "@/components/gamification/XpCounter";
import StreakBadge from "@/components/gamification/StreakBadge";

interface Props {
  xpEarned: number;
  totalXp: number;
  streak: number;
  nextLessonId: string | null;
  onNextLesson: () => void;
}

export default function CompletionScreen({
  xpEarned,
  totalXp,
  streak,
  nextLessonId,
  onNextLesson,
}: Props) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Lazy load canvas-confetti to avoid affecting initial page load
      const confettiModule = await import("canvas-confetti");
      const confetti = confettiModule.default;
      if (cancelled) return;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#0ea5e9", "#38bdf8", "#7dd3fc", "#fbbf24", "#34d399"],
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center gap-8 p-8 min-h-screen justify-center text-center"
      >
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
          className="text-6xl"
        >
          🎉
        </m.div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Lesson complete!
          </h1>
          <p className="text-gray-500 text-base">Keep the momentum going.</p>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="w-full rounded-2xl bg-white border border-gray-200 shadow-sm p-5 flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              XP Earned
            </p>
            <div className="text-4xl font-bold">
              <XpCounter from={0} to={xpEarned} />
            </div>
            <p className="text-xs text-gray-400">
              Total: {totalXp} XP
            </p>
          </div>

          <div className="w-full rounded-2xl bg-white border border-gray-200 shadow-sm p-5 flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Current Streak
            </p>
            <StreakBadge streak={streak} size="lg" />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {nextLessonId && (
            <button
              onClick={onNextLesson}
              className="w-full rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-4 text-base transition-colors"
            >
              Next lesson →
            </button>
          )}
          <a
            href="/dashboard"
            className="w-full rounded-2xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-semibold py-4 text-base transition-colors text-center block"
          >
            Back to dashboard
          </a>
        </div>
      </m.div>
    </LazyMotion>
  );
}

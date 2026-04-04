"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Track } from "@/types";

export type NodeState = "locked" | "unlocked" | "completed" | "tested_out";

interface Props {
  track: Track;
  nodeState: NodeState;
  completedCount: number;
}

export default function TrackNode({ track, nodeState, completedCount }: Props) {
  const router = useRouter();
  const [showPlacementModal, setShowPlacementModal] = useState(false);

  function handleClick() {
    if (nodeState === "locked") {
      if (track.placement_test) {
        setShowPlacementModal(true);
      }
      return;
    }
    if (track.lessons.length > 0) {
      router.push(`/learn/${track.lessons[0]}`);
    }
  }

  const containerClasses = {
    locked: "opacity-50 bg-gray-100 border-gray-200 cursor-default",
    unlocked:
      "bg-white border-brand-500 shadow-sm cursor-pointer ring-2 ring-brand-200 animate-pulse hover:animate-none hover:shadow-md transition-shadow",
    completed: "bg-brand-500 border-brand-600 cursor-pointer text-white",
    tested_out: "bg-brand-500 border-brand-600 cursor-pointer text-white relative",
  };

  const tierLabel = track.tier === "premium" ? "⭐ Premium" : "Free";
  const isLight = nodeState === "locked" || nodeState === "unlocked";

  return (
    <>
      <button
        onClick={handleClick}
        className={`w-full rounded-2xl border-2 p-5 text-left transition-all duration-200 ${containerClasses[nodeState]}`}
        aria-label={`${track.title} — ${nodeState}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${
                  isLight ? "text-gray-400" : "text-brand-100"
                }`}
              >
                {tierLabel}
              </span>
            </div>
            <h3
              className={`font-bold text-base leading-snug ${
                isLight ? "text-gray-800" : "text-white"
              }`}
            >
              {track.title}
            </h3>
            <p
              className={`text-xs mt-1 ${
                isLight ? "text-gray-500" : "text-brand-100"
              }`}
            >
              {completedCount}/{track.lessons.length} lessons
            </p>
          </div>

          <div className="shrink-0 text-xl">
            {nodeState === "locked" && "🔒"}
            {nodeState === "unlocked" && "▶️"}
            {nodeState === "completed" && (
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                ✓
              </span>
            )}
            {nodeState === "tested_out" && (
              <span className="relative">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                  ✓
                </span>
                <span className="absolute -top-1 -right-1 text-xs">⚡</span>
              </span>
            )}
          </div>
        </div>

        {/* Progress bar for unlocked/in-progress */}
        {(nodeState === "unlocked" || nodeState === "completed") &&
          track.lessons.length > 0 && (
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{
                  width: `${(completedCount / track.lessons.length) * 100}%`,
                }}
              />
            </div>
          )}
      </button>

      {/* Placement test modal stub */}
      {showPlacementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
            <h2 className="font-bold text-lg text-gray-900">
              Test out of this track?
            </h2>
            <p className="text-gray-600 text-sm">
              Take a short placement test to unlock{" "}
              <strong>{track.title}</strong> without completing the previous
              tracks.
            </p>
            <button
              className="w-full rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 text-sm transition-colors"
              onClick={() => {
                // Full placement test flow is Sprint 3
                setShowPlacementModal(false);
              }}
            >
              Take placement test
            </button>
            <button
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPlacementModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

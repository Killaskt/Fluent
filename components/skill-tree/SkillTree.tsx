"use client";

import type { Track } from "@/types";
import TrackNode, { type NodeState } from "./TrackNode";

interface Props {
  tracks: Track[];
  completedLessons: string[];
}

function getNodeState(
  track: Track,
  completedLessons: string[],
  allTracks: Track[]
): NodeState {
  const completedInTrack = track.lessons.filter((l) =>
    completedLessons.includes(l)
  );

  if (completedInTrack.length === track.lessons.length && track.lessons.length > 0) {
    return "completed";
  }

  // Check prerequisites
  const prereqsMet = track.prerequisites.every((prereqId) => {
    const prereqTrack = allTracks.find((t) => t.id === prereqId);
    if (!prereqTrack) return true;
    return prereqTrack.lessons.every((l) => completedLessons.includes(l));
  });

  if (!prereqsMet) return "locked";

  return "unlocked";
}

export default function SkillTree({ tracks, completedLessons }: Props) {
  const sorted = [...tracks].sort((a, b) => a.order - b.order);

  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 -z-10" />

      <div className="flex flex-col gap-4 py-4">
        {sorted.map((track, idx) => {
          const nodeState = getNodeState(track, completedLessons, sorted);
          const completedCount = track.lessons.filter((l) =>
            completedLessons.includes(l)
          ).length;

          return (
            <div
              key={track.id}
              className={`relative ${idx % 2 === 0 ? "pr-8" : "pl-8"}`}
            >
              {/* Dot on the spine */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 z-10 ${
                  nodeState === "locked"
                    ? "bg-gray-200 border-gray-300"
                    : nodeState === "completed" || nodeState === "tested_out"
                      ? "bg-brand-500 border-brand-600"
                      : "bg-white border-brand-500"
                } ${idx % 2 === 0 ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"}`}
              />
              <TrackNode
                track={track}
                nodeState={nodeState}
                completedCount={completedCount}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

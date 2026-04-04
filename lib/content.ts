// Stub — real implementation built by Agent A.
// TypeScript is satisfied at compile time; the merge will replace this file.

import type { Lesson } from "@/types";

export interface Track {
  id: string;
  title: string;
  tier: "free" | "premium";
  order: number;
  prerequisites: string[];
  placement_test: PlacementTest | null;
  lessons: string[];
}

export interface PlacementTest {
  id: string;
  title: string;
}

export async function loadLesson(lessonId: string): Promise<Lesson | null> {
  // Replaced by Agent A's implementation when merged.
  void lessonId;
  return null;
}

export async function loadTrack(trackId: string): Promise<Track | null> {
  // Replaced by Agent A's implementation when merged.
  void trackId;
  return null;
}

export async function loadAllTracks(): Promise<Track[]> {
  return [];
}

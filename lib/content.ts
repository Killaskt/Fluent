import "server-only";

import * as fsp from "fs/promises";
import { join } from "path";

import type { Lesson, Track } from "@/types";

const CONTENT_DIR = join(process.cwd(), "content");

export async function loadLesson(id: string): Promise<Lesson> {
  const filePath = join(CONTENT_DIR, "lessons", `${id}.json`);
  let raw: string;
  try {
    raw = await fsp.readFile(filePath, "utf-8");
  } catch {
    throw new Error(`Lesson not found: ${id}`);
  }
  return JSON.parse(raw) as Lesson;
}

export async function loadTrack(id: string): Promise<Track> {
  const tracks = await getAllTracks();
  const track = tracks.find((t) => t.id === id);
  if (!track) {
    throw new Error(`Track not found: ${id}`);
  }
  return track;
}

export async function getAllTracks(): Promise<Track[]> {
  const filePath = join(CONTENT_DIR, "tracks.json");
  const raw = await fsp.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Track[];
}

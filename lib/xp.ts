import { createClient } from "@/lib/supabase/server";
import type { Badge } from "@/types";

// ── XP bonus values ──────────────────────────────────────────────────────────

const XP_FIRST_TRY_SUCCESS = 5;
const XP_PERFECT_LOCK_IT = 5;
const XP_MODULE_COMPLETE = 15;

export interface XpBonuses {
  firstTryItSuccess?: boolean;
  perfectLockIt?: boolean;
  moduleComplete?: boolean;
}

// Local type matching the user_progress Row — avoids relying on Supabase generic inference.
interface UserProgressRow {
  id: string;
  user_id: string;
  completed_lessons: string[];
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  earned_badges: string[];
  updated_at: string;
}

// ── Badge definitions ────────────────────────────────────────────────────────

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: "first-lesson",
    name: "First Step",
    description: "Complete your first lesson",
    icon: "🎯",
  },
  {
    id: "streak-3",
    name: "On a Roll",
    description: "Maintain a 3-day streak",
    icon: "🔥",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "⚡",
  },
  {
    id: "streak-30",
    name: "Habit Formed",
    description: "Maintain a 30-day streak",
    icon: "💪",
  },
  {
    id: "xp-100",
    name: "Century",
    description: "Earn 100 XP total",
    icon: "💯",
  },
  {
    id: "xp-500",
    name: "XP Grinder",
    description: "Earn 500 XP total",
    icon: "🏆",
  },
  {
    id: "perfect-lesson",
    name: "Perfect Score",
    description: "Complete a lesson with all bonuses",
    icon: "⭐",
  },
];

// ── awardXP ──────────────────────────────────────────────────────────────────

export async function awardXP(
  userId: string,
  lessonId: string,
  baseXp: number,
  bonuses: XpBonuses
): Promise<number> {
  let earned = baseXp;
  if (bonuses.firstTryItSuccess) earned += XP_FIRST_TRY_SUCCESS;
  if (bonuses.perfectLockIt) earned += XP_PERFECT_LOCK_IT;
  if (bonuses.moduleComplete) earned += XP_MODULE_COMPLETE;

  const supabase = await createClient();

  const { data: rawExisting } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  // Cast to known shape — Supabase generic inference produces `never` without __InternalSupabase
  const existing = rawExisting as UserProgressRow | null;

  const now = new Date().toISOString().split("T")[0];
  const completedLessons: string[] = existing?.completed_lessons ?? [];
  if (!completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
  }

  const newTotalXp = (existing?.total_xp ?? 0) + earned;

  const streakResult = calculateStreak(
    existing?.last_activity_date ?? null,
    existing?.current_streak ?? 0
  );

  const newStreak = streakResult.newStreak;
  const longestStreak = Math.max(existing?.longest_streak ?? 0, newStreak);

  const currentBadges: string[] = existing?.earned_badges ?? [];
  const newBadges = checkBadges(
    currentBadges,
    completedLessons.length,
    newTotalXp,
    newStreak,
    bonuses
  );

  const payload = {
    completed_lessons: completedLessons,
    total_xp: newTotalXp,
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_activity_date: now,
    earned_badges: newBadges,
    updated_at: new Date().toISOString(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = supabase.from("user_progress") as any;
  if (existing) {
    await table.update(payload).eq("user_id", userId);
  } else {
    await table.insert({ user_id: userId, ...payload });
  }

  return earned;
}

// ── calculateStreak ──────────────────────────────────────────────────────────

export function calculateStreak(
  lastActivityDate: string | null,
  currentStreak: number
): { newStreak: number; reset: boolean } {
  if (!lastActivityDate) {
    return { newStreak: 1, reset: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = new Date(lastActivityDate);
  last.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - last.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { newStreak: currentStreak, reset: false };
  }

  if (diffDays === 1) {
    return { newStreak: currentStreak + 1, reset: false };
  }

  return { newStreak: 1, reset: true };
}

// ── internal badge checker ───────────────────────────────────────────────────

function checkBadges(
  existing: string[],
  lessonsCompleted: number,
  totalXp: number,
  streak: number,
  bonuses: XpBonuses
): string[] {
  const earned = new Set(existing);

  if (lessonsCompleted >= 1) earned.add("first-lesson");
  if (streak >= 3) earned.add("streak-3");
  if (streak >= 7) earned.add("streak-7");
  if (streak >= 30) earned.add("streak-30");
  if (totalXp >= 100) earned.add("xp-100");
  if (totalXp >= 500) earned.add("xp-500");
  if (bonuses.firstTryItSuccess && bonuses.perfectLockIt) earned.add("perfect-lesson");

  return Array.from(earned);
}

// ── Lesson content types ────────────────────────────────────────────────────

export type StepType = "concept" | "see-it" | "try-it" | "lock-it";

export interface ConceptStep {
  type: "concept";
  body: string; // Markdown
  visual?: string; // Optional image URL or diagram description
}

export interface SeeItStep {
  type: "see-it";
  description: string;
  example: {
    prompt?: string;
    output?: string;
    caption?: string;
  };
}

export type TryItVariant =
  | "prompt-challenge"
  | "pick-best"
  | "spot-problem"
  | "match"
  | "mini-task";

export interface TryItStep {
  type: "try-it";
  variant: TryItVariant;
  instructions: string;
  // Variant-specific payload — kept loose here, narrowed in components
  payload: Record<string, unknown>;
}

export interface LockItStep {
  type: "lock-it";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type LessonStep = ConceptStep | SeeItStep | TryItStep | LockItStep;

export interface Lesson {
  id: string; // e.g. "qs-1", "f2-3", "ow-1-4"
  title: string;
  module: string; // e.g. "Quick-Start", "F2", "OW-1"
  xp: number;
  steps: LessonStep[];
  badgeOnComplete?: string; // Badge ID awarded on completion
}

// ── Gamification types ───────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
}

export interface UserProgress {
  userId: string;
  completedLessons: string[]; // lesson IDs
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null; // ISO date string
  earnedBadges: string[]; // badge IDs
}

// ── Supabase profile type ────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  waitlist: boolean;
  created_at: string;
}

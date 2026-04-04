// ── Lesson content types ────────────────────────────────────────────────────

export type StepType = "concept" | "see_it" | "try_it" | "lock_it";

export type TryItSubtype =
  | "prompt_challenge"
  | "pick_best"
  | "spot_problem"
  | "match_it"
  | "mini_task";

export interface ConceptStep {
  type: "concept";
  heading: string;
  body: string;
}

export interface SeeItStep {
  type: "see_it";
  heading: string;
  body: string;
  image_url: string | null;
  example: {
    label: string;
    content: string;
  };
}

export interface TryItStep {
  type: "try_it";
  subtype: TryItSubtype;
  heading: string;
  scenario: string;
  rubric: string;
  expert_prompt: string;
  max_attempts: number;
}

export interface LockItStep {
  type: "lock_it";
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export type LessonStep = ConceptStep | SeeItStep | TryItStep | LockItStep;

export interface Lesson {
  id: string;
  track_id: string;
  title: string;
  xp: number;
  steps: LessonStep[];
}

export interface PlacementTest {
  questions: LockItStep[];
  pass_threshold: number;
}

export interface Track {
  id: string;
  title: string;
  tier: "free" | "premium";
  order: number;
  prerequisites: string[];
  placement_test: PlacementTest | null;
  lessons: string[];
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

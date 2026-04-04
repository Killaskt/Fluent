export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllTracks } from "@/lib/content";
import StreakBadge from "@/components/gamification/StreakBadge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawProgress } = await (supabase.from("user_progress") as any)
    .select("*")
    .eq("user_id", user.id)
    .single() as { data: { completed_lessons: string[]; total_xp: number; current_streak: number } | null };

  const completedLessons: string[] = rawProgress?.completed_lessons ?? [];
  const totalXp = rawProgress?.total_xp ?? 0;
  const currentStreak = rawProgress?.current_streak ?? 0;

  // Find first incomplete lesson for "Continue Learning"
  const allTracks = await getAllTracks();
  const sorted = [...allTracks].sort((a, b) => a.order - b.order);
  let firstIncompleteLessonId: string | null = null;
  for (const track of sorted) {
    const incomplete = track.lessons.find((l) => !completedLessons.includes(l));
    if (incomplete) {
      firstIncompleteLessonId = incomplete;
      break;
    }
  }

  // Find the first track for skill tree link
  const firstTrack = sorted[0] ?? null;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fluent</h1>
            <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
          </div>
          <StreakBadge streak={currentStreak} />
        </div>

        {/* XP card */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-2xl">
            ⚡
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Total XP
            </p>
            <p className="text-3xl font-bold text-brand-600 tabular-nums">
              {totalXp}
            </p>
          </div>
        </div>

        {/* Continue learning */}
        {firstIncompleteLessonId ? (
          <a
            href={`/learn/${firstIncompleteLessonId}`}
            className="block w-full rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-center font-semibold py-4 text-base transition-colors"
          >
            Continue Learning →
          </a>
        ) : (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center">
            <p className="text-green-700 font-semibold">
              🎉 All lessons complete!
            </p>
          </div>
        )}

        {/* Skill tree link */}
        {firstTrack && (
          <a
            href={`/track/${firstTrack.id}`}
            className="block w-full rounded-2xl border-2 border-gray-200 hover:border-brand-300 text-gray-700 hover:text-brand-600 text-center font-semibold py-4 text-base transition-colors"
          >
            View Skill Tree →
          </a>
        )}
      </div>
    </main>
  );
}

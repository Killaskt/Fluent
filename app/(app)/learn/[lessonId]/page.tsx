export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadLesson, loadAllTracks } from "@/lib/content";
import LessonShell from "@/components/lesson/LessonShell";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const lesson = await loadLesson(lessonId);
  if (!lesson) notFound();

  // Fetch user progress for XP/streak display
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: progress } = await (supabase.from("user_progress") as any)
    .select("*")
    .eq("user_id", user.id)
    .single() as { data: { current_streak: number; total_xp: number } | null };

  // Determine next lesson id
  const allTracks = await loadAllTracks();
  let nextLessonId: string | null = null;

  outer: for (const track of allTracks) {
    const idx = track.lessons.indexOf(lessonId);
    if (idx !== -1) {
      if (idx + 1 < track.lessons.length) {
        nextLessonId = track.lessons[idx + 1];
      } else {
        // Find next track (sorted by order)
        const sorted = [...allTracks].sort((a, b) => a.order - b.order);
        const trackIdx = sorted.findIndex((t) => t.id === track.id);
        if (trackIdx !== -1 && trackIdx + 1 < sorted.length) {
          const nextTrack = sorted[trackIdx + 1];
          if (nextTrack.lessons.length > 0) {
            nextLessonId = nextTrack.lessons[0];
          }
        }
      }
      break outer;
    }
  }

  return (
    <LessonShell
      lesson={lesson}
      nextLessonId={nextLessonId}
      initialStreak={progress?.current_streak ?? 0}
      initialTotalXp={progress?.total_xp ?? 0}
    />
  );
}

export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadTrack, getAllTracks } from "@/lib/content";
import SkillTree from "@/components/skill-tree/SkillTree";

interface Props {
  params: Promise<{ trackId: string }>;
}

export default async function TrackPage({ params }: Props) {
  const { trackId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const track = await loadTrack(trackId);
  if (!track) notFound();

  const allTracks = await getAllTracks();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: progress } = await (supabase.from("user_progress") as any)
    .select("*")
    .eq("user_id", user.id)
    .single() as { data: { completed_lessons: string[] } | null };

  const completedLessons: string[] = progress?.completed_lessons ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <a
            href="/dashboard"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            ← Dashboard
          </a>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">
            {track.title}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {track.lessons.length} lessons ·{" "}
            {track.tier === "premium" ? "⭐ Premium" : "Free"}
          </p>
        </div>

        <SkillTree tracks={allTracks} completedLessons={completedLessons} />
      </div>
    </main>
  );
}

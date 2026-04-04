import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { awardXP, calculateStreak, type XpBonuses } from "@/lib/xp";

interface RequestBody {
  lessonId: string;
  baseXp: number;
  bonuses: XpBonuses;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { lessonId, baseXp, bonuses } = body;

  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }
  if (typeof baseXp !== "number") {
    return NextResponse.json({ error: "baseXp is required" }, { status: 400 });
  }

  try {
    const earned = await awardXP(user.id, lessonId, baseXp, bonuses ?? {});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated } = await (supabase.from("user_progress") as any)
      .select("*")
      .eq("user_id", user.id)
      .single() as {
        data: {
          total_xp: number;
          current_streak: number;
          last_activity_date: string | null;
        } | null;
      };

    const streak = updated
      ? calculateStreak(updated.last_activity_date, updated.current_streak).newStreak
      : 1;

    return NextResponse.json({
      earned,
      totalXp: updated?.total_xp ?? earned,
      streak,
    });
  } catch (err) {
    console.error("[award-xp] error:", err);
    return NextResponse.json({ error: "Failed to award XP" }, { status: 500 });
  }
}

import { calculateStreak, awardXP, BADGE_DEFINITIONS } from "@/lib/xp";

// ── calculateStreak ──────────────────────────────────────────────────────────

describe("calculateStreak", () => {
  function isoDate(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  }

  it("returns streak 1 when lastActivityDate is null", () => {
    const result = calculateStreak(null, 0);
    expect(result).toEqual({ newStreak: 1, reset: false });
  });

  it("increments streak when last activity was yesterday", () => {
    const result = calculateStreak(isoDate(1), 5);
    expect(result).toEqual({ newStreak: 6, reset: false });
  });

  it("keeps streak unchanged when last activity was today", () => {
    const result = calculateStreak(isoDate(0), 5);
    expect(result).toEqual({ newStreak: 5, reset: false });
  });

  it("resets streak to 1 when last activity was 2 days ago", () => {
    const result = calculateStreak(isoDate(2), 10);
    expect(result).toEqual({ newStreak: 1, reset: true });
  });

  it("resets streak to 1 when last activity was far in the past", () => {
    const result = calculateStreak("2020-01-01", 100);
    expect(result).toEqual({ newStreak: 1, reset: true });
  });
});

// ── BADGE_DEFINITIONS ────────────────────────────────────────────────────────

describe("BADGE_DEFINITIONS", () => {
  it("is a non-empty array", () => {
    expect(BADGE_DEFINITIONS.length).toBeGreaterThan(0);
  });

  it("every badge has id, name, description, and icon", () => {
    for (const badge of BADGE_DEFINITIONS) {
      expect(typeof badge.id).toBe("string");
      expect(typeof badge.name).toBe("string");
      expect(typeof badge.description).toBe("string");
      expect(typeof badge.icon).toBe("string");
    }
  });

  it("badge ids are unique", () => {
    const ids = BADGE_DEFINITIONS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── awardXP ──────────────────────────────────────────────────────────────────

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

import { createClient } from "@/lib/supabase/server";

describe("awardXP", () => {
  const mockSingle = jest.fn();
  const mockUpdate = jest.fn().mockReturnValue({ error: null });
  const mockInsert = jest.fn().mockReturnValue({ error: null });
  const mockSelect = jest.fn();
  const mockEq = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSingle.mockResolvedValue({
      data: {
        total_xp: 50,
        completed_lessons: [],
        current_streak: 3,
        longest_streak: 3,
        last_activity_date: new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0], // yesterday
        earned_badges: [],
      },
    });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSelect.mockReturnValue({ eq: mockEq });

    (createClient as jest.Mock).mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: mockSelect,
        update: mockUpdate,
        insert: mockInsert,
        eq: mockEq,
      }),
    });

    // Make update chain work
    mockUpdate.mockReturnValue({ eq: jest.fn().mockResolvedValue({}) });
  });

  it("returns base XP when no bonuses", async () => {
    const earned = await awardXP("user-1", "lesson-1", 10, {});
    expect(earned).toBe(10);
  });

  it("adds firstTryItSuccess bonus", async () => {
    const earned = await awardXP("user-1", "lesson-1", 10, {
      firstTryItSuccess: true,
    });
    expect(earned).toBe(15);
  });

  it("adds perfectLockIt bonus", async () => {
    const earned = await awardXP("user-1", "lesson-1", 10, {
      perfectLockIt: true,
    });
    expect(earned).toBe(15);
  });

  it("adds moduleComplete bonus", async () => {
    const earned = await awardXP("user-1", "lesson-1", 10, {
      moduleComplete: true,
    });
    expect(earned).toBe(25);
  });

  it("stacks all bonuses", async () => {
    const earned = await awardXP("user-1", "lesson-1", 10, {
      firstTryItSuccess: true,
      perfectLockIt: true,
      moduleComplete: true,
    });
    expect(earned).toBe(35);
  });
});

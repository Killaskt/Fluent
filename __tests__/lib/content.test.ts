// Mock server-only so it doesn't throw in the Jest (non-server) environment
jest.mock("server-only", () => ({}), { virtual: true });

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { loadLesson, loadTrack, getAllTracks } = require("@/lib/content");

describe("loadLesson", () => {
  it("returns the correct shape for a valid lesson id", async () => {
    const result = await loadLesson("qs-1");

    expect(result.id).toBe("qs-1");
    expect(result.track_id).toBe("quick-start-office");
    expect(typeof result.title).toBe("string");
    expect(typeof result.xp).toBe("number");
    expect(result.xp).toBeGreaterThan(0);
    expect(Array.isArray(result.steps)).toBe(true);
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.steps[0].type).toBe("concept");
  });

  it("throws for an id with no corresponding file", async () => {
    await expect(loadLesson("lesson-that-does-not-exist")).rejects.toThrow(
      "Lesson not found: lesson-that-does-not-exist"
    );
  });
});

describe("loadTrack", () => {
  it("returns the correct track for a valid id", async () => {
    const result = await loadTrack("quick-start-office");

    expect(result.id).toBe("quick-start-office");
    expect(result.tier).toBe("free");
    expect(Array.isArray(result.lessons)).toBe(true);
    expect(result.lessons).toContain("qs-1");
  });

  it("throws for an id that does not match any track", async () => {
    await expect(loadTrack("track-that-does-not-exist")).rejects.toThrow(
      "Track not found: track-that-does-not-exist"
    );
  });
});

describe("getAllTracks", () => {
  it("returns an array of tracks with the expected shape", async () => {
    const result = await getAllTracks();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    const first = result[0];
    expect(typeof first.id).toBe("string");
    expect(typeof first.title).toBe("string");
    expect(["free", "premium"]).toContain(first.tier);
    expect(typeof first.order).toBe("number");
    expect(Array.isArray(first.prerequisites)).toBe(true);
    expect(Array.isArray(first.lessons)).toBe(true);
  });
});

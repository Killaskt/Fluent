import { scorePrompt } from "@/lib/claude";

// Mock the Anthropic SDK
jest.mock("@anthropic-ai/sdk", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import Anthropic from "@anthropic-ai/sdk";

const MockedAnthropic = Anthropic as unknown as jest.Mock;

function makeCreateMock(responseText: string) {
  const createFn = jest.fn().mockResolvedValue({
    content: [{ type: "text", text: responseText }],
  });
  MockedAnthropic.mockImplementation(() => ({
    messages: { create: createFn },
  }));
  return createFn;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("scorePrompt", () => {
  it("returns passed=true when score >= 0.7", async () => {
    makeCreateMock(JSON.stringify({ score: 0.85, feedback: "Great job!" }));

    const result = await scorePrompt("Write a haiku", "Check for haiku structure");
    expect(result.passed).toBe(true);
    expect(result.score).toBe(0.85);
    expect(result.feedback).toBe("Great job!");
  });

  it("returns passed=false when score < 0.7", async () => {
    makeCreateMock(JSON.stringify({ score: 0.5, feedback: "Needs work" }));

    const result = await scorePrompt("bad prompt", "detailed rubric");
    expect(result.passed).toBe(false);
    expect(result.score).toBe(0.5);
  });

  it("returns passed=true exactly at 0.7 threshold", async () => {
    makeCreateMock(JSON.stringify({ score: 0.7, feedback: "Just enough" }));

    const result = await scorePrompt("prompt", "rubric");
    expect(result.passed).toBe(true);
  });

  it("throws when Claude returns invalid JSON", async () => {
    makeCreateMock("not json at all");

    await expect(scorePrompt("prompt", "rubric")).rejects.toThrow(
      "Claude returned invalid JSON"
    );
  });

  it("throws when response is missing required fields", async () => {
    makeCreateMock(JSON.stringify({ score: 0.8 })); // missing feedback

    await expect(scorePrompt("prompt", "rubric")).rejects.toThrow(
      "Claude response missing required fields"
    );
  });

  it("sends the rubric as system prompt content", async () => {
    const createFn = makeCreateMock(
      JSON.stringify({ score: 0.9, feedback: "Perfect" })
    );

    await scorePrompt("my prompt", "my rubric text");

    expect(createFn).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringContaining("my rubric text"),
        messages: [{ role: "user", content: "my prompt" }],
      })
    );
  });
});

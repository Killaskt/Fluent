// Tests for parseScoreResponse are written against real response shapes —
// no SDK mock, no guessing. Fixtures below reflect actual Claude output.
// If Claude's format changes, update fixtures first, then fix the code.
//
// scorePrompt() (the API call itself) is not unit tested here because
// mocking the SDK means asserting our own assumptions. Integration tests
// against the real API belong in a separate suite run with ANTHROPIC_API_KEY.

import { parseScoreResponse } from "@/lib/score-parser";

describe("parseScoreResponse", () => {
  describe("clean JSON (ideal response)", () => {
    it("passes when score >= 0.7", () => {
      const result = parseScoreResponse(
        '{"score": 0.8, "feedback": "Good context and tone specified."}'
      );
      expect(result.score).toBe(0.8);
      expect(result.passed).toBe(true);
      expect(result.feedback).toBe("Good context and tone specified.");
    });

    it("fails when score < 0.7", () => {
      const result = parseScoreResponse(
        '{"score": 0.4, "feedback": "Too vague — try adding the desired tone."}'
      );
      expect(result.passed).toBe(false);
    });

    it("passes exactly at the 0.7 threshold", () => {
      const result = parseScoreResponse(
        '{"score": 0.7, "feedback": "Meets the bar."}'
      );
      expect(result.passed).toBe(true);
    });
  });

  describe("markdown fence responses (Claude ignores no-fence instruction)", () => {
    it("strips ```json ... ``` fences", () => {
      // Real Claude response shape when it wraps JSON in fences
      const raw = '```json\n{"score": 0.9, "feedback": "Excellent detail."}\n```';
      const result = parseScoreResponse(raw);
      expect(result.score).toBe(0.9);
      expect(result.passed).toBe(true);
    });

    it("strips plain ``` fences without language tag", () => {
      const raw = '```\n{"score": 0.5, "feedback": "Missing tone."}\n```';
      const result = parseScoreResponse(raw);
      expect(result.score).toBe(0.5);
      expect(result.passed).toBe(false);
    });

    it("handles fences with trailing whitespace", () => {
      const raw = '```json  \n{"score": 0.8, "feedback": "Good."}\n```  ';
      expect(parseScoreResponse(raw).score).toBe(0.8);
    });
  });

  describe("malformed responses", () => {
    it("throws with snippet when response is not JSON", () => {
      expect(() => parseScoreResponse("not json at all")).toThrow(
        "Invalid JSON from scorer: not json at all"
      );
    });

    it("throws when score field is missing", () => {
      expect(() =>
        parseScoreResponse('{"feedback": "Good job."}')
      ).toThrow("missing required fields");
    });

    it("throws when feedback field is missing", () => {
      expect(() => parseScoreResponse('{"score": 0.8}')).toThrow(
        "missing required fields"
      );
    });

    it("throws when score is a string instead of number", () => {
      expect(() =>
        parseScoreResponse('{"score": "0.8", "feedback": "Good."}')
      ).toThrow("missing required fields");
    });
  });
});

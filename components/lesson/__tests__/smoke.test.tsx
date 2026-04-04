import { render, screen } from "@testing-library/react";
import ConceptStep from "@/components/lesson/ConceptStep";
import SeeItStep from "@/components/lesson/SeeItStep";
import TryItStep from "@/components/lesson/TryItStep";
import type { ConceptStep as ConceptStepType, SeeItStep as SeeItStepType, TryItStep as TryItStepType } from "@/types";

describe("ConceptStep", () => {
  it("renders without crashing", () => {
    const step: ConceptStepType = {
      type: "concept",
      body: "AI can help you write emails faster.",
    };
    render(<ConceptStep step={step} onContinue={jest.fn()} />);
    expect(screen.getByText(step.body)).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("shows visual image when provided", () => {
    const step: ConceptStepType = {
      type: "concept",
      body: "Learn about AI.",
      visual: "https://example.com/image.png",
    };
    render(<ConceptStep step={step} onContinue={jest.fn()} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});

describe("SeeItStep", () => {
  it("renders without crashing", () => {
    const step: SeeItStepType = {
      type: "see-it",
      description: "Here is an example prompt and response.",
      example: {
        prompt: "Write an email",
        output: "Dear team…",
        caption: "Notice the clear structure",
      },
    };
    render(<SeeItStep step={step} onContinue={jest.fn()} />);
    expect(screen.getByText(step.description)).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });
});

describe("TryItStep", () => {
  it("renders without crashing", () => {
    const step: TryItStepType = {
      type: "try-it",
      variant: "prompt-challenge",
      instructions: "Write a prompt to summarise a document.",
      payload: {
        rubric: "Check for clarity and specificity",
        expert_prompt: "Please summarise the following document clearly.",
        max_attempts: 3,
      },
    };
    render(
      <TryItStep step={step} lessonId="test-lesson" onComplete={jest.fn()} />
    );
    expect(screen.getByText(step.instructions)).toBeInTheDocument();
    expect(screen.getByLabelText("Write your prompt")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import ConceptStep from "@/components/lesson/ConceptStep";
import SeeItStep from "@/components/lesson/SeeItStep";
import TryItStep from "@/components/lesson/TryItStep";
import type {
  ConceptStep as ConceptStepType,
  SeeItStep as SeeItStepType,
  TryItStep as TryItStepType,
} from "@/types";

describe("ConceptStep", () => {
  it("renders without crashing", () => {
    const step: ConceptStepType = {
      type: "concept",
      heading: "The 30-second trick",
      body: "AI can help you write emails faster.",
    };
    render(<ConceptStep step={step} onContinue={jest.fn()} />);
    expect(screen.getByText(step.body)).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });
});

describe("SeeItStep", () => {
  it("renders without crashing", () => {
    const step: SeeItStepType = {
      type: "see_it",
      heading: "Here's what that looks like",
      body: "Here is an example prompt and response.",
      image_url: null,
      example: {
        label: "The prompt used:",
        content: "Write a professional reply declining this request.",
      },
    };
    render(<SeeItStep step={step} onContinue={jest.fn()} />);
    expect(screen.getByText(step.body)).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });
});

describe("TryItStep", () => {
  it("renders without crashing", () => {
    const step: TryItStepType = {
      type: "try_it",
      subtype: "prompt_challenge",
      heading: "Your turn",
      scenario: "Write a prompt to summarise a document.",
      rubric: "Check for clarity and specificity",
      expert_prompt: "Please summarise the following document clearly.",
      max_attempts: 2,
    };
    render(
      <TryItStep step={step} lessonId="test-lesson" onComplete={jest.fn()} />
    );
    expect(screen.getByText(step.scenario)).toBeInTheDocument();
    expect(screen.getByLabelText("Write your prompt")).toBeInTheDocument();
  });
});

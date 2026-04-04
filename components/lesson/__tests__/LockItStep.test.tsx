import { render, screen, fireEvent } from "@testing-library/react";
import LockItStep from "@/components/lesson/LockItStep";
import type { LockItStep as LockItStepType } from "@/types";

const step: LockItStepType = {
  type: "lock-it",
  question: "Which is the best practice?",
  options: ["Option A", "Option B", "Option C"],
  correctIndex: 1,
  explanation: "Option B is correct because it follows best practices.",
};

describe("LockItStep", () => {
  it("renders the question and all options", () => {
    render(<LockItStep step={step} onComplete={jest.fn()} />);
    expect(screen.getByText(step.question)).toBeInTheDocument();
    step.options.forEach((o) => {
      expect(screen.getByText(o)).toBeInTheDocument();
    });
  });

  it("shows correct feedback and Continue when the correct option is selected", () => {
    const onComplete = jest.fn();
    render(<LockItStep step={step} onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Option B"));

    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(
      screen.getByText(step.explanation, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("calls onComplete(true) when correct option is chosen", () => {
    const onComplete = jest.fn();
    render(<LockItStep step={step} onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Option B"));
    fireEvent.click(screen.getByText("Continue"));

    expect(onComplete).toHaveBeenCalledWith(true);
  });

  it("shows 'not quite' feedback on first wrong selection", () => {
    render(<LockItStep step={step} onComplete={jest.fn()} />);

    fireEvent.click(screen.getByText("Option A"));

    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
    expect(screen.queryByText("Continue")).not.toBeInTheDocument();
  });

  it("reveals correct answer after second wrong selection", () => {
    const onComplete = jest.fn();
    render(<LockItStep step={step} onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Option A")); // first wrong
    fireEvent.click(screen.getByText("Option C")); // second wrong

    expect(screen.getByText(/here's the correct answer/i)).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("calls onComplete(false) after two wrong selections", () => {
    const onComplete = jest.fn();
    render(<LockItStep step={step} onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Option A"));
    fireEvent.click(screen.getByText("Option C"));
    fireEvent.click(screen.getByText("Continue"));

    expect(onComplete).toHaveBeenCalledWith(false);
  });

  it("does not allow further clicks after correct answer", () => {
    const onComplete = jest.fn();
    render(<LockItStep step={step} onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Option B")); // correct

    // Clicking another option should not call onComplete a second time before Continue
    fireEvent.click(screen.getByText("Option A"));
    expect(screen.getByText("Continue")).toBeInTheDocument(); // still showing continue
  });
});

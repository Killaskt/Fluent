import { render, screen } from "@testing-library/react";
import StreakBadge from "@/components/gamification/StreakBadge";

describe("StreakBadge", () => {
  it("renders streak count", () => {
    render(<StreakBadge streak={7} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(<StreakBadge streak={7} />);
    expect(screen.getByLabelText("7-day streak")).toBeInTheDocument();
  });

  it("renders streak of 0 without crashing", () => {
    render(<StreakBadge streak={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

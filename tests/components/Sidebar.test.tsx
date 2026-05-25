import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../utils/test-utils";
import { Sidebar } from "../../src/components/layout/Sidebar";
import type { View } from "../../src/types";

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders navigation items", () => {
    const mockOnViewChange = vi.fn();
    render(<Sidebar currentView="dashboard" onViewChange={mockOnViewChange} />);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Nutrition/i)).toBeInTheDocument();
  });

  it("calls onViewChange when clicking a nav item", () => {
    const mockOnViewChange = vi.fn();
    render(<Sidebar currentView="dashboard" onViewChange={mockOnViewChange} />);

    const activityButton = screen.getByText(/Activity/i);
    activityButton.click();

    expect(mockOnViewChange).toHaveBeenCalledWith("activity");
  });
});
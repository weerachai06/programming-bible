import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Counter from "./Counter";

/**
 * Test suite for Counter component.
 *
 * @fileoverview Tests for the Counter component functionality
 * @since 1.0.0
 */
describe("Counter Component", () => {
  /**
   * Test default rendering behavior.
   */
  it("renders with default initial value", () => {
    render(<Counter />);

    expect(screen.getByTestId("counter-value")).toHaveTextContent("0");
    expect(screen.getByText("Counter")).toBeInTheDocument();
    expect(screen.getByText("Step: 1 | Initial: 0")).toBeInTheDocument();
  });

  /**
   * Test custom initial value rendering.
   */
  it("renders with custom initial value", () => {
    render(<Counter initialValue={10} />);

    expect(screen.getByTestId("counter-value")).toHaveTextContent("10");
    expect(screen.getByText("Step: 1 | Initial: 10")).toBeInTheDocument();
  });

  /**
   * Test increment functionality.
   */
  it("increments counter when + button is clicked", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementBtn = screen.getByTestId("increment-btn");
    await user.click(incrementBtn);

    expect(screen.getByTestId("counter-value")).toHaveTextContent("1");
  });

  /**
   * Test decrement functionality.
   */
  it("decrements counter when - button is clicked", async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={5} />);

    const decrementBtn = screen.getByTestId("decrement-btn");
    await user.click(decrementBtn);

    expect(screen.getByTestId("counter-value")).toHaveTextContent("4");
  });

  /**
   * Test reset functionality.
   */
  it("resets counter to initial value when reset button is clicked", async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={10} />);

    // Change the value first
    const incrementBtn = screen.getByTestId("increment-btn");
    await user.click(incrementBtn);
    expect(screen.getByTestId("counter-value")).toHaveTextContent("11");

    // Then reset
    const resetBtn = screen.getByTestId("reset-btn");
    await user.click(resetBtn);
    expect(screen.getByTestId("counter-value")).toHaveTextContent("10");
  });

  /**
   * Test custom step functionality.
   */
  it("works with custom step value", async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={0} step={5} />);

    const incrementBtn = screen.getByTestId("increment-btn");
    await user.click(incrementBtn);

    expect(screen.getByTestId("counter-value")).toHaveTextContent("5");

    const decrementBtn = screen.getByTestId("decrement-btn");
    await user.click(decrementBtn);
    await user.click(decrementBtn);

    expect(screen.getByTestId("counter-value")).toHaveTextContent("-5");
    expect(screen.getByText("Step: 5 | Initial: 0")).toBeInTheDocument();
  });

  /**
   * Test button labels and accessibility.
   */
  it("has correct button labels and types", () => {
    render(<Counter />);

    const incrementBtn = screen.getByTestId("increment-btn");
    const decrementBtn = screen.getByTestId("decrement-btn");
    const resetBtn = screen.getByTestId("reset-btn");

    expect(incrementBtn).toHaveTextContent("+");
    expect(decrementBtn).toHaveTextContent("-");
    expect(resetBtn).toHaveTextContent("Reset");

    // Check button types
    expect(incrementBtn).toHaveAttribute("type", "button");
    expect(decrementBtn).toHaveAttribute("type", "button");
    expect(resetBtn).toHaveAttribute("type", "button");
  });

  /**
   * Test multiple clicks behavior.
   */
  it("handles multiple clicks correctly", async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={0} step={2} />);

    const incrementBtn = screen.getByTestId("increment-btn");

    // Click increment 3 times
    await user.click(incrementBtn);
    await user.click(incrementBtn);
    await user.click(incrementBtn);

    expect(screen.getByTestId("counter-value")).toHaveTextContent("6");
  });

  /**
   * Test negative values behavior.
   */
  it("can handle negative values", async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={0} />);

    const decrementBtn = screen.getByTestId("decrement-btn");

    // Click decrement to go negative
    await user.click(decrementBtn);
    await user.click(decrementBtn);

    expect(screen.getByTestId("counter-value")).toHaveTextContent("-2");
  });
});

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

/**
 * Test suite for Switch component.
 *
 * @fileoverview Tests for the Switch component functionality
 * @since 1.0.0
 */
describe("Switch Component", () => {
  /**
   * Test default rendering behavior.
   */
  it("renders with default unchecked state", () => {
    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute("data-state", "unchecked");
    expect(switchElement).toHaveAttribute("role", "switch");
    expect(switchElement).toHaveAttribute("aria-checked", "false");
  });

  /**
   * Test checked state rendering.
   */
  it("renders with checked state when defaultChecked is true", () => {
    render(<Switch data-testid="switch" defaultChecked />);

    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toHaveAttribute("data-state", "checked");
    expect(switchElement).toHaveAttribute("aria-checked", "true");
  });

  /**
   * Test controlled checked state.
   */
  it("renders with controlled checked state", () => {
    render(<Switch data-testid="switch" checked />);

    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toHaveAttribute("data-state", "checked");
    expect(switchElement).toHaveAttribute("aria-checked", "true");
  });

  /**
   * Test toggle functionality.
   */
  it("toggles state when clicked", async () => {
    const user = userEvent.setup();
    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId("switch");

    // Initial state should be unchecked
    expect(switchElement).toHaveAttribute("data-state", "unchecked");

    // Click to toggle
    await user.click(switchElement);
    expect(switchElement).toHaveAttribute("data-state", "checked");

    // Click to toggle back
    await user.click(switchElement);
    expect(switchElement).toHaveAttribute("data-state", "unchecked");
  });

  /**
   * Test onCheckedChange callback.
   */
  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch data-testid="switch" onCheckedChange={onCheckedChange} />);

    const switchElement = screen.getByTestId("switch");
    await user.click(switchElement);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  /**
   * Test disabled state.
   */
  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        data-testid="switch"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toBeDisabled();

    await user.click(switchElement);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(switchElement).toHaveAttribute("data-state", "unchecked");
  });

  /**
   * Test keyboard navigation.
   */
  it("toggles with space key", async () => {
    const user = userEvent.setup();
    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId("switch");
    switchElement.focus();

    // Press space to toggle
    await user.keyboard(" ");
    expect(switchElement).toHaveAttribute("data-state", "checked");
  });

  /**
   * Test keyboard navigation with enter key.
   */
  it("toggles with enter key", async () => {
    const user = userEvent.setup();
    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId("switch");
    switchElement.focus();

    // Press enter to toggle
    await user.keyboard("{Enter}");
    expect(switchElement).toHaveAttribute("data-state", "checked");
  });

  /**
   * Test custom className.
   */
  it("applies custom className", () => {
    render(<Switch data-testid="switch" className="custom-class" />);

    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toHaveClass("custom-class");
  });

  /**
   * Test switch thumb element.
   */
  it("renders switch thumb element", () => {
    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId("switch");
    const thumbElement = switchElement.querySelector(
      '[data-slot="switch-thumb"]',
    );

    expect(thumbElement).toBeInTheDocument();
  });

  /**
   * Test focus behavior.
   */
  it("is focusable and has correct focus attributes", () => {
    render(<Switch data-testid="switch" />);

    const switchElement = screen.getByTestId("switch");
    switchElement.focus();

    expect(switchElement).toHaveFocus();
    expect(switchElement).toHaveAttribute("tabindex", "0");
  });

  /**
   * Test disabled focus behavior.
   */
  it("is not focusable when disabled", () => {
    render(<Switch data-testid="switch" disabled />);

    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toHaveAttribute("tabindex", "-1");
  });

  /**
   * Test name and value attributes.
   */
  it("passes through name and value attributes", () => {
    render(<Switch data-testid="switch" name="test-switch" value="on" />);

    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toHaveAttribute("name", "test-switch");
    expect(switchElement).toHaveAttribute("value", "on");
  });

  /**
   * Test controlled component behavior.
   */
  it("works as controlled component", async () => {
    const user = userEvent.setup();
    let checked = false;
    const onCheckedChange = vi.fn((newChecked: boolean) => {
      checked = newChecked;
    });

    const { rerender } = render(
      <Switch
        data-testid="switch"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />,
    );

    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toHaveAttribute("data-state", "unchecked");

    await user.click(switchElement);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    // Rerender with new checked state
    rerender(
      <Switch
        data-testid="switch"
        checked={true}
        onCheckedChange={onCheckedChange}
      />,
    );

    expect(switchElement).toHaveAttribute("data-state", "checked");
  });
});

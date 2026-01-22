import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./label";

/**
 * Test suite for Label component.
 *
 * @fileoverview Tests for the Label component functionality
 * @since 1.0.0
 */
describe("Label Component", () => {
  /**
   * Test default rendering behavior.
   */
  it("renders with default classes and attributes", () => {
    render(<Label>Test Label</Label>);

    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("data-slot", "label");
    expect(label).toHaveClass(
      "flex",
      "items-center",
      "gap-2",
      "text-sm",
      "leading-none",
      "font-medium",
      "select-none"
    );
  });

  /**
   * Test custom className merging.
   */
  it("merges custom className with default classes", () => {
    render(<Label className="custom-class text-lg">Custom Label</Label>);

    const label = screen.getByText("Custom Label");
    expect(label).toHaveClass("custom-class", "text-lg");
    expect(label).toHaveClass("flex", "items-center", "gap-2");
  });

  /**
   * Test htmlFor attribute.
   */
  it("accepts htmlFor attribute", () => {
    render(<Label htmlFor="test-input">Label for input</Label>);

    const label = screen.getByText("Label for input");
    expect(label).toHaveAttribute("for", "test-input");
  });

  /**
   * Test with associated input.
   */
  it("works with associated input element", () => {
    render(
      <div>
        <Label htmlFor="email">Email Address</Label>
        <input id="email" type="email" />
      </div>
    );

    const label = screen.getByText("Email Address");
    const input = screen.getByRole("textbox");
    
    expect(label).toHaveAttribute("for", "email");
    expect(input).toHaveAttribute("id", "email");
  });

  /**
   * Test disabled state classes.
   */
  it("applies disabled styles when in disabled group", () => {
    render(
      <div data-disabled="true">
        <Label>Disabled Label</Label>
      </div>
    );

    const label = screen.getByText("Disabled Label");
    expect(label).toHaveClass(
      "group-data-[disabled=true]:pointer-events-none",
      "group-data-[disabled=true]:opacity-50"
    );
  });

  /**
   * Test peer-disabled classes.
   */
  it("applies peer-disabled styles", () => {
    render(<Label>Peer Disabled Label</Label>);

    const label = screen.getByText("Peer Disabled Label");
    expect(label).toHaveClass(
      "peer-disabled:cursor-not-allowed",
      "peer-disabled:opacity-50"
    );
  });

  /**
   * Test with children elements.
   */
  it("renders with complex children", () => {
    render(
      <Label>
        <span>Required</span>
        <span className="text-red-500">*</span>
      </Label>
    );

    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("*")).toHaveClass("text-red-500");
  });

  /**
   * Test additional props forwarding.
   */
  it("forwards additional props to root element", () => {
    render(
      <Label data-testid="test-label" aria-describedby="description">
        Accessible Label
      </Label>
    );

    const label = screen.getByTestId("test-label");
    expect(label).toHaveAttribute("aria-describedby", "description");
  });

  /**
   * Test as different element types.
   */
  it("can be rendered as different element types", () => {
    render(<Label asChild><legend>Form Legend</legend></Label>);

    const legend = screen.getByText("Form Legend");
    expect(legend.tagName).toBe("LEGEND");
    expect(legend).toHaveClass("flex", "items-center", "gap-2");
  });

  /**
   * Test empty label.
   */
  it("renders without children", () => {
    render(<Label data-testid="empty-label" />);

    const label = screen.getByTestId("empty-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("data-slot", "label");
  });
});
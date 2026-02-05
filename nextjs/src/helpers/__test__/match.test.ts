import { describe, expect, test } from "vitest";
import { match, P } from "../match";

describe("match", () => {
  test("should match literal values", () => {
    const result = match("hello")
      .with("hello", () => "world")
      .with("hi", () => "there")
      .otherwise(() => "nothing");

    expect(result).toBe("world");
  });

  test("should match using P.string", () => {
    const result = match("hello")
      .with(P.string, (val) => `prefix_${val}`)
      .otherwise(() => "not a string");

    expect(result).toBe("prefix_hello");
  });

  test("should match using P.number", () => {
    const result = match(42)
      .with(P.number, (val) => val * 2)
      .otherwise(() => 0);

    expect(result).toBe(84);
  });

  test("should match using P.boolean", () => {
    const result = match(true)
      .with(P.boolean, (val) => !val)
      .otherwise(() => false);

    expect(result).toBe(false);
  });

  test("should match using P.nullish", () => {
    const result1 = match(null)
      .with(P.nullish, () => "is nullish")
      .otherwise(() => "not nullish");

    const result2 = match(undefined)
      .with(P.nullish, () => "is nullish")
      .otherwise(() => "not nullish");

    expect(result1).toBe("is nullish");
    expect(result2).toBe("is nullish");
  });

  test("should match objects deep", () => {
    const result = match({ a: 1, b: { c: "hello" } })
      .with({ a: 1, b: { c: "hello" } }, () => "match")
      .otherwise(() => "no match");

    expect(result).toBe("match");
  });

  test("should match objects partially", () => {
    const result = match({ a: 1, b: 2, c: 3 })
      .with({ a: 1, b: 2 }, () => "partial")
      .otherwise(() => "no match");

    expect(result).toBe("partial");
  });

  test("should match using P.array", () => {
    const result = match([1, 2, 3])
      .with(P.array(P.number), (arr) => arr.length)
      .otherwise(() => 0);

    expect(result).toBe(3);
  });

  test("should use otherwise when no match", () => {
    const result = match(10)
      .with(1, () => "one")
      .otherwise(() => "other");

    expect(result).toBe("other");
  });

  test("should throw error on run() if no match", () => {
    expect(() => {
      match(10)
        .with(1, () => "one")
        .exhaustive();
    }).toThrow("Unmatched value in match function");
  });

  test("should correctly infer return type from multiple cases", () => {
    const result = match<number | string>(10)
      .with(P.number, () => "test is a number")
      .with(P.string, () => 123)
      .otherwise(() => null);

    // Type should be string | number | null
    const val: string | number | null = result;
    expect(val).toBe("test is a number");
  });

  test("should narrow union types", () => {
    type Shape =
      | { type: "circle"; radius: number }
      | { type: "square"; side: number };
    const shape = { type: "circle", radius: 10 } as Shape;

    const result = match(shape)
      .with({ type: "circle" }, (s) => {
        // s should be narrowed to { type: 'circle', radius: number }
        return s.radius * Math.PI;
      })
      .with({ type: "square" }, (s) => {
        // s should be narrowed to { type: 'square', side: number }
        return s.side * s.side;
      })
      .exhaustive();

    expect(result).toBeCloseTo(31.4159);
  });

  test("should narrow using P.string on union", () => {
    const val: string | number = "hello";
    const result = match(val)
      .with(P.string, (s) => s.toUpperCase())
      .with(P.number, (n) => n.toFixed(2))
      .exhaustive();

    expect(result).toBe("HELLO");
  });
});

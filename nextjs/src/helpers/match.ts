/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pattern matching utility inspired by ts-pattern.
 * Provides a type-safe way to handle different cases for a value.
 */

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace P {
  export const string = (val: any): val is string => typeof val === 'string'
  export const number = (val: any): val is number => typeof val === 'number'
  export const boolean = (val: any): val is boolean => typeof val === 'boolean'
  export const nullish = (val: any): val is null | undefined =>
    val === null || val === undefined
  export const any = (_val: any): _val is any => true

  export const array = <T>(pattern: (val: any) => val is T) => {
    return (val: any): val is T[] => Array.isArray(val) && val.every(pattern)
  }

  export const optional = <T>(pattern: (val: any) => val is T) => {
    return (val: any): val is T | undefined | null =>
      val === null || val === undefined || pattern(val)
  }
}

/**
 * Type utility to narrow T based on Pattern P
 */
type Narrow<T, P> = P extends (val: any) => val is infer U
  ? U
  : [Extract<T, P>] extends [never]
    ? T & P
    : Extract<T, P>

type Pattern<T> =
  | T
  | ((val: any) => val is any)
  | (T extends object ? { [K in keyof T]?: any } : any)

function isPatternFunc<T>(pattern: any): pattern is (val: any) => val is T {
  return typeof pattern === 'function'
}

function matches<T>(value: any, pattern: Pattern<T>): boolean {
  if (isPatternFunc(pattern)) {
    return pattern(value)
  }

  if (value === pattern) {
    return true
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    typeof pattern === 'object' &&
    pattern !== null
  ) {
    return Object.entries(pattern).every(([key, subPattern]) => {
      return matches((value as any)[key], subPattern as any)
    })
  }

  return false
}

interface Matcher<TInput, TOutput = never> {
  with<TPattern extends Pattern<TInput>, TResult>(
    pattern: TPattern,
    handler: (value: Narrow<TInput, TPattern>) => TResult,
  ): Matcher<TInput, TOutput | TResult>
  otherwise<TResult>(handler: (value: TInput) => TResult): TOutput | TResult
  exhaustive(): TOutput
}

/**
 * Entry point for pattern matching.
 * @param value The value to match against.
 * @returns A matcher object that allows chaining .with() or .otherwise().
 */
export function match<T>(value: T): Matcher<T> {
  const cases: Array<{ pattern: Pattern<any>; handler: (value: any) => any }> =
    []

  const matcher: Matcher<T, any> = {
    with(pattern: Pattern<any>, handler: (value: any) => any) {
      cases.push({ pattern, handler })
      return matcher
    },
    otherwise(handler: (value: any) => any) {
      for (const { pattern, handler: caseHandler } of cases) {
        if (matches(value, pattern)) {
          return caseHandler(value)
        }
      }
      return handler(value)
    },
    exhaustive() {
      for (const { pattern, handler: caseHandler } of cases) {
        if (matches(value, pattern)) {
          return caseHandler(value)
        }
      }
      throw new Error(
        'Unmatched value in match function. Use .otherwise() to handle all cases.',
      )
    },
  }

  return matcher as any
}

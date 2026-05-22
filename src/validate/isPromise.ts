/**
 * Returns `true` if the value is a Promise instance.
 * Narrows the type to `Promise<unknown>` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if Promise, `false` otherwise
 *
 * @example
 * isPromise(Promise.resolve())   // true
 * isPromise(new Promise(() => {})) // true
 * isPromise({ then: () => {} })  // false — thenable but not a Promise
 * isPromise(null)                // false
 */
export function isPromise(value: unknown): value is Promise<unknown> {
  return value instanceof Promise
}
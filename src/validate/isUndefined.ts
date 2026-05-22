/**
 * Returns `true` if the value is `undefined`.
 * Narrows the type to `undefined` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if undefined, `false` otherwise
 *
 * @example
 * isUndefined(undefined)  // true
 * isUndefined(null)       // false
 * isUndefined(0)          // false
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}
/**
 * Returns `true` if the value is `null` or `undefined`.
 * Narrows the type to `null | undefined` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if null or undefined, `false` otherwise
 *
 * @example
 * isNullOrUndefined(null)       // true
 * isNullOrUndefined(undefined)  // true
 * isNullOrUndefined(0)          // false
 * isNullOrUndefined('')         // false
 * isNullOrUndefined(false)      // false
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined
}
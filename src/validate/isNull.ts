/**
 * Returns `true` if the value is `null`.
 * Narrows the type to `null` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if null, `false` otherwise
 *
 * @example
 * isNull(null)       // true
 * isNull(undefined)  // false
 * isNull(0)          // false
 */
export function isNull(value: unknown): value is null {
  return value === null
}
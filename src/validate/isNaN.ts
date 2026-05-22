/**
 * Returns `true` if the value is exactly `NaN`.
 * Unlike native `isNaN`, does not coerce the value to a number first.
 *
 * @param value - The value to check
 * @returns `true` if NaN, `false` otherwise
 *
 * @example
 * isNaN(NaN)        // true
 * isNaN(undefined)  // false — native isNaN returns true ⚠️
 * isNaN('hello')    // false — native isNaN returns true ⚠️
 * isNaN(42)         // false
 */
export function isNaN(value: unknown): boolean {
  return Number.isNaN(value)
}
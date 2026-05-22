/**
 * Returns `true` if the value is a finite number.
 * Unlike native `isFinite`, does not coerce the value to a number first.
 *
 * @param value - The value to check
 * @returns `true` if finite number, `false` otherwise
 *
 * @example
 * isFinite(42)        // true
 * isFinite(3.14)      // true
 * isFinite(Infinity)  // false
 * isFinite(NaN)       // false
 * isFinite('42')      // false — native isFinite returns true ⚠️
 * isFinite(null)      // false — native isFinite returns true ⚠️
 */
export function isFinite(value: unknown): boolean {
  return Number.isFinite(value)
}
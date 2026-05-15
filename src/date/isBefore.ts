/**
 * Returns `true` if date `a` is before date `b`.
 *
 * Compares by timestamp — time of day is included in comparison.
 * Use with `startOfDay` if you want date-only comparison.
 *
 * @param a - The date to check
 * @param b - The date to compare against
 * @returns `true` if `a` is before `b`
 *
 * @example
 * isBefore(new Date('2026-01-01'), new Date('2026-12-31')) // true
 * isBefore(new Date('2026-12-31'), new Date('2026-01-01')) // false
 *
 * @example
 * // check if deadline has passed
 * isBefore(deadline, new Date())
 */
export function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime()
}
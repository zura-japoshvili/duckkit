/**
 * Returns `true` if date `a` is after date `b`.
 *
 * Compares by timestamp — time of day is included in comparison.
 * Use with `startOfDay` if you want date-only comparison.
 *
 * @param a - The date to check
 * @param b - The date to compare against
 * @returns `true` if `a` is after `b`
 *
 * @example
 * isAfter(new Date('2026-12-31'), new Date('2026-01-01')) // true
 * isAfter(new Date('2026-01-01'), new Date('2026-12-31')) // false
 *
 * @example
 * // check if event has started
 * isAfter(new Date(), eventStartDate)
 */
export function isAfter(a: Date, b: Date): boolean {
  return a.getTime() > b.getTime()
}
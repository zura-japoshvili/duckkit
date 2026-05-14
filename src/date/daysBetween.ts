/**
 * Returns the number of full days between two dates.
 *
 * Order doesn't matter — always returns a positive number.
 * Uses UTC midnight to avoid daylight saving time edge cases.
 *
 * @param a - First date
 * @param b - Second date
 * @returns Number of full days between `a` and `b`
 *
 * @example
 * daysBetween(new Date('2026-01-01'), new Date('2026-12-31')) // 364
 * daysBetween(new Date('2026-12-31'), new Date('2026-01-01')) // 364 (symmetric)
 * daysBetween(new Date('2026-01-01'), new Date('2026-01-01')) // 0
 */
export function daysBetween(a: Date, b: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.abs(Math.floor((utcB - utcA) / MS_PER_DAY))
}
/**
 * Adds a specified number of days to a date. Non-mutating.
 *
 * @param date - The base date
 * @param days - Number of days to add (use negative to subtract)
 * @returns A new Date with the days added
 *
 * @example
 * addDays(new Date('2026-01-01'), 7)
 * // 2026-01-08
 *
 * @example
 * // deadline in 30 days
 * const deadline = addDays(new Date(), 30)
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
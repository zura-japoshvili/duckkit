/**
 * Subtracts a specified number of days from a date. Non-mutating.
 *
 * @param date - The base date
 * @param days - Number of days to subtract
 * @returns A new Date with the days subtracted
 *
 * @example
 * subDays(new Date('2026-01-10'), 7)
 * // 2026-01-03
 *
 * @example
 * // 7 days ago
 * const lastWeek = subDays(new Date(), 7)
 */
export function subDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}
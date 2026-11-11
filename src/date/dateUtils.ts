/**
 * Returns a new date set to the start of the day (00:00:00.000).
 *
 * @param date - The date to use
 * @returns New Date at midnight of the same day
 *
 * @example
 * startOfDay(new Date('2026-05-13T14:30:00'))
 * // 2026-05-13T00:00:00.000
 */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * Returns a new date set to the end of the day (23:59:59.999).
 *
 * @param date - The date to use
 * @returns New Date at 23:59:59.999 of the same day
 *
 * @example
 * endOfDay(new Date('2026-05-13T08:00:00'))
 * // 2026-05-13T23:59:59.999
 */
export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

/**
 * Returns a new date set to the start of the week (Sunday 00:00:00.000).
 *
 * @param date - The date to use
 * @returns New Date at the start of the week
 *
 * @example
 * startOfWeek(new Date('2026-05-13')) // Wednesday
 * // 2026-05-10 (Sunday)
 */
export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() - d.getDay())
  return d
}

/**
 * Returns a new date set to the start of the month (1st day, 00:00:00.000).
 *
 * @param date - The date to use
 * @returns New Date at the first day of the month
 *
 * @example
 * startOfMonth(new Date('2026-05-13'))
 * // 2026-05-01T00:00:00.000
 */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Returns `true` if two dates fall on the same calendar day.
 *
 * Ignores time of day.
 *
 * @param a - First date
 * @param b - Second date
 * @returns `true` if same year, month, and day
 *
 * @example
 * isSameDay(new Date('2026-05-13T08:00'), new Date('2026-05-13T22:00')) // true
 * isSameDay(new Date('2026-05-13'), new Date('2026-05-14'))             // false
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * Adds a specified number of months to a date. Non-mutating.
 *
 * If the day does not exist in the target month, the last day of that month
 * is used — Jan 31 + 1 month is Feb 28 (Feb 29 in a leap year), never March.
 * The time of day is kept.
 *
 * @param date - The base date
 * @param months - Number of months to add (use negative to subtract)
 * @returns A new Date with the months added
 *
 * @example
 * addMonths(new Date(2026, 0, 31), 1) // 2026-02-28
 * addMonths(new Date(2026, 2, 31), 1) // 2026-04-30
 * addMonths(new Date(2026, 2, 15), 3) // 2026-06-15
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  const targetMonth = Math.trunc(result.getMonth() + months)
  // Last day of the target month. Computed in UTC so daylight saving can't shift it, and
  // with setUTCFullYear so years 0–99 are not mapped to 1900–1999 like new Date(y, m, d) does.
  const probe = new Date(0)
  probe.setUTCFullYear(result.getFullYear(), targetMonth + 1, 0)
  // Month and day in one call: the time of day never passes through another date
  // (e.g. a 1st of the month that has a daylight-saving gap at that hour)
  result.setMonth(targetMonth, Math.min(result.getDate(), probe.getUTCDate()))
  return result
}

/**
 * Adds a specified number of years to a date. Non-mutating.
 *
 * Feb 29 + 1 year is Feb 28, never March 1. The time of day is kept.
 *
 * @param date - The base date
 * @param years - Number of years to add (use negative to subtract)
 * @returns A new Date with the years added
 *
 * @example
 * addYears(new Date(2026, 4, 13), 1)  // 2027-05-13
 * addYears(new Date(2026, 4, 13), -2) // 2024-05-13
 * addYears(new Date(2024, 1, 29), 1)  // 2025-02-28
 */
export function addYears(date: Date, years: number): Date {
  return addMonths(date, Math.trunc(years) * 12)
}
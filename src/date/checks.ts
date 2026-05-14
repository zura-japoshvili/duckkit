function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function today(): Date {
  return startOfDay(new Date())
}

/**
 * Returns `true` if the date is today.
 * @example isToday(new Date()) // true
 */
export function isToday(date: Date): boolean {
  return startOfDay(date).getTime() === today().getTime()
}

/**
 * Returns `true` if the date was yesterday.
 * @example isYesterday(new Date(Date.now() - 86400_000)) // true
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date(today())
  yesterday.setDate(yesterday.getDate() - 1)
  return startOfDay(date).getTime() === yesterday.getTime()
}

/**
 * Returns `true` if the date falls on a Saturday or Sunday.
 * @example isWeekend(new Date('2026-05-16')) // true (Saturday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

/**
 * Returns `true` if the date is within the current calendar week (Sunday–Saturday).
 * @example isThisWeek(new Date()) // true
 */
export function isThisWeek(date: Date): boolean {
  const now = today()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  const d = startOfDay(date)
  return d >= startOfWeek && d <= endOfWeek
}

/**
 * Returns `true` if the date is in the current calendar year.
 * @example isThisYear(new Date()) // true
 */
export function isThisYear(date: Date): boolean {
  return date.getFullYear() === new Date().getFullYear()
}
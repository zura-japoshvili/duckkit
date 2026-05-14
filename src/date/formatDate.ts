const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/**
 * Formats a date using a token-based format string.
 *
 * Supported tokens:
 * - `YYYY` — full year (2026)
 * - `YY`   — 2-digit year (26)
 * - `MMMM` — full month name (January)
 * - `MMM`  — short month name (Jan)
 * - `MM`   — zero-padded month (01–12)
 * - `M`    — month (1–12)
 * - `DD`   — zero-padded day (01–31)
 * - `D`    — day (1–31)
 * - `HH`   — zero-padded hours (00–23)
 * - `H`    — hours (0–23)
 * - `mm`   — zero-padded minutes (00–59)
 * - `ss`   — zero-padded seconds (00–59)
 *
 * @param date - The date to format
 * @param format - Format string using the tokens above
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(), 'DD/MM/YYYY')  // "13/05/2026"
 * formatDate(new Date(), 'MMM D, YYYY') // "May 13, 2026"
 * formatDate(new Date(), 'MMMM YYYY')   // "May 2026"
 * formatDate(new Date(), 'HH:mm:ss')    // "14:03:09"
 */
export function formatDate(date: Date, format: string): string {
  const d = date.getDate()
  const m = date.getMonth()
  const y = date.getFullYear()
  const h = date.getHours()
  const min = date.getMinutes()
  const s = date.getSeconds()

  const tokens: Record<string, string> = {
    YYYY: String(y),
    YY: String(y).slice(-2),
    MMMM: MONTHS_LONG[m] ?? '',
    MMM: MONTHS_SHORT[m] ?? '',
    MM: String(m + 1).padStart(2, '0'),
    M: String(m + 1),
    DD: String(d).padStart(2, '0'),
    D: String(d),
    HH: String(h).padStart(2, '0'),
    H: String(h),
    mm: String(min).padStart(2, '0'),
    ss: String(s).padStart(2, '0'),
  }

  return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|ss/g, token => tokens[token] ?? token)
}
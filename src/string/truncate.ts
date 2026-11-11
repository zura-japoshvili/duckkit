import { cutAt } from '../_internal/cut'

/**
 * Truncates a string to a maximum length, appending a suffix if cut.
 *
 * The result is never longer than `maxLength` (measured like `str.length`) — if
 * the suffix alone does not fit, it is cut too. Characters are never cut in half:
 * an emoji, flag or accented letter that does not fit whole is left out.
 *
 * @param str - The string to truncate
 * @param maxLength - Maximum length including the suffix
 * @param suffix - Appended when truncated (default: "...")
 * @returns The truncated string
 *
 * @example
 * truncate('Hello World', 8)        // "Hello..."
 * truncate('Hello World', 8, ' →')  // "Hello  →"
 * truncate('Hi', 8)                 // "Hi"
 * truncate('Hello World', 2)        // ".."
 * truncate('Hi😀there', 6)          // "Hi..." — the emoji does not fit whole
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str
  if (suffix.length >= maxLength) return cutAt(suffix, maxLength)
  return cutAt(str, maxLength - suffix.length) + suffix
}

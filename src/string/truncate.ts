/**
 * Truncates a string to a maximum length, appending a suffix if cut.
 *
 * @param str - The string to truncate
 * @param maxLength - Maximum length including the suffix
 * @param suffix - Appended when truncated (default: "...")
 * @returns The truncated string
 *
 * @example
 * truncate('Hello World', 8)        // "Hello..."
 * truncate('Hello World', 8, ' →')  // "Hello →"
 * truncate('Hi', 8)                 // "Hi"
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - suffix.length) + suffix
}
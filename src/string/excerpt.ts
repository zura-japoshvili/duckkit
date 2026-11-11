import { cutAt } from '../_internal/cut'

/**
 * Truncates a string at a word boundary instead of mid-word.
 *
 * Unlike `truncate`, this never cuts in the middle of a word —
 * it keeps the most complete words that fit within `maxLength`. A single word
 * longer than the limit is cut, but never in the middle of a character (emoji,
 * flags and accented letters stay whole). The result is never longer than `maxLength`.
 *
 * @param str - The string to excerpt
 * @param maxLength - Maximum length of the result including suffix
 * @param suffix - Appended when truncated (default: '...')
 * @returns The excerpted string
 *
 * @example
 * excerpt('Hello World foo bar', 15)
 * // "Hello World..." — not "Hello World fo..."
 *
 * @example
 * excerpt('Short', 20)
 * // "Short" — fits, returned unchanged
 *
 * @example
 * excerpt('Hello World', 8, ' →')
 * // "Hello →"
 */
export function excerpt(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str
  if (suffix.length >= maxLength) return cutAt(suffix, maxLength)

  const limit = maxLength - suffix.length
  // Look one character past the limit: if it is a space, the word before it fits whole
  const lastSpace = str.slice(0, limit + 1).lastIndexOf(' ')
  const wholeWords = lastSpace > 0 ? str.slice(0, lastSpace).trimEnd() : ''
  // No complete word fits (one long word, maybe after leading spaces) — cut it at the limit
  const kept = wholeWords.trim() ? wholeWords : cutAt(str, limit)

  return kept + suffix
}

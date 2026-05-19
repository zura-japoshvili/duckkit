/**
 * Truncates a string at a word boundary instead of mid-word.
 *
 * Unlike `truncate`, this never cuts in the middle of a word —
 * it finds the last complete word that fits within `maxLength`.
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

  const limit = maxLength - suffix.length
  const trimmed = str.slice(0, limit)
  const lastSpace = trimmed.lastIndexOf(' ')

  return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed) + suffix
}
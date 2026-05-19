/**
 * Removes all HTML tags from a string.
 *
 * Useful when dealing with CMS content, rich text editors,
 * or any input that may contain HTML markup.
 *
 * Does not sanitize — use a dedicated library for XSS protection.
 * This only strips tags, it does not unescape entities.
 *
 * @param str - The string to strip
 * @returns Plain text with all HTML tags removed
 *
 * @example
 * stripHtml('<p>Hello <strong>World</strong></p>')
 * // "Hello World"
 *
 * @example
 * stripHtml('<a href="/about">About us</a>')
 * // "About us"
 *
 * @example
 * stripHtml('No tags here')
 * // "No tags here"
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}
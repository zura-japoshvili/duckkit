/**
 * Escapes HTML special characters in a string.
 *
 * Converts `&`, `<`, `>`, `"`, and `'` to their HTML entities.
 * Use before inserting user-generated content into HTML to prevent XSS.
 *
 * @param str - The string to escape
 * @returns The escaped string
 *
 * @example
 * escapeHtml('<script>alert("xss")</script>')
 * // "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 *
 * @example
 * escapeHtml('Hello & "World"')
 * // "Hello &amp; &quot;World&quot;"
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
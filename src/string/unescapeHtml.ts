/**
 * Unescapes HTML entities back to their original characters.
 *
 * Reverses `escapeHtml` — converts `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`
 * back to `&`, `<`, `>`, `"`, `'`.
 *
 * @param str - The string to unescape
 * @returns The unescaped string
 *
 * @example
 * unescapeHtml('&lt;div&gt;Hello &amp; World&lt;/div&gt;')
 * // "<div>Hello & World</div>"
 *
 * @example
 * unescapeHtml('&quot;quoted&quot;')
 * // '"quoted"'
 */
export function unescapeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}
/**
 * Returns `true` if the value is a valid URL with http or https protocol.
 *
 * @param value - The string to check
 * @returns `true` if valid URL, `false` otherwise
 *
 * @example
 * isUrl('https://github.com')  // true
 * isUrl('http://example.com')  // true
 * isUrl('ftp://example.com')   // false — only http/https
 * isUrl('github.com')          // false — missing protocol
 */
export function isUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
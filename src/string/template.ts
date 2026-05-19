/**
 * Simple string interpolation using `{key}` placeholders.
 *
 * Replaces `{key}` tokens with values from a data object.
 * Missing keys are left as-is by default, or replaced with a fallback.
 *
 * @param str - The template string with `{key}` placeholders
 * @param data - Object containing replacement values
 * @param fallback - Value to use for missing keys (default: leaves placeholder)
 * @returns The interpolated string
 *
 * @example
 * template('Hello {name}!', { name: 'Zura' })
 * // "Hello Zura!"
 *
 * @example
 * template('Dear {title} {lastName},', { title: 'Mr', lastName: 'J' })
 * // "Dear Mr J,"
 *
 * @example
 * // missing key with fallback
 * template('Hello {name}!', {}, 'stranger')
 * // "Hello stranger!"
 */
export function template(
  str: string,
  data: Record<string, string | number>,
  fallback?: string
): string {
  return str.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (key in data) return String(data[key])
    if (fallback !== undefined) return fallback
    return match
  })
}
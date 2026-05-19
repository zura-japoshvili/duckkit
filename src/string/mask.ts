/**
 * Masks a string, revealing only the last N characters.
 *
 * Useful for displaying card numbers, tokens, API keys, or passwords
 * without exposing the full value.
 *
 * @param str - The string to mask
 * @param visibleCount - Number of characters to show at the end (default: 4)
 * @param maskChar - Character to use for masking (default: '*')
 * @returns The masked string
 *
 * @example
 * mask('4242424242424242')        // "************4242"
 * mask('my-secret-api-key', 6)    // "************pi-key"
 * mask('hello', 0)                // "*****"
 * mask('hi', 10)                  // "hi" — visible count exceeds length
 *
 * @example
 * // custom mask character
 * mask('4242424242424242', 4, '•') // "••••••••••••4242"
 */
export function mask(str: string, visibleCount: number = 4, maskChar: string = '*'): string {
  if (visibleCount >= str.length) return str
  const masked = maskChar.repeat(str.length - visibleCount)
  return masked + str.slice(str.length - visibleCount)
}
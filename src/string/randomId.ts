/**
 * Generates a cryptographically secure random alphanumeric ID string.
 *
 * Uses the native `crypto.getRandomValues` API — secure, zero-dependency,
 * works in both browser and Node.js 18+.
 *
 * @param length - Length of the generated ID (default: 8)
 * @returns A cryptographically secure random alphanumeric string
 *
 * @example
 * randomId()     // "xK9mP2qL"
 * randomId(12)   // "xK9mP2qLwZ4n"
 * randomId(4)    // "xK9m"
 */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function randomId(length: number = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes)
    .map(b => CHARS[b % CHARS.length])
    .join('')
}
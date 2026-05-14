const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Generates a random alphanumeric ID string.
 *
 * Not cryptographically secure — use for UI keys, temp IDs, and session tokens,
 * not for security-sensitive purposes. Inspired by nanoid but zero-dependency.
 *
 * @param length - Length of the generated ID (default: 8)
 * @returns A random alphanumeric string
 *
 * @example
 * randomId()     // "xK9mP2qL"
 * randomId(12)   // "xK9mP2qLwZ4n"
 * randomId(4)    // "xK9m"
 */
export function randomId(length: number = 8): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}
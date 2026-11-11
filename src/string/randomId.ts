const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// 256 is not a multiple of 62, so `byte % 62` would make the first 8 characters
// slightly more likely. Bytes from 248 (= 4 × 62) up are thrown away instead.
const BYTE_LIMIT = 256 - (256 % CHARS.length)

/**
 * Generates a cryptographically secure random alphanumeric ID string.
 *
 * Uses the native `crypto.getRandomValues` API (every current browser,
 * Node.js 19+). Every character is equally likely.
 *
 * @param length - Length of the generated ID (default: 8)
 * @returns A cryptographically secure random alphanumeric string
 * @throws If `length` is not a non-negative integer
 *
 * @example
 * randomId()     // "xK9mP2qL"
 * randomId(12)   // "xK9mP2qLwZ4n"
 * randomId(4)    // "xK9m"
 */
export function randomId(length: number = 8): string {
  if (!Number.isInteger(length) || length < 0) {
    throw new Error('randomId: length must be a non-negative integer')
  }

  let id = ''
  while (id.length < length) {
    // About 3% of bytes are thrown away, so ask for a few extra.
    // 65536 bytes is the most getRandomValues returns per call.
    const bytes = crypto.getRandomValues(new Uint8Array(Math.min(length - id.length + 8, 65536)))
    for (const byte of bytes) {
      if (byte >= BYTE_LIMIT) continue
      id += CHARS[byte % CHARS.length]
      if (id.length === length) break
    }
  }
  return id
}

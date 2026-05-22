/**
 * Returns `true` if the value is a valid UUID v4.
 *
 * @param value - The string to check
 * @returns `true` if valid UUID v4, `false` otherwise
 *
 * @example
 * isUUID('550e8400-e29b-41d4-a716-446655440000')  // true
 * isUUID('550E8400-E29B-41D4-A716-446655440000')  // true — case insensitive
 * isUUID('not-a-uuid')                             // false
 */
export function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}
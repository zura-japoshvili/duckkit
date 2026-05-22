/**
 * Returns `true` if the value is a string.
 * Narrows the type to `string` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if string, `false` otherwise
 *
 * @example
 * isString('hello')  // true
 * isString('')       // true
 * isString(42)       // false
 * isString(null)     // false
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
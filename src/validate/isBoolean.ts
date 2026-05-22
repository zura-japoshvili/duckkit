/**
 * Returns `true` if the value is a boolean.
 * Narrows the type to `boolean` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if boolean, `false` otherwise
 *
 * @example
 * isBoolean(true)   // true
 * isBoolean(false)  // true
 * isBoolean(0)      // false
 * isBoolean('true') // false
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}
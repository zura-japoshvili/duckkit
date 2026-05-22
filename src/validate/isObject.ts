/**
 * Returns `true` if the value is a plain object.
 * Returns `false` for arrays, null, and class instances.
 * Narrows the type to `Record<string, unknown>` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if plain object, `false` otherwise
 *
 * @example
 * isObject({ a: 1 })    // true
 * isObject({})          // true
 * isObject([])          // false — array
 * isObject(null)        // false — null
 * isObject(new Date())  // false — class instance
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
}
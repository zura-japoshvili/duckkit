/**
 * Returns `true` if the value is an array.
 * Narrows the type to `unknown[]` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if array, `false` otherwise
 *
 * @example
 * isArray([1, 2, 3])  // true
 * isArray([])         // true
 * isArray({})         // false
 * isArray('hello')    // false
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
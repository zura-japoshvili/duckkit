/**
 * Returns `true` if the object has no own enumerable keys.
 *
 * @param value - The object to check
 * @returns `true` if empty object, `false` otherwise
 *
 * @example
 * isEmptyObject({})                  // true
 * isEmptyObject({ a: 1 })            // false
 * isEmptyObject({ a: undefined })    // false — key exists
 */
export function isEmptyObject(value: Record<string, unknown>): boolean {
  return Object.keys(value).length === 0
}
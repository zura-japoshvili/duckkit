/**
 * Returns `true` if the value is empty.
 * - string: empty or whitespace only
 * - array: length is 0
 * - object: no own enumerable keys
 *
 * @param value - The string, array, or object to check
 * @returns `true` if empty, `false` otherwise
 *
 * @example
 * isEmpty('')         // true — empty string
 * isEmpty('   ')      // true — whitespace only
 * isEmpty([])         // true — empty array
 * isEmpty({})         // true — empty object
 * isEmpty('hello')    // false
 * isEmpty([1])        // false
 * isEmpty({ a: 1 })   // false
 */
export function isEmpty(value: string | unknown[] | Record<string, unknown>): boolean {
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  return Object.keys(value).length === 0
}
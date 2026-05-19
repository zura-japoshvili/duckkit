/**
 * Creates a true deep clone of a value.
 *
 * Handles objects, arrays, dates, primitives, null, and undefined.
 * Unlike `JSON.parse(JSON.stringify(x))` this preserves:
 * - `Date` objects (not converted to strings)
 * - `undefined` values
 * - Does not choke on non-serializable values
 *
 * Does not handle: circular references, functions, class instances, Map, Set.
 * For those cases, use the native `structuredClone()` available in Node 17+ and modern browsers.
 *
 * @param value - The value to clone
 * @returns A deep clone of the value
 *
 * @example
 * const original = { a: 1, b: { c: 2 } }
 * const clone = deepClone(original)
 * clone.b.c = 99
 * original.b.c  // still 2 ✅
 *
 * @example
 * // JSON.parse breaks dates — deepClone doesn't
 * const obj = { createdAt: new Date() }
 * deepClone(obj).createdAt instanceof Date  // true ✅
 * JSON.parse(JSON.stringify(obj)).createdAt instanceof Date  // false ❌
 */
export function deepClone<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (value instanceof Date) return new Date(value.getTime()) as T
  if (Array.isArray(value)) return value.map(deepClone) as T
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(value)) {
      result[key] = deepClone((value as Record<string, unknown>)[key])
    }
    return result as T
  }
  return value
}
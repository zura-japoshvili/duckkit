/**
 * Creates a new object with all keys transformed by `fn`. Values are unchanged.
 *
 * Useful for converting between naming conventions,
 * e.g. `snake_case` → `camelCase` on API responses.
 *
 * @param obj - The source object
 * @param fn - Function that transforms each key
 * @returns A new object with transformed keys and the same values
 *
 * @example
 * mapKeys({ first_name: 'Zura', last_name: 'G' }, k => k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()))
 * // { firstName: 'Zura', lastName: 'G' }
 *
 * @example
 * mapKeys({ a: 1, b: 2 }, k => k.toUpperCase())
 * // { A: 1, B: 2 }
 */
export function mapKeys<T>(
  obj: Record<string, T>,
  fn: (key: string) => string
): Record<string, T> {
  const result: Record<string, T> = {}
  for (const key of Object.keys(obj)) {
    result[fn(key)] = obj[key] as T
  }
  return result
}
/**
 * Flattens a nested object into a single level using dot-notation keys.
 *
 * Useful for logging, form serialization, config diffing, or
 * sending nested data to flat key-value stores.
 *
 * @param obj - The object to flatten
 * @param prefix - Internal use for recursion (leave empty)
 * @returns A new flat object with dot-notation keys
 *
 * @example
 * flattenObject({ a: { b: { c: 1 }, d: 2 }, e: 3 })
 * // { 'a.b.c': 1, 'a.d': 2, 'e': 3 }
 *
 * @example
 * flattenObject({ user: { name: 'Zura', address: { city: 'Tbilisi' } } })
 * // { 'user.name': 'Zura', 'user.address.city': 'Tbilisi' }
 */
export function flattenObject(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey))
    } else {
      result[fullKey] = value
    }
  }
  return result
}
/**
 * Restores a flat dot-notation object back into a nested structure.
 *
 * The inverse of `flattenObject`.
 *
 * @param obj - A flat object with dot-notation keys
 * @returns A new nested object
 *
 * @example
 * unflattenObject({ 'a.b.c': 1, 'a.d': 2, 'e': 3 })
 * // { a: { b: { c: 1 }, d: 2 }, e: 3 }
 *
 * @example
 * unflattenObject({ 'user.name': 'Zura', 'user.address.city': 'Tbilisi' })
 * // { user: { name: 'Zura', address: { city: 'Tbilisi' } } }
 */
export function unflattenObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    const parts = key.split('.')
    let current = result
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]!
      if (typeof current[part] !== 'object' || current[part] === null) {
        current[part] = {}
      }
      current = current[part] as Record<string, unknown>
    }
    current[parts[parts.length - 1]!] = obj[key]
  }
  return result
}
import { setOwn } from '../_internal/own'

/**
 * Flattens a nested object into a single level using dot-notation keys.
 *
 * Only plain objects are recursed into. Arrays, Dates, Maps, Sets, RegExp,
 * and class instances are kept as leaf values.
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
 *
 * @example
 * // Dates are preserved as values
 * flattenObject({ createdAt: new Date('2026-01-01') })
 * // { createdAt: Date } ✅
 *
 * @example
 * // Empty nested objects are kept
 * flattenObject({ a: {}, b: 1 })
 * // { a: {}, b: 1 } ✅
 */
function isPlainObject(val: unknown): val is Record<string, unknown> {
  if (typeof val !== 'object' || val === null) return false
  const proto = Object.getPrototypeOf(val)
  return proto === null || proto === Object.prototype
}

export function flattenObject(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]
    if (isPlainObject(value)) {
      const nested = flattenObject(value, fullKey)
      if (Object.keys(nested).length === 0) {
        // Preserve empty plain objects instead of dropping them
        setOwn(result, fullKey, {})
      } else {
        for (const k of Object.keys(nested)) setOwn(result, k, nested[k])
      }
    } else {
      setOwn(result, fullKey, value)
    }
  }
  return result
}
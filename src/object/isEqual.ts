/**
 * Performs a deep equality check between two values.
 *
 * Handles primitives, objects, arrays, null, undefined, Date, and nested structures.
 * Does not handle circular references.
 *
 * @param a - First value
 * @param b - Second value
 * @returns `true` if values are deeply equal
 *
 * @example
 * isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }) // true
 * isEqual([1, 2, 3], [1, 2, 3])                           // true
 * isEqual({ a: 1 }, { a: 2 })                             // false
 *
 * @example
 * // Safe alternative to JSON.stringify comparison
 * isEqual(new Date('2026-01-01'), new Date('2026-01-01')) // true
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a === null || b === null) return false
  if (a === undefined || b === undefined) return false
  if (typeof a !== typeof b) return false

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, i) => isEqual(item, b[i]))
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object)
    const keysB = Object.keys(b as object)
    if (keysA.length !== keysB.length) return false
    return keysA.every(key =>
      isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    )
  }

  return false
}
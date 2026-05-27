/**
 * Performs a deep equality check between two values.
 *
 * Handles primitives, objects, arrays, null, undefined, Date, RegExp,
 * Map, Set, NaN, and nested structures.
 *
 * Objects with different prototypes are not equal — a class instance and
 * a plain object with the same own keys compare as not equal.
 *
 * Does not handle circular references.
 *
 * @param a - First value
 * @param b - Second value
 * @returns `true` if values are deeply equal
 *
 * @example
 * isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }) // true
 * isEqual([1, 2, 3], [1, 2, 3])                          // true
 * isEqual({ a: 1 }, { a: 2 })                            // false
 *
 * @example
 * isEqual(NaN, NaN)                                       // true ✅
 * isEqual(new Map([['a', 1]]), new Map([['a', 1]]))       // true ✅
 * isEqual(new Set([1, 2]), new Set([1, 2]))               // true ✅
 * isEqual(/foo/g, /foo/g)                                 // true ✅
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  // Both NaN — only NaN is not equal to itself
  if (a !== a && b !== b) return true

  if (a === null || b === null) return false
  if (a === undefined || b === undefined) return false
  if (typeof a !== typeof b) return false

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false
    for (const [k, v] of a) {
      if (!b.has(k) || !isEqual(v, b.get(k))) return false
    }
    return true
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false
    for (const item of a) {
      if (!b.has(item)) return false
    }
    return true
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, i) => isEqual(item, b[i]))
  }
  // Array vs non-array
  if (Array.isArray(a) !== Array.isArray(b)) return false

  if (typeof a === 'object' && typeof b === 'object') {
    // Different prototypes are not equal — catches class instance vs plain object
    if (Object.getPrototypeOf(a as object) !== Object.getPrototypeOf(b as object)) return false

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
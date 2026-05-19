/**
 * Returns items from `a` that do not exist in `b`.
 *
 * Uses a Set internally — O(n + m), not O(n²).
 * With a key function, compares objects by a derived value.
 *
 * @param a - Source array
 * @param b - Array of items to exclude
 * @param fn - Optional function to derive the comparison key
 * @returns New array of items from `a` not present in `b`
 *
 * @example
 * difference([1, 2, 3, 4], [2, 4])
 * // [1, 3]
 *
 * @example
 * difference(allUsers, activeUsers, x => x.id)
 * // users that are not active
 */
export function difference<T>(a: T[], b: T[], fn?: (item: T) => unknown): T[] {
  const set = new Set(fn ? b.map(fn) : b)
  return a.filter(item => !set.has(fn ? fn(item) : item))
}
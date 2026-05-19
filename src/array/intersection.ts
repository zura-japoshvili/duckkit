/**
 * Returns items that exist in both arrays.
 *
 * Uses a Set internally — O(n + m), not O(n²).
 * With a key function, compares objects by a derived value.
 *
 * @param a - First array
 * @param b - Second array
 * @param fn - Optional function to derive the comparison key
 * @returns New array of items from `a` that also exist in `b`
 *
 * @example
 * intersection([1, 2, 3, 4], [2, 4, 6])
 * // [2, 4]
 *
 * @example
 * intersection(usersA, usersB, x => x.id)
 * // users that exist in both lists
 */
export function intersection<T>(a: T[], b: T[], fn?: (item: T) => unknown): T[] {
  const set = new Set(fn ? b.map(fn) : b)
  return a.filter(item => set.has(fn ? fn(item) : item))
}
/**
 * Groups items by a key and returns the count per group.
 *
 * Like `groupBy` but returns counts instead of arrays.
 * Returns `Partial<Record<K, number>>` — missing keys read as `undefined`,
 * so callers should guard with `?? 0` when expecting a number.
 *
 * Useful for analytics, frequency maps, and histograms.
 *
 * @param arr - The array to count
 * @param fn - Function that returns the group key for each item
 * @returns A record mapping each key to its count
 *
 * @example
 * countBy(users, x => x.country)
 * // { GE: 3, US: 5, DE: 1 }
 *
 * @example
 * const counts = countBy(orders, x => x.status)
 * const pending = counts.pending ?? 0  // safe number ✅
 */
export function countBy<T, K extends string>(
  arr: T[],
  fn: (item: T) => K
): Partial<Record<K, number>> {
  const result = {} as Partial<Record<K, number>>
  for (const item of arr) {
    const key = fn(item)
    result[key] = (result[key] ?? 0) + 1
  }
  return result
}
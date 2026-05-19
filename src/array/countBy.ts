/**
 * Groups items by a key and returns the count per group.
 *
 * Like `groupBy` but returns counts instead of arrays.
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
 * countBy(orders, x => x.status)
 * // { pending: 4, shipped: 12, delivered: 8 }
 */
export function countBy<T>(arr: T[], fn: (item: T) => string): Record<string, number> {
  const result: Record<string, number> = {}
  for (const item of arr) {
    const key = fn(item)
    result[key] = (result[key] ?? 0) + 1
  }
  return result
}
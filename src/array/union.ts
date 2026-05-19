/**
 * Merges two arrays and removes duplicates.
 *
 * With a key function, deduplicates objects by a derived value.
 *
 * @param a - First array
 * @param b - Second array
 * @param fn - Optional function to derive the comparison key
 * @returns New array with all unique items from both arrays
 *
 * @example
 * union([1, 2, 3], [2, 3, 4, 5])
 * // [1, 2, 3, 4, 5]
 *
 * @example
 * union(localUsers, remoteUsers, x => x.id)
 * // merged list, no duplicate ids
 */
export function union<T>(a: T[], b: T[], fn?: (item: T) => unknown): T[] {
  if (!fn) return [...new Set([...a, ...b])]
  const seen = new Set<unknown>()
  return [...a, ...b].filter(item => {
    const key = fn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
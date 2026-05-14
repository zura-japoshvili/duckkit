/**
 * Removes duplicate values from an array.
 *
 * Without a key function, uses a `Set` for primitive deduplication.
 * With a key function, deduplicates objects by a derived key — O(n) using a Set,
 * unlike the common `.filter(findIndex)` pattern which is O(n²).
 *
 * @param arr - The array to deduplicate
 * @param fn - Optional function to derive the uniqueness key per item
 * @returns New array with duplicates removed, preserving original order
 *
 * @example
 * unique([1, 2, 2, 3, 1])
 * // [1, 2, 3]
 *
 * @example
 * unique(users, x => x.id)
 * // removes users with duplicate ids, keeps first occurrence
 */
export function unique<T>(arr: T[], fn?: (item: T) => unknown): T[] {
  if (!fn) return [...new Set(arr)]
  const seen = new Set<unknown>()
  return arr.filter(item => {
    const key = fn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
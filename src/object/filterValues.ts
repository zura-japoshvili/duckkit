/**
 * Creates a new object keeping only entries where the value passes the predicate.
 *
 * @param obj - The source object
 * @param predicate - Function that returns true for values to keep
 * @returns A new object with only the matching entries
 *
 * @example
 * filterValues({ a: 1, b: null, c: 3, d: undefined }, v => v != null)
 * // { a: 1, c: 3 }
 *
 * @example
 * filterValues(scores, v => v > 0)
 * // only positive scores
 */
export function filterValues<T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): Record<string, T> {
  const result: Record<string, T> = {}
  for (const key of Object.keys(obj)) {
    const value = obj[key] as T
    if (predicate(value, key)) result[key] = value
  }
  return result
}
/**
 * Combines two arrays into an array of pairs.
 *
 * Stops at the length of the shorter array.
 * Useful for pairing parallel data structures: labels + values,
 * keys + results, before + after comparisons.
 *
 * @param a - First array
 * @param b - Second array
 * @returns Array of `[A, B]` tuples, typed exactly
 *
 * @example
 * zip(['a', 'b', 'c'], [1, 2, 3])
 * // [['a', 1], ['b', 2], ['c', 3]] — typed as [string, number][]
 *
 * @example
 * Object.fromEntries(zip(keys, values))
 */
export function zip<A, B>(a: A[], b: B[]): [A, B][] {
  const length = Math.min(a.length, b.length)
  const result: [A, B][] = []
  for (let i = 0; i < length; i++) {
    result.push([a[i] as A, b[i] as B])
  }
  return result
}
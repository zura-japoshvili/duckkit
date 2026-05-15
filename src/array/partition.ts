/**
 * Splits an array into two groups based on a predicate.
 *
 * First array contains items where predicate returns true.
 * Second array contains items where predicate returns false.
 *
 * @param arr - The array to partition
 * @param predicate - Function that returns true or false for each item
 * @returns A tuple of [matches, nonMatches]
 *
 * @example
 * const [admins, users] = partition(people, x => x.role === 'admin')
 *
 * @example
 * const [evens, odds] = partition([1, 2, 3, 4, 5], n => n % 2 === 0)
 * // evens: [2, 4], odds: [1, 3, 5]
 */
export function partition<T>(
  arr: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const matches: T[] = []
  const nonMatches: T[] = []
  for (const item of arr) {
    if (predicate(item)) matches.push(item)
    else nonMatches.push(item)
  }
  return [matches, nonMatches]
}
/**
 * Sorts an array by a numeric or string criteria. Non-mutating.
 *
 * @param arr - The array to sort
 * @param fn - Function that returns the sort key for each item
 * @param order - 'asc' (default) or 'desc'
 * @returns New sorted array
 *
 * @example
 * sortBy(users, x => x.name)
 * // alphabetical ascending
 *
 * sortBy(songs, x => x.plays, 'desc')
 * // most played first
 */
export function sortBy<T>(
  arr: T[],
  fn: (item: T) => string | number,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const ak = fn(a)
    const bk = fn(b)
    if (ak < bk) return order === 'asc' ? -1 : 1
    if (ak > bk) return order === 'asc' ? 1 : -1
    return 0
  })
}
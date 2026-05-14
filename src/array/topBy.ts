/**
 * Returns the top N items sorted by a numeric criteria.
 *
 * Equivalent to `.sort(...).slice(0, n)` but doesn't mutate the original array.
 * Useful for leaderboards, "most played", "highest rated", "most recent" lists.
 *
 * @param arr - The array to select from
 * @param fn - Function that returns the numeric score for each item
 * @param n - Number of top items to return
 * @returns New array of the top `n` items in descending order
 *
 * @example
 * topBy(songs, x => x.plays, 5)
 * // top 5 most played songs
 *
 * @example
 * topBy(users, x => x.score, 3)
 * // [{ score: 98 }, { score: 91 }, { score: 87 }]
 */
export function topBy<T>(arr: T[], fn: (item: T) => number, n: number): T[] {
  return [...arr].sort((a, b) => fn(b) - fn(a)).slice(0, n)
}
/**
 * Groups array items by multiple keys per item.
 *
 * Unlike `groupBy`, each item can appear under several keys simultaneously.
 *
 * Perfect for tags, genres, categories — anything where one item
 * belongs to multiple groups at once.
 *
 * @param arr - The array to group
 * @param fn - Function that returns an array of keys for each item
 * @returns A record mapping each key to all items that belong to it
 *
 * @example
 * const artists = [
 *   { name: 'Gorillaz', genres: ['alternative', 'electronic'] },
 *   { name: 'Arctic Monkeys', genres: ['rock', 'alternative'] },
 * ]
 * flatGroupBy(artists, a => a.genres)
 * // {
 * //   alternative: [Gorillaz, ArcticMonkeys],
 * //   electronic:  [Gorillaz],
 * //   rock:        [ArcticMonkeys],
 * // }
 */
export function flatGroupBy<T>(
  arr: T[],
  fn: (item: T) => string[]
): Record<string, T[]> {
  const result: Record<string, T[]> = {}
  for (const item of arr) {
    const keys = fn(item)
    for (const key of keys) {
      if (!result[key]) {
        result[key] = []
      }
      result[key].push(item)
    }
  }
  return result
}
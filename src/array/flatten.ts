/**
 * Flattens an array one level deep.
 *
 * @param arr - Array of arrays to flatten
 * @returns New flattened array
 *
 * @example
 * flatten([[1, 2], [3, 4], [5]])
 * // [1, 2, 3, 4, 5]
 *
 * @example
 * flatten(users.map(u => u.tags))
 * // all tags in one array
 */
export function flatten<T>(arr: T[][]): T[] {
  return ([] as T[]).concat(...arr)
}
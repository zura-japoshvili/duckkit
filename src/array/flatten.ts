/**
 * Flattens an array one level deep.
 *
 * Uses the native `Array.prototype.flat()` — safe for arrays of any size,
 * unlike the spread-based pattern `[].concat(...arr)` which can overflow
 * the JS engine's argument limit on large inputs (~10–16k items).
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
 *
 * @example
 * // For deeper nesting use the native method directly
 * arr.flat(Infinity)
 */
export function flatten<T>(arr: T[][]): T[] {
  return arr.flat()
}
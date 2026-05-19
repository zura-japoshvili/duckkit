/**
 * Returns a new array with specified values removed.
 *
 * @param arr - The source array
 * @param values - Values to exclude
 * @returns New array without the specified values
 *
 * @example
 * without([1, 2, 3, 4, 5], 2, 4)
 * // [1, 3, 5]
 *
 * @example
 * without(tags, 'draft', 'archived')
 * // tags without draft or archived
 */
export function without<T>(arr: T[], ...values: T[]): T[] {
  const set = new Set(values)
  return arr.filter(item => !set.has(item))
}
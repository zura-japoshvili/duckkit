/**
 * Splits an array into chunks of a given size.
 *
 * Useful for pagination, batch processing, and grid layouts.
 * The last chunk may be smaller than `size` if the array doesn't divide evenly.
 *
 * @param arr - The array to split
 * @param size - Maximum size of each chunk (must be > 0)
 * @returns Array of chunks typed as `T[][]`
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2)
 * // [[1, 2], [3, 4], [5]]
 *
 * @example
 * // Process in batches of 50
 * for (const batch of chunk(emails, 50)) {
 *   await sendBatch(batch)
 * }
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) throw new Error('chunk size must be greater than 0')
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}
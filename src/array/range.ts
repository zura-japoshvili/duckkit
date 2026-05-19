/**
 * Creates an array of numbers from `start` to `end` (exclusive).
 *
 * @param start - Start of range (inclusive)
 * @param end - End of range (exclusive)
 * @param step - Step between values (default: 1)
 * @returns Array of numbers
 *
 * @example
 * range(0, 5)
 * // [0, 1, 2, 3, 4]
 *
 * @example
 * range(0, 10, 2)
 * // [0, 2, 4, 6, 8]
 *
 * @example
 * range(5, 0, -1)
 * // [5, 4, 3, 2, 1]
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = []
  if (step === 0) throw new Error('step must not be 0')
  if (step > 0) {
    for (let i = start; i < end; i += step) result.push(i)
  } else {
    for (let i = start; i > end; i += step) result.push(i)
  }
  return result
}
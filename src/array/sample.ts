/**
 * Returns a random item from an array.
 *
 * @param arr - The array to sample from
 * @returns A random item, or undefined if array is empty
 *
 * @example
 * sample(['rock', 'paper', 'scissors'])
 * // 'paper' — random each time
 *
 * @example
 * sample(questions)
 * // random quiz question
 */
export function sample<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}
/**
 * Returns a new array with items in random order.
 *
 * Uses the Fisher-Yates algorithm — uniform distribution, O(n).
 * Non-mutating — original array is not changed.
 *
 * @param arr - The array to shuffle
 * @returns New array with the same items in random order
 *
 * @example
 * shuffle([1, 2, 3, 4, 5])
 * // [3, 1, 5, 2, 4] — different each time
 *
 * @example
 * shuffle(questions)
 * // randomized quiz questions
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}
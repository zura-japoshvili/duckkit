/**
 * Pauses execution for a given number of milliseconds.
 *
 * Simple promisified setTimeout. Use with `await` to pause async functions.
 *
 * @param ms - Duration to wait in milliseconds
 * @returns A promise that resolves after `ms` milliseconds
 *
 * @example
 * await delay(1000) // pauses for 1 second
 *
 * @example
 * console.log('start')
 * await delay(500)
 * console.log('500ms later')
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
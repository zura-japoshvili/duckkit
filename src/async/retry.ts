/**
 * Retries an async function up to `times` attempts with optional delay between retries.
 *
 * Stops and returns on first success. Throws the last error if all attempts fail.
 * Delay doubles on each retry (exponential backoff) if `backoff` is true.
 *
 * @param fn - Async function to retry
 * @param times - Maximum number of attempts (default: 3)
 * @param delayMs - Delay between retries in ms (default: 0)
 * @param backoff - Double delay on each retry (default: false)
 * @returns The resolved value on success
 * @throws The last error if all retries fail
 *
 * @example
 * const data = await retry(() => fetchUser(id), 3, 1000)
 * // tries up to 3 times, 1s between each
 *
 * @example
 * // with exponential backoff — 200ms, 400ms, 800ms
 * await retry(() => fetchData(), 3, 200, true)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  times: number = 3,
  delayMs: number = 0,
  backoff: boolean = false
): Promise<T> {
  let lastError: Error = new Error('retry failed')
  let currentDelay = delayMs

  for (let i = 0; i < times; i++) {
    try {
      return await fn()
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e))
      if (i < times - 1 && currentDelay > 0) {
        await new Promise(r => setTimeout(r, currentDelay))
        if (backoff) currentDelay *= 2
      }
    }
  }

  throw lastError
}
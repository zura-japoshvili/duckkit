/**
 * Retries an async function up to `times` attempts with optional delay between retries.
 *
 * Stops and returns on first success. Throws the last error if all attempts fail.
 * Delay doubles on each retry (exponential backoff) if `backoff` is true.
 *
 * `times` counts total attempts, not retries on top of the original — `times=3`
 * means 3 attempts and 2 delays between them.
 *
 * @param fn - Async function to retry
 * @param times - Maximum number of attempts (default: 3, must be >= 1)
 * @param delayMs - Delay between retries in ms (default: 0)
 * @param backoff - Double delay on each retry (default: false)
 * @returns The resolved value on success
 * @throws The last error if all retries fail, or an error if `times < 1`
 *
 * @example
 * const data = await retry(() => fetchUser(id), 3, 1000)
 * // up to 3 attempts, 1s wait between each
 *
 * @example
 * // exponential backoff — waits 200ms then 400ms between 3 attempts
 * await retry(() => fetchData(), 3, 200, true)
 *
 * @example
 * // 4 attempts with exponential backoff — waits 200ms, 400ms, 800ms
 * await retry(() => fetchData(), 4, 200, true)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  times: number = 3,
  delayMs: number = 0,
  backoff: boolean = false
): Promise<T> {
  if (!Number.isInteger(times) || times < 1) {
    throw new Error('retry: times must be a positive integer')
  }

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
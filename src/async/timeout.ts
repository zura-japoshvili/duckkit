/**
 * Races a promise against a timer. Rejects with a TimeoutError if the timer wins.
 *
 * @param promise - The promise to race
 * @param ms - Timeout duration in milliseconds
 * @param message - Custom error message (default: "Operation timed out")
 * @returns The resolved value if promise wins
 * @throws TimeoutError if the timer wins
 *
 * @example
 * const data = await timeout(fetchUser(id), 5000)
 * // rejects if fetchUser takes more than 5s
 *
 * @example
 * try {
 *   const result = await timeout(slowOperation(), 3000, 'Request took too long')
 * } catch (e) {
 *   console.log(e.message) // "Request took too long"
 * }
 */
export class TimeoutError extends Error {
  constructor(message: string = 'Operation timed out') {
    super(message)
    this.name = 'TimeoutError'
  }
}

export async function timeout<T>(
  promise: Promise<T>,
  ms: number,
  message?: string
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(message))
    }, ms)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    clearTimeout(timer!)
  }
}
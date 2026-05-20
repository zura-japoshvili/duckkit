/**
 * Calls a function N times with a delay between each call.
 *
 * The callback receives the current index (0-based).
 * Waits for the delay before the next iteration — not a fixed interval.
 *
 * @param times - Number of times to call the function
 * @param ms - Delay between each call in milliseconds
 * @param fn - Callback to run each iteration, receives current index
 * @returns A promise that resolves when all iterations are done
 *
 * @example
 * await repeat(3, 500, i => console.log(`tick ${i}`))
 * // logs "tick 0", waits 500ms, "tick 1", waits 500ms, "tick 2"
 *
 * @example
 * // Retry an API call up to 3 times
 * await repeat(3, 1000, async () => {
 *   await fetchData()
 * })
 */
export async function repeat(
  times: number,
  ms: number,
  fn: (index: number) => void | Promise<void>
): Promise<void> {
  for (let i = 0; i < times; i++) {
    await fn(i)
    if (i < times - 1) await new Promise(r => setTimeout(r, ms))
  }
}
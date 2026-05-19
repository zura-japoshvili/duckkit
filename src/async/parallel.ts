/**
 * Runs async tasks in parallel with an optional concurrency limit.
 *
 * Without a limit, all tasks start at once (like `Promise.all`).
 * With a limit, at most `concurrency` tasks run simultaneously —
 * preventing API rate limit hits or memory spikes on large batches.
 *
 * @param tasks - Array of async functions to run
 * @param options - Optional `{ concurrency: number }`
 * @returns Array of results in the same order as tasks
 *
 * @example
 * // all at once
 * const results = await parallel([fetchA, fetchB, fetchC])
 *
 * @example
 * // max 2 at a time — useful for API rate limits
 * const results = await parallel(
 *   urls.map(url => () => fetch(url)),
 *   { concurrency: 2 }
 * )
 */
export async function parallel<T>(
  tasks: (() => Promise<T>)[],
  options: { concurrency?: number } = {}
): Promise<T[]> {
  const { concurrency } = options

  if (!concurrency || concurrency >= tasks.length) {
    return Promise.all(tasks.map(t => t()))
  }

  const results: T[] = new Array(tasks.length)
  let index = 0

  async function worker() {
    while (index < tasks.length) {
      const i = index++
      results[i] = await tasks[i]!()
    }
  }

  const workers = Array.from({ length: concurrency }, worker)
  await Promise.all(workers)
  return results
}
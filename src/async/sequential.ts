/**
 * Runs async tasks one after another, in order.
 *
 * Unlike `Promise.all`, each task waits for the previous one to finish.
 * Useful when order matters or tasks have side effects that depend on each other.
 *
 * @param tasks - Array of async functions to run in sequence
 * @returns Array of results in the same order as tasks
 *
 * @example
 * const results = await sequential([
 *   () => createUser(data),
 *   () => sendWelcomeEmail(data.email),
 *   () => logSignup(data.id),
 * ])
 *
 * @example
 * // process items one at a time
 * await sequential(items.map(item => () => processItem(item)))
 */
export async function sequential<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = []
  for (const task of tasks) {
    results.push(await task())
  }
  return results
}
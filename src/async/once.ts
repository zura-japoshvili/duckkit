/**
 * Returns a version of `fn` that only executes on the first call.
 * All subsequent calls return the cached result without calling `fn` again.
 *
 * Useful for lazy initialization, one-time setup, singleton factories.
 *
 * @param fn - The function to wrap
 * @returns A function that executes `fn` only once
 *
 * @example
 * const init = once(() => {
 *   console.log('initializing...')
 *   return setupDatabase()
 * })
 *
 * init() // runs, logs "initializing..."
 * init() // returns cached result, fn never called again
 *
 * @example
 * const getConfig = once(() => loadConfigFromDisk())
 * // no matter how many times called, disk is read once
 */
export function once<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  let called = false
  let result: R

  return (...args: Args): R => {
    if (!called) {
      called = true
      result = fn(...args)
    }
    return result
  }
}
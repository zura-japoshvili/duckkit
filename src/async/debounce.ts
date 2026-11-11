/** A debounced function, plus `cancel()` and `flush()`. */
export interface Debounced<Args extends unknown[]> {
  (...args: Args): void
  /** Drops the pending call, if there is one. */
  cancel(): void
  /** Runs the pending call right now instead of waiting, if there is one. */
  flush(): void
}

/**
 * Returns a debounced version of `fn` that delays execution until
 * `delay` ms have passed since the last call.
 *
 * Every new call resets the timer. Only the last call in a burst executes.
 * Useful for search inputs, resize handlers, form autosave.
 *
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns A debounced function with the same argument signature, plus `cancel()` and `flush()`
 *
 * @example
 * const search = debounce((query: string) => fetchResults(query), 300)
 * // typing fast — only fires 300ms after the user stops
 *
 * @example
 * const save = debounce(() => saveForm(), 1000)
 * window.addEventListener('beforeunload', () => save.flush()) // don't lose the last edit
 * // or drop it, e.g. when the component unmounts:
 * save.cancel()
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): Debounced<Args> {
  let timer: ReturnType<typeof setTimeout> | undefined
  let pendingArgs: Args | undefined

  function run(): void {
    timer = undefined
    const args = pendingArgs
    pendingArgs = undefined
    if (args) fn(...args)
  }

  const debounced = (...args: Args): void => {
    pendingArgs = args
    clearTimeout(timer)
    timer = setTimeout(run, delay)
  }

  debounced.cancel = (): void => {
    clearTimeout(timer)
    timer = undefined
    pendingArgs = undefined
  }

  debounced.flush = (): void => {
    if (timer === undefined) return
    clearTimeout(timer)
    run()
  }

  return debounced
}

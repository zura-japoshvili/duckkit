const MAX_TIMEOUT = 2_147_483_647

/** A throttled function, plus `cancel()`. */
export interface Throttled<Args extends unknown[]> {
  (...args: Args): void
  /** Drops the pending trailing call and resets the timer, so the next call runs immediately. */
  cancel(): void
}

/**
 * Returns a throttled version of a function that runs at most once per `ms` milliseconds.
 *
 * The first call runs immediately. Calls made while waiting are not lost: the
 * last one runs when the wait ends (the "trailing" call), with the newest
 * arguments. Pass `{ trailing: false }` to drop them instead.
 *
 * @param fn - The function to throttle
 * @param ms - Minimum time between runs in milliseconds
 * @param options.trailing - Run the last call made while waiting once the wait ends (default: `true`)
 * @returns A throttled function with the same signature, plus `cancel()`
 *
 * @example
 * const onScroll = throttle(() => updatePosition(), 100)
 * window.addEventListener('scroll', onScroll)
 * // runs immediately, at most once every 100ms, and once more after scrolling stops
 *
 * @example
 * const onResize = throttle(() => recalcLayout(), 200, { trailing: false })
 * // later, e.g. when the component unmounts:
 * onResize.cancel()
 */
export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  ms: number,
  options: { trailing?: boolean | undefined } = {}
): Throttled<Args> {
  const trailing = options.trailing ?? true
  let lastRun: number | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let pendingArgs: Args | undefined

  function run(args: Args): void {
    lastRun = Date.now()
    fn(...args)
  }

  function runPending(): void {
    timer = undefined
    const next = pendingArgs
    pendingArgs = undefined
    if (next) run(next)
  }

  // setTimeout fires almost immediately for delays above 2^31 - 1 ms (~24.8 days),
  // so longer waits are split into chunks
  function scheduleTrailing(wait: number): void {
    timer = setTimeout(() => {
      if (wait > MAX_TIMEOUT) scheduleTrailing(wait - MAX_TIMEOUT)
      else runPending()
    }, Math.min(wait, MAX_TIMEOUT))
  }

  const throttled = (...args: Args): void => {
    const elapsed = lastRun === undefined ? Infinity : Date.now() - lastRun
    // elapsed < 0 means the system clock moved back — treat the wait as over
    if (elapsed >= ms || elapsed < 0) {
      clearTimeout(timer)
      timer = undefined
      pendingArgs = undefined
      run(args)
      return
    }
    // With ms = Infinity the wait never ends, so there is no trailing call to schedule
    if (!trailing || ms === Infinity) return
    pendingArgs = args
    if (timer === undefined) scheduleTrailing(ms - elapsed)
  }

  throttled.cancel = (): void => {
    clearTimeout(timer)
    timer = undefined
    pendingArgs = undefined
    lastRun = undefined
  }

  return throttled
}

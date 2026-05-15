/**
 * Returns a throttled version of a function that fires at most once per `ms` milliseconds.
 *
 * Unlike debounce which resets on every call, throttle guarantees
 * the function fires immediately then ignores calls until the interval passes.
 *
 * @param fn - The function to throttle
 * @param ms - Minimum time between calls in milliseconds
 * @returns A throttled function with the same signature
 *
 * @example
 * const onScroll = throttle(() => updatePosition(), 100)
 * window.addEventListener('scroll', onScroll)
 * // fires immediately, then at most once every 100ms
 *
 * @example
 * const onResize = throttle(() => recalcLayout(), 200)
 */
export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  ms: number
): (...args: Args) => void {
  let lastCall = 0

  return (...args: Args): void => {
    const now = Date.now()
    if (now - lastCall >= ms) {
      lastCall = now
      fn(...args)
    }
  }
}
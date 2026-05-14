/**
 * Returns a debounced version of `fn` that delays execution until
 * `delay` ms have passed since the last call.
 *
 * Every new call resets the timer. Only the last call in a burst executes.
 * Useful for search inputs, resize handlers, form autosave.
 *
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns A debounced function with the same argument signature
 *
 * @example
 * const search = debounce((query: string) => fetchResults(query), 300)
 * // typing fast — only fires 300ms after the user stops
 *
 * @example
 * const save = debounce(() => saveForm(), 1000)
 * window.addEventListener('resize', debounce(recalcLayout, 150))
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined

  return (...args: Args): void => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
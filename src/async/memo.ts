/**
 * Memoizes a function — caches results by arguments and returns cached value on repeat calls.
 *
 * Uses `JSON.stringify` for cache keying, so works well with
 * primitives and plain objects. Not suitable for functions that take
 * non-serializable args (e.g. class instances, functions, `undefined`).
 *
 * For async functions, use `memoAsync` instead — it deduplicates concurrent calls.
 *
 * @param fn - The function to memoize
 * @param options.maxSize - Max number of cached entries. When exceeded, the oldest entry is evicted (FIFO).
 * @returns A memoized version of `fn` with the same signature
 *
 * @example
 * const expensiveCalc = memo((n: number) => n * n * n)
 * expensiveCalc(5) // calculates → 125
 * expensiveCalc(5) // cached → 125, fn not called again
 *
 * @example
 * // Bounded cache — safe for long-running apps
 * const getUser = memo((id: string) => db.findUser(id), { maxSize: 100 })
 */
export function memo<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  options?: { maxSize?: number }
): (...args: Args) => R {
  const cache = new Map<string, R>()
  const maxSize = options?.maxSize

  return (...args: Args): R => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key) as R

    const result = fn(...args)
    cache.set(key, result)

    if (maxSize && cache.size > maxSize) {
      cache.delete(cache.keys().next().value!)
    }

    return result
  }
}
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
 * @returns A memoized version of `fn` with the same signature
 *
 * @example
 * const expensiveCalc = memo((n: number) => n * n * n)
 * expensiveCalc(5) // calculates → 125
 * expensiveCalc(5) // cached → 125, fn not called again
 *
 * @example
 * const getUser = memo((id: string) => db.findUser(id))
 * await getUser('abc') // hits db
 * await getUser('abc') // from cache
 */
export function memo<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  const cache = new Map<string, R>()
  return (...args: Args): R => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key) as R
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}
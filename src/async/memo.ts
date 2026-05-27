/**
 * Memoizes a function — caches results by arguments and returns cached value on repeat calls.
 *
 * Uses `JSON.stringify` for cache keying. This means:
 * - Throws on circular references and `BigInt` args
 * - Functions, symbols, and `undefined` values inside objects are dropped, causing collisions
 * - Object key order affects the cache key (`{a:1,b:2}` and `{b:2,a:1}` are different)
 * - `null` and `undefined` as top-level args produce the same cache key
 *
 * For async functions, use `memoAsync` instead — it deduplicates concurrent calls.
 *
 * @param fn - The function to memoize
 * @param options.maxSize - Max number of cached entries (must be a positive integer).
 *   When exceeded, the oldest entry is evicted (FIFO).
 * @returns A memoized version of `fn` with the same signature
 * @throws If `maxSize` is provided and is not a positive integer
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
  if (options?.maxSize !== undefined) {
    if (!Number.isInteger(options.maxSize) || options.maxSize < 1) {
      throw new Error('memo: maxSize must be a positive integer')
    }
  }

  const cache = new Map<string, R>()
  const maxSize = options?.maxSize

  return (...args: Args): R => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key) as R

    const result = fn(...args)
    cache.set(key, result)

    if (maxSize !== undefined && cache.size > maxSize) {
      cache.delete(cache.keys().next().value!)
    }

    return result
  }
}
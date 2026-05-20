/**
 * Memoizes an async function — caches the resolved value by arguments.
 *
 * Unlike wrapping `memo` around an async function, `memoAsync` caches
 * the *promise itself* on first call — so concurrent calls with the same
 * args share one request instead of firing duplicates.
 *
 * Uses `JSON.stringify` for cache keying. Not suitable for non-serializable args
 * (class instances, functions, circular objects).
 *
 * @param fn - The async function to memoize
 * @param options.maxSize - Max number of cached entries. When exceeded, the oldest entry is evicted (FIFO).
 * @returns A memoized async function with the same signature
 *
 * @example
 * const getUser = memoAsync((id: string) => fetchUser(id))
 *
 * await getUser('123') // fetches
 * await getUser('123') // from cache — no request made
 *
 * @example
 * // concurrent calls share one request
 * await Promise.all([getUser('123'), getUser('123')])
 * // fetchUser called only once ✅
 *
 * @example
 * // Bounded cache — safe for long-running apps
 * const getUser = memoAsync(fetchUser, { maxSize: 200 })
 */
export function memoAsync<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  options?: { maxSize?: number }
): (...args: Args) => Promise<R> {
  const cache = new Map<string, Promise<R>>()
  const maxSize = options?.maxSize

  return (...args: Args): Promise<R> => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key) as Promise<R>

    const promise = fn(...args).catch(err => {
      cache.delete(key)
      return Promise.reject(err)
    })

    cache.set(key, promise)

    if (maxSize && cache.size > maxSize) {
      cache.delete(cache.keys().next().value!)
    }

    return promise
  }
}
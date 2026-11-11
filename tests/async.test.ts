import { describe, it, expect, vi } from 'vitest'
import { safe, safeAsync, pipe, memo, debounce } from '../src/async/index'
import { throttle, retry, timeout, TimeoutError } from '../src/async/index'
import { once, memoAsync, defer, parallel, sequential } from '../src/async/index'

describe('throttle', () => {
  it('calls fn immediately on first call', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('ignores calls within the interval', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    throttled()
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('allows call after interval passes', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    vi.advanceTimersByTime(100)
    throttled()
    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('passes args correctly', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled('hello', 42)
    expect(fn).toHaveBeenCalledWith('hello', 42)
    vi.useRealTimers()
  })

  it('runs the last call made during the wait once it ends (trailing)', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled('a')
    throttled('b')
    throttled('c')
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('c')
    vi.useRealTimers()
  })

  it('keeps the interval after a trailing call', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled('a')                 // t=0   runs
    vi.advanceTimersByTime(50)
    throttled('b')                 // t=50  pending
    vi.advanceTimersByTime(50)     // t=100 trailing 'b' runs
    expect(fn).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(50)
    throttled('c')                 // t=150 only 50ms since 'b' — pending
    expect(fn).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(50)     // t=200 'c' runs
    expect(fn).toHaveBeenCalledTimes(3)
    expect(fn).toHaveBeenLastCalledWith('c')
    vi.useRealTimers()
  })

  it('does not add a trailing call when nothing was called during the wait', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('{ trailing: false } drops calls made during the wait', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 100, { trailing: false })
    throttled('a')
    throttled('b')
    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('a')
    vi.useRealTimers()
  })

  it('cancel() drops the pending call and lets the next call run immediately', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled('a')
    throttled('b')
    throttled.cancel()
    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
    throttled('c')
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('c')
    vi.useRealTimers()
  })

  it('waits for windows longer than setTimeout allows (~24.8 days)', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const day = 24 * 3600 * 1000
    const throttled = throttle(fn, 30 * day)
    throttled('a')
    throttled('b')
    vi.advanceTimersByTime(day)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(29 * day)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('b')
    vi.useRealTimers()
  })

  it('with ms = Infinity runs once and never schedules a trailing call', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, Infinity)
    throttled('a')
    throttled('b')
    vi.advanceTimersByTime(365 * 24 * 3600 * 1000)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
    vi.useRealTimers()
  })

  it('accepts { trailing: undefined } (exactOptionalPropertyTypes)', () => {
    const options: { trailing?: boolean | undefined } = { trailing: undefined }
    expect(typeof throttle(() => {}, 100, options)).toBe('function')
  })

  it('runs immediately again if the system clock moves backward', () => {
    vi.useFakeTimers()
    vi.setSystemTime(10_000)
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled('a')
    vi.setSystemTime(5_000)
    throttled('b')
    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })
})

describe('retry', () => {
  it('returns value on first success', async () => {
    const fn = vi.fn().mockResolvedValue(42)
    expect(await retry(fn, 3)).toBe(42)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on failure and succeeds', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok')
    expect(await retry(fn, 3)).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('throws after all attempts fail', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'))
    await expect(retry(fn, 3)).rejects.toThrow('always fails')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('defaults to 3 attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'))
    await expect(retry(fn)).rejects.toThrow()
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('wraps non-Error throws', async () => {
    const fn = vi.fn().mockRejectedValue('string error')
    await expect(retry(fn, 1)).rejects.toBeInstanceOf(Error)
  })
})

describe('retry — validation', () => {
  it('throws on times = 0', async () => {
    await expect(retry(async () => 1, 0)).rejects.toThrow(/positive integer/)
  })
 
  it('throws on negative times', async () => {
    await expect(retry(async () => 1, -1)).rejects.toThrow(/positive integer/)
  })
 
  it('throws on non-integer times', async () => {
    await expect(retry(async () => 1, 1.5)).rejects.toThrow(/positive integer/)
  })
 
  it('throws on NaN times', async () => {
    await expect(retry(async () => 1, NaN)).rejects.toThrow(/positive integer/)
  })
})
 
describe('retry — backoff delay sequence', () => {
  it('with times=3 and backoff, waits delayMs then delayMs*2 between attempts', async () => {
    // Fake timers make the delays exact — real timers made this test flaky on busy machines.
    vi.useFakeTimers()
    try {
      const calledAt: number[] = []
      const fn = vi.fn(async () => {
        calledAt.push(Date.now())
        throw new Error('always fails')
      })

      const assertion = expect(retry(fn, 3, 50, true)).rejects.toThrow('always fails')
      await vi.runAllTimersAsync()
      await assertion

      expect(fn).toHaveBeenCalledTimes(3)
      expect([calledAt[1]! - calledAt[0]!, calledAt[2]! - calledAt[1]!]).toEqual([50, 100])
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('timeout', () => {
  it('resolves if promise wins', async () => {
    const result = await timeout(Promise.resolve(42), 1000)
    expect(result).toBe(42)
  })

  it('rejects with TimeoutError if timer wins', async () => {
    vi.useFakeTimers()
    const p = new Promise(() => {})
    const result = timeout(p, 1000)
    vi.advanceTimersByTime(1000)
    await expect(result).rejects.toBeInstanceOf(TimeoutError)
    vi.useRealTimers()
  })

  it('uses custom error message', async () => {
    vi.useFakeTimers()
    const p = new Promise(() => {})
    const result = timeout(p, 1000, 'too slow')
    vi.advanceTimersByTime(1000)
    await expect(result).rejects.toThrow('too slow')
    vi.useRealTimers()
  })

  it('TimeoutError has correct name', async () => {
    vi.useFakeTimers()
    const p = new Promise(() => {})
    const result = timeout(p, 1000)
    vi.advanceTimersByTime(1000)
    await expect(result).rejects.toMatchObject({ name: 'TimeoutError' })
    vi.useRealTimers()
  })
})

describe('safe', () => {
  it('returns ok result on success', () => {
    const result = safe(() => JSON.parse('{"a":1}'))
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toEqual({ a: 1 })
  })

  it('returns err result on throw', () => {
    const result = safe(() => JSON.parse('bad json'))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toBeInstanceOf(Error)
  })

  it('wraps non-Error throws in Error', () => {
    const result = safe(() => { throw 'string error' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toBe('string error')
  })

  it('wraps thrown numbers in Error', () => {
    const result = safe(() => { throw 42 })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toBe('42')
  })

  it('returns null value as ok', () => {
    const result = safe(() => null)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBeNull()
  })

  it('returns undefined value as ok', () => {
    const result = safe(() => undefined)
    expect(result.ok).toBe(true)
  })

  it('preserves the original Error instance', () => {
    const original = new TypeError('bad type')
    const result = safe(() => { throw original })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toBe(original)
  })
})

describe('safeAsync', () => {
  it('returns ok for resolved promise', async () => {
    const result = await safeAsync(() => Promise.resolve(42))
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(42)
  })

  it('returns err for rejected promise', async () => {
    const result = await safeAsync(() => Promise.reject(new Error('oops')))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toBe('oops')
  })

  it('wraps non-Error rejection in Error', async () => {
    const result = await safeAsync(() => Promise.reject('string rejection'))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toBeInstanceOf(Error)
  })

  it('handles async function that throws synchronously inside', async () => {
    const result = await safeAsync(async () => { throw new Error('sync inside async') })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toBe('sync inside async')
  })

  it('returns ok for void resolved promise', async () => {
    const result = await safeAsync(() => Promise.resolve(undefined))
    expect(result.ok).toBe(true)
  })
})

describe('pipe', () => {
  it('chains transformations', () => {
    const result = pipe([1, 2, 3, 4, 5, 6])
      .through(arr => arr.filter(n => n % 2 === 0))
      .through(arr => arr.map(n => n * 10))
      .value()
    expect(result).toEqual([20, 40, 60])
  })

  it('works with type changes between steps', () => {
    const result = pipe(42)
      .through(n => String(n))
      .through(s => s.length)
      .value()
    expect(result).toBe(2)
  })

  it('single step works', () => {
    const result = pipe(5).through(n => n * 2).value()
    expect(result).toBe(10)
  })

  it('no through returns original value', () => {
    expect(pipe(42).value()).toBe(42)
  })

  it('works with objects', () => {
    const result = pipe({ name: 'zura', age: 25 })
      .through(u => ({ ...u, name: u.name.toUpperCase() }))
      .through(u => u.name)
      .value()
    expect(result).toBe('ZURA')
  })

  it('works with strings', () => {
    const result = pipe('  hello world  ')
      .through(s => s.trim())
      .through(s => s.toUpperCase())
      .through(s => s.split(' '))
      .value()
    expect(result).toEqual(['HELLO', 'WORLD'])
  })
})

describe('memo', () => {
  it('caches results', () => {
    const fn = vi.fn((n: number) => n * n)
    const memoized = memo(fn)
    memoized(5)
    memoized(5)
    memoized(5)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('calls fn for different args', () => {
    const fn = vi.fn((n: number) => n * n)
    const memoized = memo(fn)
    memoized(5)
    memoized(6)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('returns correct cached value', () => {
    const memoized = memo((n: number) => n * 3)
    expect(memoized(4)).toBe(12)
    expect(memoized(4)).toBe(12)
  })

  it('works with multiple arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    const memoized = memo(fn)
    expect(memoized(1, 2)).toBe(3)
    expect(memoized(1, 2)).toBe(3)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('treats different arg combos as different cache keys', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    const memoized = memo(fn)
    memoized(1, 2)
    memoized(2, 1)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('each memoized instance has its own cache', () => {
    const fn = vi.fn((n: number) => n * 2)
    const a = memo(fn)
    const b = memo(fn)
    a(5)
    b(5)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('caches falsy return values correctly', () => {
    const fn = vi.fn(() => 0)
    const memoized = memo(fn)
    expect(memoized()).toBe(0)
    expect(memoized()).toBe(0)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('memo — maxSize validation', () => {
  it('throws on maxSize = 0', () => {
    expect(() => memo((x: number) => x, { maxSize: 0 })).toThrow(/positive integer/)
  })
 
  it('throws on negative maxSize', () => {
    expect(() => memo((x: number) => x, { maxSize: -1 })).toThrow(/positive integer/)
  })
 
  it('throws on non-integer maxSize', () => {
    expect(() => memo((x: number) => x, { maxSize: 1.5 })).toThrow(/positive integer/)
  })
 
  it('accepts omitted maxSize — unbounded', () => {
    const fn = memo((x: number) => x * 2)
    expect(fn(1)).toBe(2)
    expect(fn(2)).toBe(4)
  })
 
  it('evicts oldest entry when maxSize is exceeded', () => {
    const inner = vi.fn((x: number) => x * 2)
    const fn = memo(inner, { maxSize: 2 })
 
    fn(1) // cache: {1}
    fn(2) // cache: {1, 2}
    fn(3) // cache: {2, 3} — 1 evicted
    fn(1) // cache miss — inner called again
 
    expect(inner).toHaveBeenCalledTimes(4)
  })
})

describe('memo — documented limitations', () => {
  it('throws on BigInt args (JSON.stringify limitation)', () => {
    const fn = memo((x: bigint) => x * 2n)
    expect(() => fn(5n)).toThrow()
  })
 
  it('null and undefined args collide on cache key', () => {
    const inner = vi.fn((x: string | null | undefined) => x ?? 'default')
    const fn = memo(inner)
 
    fn(null)        // runs
    fn(undefined)   // cache hit (collision)
 
    expect(inner).toHaveBeenCalledTimes(1)
  })
 
  it('object key order produces different cache entries', () => {
    const inner = vi.fn((opts: Record<string, number>) => Object.values(opts).reduce((a, b) => a + b, 0))
    const fn = memo(inner)
 
    fn({ a: 1, b: 2 })
    fn({ b: 2, a: 1 })  // semantically equal, different key
 
    expect(inner).toHaveBeenCalledTimes(2)
  })
})
 
describe('memoAsync — rejected promise removes cache entry', () => {
  it('next call after rejection retries instead of returning cached error', async () => {
    let attempt = 0
    const inner = vi.fn(async () => {
      attempt++
      if (attempt === 1) throw new Error('first fails')
      return 'success'
    })
 
    const fn = memoAsync(inner)
 
    await expect(fn()).rejects.toThrow('first fails')
    const result = await fn()  // should retry, not return cached error
    expect(result).toBe('success')
    expect(inner).toHaveBeenCalledTimes(2)
  })
 
  it('concurrent calls share one in-flight promise', async () => {
    const inner = vi.fn(async () => {
      await new Promise(r => setTimeout(r, 50))
      return 'result'
    })
 
    const fn = memoAsync(inner)
    const results = await Promise.all([fn(), fn(), fn()])
 
    expect(results).toEqual(['result', 'result', 'result'])
    expect(inner).toHaveBeenCalledTimes(1)
  })
})

describe('debounce', () => {
  it('delays execution', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced()
    debounced()
    debounced()
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('passes args correctly', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced('hello', 42)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('hello', 42)
    vi.useRealTimers()
  })

  it('resets timer on each call', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('only uses args from the last call', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced('first')
    debounced('second')
    debounced('third')
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('third')
    vi.useRealTimers()
  })

  it('cancel() drops the pending call', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced('x')
    debounced.cancel()
    vi.advanceTimersByTime(500)
    expect(fn).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('flush() runs the pending call now, with the last args, and only once', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced('a')
    debounced('b')
    debounced.flush()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('b')
    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('flush() does nothing when no call is pending', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced.flush()
    debounced('a')
    vi.advanceTimersByTime(100)
    debounced.flush()
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('works normally after cancel()', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced('a')
    debounced.cancel()
    debounced('b')
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('b')
    vi.useRealTimers()
  })

  it('can be called again after delay expires', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })
})

describe('once', () => {
  it('calls fn only on first call', () => {
    const fn = vi.fn(() => 42)
    const onced = once(fn)
    onced()
    onced()
    onced()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('returns the same value on subsequent calls', () => {
    const onced = once(() => Math.random())
    const first = onced()
    const second = onced()
    expect(first).toBe(second)
  })

  it('passes args on first call', () => {
    const fn = vi.fn((x: number) => x * 2)
    const onced = once(fn)
    expect(onced(5)).toBe(10)
    expect(onced(99)).toBe(10)
  })

  it('works with void functions', () => {
    const fn = vi.fn()
    const onced = once(fn)
    onced()
    onced()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('each once instance is independent', () => {
    const fn = vi.fn(() => 1)
    const a = once(fn)
    const b = once(fn)
    a()
    b()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('memoAsync', () => {
  it('caches resolved value', async () => {
    const fn = vi.fn().mockResolvedValue(42)
    const memoized = memoAsync(fn)
    await memoized('key')
    await memoized('key')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('calls fn for different args', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const memoized = memoAsync(fn)
    await memoized('a')
    await memoized('b')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('concurrent calls with same args share one request', async () => {
    const fn = vi.fn().mockResolvedValue('data')
    const memoized = memoAsync(fn)
    await Promise.all([memoized('x'), memoized('x'), memoized('x')])
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('clears cache on rejection so next call retries', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok')
    const memoized = memoAsync(fn)
    await expect(memoized('key')).rejects.toThrow('fail')
    await expect(memoized('key')).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('returns correct value', async () => {
    const memoized = memoAsync(async (n: number) => n * 2)
    expect(await memoized(5)).toBe(10)
    expect(await memoized(5)).toBe(10)
  })
})

describe('memoAsync — maxSize validation', () => {
  it('throws on maxSize = 0', () => {
    expect(() => memoAsync(async (x: number) => x, { maxSize: 0 }))
      .toThrow(/positive integer/)
  })
 
  it('throws on negative maxSize', () => {
    expect(() => memoAsync(async (x: number) => x, { maxSize: -1 }))
      .toThrow(/positive integer/)
  })
 
  it('throws on non-integer maxSize', () => {
    expect(() => memoAsync(async (x: number) => x, { maxSize: 1.5 }))
      .toThrow(/positive integer/)
  })
})
 

describe('defer', () => {
  it('resolves with the given value', async () => {
    const d = defer<number>()
    d.resolve(42)
    expect(await d.promise).toBe(42)
  })

  it('rejects with the given reason', async () => {
    const d = defer<number>()
    d.reject(new Error('oops'))
    await expect(d.promise).rejects.toThrow('oops')
  })

  it('resolves asynchronously', async () => {
    const d = defer<string>()
    setTimeout(() => d.resolve('done'), 10)
    expect(await d.promise).toBe('done')
  })

  it('each defer is independent', async () => {
    const a = defer<number>()
    const b = defer<number>()
    a.resolve(1)
    b.resolve(2)
    expect(await a.promise).toBe(1)
    expect(await b.promise).toBe(2)
  })
})

describe('parallel', () => {
  it('runs all tasks and returns results', async () => {
    const results = await parallel([
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3),
    ])
    expect(results).toEqual([1, 2, 3])
  })

  it('preserves order of results', async () => {
    const results = await parallel([
      () => new Promise<number>(r => setTimeout(() => r(3), 30)),
      () => new Promise<number>(r => setTimeout(() => r(1), 10)),
      () => new Promise<number>(r => setTimeout(() => r(2), 20)),
    ])
    expect(results).toEqual([3, 1, 2])
  })

  it('handles empty array', async () => {
    expect(await parallel([])).toEqual([])
  })

  it('respects concurrency limit', async () => {
    let active = 0
    let maxActive = 0

    const task = () => new Promise<void>(r => {
      active++
      maxActive = Math.max(maxActive, active)
      setTimeout(() => { active--; r() }, 10)
    })

    await parallel(Array.from({ length: 6 }, () => task), { concurrency: 2 })
    expect(maxActive).toBeLessThanOrEqual(2)
  })

  it('without concurrency runs all at once', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    await parallel([fn, fn, fn])
    expect(fn).toHaveBeenCalledTimes(3)
  })
})

describe('parallel — concurrency validation', () => {
  it('throws on negative concurrency', async () => {
    await expect(parallel([async () => 1], { concurrency: -1 }))
      .rejects.toThrow(/positive integer/)
  })
 
  it('throws on concurrency = 0', async () => {
    await expect(parallel([async () => 1], { concurrency: 0 }))
      .rejects.toThrow(/positive integer/)
  })
 
  it('throws on non-integer concurrency', async () => {
    await expect(parallel([async () => 1], { concurrency: 2.5 }))
      .rejects.toThrow(/positive integer/)
  })
 
  it('throws on NaN concurrency', async () => {
    await expect(parallel([async () => 1], { concurrency: NaN }))
      .rejects.toThrow(/positive integer/)
  })
 
  it('accepts undefined concurrency — unlimited', async () => {
    const result = await parallel([async () => 1, async () => 2, async () => 3])
    expect(result).toEqual([1, 2, 3])
  })
})

describe('sequential', () => {
  it('runs tasks in order and returns results', async () => {
    const order: number[] = []
    await sequential([
      async () => { order.push(1); return 1 },
      async () => { order.push(2); return 2 },
      async () => { order.push(3); return 3 },
    ])
    expect(order).toEqual([1, 2, 3])
  })

  it('returns results array', async () => {
    const results = await sequential([
      () => Promise.resolve('a'),
      () => Promise.resolve('b'),
      () => Promise.resolve('c'),
    ])
    expect(results).toEqual(['a', 'b', 'c'])
  })

  it('handles empty array', async () => {
    expect(await sequential([])).toEqual([])
  })

  it('waits for each task before starting next', async () => {
    const log: string[] = []
    await sequential([
      async () => { log.push('start 1'); await new Promise(r => setTimeout(r, 10)); log.push('end 1') },
      async () => { log.push('start 2') },
    ])
    expect(log).toEqual(['start 1', 'end 1', 'start 2'])
  })

  it('rejects if any task fails', async () => {
    await expect(sequential([
      () => Promise.resolve(1),
      () => Promise.reject(new Error('fail')),
      () => Promise.resolve(3),
    ])).rejects.toThrow('fail')
  })
})
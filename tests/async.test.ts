import { describe, it, expect, vi } from 'vitest'
import { safe, safeAsync, pipe, memo, debounce } from '../src/async/index'
import { throttle, retry, timeout, TimeoutError } from '../src/async/index'

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
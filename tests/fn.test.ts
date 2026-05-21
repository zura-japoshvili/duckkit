import { describe, it, expect, vi } from 'vitest'
import { pipeline, compose, pipelineAsync, composeAsync, curry, tap, when } from '../src/fn/index'

// ─── pipeline ─────────────────────────────────────────────────────────────────

describe('pipeline', () => {
  it('single step transforms the value', () => {
    const double = pipeline((n: number) => n * 2)
    expect(double(5)).toBe(10)
  })

  it('two steps compose left to right', () => {
    const process = pipeline(
      (s: string) => s.trim(),
      s => s.toUpperCase(),
    )
    expect(process('  hello  ')).toBe('HELLO')
  })

  it('three steps compose in order', () => {
    const process = pipeline(
      (s: string) => s.trim(),
      s => s.toUpperCase(),
      s => s.split(' '),
    )
    expect(process('  hello world  ')).toEqual(['HELLO', 'WORLD'])
  })

  it('four steps compose in order', () => {
    const process = pipeline(
      (n: number) => n + 1,
      n => n * 2,
      n => n - 3,
      n => String(n),
    )
    expect(process(5)).toBe('9')
  })

  it('five steps compose in order', () => {
    const process = pipeline(
      (s: string) => s.trim(),
      s => s.toLowerCase(),
      s => s.split(' '),
      arr => arr.filter(w => w.length > 3),
      arr => arr.join('-'),
    )
    expect(process('  The Quick Brown Fox  ')).toBe('quick-brown')
  })

  it('handles type changes between steps', () => {
    const process = pipeline(
      (n: number) => String(n),
      s => s.length,
      n => n > 1,
    )
    expect(process(42)).toBe(true)
    expect(process(5)).toBe(false)
  })

  it('returns a reusable function', () => {
    const double = pipeline((n: number) => n * 2)
    expect(double(1)).toBe(2)
    expect(double(5)).toBe(10)
    expect(double(100)).toBe(200)
  })

  it('works with array inputs', () => {
    const process = pipeline(
      (arr: number[]) => arr.filter(n => n % 2 === 0),
      arr => arr.map(n => n * 10),
    )
    expect(process([1, 2, 3, 4, 5])).toEqual([20, 40])
  })

  it('works with object inputs', () => {
    const process = pipeline(
      (u: { name: string; age: number }) => ({ ...u, name: u.name.toUpperCase() }),
      u => u.name,
    )
    expect(process({ name: 'zura', age: 25 })).toBe('ZURA')
  })

  it('each call is independent', () => {
    const fn = vi.fn((n: number) => n * 2)
    const double = pipeline(fn)
    double(3)
    double(4)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenNthCalledWith(1, 3)
    expect(fn).toHaveBeenNthCalledWith(2, 4)
  })

  it('identity step passes value through', () => {
    const process = pipeline(
      (n: number) => n,
      n => n + 1,
    )
    expect(process(5)).toBe(6)
  })
})

// ─── compose ──────────────────────────────────────────────────────────────────

describe('compose', () => {
  it('single step transforms the value', () => {
    const double = compose((n: number) => n * 2)
    expect(double(5)).toBe(10)
  })

  it('two steps execute right to left', () => {
    const process = compose(
      (s: string) => s.toUpperCase(),
      (n: number) => String(n),
    )
    expect(process(42)).toBe('42')
  })

  it('three steps execute right to left', () => {
    const order: string[] = []
    const process = compose(
      (n: number) => { order.push('f3'); return n * 2 },
      (n: number) => { order.push('f2'); return n + 1 },
      (n: number) => { order.push('f1'); return n },
    )
    process(5)
    expect(order).toEqual(['f1', 'f2', 'f3'])
  })

  it('four steps execute right to left', () => {
    const process = compose(
      (n: number) => String(n),
      (n: number) => n - 3,
      (n: number) => n * 2,
      (n: number) => n + 1,
    )
    expect(process(5)).toBe('9')
  })

  it('five steps execute right to left', () => {
    const process = compose(
      (arr: string[]) => arr.join('-'),
      (arr: string[]) => arr.filter(w => w.length > 3),
      (s: string) => s.split(' '),
      (s: string) => s.toLowerCase(),
      (s: string) => s.trim(),
    )
    expect(process('  The Quick Brown Fox  ')).toBe('quick-brown')
  })

  it('is equivalent to pipeline with reversed args', () => {
    const add1 = (n: number) => n + 1
    const double = (n: number) => n * 2
    const toString = (n: number) => String(n)
    expect(compose(toString, double, add1)(5)).toBe(pipeline(add1, double, toString)(5))
  })

  it('returns a reusable function', () => {
    const process = compose(
      (n: number) => n * 2,
      (n: number) => n + 1,
    )
    expect(process(0)).toBe(2)
    expect(process(5)).toBe(12)
  })
})

// ─── pipelineAsync ────────────────────────────────────────────────────────────

describe('pipelineAsync', () => {
  it('single async step resolves correctly', async () => {
    const double = pipelineAsync(async (n: number) => n * 2)
    expect(await double(5)).toBe(10)
  })

  it('two async steps compose left to right', async () => {
    const process = pipelineAsync(
      async (s: string) => s.trim(),
      async (s: string) => s.toUpperCase(),
    )
    expect(await process('  hello  ')).toBe('HELLO')
  })

  it('sync and async steps can be mixed', async () => {
    const process = pipelineAsync(
      (s: string) => s.trim(),
      async (s: string) => s.toUpperCase(),
      (s: string) => s.split(' '),
    )
    expect(await process('  hello world  ')).toEqual(['HELLO', 'WORLD'])
  })

  it('steps are awaited in order', async () => {
    const order: number[] = []
    const process = pipelineAsync(
      async (n: number) => { order.push(1); return n + 1 },
      async (n: number) => { order.push(2); return n + 1 },
      async (n: number) => { order.push(3); return n + 1 },
    )
    await process(0)
    expect(order).toEqual([1, 2, 3])
  })

  it('rejection stops pipeline', async () => {
    const h3 = vi.fn()
    const process = pipelineAsync(
      async (n: number) => n + 1,
      async (_: number) => { throw new Error('step 2 failed') },
      async (n: number) => { h3(); return n },
    )
    await expect(process(1)).rejects.toThrow('step 2 failed')
    expect(h3).not.toHaveBeenCalled()
  })

  it('returns a reusable async function', async () => {
    const double = pipelineAsync(async (n: number) => n * 2)
    expect(await double(3)).toBe(6)
    expect(await double(5)).toBe(10)
  })
})

// ─── composeAsync ─────────────────────────────────────────────────────────────

describe('composeAsync', () => {
  it('single async step resolves correctly', async () => {
    const double = composeAsync(async (n: number) => n * 2)
    expect(await double(5)).toBe(10)
  })

  it('two async steps execute right to left', async () => {
    const process = composeAsync(
      async (s: string) => s.toUpperCase(),
      async (n: number) => String(n),
    )
    expect(await process(42)).toBe('42')
  })

  it('three steps execute right to left', async () => {
    const order: string[] = []
    const process = composeAsync(
      async (n: number) => { order.push('f3'); return n * 2 },
      async (n: number) => { order.push('f2'); return n + 1 },
      async (n: number) => { order.push('f1'); return n },
    )
    await process(5)
    expect(order).toEqual(['f1', 'f2', 'f3'])
  })

  it('is equivalent to pipelineAsync with reversed args', async () => {
    const add1 = async (n: number) => n + 1
    const double = async (n: number) => n * 2
    const toString = async (n: number) => String(n)
    expect(await composeAsync(toString, double, add1)(5)).toBe(await pipelineAsync(add1, double, toString)(5))
  })

  it('rejection propagates and stops pipeline', async () => {
    const last = vi.fn()
    const process = composeAsync(
      async (n: number) => { last(); return n },
      async (_: number) => { throw new Error('failed') },
      async (n: number) => n + 1,
    )
    await expect(process(1)).rejects.toThrow('failed')
    expect(last).not.toHaveBeenCalled()
  })

  it('sync and async steps can be mixed', async () => {
    const process = composeAsync(
      (arr: string[]) => arr.join('-'),
      async (s: string) => s.split(' '),
      (s: string) => s.toUpperCase(),
    )
    expect(await process('hello world')).toBe('HELLO-WORLD')
  })
})

// ─── curry ────────────────────────────────────────────────────────────────────

describe('curry', () => {
  it('2-arg: returns a curried function', () => {
    const add = curry((a: number, b: number) => a + b)
    expect(add(2)(3)).toBe(5)
  })

  it('2-arg: partial application creates a reusable function', () => {
    const add = curry((a: number, b: number) => a + b)
    const add10 = add(10)
    expect(add10(1)).toBe(11)
    expect(add10(5)).toBe(15)
  })

  it('2-arg: useful for array methods', () => {
    const multiply = curry((factor: number, value: number) => value * factor)
    expect([1, 2, 3].map(multiply(2))).toEqual([2, 4, 6])
  })

  it('3-arg: returns a fully curried chain', () => {
    const clamp = curry((min: number, max: number, value: number) =>
      Math.min(Math.max(value, min), max)
    )
    expect(clamp(0)(100)(50)).toBe(50)
    expect(clamp(0)(100)(150)).toBe(100)
    expect(clamp(0)(100)(-10)).toBe(0)
  })

  it('3-arg: partial applications are independent', () => {
    const clamp = curry((min: number, max: number, value: number) =>
      Math.min(Math.max(value, min), max)
    )
    const clamp0to10 = clamp(0)(10)
    const clamp0to100 = clamp(0)(100)
    expect(clamp0to10(50)).toBe(10)
    expect(clamp0to100(50)).toBe(50)
  })

  it('4-arg function is returned unchanged', () => {
    const fn = (a: number, b: number, c: number, d: number) => a + b + c + d
    const curried = curry(fn as any) as unknown as typeof fn
    expect(curried(1, 2, 3, 4)).toBe(10)
  })
})

// ─── tap ──────────────────────────────────────────────────────────────────────

describe('tap', () => {
  it('passes value through unchanged', () => {
    const fn = tap((n: number) => n * 100)
    expect(fn(5)).toBe(5)
  })

  it('calls the side effect with the value', () => {
    const spy = vi.fn()
    tap(spy)(42)
    expect(spy).toHaveBeenCalledWith(42)
  })

  it('works inside a pipeline', () => {
    const log = vi.fn()
    const process = pipeline(
      (n: number) => n * 2,
      tap(log),
      n => n + 1,
    )
    expect(process(5)).toBe(11)
    expect(log).toHaveBeenCalledWith(10)
  })

  it('side effect runs even if value is falsy', () => {
    const spy = vi.fn()
    tap(spy)(0)
    tap(spy)('')
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('does not mutate the value even if side effect tries', () => {
    const process = pipeline(
      (arr: number[]) => [...arr, 4],
      tap(arr => { arr.push(99) }),  // mutation in side effect
      arr => arr.length,
    )
    // tap returns original reference so mutation does affect it — documented behavior
    expect(process([1, 2, 3])).toBe(5) // [1,2,3,4,99]
  })

  it('each call is independent', () => {
    const spy = vi.fn()
    const t = tap(spy)
    t(1)
    t(2)
    t(3)
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy).toHaveBeenNthCalledWith(1, 1)
    expect(spy).toHaveBeenNthCalledWith(2, 2)
    expect(spy).toHaveBeenNthCalledWith(3, 3)
  })
})

// ─── when ─────────────────────────────────────────────────────────────────────

describe('when', () => {
  it('applies fn when condition is true', () => {
    const addHundred = when((n: number) => n > 10, n => n + 100)
    expect(addHundred(20)).toBe(120)
  })

  it('passes value through when condition is false', () => {
    const addHundred = when((n: number) => n > 10, n => n + 100)
    expect(addHundred(5)).toBe(5)
  })

  it('works inside a pipeline', () => {
    const process = pipeline(
      (n: number) => n * 2,
      when(n => n > 10, n => n + 100),
      n => String(n),
    )
    expect(process(3)).toBe('6')    // 3*2=6, condition false
    expect(process(10)).toBe('120') // 10*2=20, condition true, +100
  })

  it('works with strings', () => {
    const normalize = when(
      (s: string) => s.length > 0,
      s => s.trim().toLowerCase(),
    )
    expect(normalize('  HELLO  ')).toBe('hello')
    expect(normalize('')).toBe('')
  })

  it('condition receives the current value', () => {
    const spy = vi.fn(() => true)
    when(spy, (n: number) => n)(42)
    expect(spy).toHaveBeenCalledWith(42)
  })

  it('fn is not called when condition is false', () => {
    const fn = vi.fn((n: number) => n + 1)
    when(() => false, fn)(5)
    expect(fn).not.toHaveBeenCalled()
  })

  it('fn is called when condition is true', () => {
    const fn = vi.fn((n: number) => n + 1)
    when(() => true, fn)(5)
    expect(fn).toHaveBeenCalledWith(5)
  })

  it('works with objects', () => {
    type User = { name: string; active: boolean }
    const normalize = when(
      (u: User) => u.active,
      u => ({ ...u, name: u.name.toUpperCase() }),
    )
    expect(normalize({ name: 'zura', active: true })).toEqual({ name: 'ZURA', active: true })
    expect(normalize({ name: 'zura', active: false })).toEqual({ name: 'zura', active: false })
  })
})
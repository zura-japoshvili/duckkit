import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { delay, delaySkippable, delayWithAbort, repeat } from '../src/delay/index'

beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })
describe('delay', () => {
  it('resolves after given ms', async () => {
    let resolved = false
    delay(1000).then(() => { resolved = true })

    expect(resolved).toBe(false)
    await vi.advanceTimersByTimeAsync(1000)
    expect(resolved).toBe(true)
  })

  it('does not resolve before time is up', async () => {
    let resolved = false
    delay(1000).then(() => { resolved = true })

    await vi.advanceTimersByTimeAsync(500)
    expect(resolved).toBe(false)
  })

  it('resolves immediately for 0ms', async () => {
    let resolved = false
    delay(0).then(() => { resolved = true })

    await vi.advanceTimersByTimeAsync(0)
    expect(resolved).toBe(true)
  })
})

describe('delaySkippable', () => {
  it('resolves after full duration when condition stays false', async () => {
    let resolved = false
    delaySkippable(1000, () => false).then(() => { resolved = true })

    await vi.advanceTimersByTimeAsync(999)
    expect(resolved).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(resolved).toBe(true)
  })

  it('resolves early when condition becomes true', async () => {
    let skip = false
    let resolved = false
    delaySkippable(1000, () => skip, 50).then(() => { resolved = true })

    await vi.advanceTimersByTimeAsync(200)
    skip = true
    await vi.advanceTimersByTimeAsync(50)
    expect(resolved).toBe(true)
  })

  it('resolves immediately if condition is already true', async () => {
    let resolved = false
    delaySkippable(1000, () => true).then(() => { resolved = true })

    await vi.advanceTimersByTimeAsync(0)
    expect(resolved).toBe(true)
  })

    it('respects custom poll interval', async () => {
    let skip = false
    let resolved = false
    delaySkippable(2000, () => skip, 200).then(() => { resolved = true })

    await vi.advanceTimersByTimeAsync(100)
    skip = true

    // t=150 — poll fires at t=200, hasn't fired yet
    await vi.advanceTimersByTimeAsync(50)
    expect(resolved).toBe(false)

    // t=250 — poll already fired at t=200, resolved
    await vi.advanceTimersByTimeAsync(100)
    expect(resolved).toBe(true)
    })  
})

describe('delayWithAbort', () => {
  it('resolves after full duration when not aborted', async () => {
    const controller = new AbortController()
    let resolved = false
    delayWithAbort(1000, controller.signal).then(() => { resolved = true })

    await vi.advanceTimersByTimeAsync(1000)
    expect(resolved).toBe(true)
  })

  it('rejects when aborted before timeout', async () => {
    const controller = new AbortController()
    let errorName = ''

    delayWithAbort(1000, controller.signal).catch(e => {
      errorName = (e as DOMException).name
    })

    await vi.advanceTimersByTimeAsync(300)
    controller.abort()
    await vi.advanceTimersByTimeAsync(0)

    expect(errorName).toBe('AbortError')
  })

  it('rejects immediately if signal already aborted', async () => {
    const controller = new AbortController()
    controller.abort()

    let errorName = ''
    delayWithAbort(1000, controller.signal).catch(e => {
      errorName = (e as DOMException).name
    })

    await vi.advanceTimersByTimeAsync(0)
    expect(errorName).toBe('AbortError')
  })

  it('does not resolve after abort', async () => {
    const controller = new AbortController()
    let resolved = false
    let rejected = false

    delayWithAbort(1000, controller.signal)
      .then(() => { resolved = true })
      .catch(() => { rejected = true })

    controller.abort()
    await vi.advanceTimersByTimeAsync(1000)

    expect(resolved).toBe(false)
    expect(rejected).toBe(true)
  })
})

describe('repeat', () => {
  it('calls fn the correct number of times', async () => {
    const fn = vi.fn()
    const p = repeat(3, 100, fn)
    await vi.advanceTimersByTimeAsync(300)
    await p
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('passes correct index to each call', async () => {
    const indices: number[] = []
    const p = repeat(3, 100, i => { indices.push(i) })
    await vi.advanceTimersByTimeAsync(300)
    await p
    expect(indices).toEqual([0, 1, 2])
  })

  it('waits between calls', async () => {
    const fn = vi.fn()
    repeat(3, 500, fn)

    await vi.advanceTimersByTimeAsync(0)
    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(500)
    expect(fn).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(500)
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('no delay after last call', async () => {
    const fn = vi.fn()
    let done = false
    repeat(2, 500, fn).then(() => { done = true })

    await vi.advanceTimersByTimeAsync(500) // first call + delay
    await vi.advanceTimersByTimeAsync(0)   // second call fires immediately
    await vi.advanceTimersByTimeAsync(0)   // promise resolves
    expect(done).toBe(true)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('times = 0 never calls fn', async () => {
    const fn = vi.fn()
    const p = repeat(0, 100, fn)
    await vi.advanceTimersByTimeAsync(0)
    await p
    expect(fn).not.toHaveBeenCalled()
  })

  it('times = 1 calls fn once with no delay', async () => {
    const fn = vi.fn()
    const p = repeat(1, 500, fn)
    await vi.advanceTimersByTimeAsync(0)
    await p
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('works with async callback', async () => {
    const results: number[] = []
    const p = repeat(3, 100, async i => {
      await Promise.resolve()
      results.push(i * 2)
    })
    await vi.advanceTimersByTimeAsync(300)
    await p
    expect(results).toEqual([0, 2, 4])
  })

  it('negative times never calls fn', async () => {
    const fn = vi.fn()
    const p = repeat(-1, 100, fn)
    await vi.advanceTimersByTimeAsync(0)
    await p
    expect(fn).not.toHaveBeenCalled()
  })
})
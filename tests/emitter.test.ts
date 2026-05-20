import { describe, it, expect, vi } from 'vitest'
import { createEmitter } from '../src/emitter/index'

// ─── createEmitter ────────────────────────────────────────────────────────────

describe('createEmitter — on / emit', () => {
  it('calls handler when event is emitted', () => {
    const emitter = createEmitter<{ win: number }>()
    const handler = vi.fn()
    emitter.on('win', handler)
    emitter.emit('win', 100)
    expect(handler).toHaveBeenCalledWith(100)
  })

  it('calls handler with correct payload type', () => {
    const emitter = createEmitter<{ score: { value: number; label: string } }>()
    const handler = vi.fn()
    emitter.on('score', handler)
    emitter.emit('score', { value: 42, label: 'high' })
    expect(handler).toHaveBeenCalledWith({ value: 42, label: 'high' })
  })

  it('void event handler is called with no payload', () => {
    const emitter = createEmitter<{ spin: void }>()
    const handler = vi.fn()
    emitter.on('spin', handler)
    emitter.emit('spin')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('multiple handlers on the same event are all called', () => {
    const emitter = createEmitter<{ win: number }>()
    const h1 = vi.fn()
    const h2 = vi.fn()
    const h3 = vi.fn()
    emitter.on('win', h1)
    emitter.on('win', h2)
    emitter.on('win', h3)
    emitter.emit('win', 50)
    expect(h1).toHaveBeenCalledWith(50)
    expect(h2).toHaveBeenCalledWith(50)
    expect(h3).toHaveBeenCalledWith(50)
  })

  it('handlers are called in subscription order', () => {
    const emitter = createEmitter<{ tick: void }>()
    const order: number[] = []
    emitter.on('tick', () => order.push(1))
    emitter.on('tick', () => order.push(2))
    emitter.on('tick', () => order.push(3))
    emitter.emit('tick')
    expect(order).toEqual([1, 2, 3])
  })

  it('emitting a different event does not fire unrelated handlers', () => {
    const emitter = createEmitter<{ win: number; spin: void }>()
    const winHandler = vi.fn()
    emitter.on('win', winHandler)
    emitter.emit('spin')
    expect(winHandler).not.toHaveBeenCalled()
  })

  it('emitting with no subscribers does nothing', () => {
    const emitter = createEmitter<{ win: number }>()
    expect(() => emitter.emit('win', 100)).not.toThrow()
  })

    it('same handler subscribed twice is called only once — Set deduplicates', () => {
    const emitter = createEmitter<{ tick: void }>()
    const handler = vi.fn()
    emitter.on('tick', handler)
    emitter.on('tick', handler) // same reference — deduplicated
    emitter.emit('tick')
    expect(handler).toHaveBeenCalledTimes(1)
    })
  it('multiple events are independent', () => {
    const emitter = createEmitter<{ a: number; b: string }>()
    const ha = vi.fn()
    const hb = vi.fn()
    emitter.on('a', ha)
    emitter.on('b', hb)
    emitter.emit('a', 1)
    emitter.emit('b', 'hello')
    expect(ha).toHaveBeenCalledWith(1)
    expect(hb).toHaveBeenCalledWith('hello')
  })
})

describe('createEmitter — off', () => {
  it('removes a specific handler', () => {
    const emitter = createEmitter<{ win: number }>()
    const handler = vi.fn()
    emitter.on('win', handler)
    emitter.off('win', handler)
    emitter.emit('win', 100)
    expect(handler).not.toHaveBeenCalled()
  })

  it('only removes the matching handler reference', () => {
    const emitter = createEmitter<{ win: number }>()
    const h1 = vi.fn()
    const h2 = vi.fn()
    emitter.on('win', h1)
    emitter.on('win', h2)
    emitter.off('win', h1)
    emitter.emit('win', 100)
    expect(h1).not.toHaveBeenCalled()
    expect(h2).toHaveBeenCalledWith(100)
  })

  it('off with a different reference does nothing', () => {
    const emitter = createEmitter<{ win: number }>()
    const handler = vi.fn()
    emitter.on('win', handler)
    emitter.off('win', vi.fn()) // different reference
    emitter.emit('win', 100)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('off on an event with no listeners does not throw', () => {
    const emitter = createEmitter<{ win: number }>()
    expect(() => emitter.off('win', vi.fn())).not.toThrow()
  })

  it('calling off twice has no extra effect', () => {
    const emitter = createEmitter<{ win: number }>()
    const handler = vi.fn()
    emitter.on('win', handler)
    emitter.off('win', handler)
    emitter.off('win', handler) // second time — no error
    emitter.emit('win', 100)
    expect(handler).not.toHaveBeenCalled()
  })
})

describe('createEmitter — on() unsubscribe return value', () => {
  it('returned function unsubscribes the handler', () => {
    const emitter = createEmitter<{ win: number }>()
    const handler = vi.fn()
    const off = emitter.on('win', handler)
    off()
    emitter.emit('win', 100)
    expect(handler).not.toHaveBeenCalled()
  })

  it('calling unsubscribe twice does not throw', () => {
    const emitter = createEmitter<{ win: number }>()
    const off = emitter.on('win', vi.fn())
    off()
    expect(() => off()).not.toThrow()
  })

  it('only unsubscribes its own handler, not others', () => {
    const emitter = createEmitter<{ win: number }>()
    const h1 = vi.fn()
    const h2 = vi.fn()
    const off1 = emitter.on('win', h1)
    emitter.on('win', h2)
    off1()
    emitter.emit('win', 100)
    expect(h1).not.toHaveBeenCalled()
    expect(h2).toHaveBeenCalledWith(100)
  })
})

describe('createEmitter — once', () => {
  it('calls handler only on the first emit', () => {
    const emitter = createEmitter<{ win: number }>()
    const handler = vi.fn()
    emitter.once('win', handler)
    emitter.emit('win', 100)
    emitter.emit('win', 200)
    emitter.emit('win', 300)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(100)
  })

  it('receives the correct payload', () => {
    const emitter = createEmitter<{ score: number }>()
    const handler = vi.fn()
    emitter.once('score', handler)
    emitter.emit('score', 42)
    expect(handler).toHaveBeenCalledWith(42)
  })

  it('void once fires once and auto-unsubscribes', () => {
    const emitter = createEmitter<{ tick: void }>()
    const handler = vi.fn()
    emitter.once('tick', handler)
    emitter.emit('tick')
    emitter.emit('tick')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('cancel function from once prevents the handler from ever firing', () => {
    const emitter = createEmitter<{ win: number }>()
    const handler = vi.fn()
    const cancel = emitter.once('win', handler)
    cancel()
    emitter.emit('win', 100)
    expect(handler).not.toHaveBeenCalled()
  })

  it('once and on can coexist on the same event', () => {
    const emitter = createEmitter<{ win: number }>()
    const permanent = vi.fn()
    const oneTime = vi.fn()
    emitter.on('win', permanent)
    emitter.once('win', oneTime)
    emitter.emit('win', 1)
    emitter.emit('win', 2)
    expect(permanent).toHaveBeenCalledTimes(2)
    expect(oneTime).toHaveBeenCalledTimes(1)
  })

  it('multiple once subscriptions each fire exactly once', () => {
    const emitter = createEmitter<{ tick: void }>()
    const h1 = vi.fn()
    const h2 = vi.fn()
    emitter.once('tick', h1)
    emitter.once('tick', h2)
    emitter.emit('tick')
    emitter.emit('tick')
    expect(h1).toHaveBeenCalledTimes(1)
    expect(h2).toHaveBeenCalledTimes(1)
  })
})

describe('createEmitter — clear', () => {
  it('clear(event) removes all handlers for that event', () => {
    const emitter = createEmitter<{ win: number }>()
    const h1 = vi.fn()
    const h2 = vi.fn()
    emitter.on('win', h1)
    emitter.on('win', h2)
    emitter.clear('win')
    emitter.emit('win', 100)
    expect(h1).not.toHaveBeenCalled()
    expect(h2).not.toHaveBeenCalled()
  })

  it('clear(event) does not affect other events', () => {
    const emitter = createEmitter<{ win: number; spin: void }>()
    const winHandler = vi.fn()
    const spinHandler = vi.fn()
    emitter.on('win', winHandler)
    emitter.on('spin', spinHandler)
    emitter.clear('win')
    emitter.emit('spin')
    expect(spinHandler).toHaveBeenCalledTimes(1)
  })

  it('clear() with no arg removes all handlers for all events', () => {
    const emitter = createEmitter<{ win: number; spin: void }>()
    const winHandler = vi.fn()
    const spinHandler = vi.fn()
    emitter.on('win', winHandler)
    emitter.on('spin', spinHandler)
    emitter.clear()
    emitter.emit('win', 100)
    emitter.emit('spin')
    expect(winHandler).not.toHaveBeenCalled()
    expect(spinHandler).not.toHaveBeenCalled()
  })

  it('clear on event with no handlers does not throw', () => {
    const emitter = createEmitter<{ win: number }>()
    expect(() => emitter.clear('win')).not.toThrow()
  })

  it('can subscribe again after clear', () => {
    const emitter = createEmitter<{ win: number }>()
    const handler = vi.fn()
    emitter.on('win', handler)
    emitter.clear('win')
    emitter.on('win', handler)
    emitter.emit('win', 50)
    expect(handler).toHaveBeenCalledTimes(1)
  })
})

describe('createEmitter — error handling', () => {
  it('error in one handler prevents subsequent handlers from being called', () => {
    const emitter = createEmitter<{ win: number }>()
    const h1 = vi.fn(() => { throw new Error('oops') })
    const h2 = vi.fn()
    emitter.on('win', h1)
    emitter.on('win', h2)
    expect(() => emitter.emit('win', 100)).toThrow('oops')
    expect(h2).not.toHaveBeenCalled()
  })

  it('error propagates from emit call', () => {
    const emitter = createEmitter<{ tick: void }>()
    emitter.on('tick', () => { throw new Error('handler error') })
    expect(() => emitter.emit('tick')).toThrow('handler error')
  })
})

describe('createEmitter — independence', () => {
  it('two emitters with the same type are fully independent', () => {
    const a = createEmitter<{ win: number }>()
    const b = createEmitter<{ win: number }>()
    const ha = vi.fn()
    const hb = vi.fn()
    a.on('win', ha)
    b.on('win', hb)
    a.emit('win', 1)
    expect(ha).toHaveBeenCalledWith(1)
    expect(hb).not.toHaveBeenCalled()
  })
})
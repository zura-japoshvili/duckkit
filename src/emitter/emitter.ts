/**
 * Creates a fully typed event emitter.
 *
 * Define your event map as a type — keys are event names, values are payload types.
 * Use `void` for events that carry no payload.
 *
 * @returns An emitter instance scoped to your event map
 *
 * @example
 * const emitter = createEmitter<{
 *   win: number
 *   spin: void
 *   error: { code: number; message: string }
 * }>()
 *
 * emitter.on('win', amount => console.log(amount))  // amount: number ✅
 * emitter.emit('win', 500)
 * emitter.emit('spin')                              // no payload needed ✅
 */

type EventMap = Record<string, unknown>

// If the event payload is void, the handler takes no arguments.
// Otherwise it takes exactly one argument typed to the payload.
type Handler<T> = T extends void ? () => void : (payload: T) => void

export interface Emitter<Events extends EventMap> {
  /**
   * Subscribes to an event. Returns an unsubscribe function.
   *
   * @example
   * const off = emitter.on('win', amount => console.log(amount))
   * off() // unsubscribe
   */
  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void

  /**
   * Unsubscribes a specific handler from an event.
   */
  off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void

  /**
   * Subscribes to an event for one call only — auto-unsubscribes after first emit.
   * Returns an unsubscribe function to cancel early if needed.
   *
   * @example
   * emitter.once('spin', () => console.log('first spin only'))
   */
  once<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void

  /**
   * Emits an event, calling all subscribed handlers.
   *
   * For `void` events, no second argument is needed or accepted.
   * For typed events, the payload argument is required and typed.
   *
   * @example
   * emitter.emit('win', 500)   // payload required ✅
   * emitter.emit('spin')       // no payload — void event ✅
   * emitter.emit('win')        // TypeScript error — payload missing ❌
   */
  emit<K extends keyof Events>(
    ...args: Events[K] extends void ? [event: K] : [event: K, payload: Events[K]]
  ): void

  /**
   * Removes all handlers for a specific event, or all handlers for all events
   * if no event is provided.
   *
   * @example
   * emitter.clear('win')  // clears only win handlers
   * emitter.clear()       // clears everything
   */
  clear(event?: keyof Events): void
}

export function createEmitter<Events extends EventMap>(): Emitter<Events> {
  const listeners = new Map<keyof Events, Set<Function>>()

  function getOrCreate(event: keyof Events): Set<Function> {
    if (!listeners.has(event)) listeners.set(event, new Set())
    return listeners.get(event)!
  }

  function on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    getOrCreate(event).add(handler)
    return () => off(event, handler)
  }

  function off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void {
    listeners.get(event)?.delete(handler)
  }

  function once<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    const wrapper = ((payload?: Events[K]) => {
      off(event, wrapper as Handler<Events[K]>)
      ;(handler as Function)(payload)
    }) as Handler<Events[K]>
    return on(event, wrapper)
  }

  function emit<K extends keyof Events>(
    ...args: Events[K] extends void ? [event: K] : [event: K, payload: Events[K]]
  ): void {
    const [event, payload] = args as [K, Events[K]]
    listeners.get(event)?.forEach(fn => fn(payload))
  }

  function clear(event?: keyof Events): void {
    if (event === undefined) listeners.clear()
    else listeners.delete(event)
  }

  return { on, off, once, emit, clear }
}
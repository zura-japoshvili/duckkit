/**
 * Pauses execution until the delay expires or an AbortSignal fires.
 *
 * Uses the native `AbortController` API. When the signal is aborted,
 * the promise rejects with an `AbortError`. Useful when you need
 * explicit external cancellation with proper error handling.
 *
 * @param ms - Duration to wait in milliseconds
 * @param signal - AbortSignal to cancel the delay
 * @returns A promise that resolves after `ms` ms or rejects on abort
 *
 * @example
 * const controller = new AbortController()
 *
 * // cancel from outside
 * setTimeout(() => controller.abort(), 500)
 *
 * try {
 *   await delayWithAbort(3000, controller.signal)
 * } catch (e) {
 *   console.log('delay was aborted')
 * }
 */
export function delayWithAbort(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Delay aborted', 'AbortError'))
      return
    }

    const timer = setTimeout(resolve, ms)

    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Delay aborted', 'AbortError'))
    }, { once: true })
  })
}
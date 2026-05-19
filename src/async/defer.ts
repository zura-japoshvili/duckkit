/**
 * Creates a deferred promise — a promise you can resolve or reject from outside.
 *
 * Useful when you need to pass a promise around and trigger it
 * from a different place in your code.
 *
 * @returns An object with `promise`, `resolve`, and `reject`
 *
 * @example
 * const d = defer<string>()
 * setTimeout(() => d.resolve('done'), 1000)
 * const result = await d.promise // 'done' after 1s
 *
 * @example
 * // wait for user action
 * const confirmation = defer<boolean>()
 * confirmButton.onclick = () => confirmation.resolve(true)
 * cancelButton.onclick = () => confirmation.resolve(false)
 * const confirmed = await confirmation.promise
 */
export interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
}

export function defer<T>(): Deferred<T> {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}
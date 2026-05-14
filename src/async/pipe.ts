class Pipeline<T> {
  constructor(private readonly _value: T) {}

  /**
   * Passes the current value through a transformation function.
   * The return type of `fn` becomes the new pipeline type.
   *
   * @param fn - Transformation to apply
   * @returns A new `Pipeline` with the transformed value
   */
  through<U>(fn: (value: T) => U): Pipeline<U> {
    return new Pipeline(fn(this._value))
  }

  /**
   * Extracts the final value out of the pipeline.
   *
   * @returns The current value, fully typed
   */
  value(): T {
    return this._value
  }
}

/**
 * Creates a typed pipeline for chaining transformations.
 *
 * Each `.through()` step is fully typed — the output type of one step
 * becomes the input type of the next. No `any` at any point.
 *
 * @param value - The initial value to pipe
 * @returns A `Pipeline<T>` with `.through()` and `.value()`
 *
 * @example
 * pipe([1, 2, 3, 4, 5, 6])
 *   .through(arr => arr.filter(n => n % 2 === 0))  // number[]
 *   .through(arr => arr.map(n => n * 10))           // number[]
 *   .through(arr => arr.join(', '))                 // string
 *   .value()
 * // "20, 40, 60"
 */
export function pipe<T>(value: T): Pipeline<T> {
  return new Pipeline(value)
}
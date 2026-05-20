/**
 * Function composition utilities.
 *
 * - `pipeline` — left to right (f1 → f2 → f3), matches reading order
 * - `compose`  — right to left (f3 ← f2 ← f1), traditional math/FP style
 * - `pipelineAsync` / `composeAsync` — same but each step can be async
 * - `curry`    — converts a multi-arg function into a chain of single-arg functions
 *
 * All are fully typed with overloads up to 5 steps. TypeScript infers each
 * intermediate type — no `any` in the chain.
 */

// ─── pipeline ────────────────────────────────────────────────────────────────

/**
 * Composes functions left to right — returns a new function from input A to final output.
 *
 * Unlike `pipe(value)` which threads a single value, `pipeline(...fns)` returns
 * a reusable composed function you can call multiple times.
 *
 * @example
 * const process = pipeline(
 *   (s: string) => s.trim(),
 *   s => s.toUpperCase(),
 *   s => s.split(' '),
 * )
 * process('  hello world  ')  // ["HELLO", "WORLD"] ✅
 * process('  foo bar  ')      // ["FOO", "BAR"] ✅ — reusable
 *
 * @example
 * // Compose validators
 * const validate = pipeline(
 *   (n: number) => Math.max(0, n),   // clamp negatives
 *   n => Math.min(n, 100),           // clamp to 100
 *   n => Math.round(n),              // round to int
 * )
 * validate(-5)   // 0
 * validate(99.7) // 100
 */
export function pipeline<A, B>(
  f1: (a: A) => B
): (a: A) => B
export function pipeline<A, B, C>(
  f1: (a: A) => B,
  f2: (b: B) => C
): (a: A) => C
export function pipeline<A, B, C, D>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D
): (a: A) => D
export function pipeline<A, B, C, D, E>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
  f4: (d: D) => E
): (a: A) => E
export function pipeline<A, B, C, D, E, F>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
  f4: (d: D) => E,
  f5: (e: E) => F
): (a: A) => F
export function pipeline(...fns: Function[]): Function {
  return (input: unknown) => fns.reduce((acc, fn) => fn(acc), input)
}

// ─── compose ─────────────────────────────────────────────────────────────────

/**
 * Composes functions right to left — traditional math/FP style.
 * `compose(f, g)(x)` is equivalent to `f(g(x))`.
 *
 * @example
 * const process = compose(
 *   (arr: string[]) => arr.join('-'),
 *   (s: string) => s.split(' '),
 *   (s: string) => s.toUpperCase(),
 * )
 * process('hello world')  // "HELLO-WORLD"
 * // execution order: toUpperCase → split → join
 */
export function compose<A, B>(
  f1: (a: A) => B
): (a: A) => B
export function compose<A, B, C>(
  f2: (b: B) => C,
  f1: (a: A) => B
): (a: A) => C
export function compose<A, B, C, D>(
  f3: (c: C) => D,
  f2: (b: B) => C,
  f1: (a: A) => B
): (a: A) => D
export function compose<A, B, C, D, E>(
  f4: (d: D) => E,
  f3: (c: C) => D,
  f2: (b: B) => C,
  f1: (a: A) => B
): (a: A) => E
export function compose<A, B, C, D, E, F>(
  f5: (e: E) => F,
  f4: (d: D) => E,
  f3: (c: C) => D,
  f2: (b: B) => C,
  f1: (a: A) => B
): (a: A) => F
export function compose(...fns: Function[]): Function {
  return (input: unknown) => fns.reduceRight((acc, fn) => fn(acc), input)
}

// ─── pipelineAsync ───────────────────────────────────────────────────────────

/**
 * Like `pipeline` but each step can be async. Steps are awaited in order.
 * Sync functions work too — they're treated as instantly resolved.
 *
 * @example
 * const processUser = pipelineAsync(
 *   (id: string) => fetchUser(id),           // async
 *   user => normalizeUser(user),             // sync
 *   user => saveToCache(user),               // async
 * )
 *
 * const user = await processUser('abc123')  // fully typed ✅
 */
export function pipelineAsync<A, B>(
  f1: (a: A) => B | Promise<B>
): (a: A) => Promise<B>
export function pipelineAsync<A, B, C>(
  f1: (a: A) => B | Promise<B>,
  f2: (b: B) => C | Promise<C>
): (a: A) => Promise<C>
export function pipelineAsync<A, B, C, D>(
  f1: (a: A) => B | Promise<B>,
  f2: (b: B) => C | Promise<C>,
  f3: (c: C) => D | Promise<D>
): (a: A) => Promise<D>
export function pipelineAsync<A, B, C, D, E>(
  f1: (a: A) => B | Promise<B>,
  f2: (b: B) => C | Promise<C>,
  f3: (c: C) => D | Promise<D>,
  f4: (d: D) => E | Promise<E>
): (a: A) => Promise<E>
export function pipelineAsync<A, B, C, D, E, F>(
  f1: (a: A) => B | Promise<B>,
  f2: (b: B) => C | Promise<C>,
  f3: (c: C) => D | Promise<D>,
  f4: (d: D) => E | Promise<E>,
  f5: (e: E) => F | Promise<F>
): (a: A) => Promise<F>
export function pipelineAsync(...fns: Function[]): (input: unknown) => Promise<unknown> {
  return async (input: unknown) => {
    let result = input
    for (const fn of fns) result = await fn(result)
    return result
  }
}

// ─── composeAsync ────────────────────────────────────────────────────────────

/**
 * Like `compose` but each step can be async. Executes right to left.
 *
 * @example
 * const process = composeAsync(
 *   (user: User) => saveToCache(user),   // async, runs last
 *   (user: User) => normalizeUser(user), // sync
 *   (id: string) => fetchUser(id),       // async, runs first
 * )
 * await process('abc123')
 */
export function composeAsync<A, B>(
  f1: (a: A) => B | Promise<B>
): (a: A) => Promise<B>
export function composeAsync<A, B, C>(
  f2: (b: B) => C | Promise<C>,
  f1: (a: A) => B | Promise<B>
): (a: A) => Promise<C>
export function composeAsync<A, B, C, D>(
  f3: (c: C) => D | Promise<D>,
  f2: (b: B) => C | Promise<C>,
  f1: (a: A) => B | Promise<B>
): (a: A) => Promise<D>
export function composeAsync<A, B, C, D, E>(
  f4: (d: D) => E | Promise<E>,
  f3: (c: C) => D | Promise<D>,
  f2: (b: B) => C | Promise<C>,
  f1: (a: A) => B | Promise<B>
): (a: A) => Promise<E>
export function composeAsync<A, B, C, D, E, F>(
  f5: (e: E) => F | Promise<F>,
  f4: (d: D) => E | Promise<E>,
  f3: (c: C) => D | Promise<D>,
  f2: (b: B) => C | Promise<C>,
  f1: (a: A) => B | Promise<B>
): (a: A) => Promise<F>
export function composeAsync(...fns: Function[]): (input: unknown) => Promise<unknown> {
  return async (input: unknown) => {
    let result = input
    for (const fn of [...fns].reverse()) result = await fn(result)
    return result
  }
}

// ─── curry ───────────────────────────────────────────────────────────────────

/**
 * Converts a multi-argument function into a chain of single-argument functions.
 *
 * Supports 2- and 3-argument functions. TypeScript infers all argument and
 * return types automatically.
 *
 * @example
 * // 2-arg
 * const add = curry((a: number, b: number) => a + b)
 * const add5 = add(5)     // (b: number) => number
 * add5(3)                 // 8
 * add5(10)                // 15
 *
 * @example
 * // 3-arg
 * const clamp = curry((min: number, max: number, value: number) => Math.min(Math.max(value, min), max))
 * const clamp0to100 = clamp(0)(100)   // (value: number) => number
 * clamp0to100(150)                    // 100
 * clamp0to100(-5)                     // 0
 *
 * @example
 * // Partial application for array methods
 * const multiply = curry((factor: number, value: number) => value * factor)
 * [1, 2, 3].map(multiply(2))  // [2, 4, 6] ✅
 */
export function curry<A, B, R>(
  fn: (a: A, b: B) => R
): (a: A) => (b: B) => R
export function curry<A, B, C, R>(
  fn: (a: A, b: B, c: C) => R
): (a: A) => (b: B) => (c: C) => R
export function curry(fn: Function): Function {
  if (fn.length === 2) return (a: unknown) => (b: unknown) => fn(a, b)
  if (fn.length === 3) return (a: unknown) => (b: unknown) => (c: unknown) => fn(a, b, c)
  return fn
}
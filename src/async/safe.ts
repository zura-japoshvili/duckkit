/**
 * Wraps a synchronous function in a Result type, eliminating try/catch.
 *
 * Returns `{ ok: true, value: T }` on success or `{ ok: false, error: Error }` on failure.
 * Non-Error throws are automatically wrapped in an `Error`.
 *
 * @param fn - The function to execute safely
 * @returns A `Result<T>` — either `Ok<T>` or `Err`
 *
 * @example
 * const result = safe(() => JSON.parse(rawString))
 * if (result.ok) {
 *   console.log(result.value) // typed T ✅
 * } else {
 *   console.error(result.error) // typed Error ✅
 * }
 */
export type Ok<T> = { ok: true; value: T }
export type Err = { ok: false; error: Error }
export type Result<T> = Ok<T> | Err

export function safe<T>(fn: () => T): Result<T> {
  try {
    return { ok: true, value: fn() }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }
  }
}

/**
 * Wraps an async function in a Result type, eliminating try/catch.
 *
 * Async version of `safe`. Never rejects — always resolves to `Ok<T>` or `Err`.
 *
 * @param fn - The async function to execute safely
 * @returns A `Promise<Result<T>>`
 *
 * @example
 * const result = await safeAsync(() => fetchUser(id))
 * if (result.ok) {
 *   console.log(result.value) // typed User ✅
 * } else {
 *   console.error(result.error.message)
 * }
 */
export async function safeAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, value: await fn() }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }
  }
}
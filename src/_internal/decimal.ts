/**
 * Internal helpers — not exported from the package.
 */

/**
 * Returns `value * 10 ** exp`, computed by moving the decimal point in the
 * number's shortest decimal form (what `String(value)` prints) instead of
 * multiplying in binary floating point.
 *
 * `1.005 * 100` is `100.49999999999999`, but `shiftDecimal(1.005, 2)` is `100.5`.
 * Zero keeps its sign. May return ±Infinity when the result overflows.
 */
export function shiftDecimal(value: number, exp: number): number {
  if (value === 0) return value // String(-0) is "0" — keep the sign
  const [mantissa, exponent = '0'] = String(value).split('e')
  return Number(`${mantissa}e${Number(exponent) + exp}`)
}

/**
 * Applies `step` (Math.round, Math.floor, …) at `decimals` places, on the decimal
 * form of `value`. Values too large to shift are returned unchanged — they have no
 * digits at that precision to round.
 */
export function atDecimals(value: number, decimals: number, step: (n: number) => number): number {
  if (!Number.isFinite(value)) return value
  const shifted = shiftDecimal(value, decimals)
  if (!Number.isFinite(shifted)) return value
  return shiftDecimal(step(shifted), -decimals)
}

/** Throws when `decimals` is not an integer (`10 ** 1.5` places makes no sense). */
export function assertDecimals(name: string, decimals: number): void {
  if (!Number.isInteger(decimals)) {
    throw new Error(`${name}: decimals must be an integer`)
  }
}

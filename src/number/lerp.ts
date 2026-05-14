/**
 * Linearly interpolates between two numbers by factor `t`.
 *
 * `t = 0` returns `start`, `t = 1` returns `end`, `t = 0.5` returns the midpoint.
 * `t` is not clamped — values outside 0–1 extrapolate beyond the range.
 *
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (typically 0–1)
 * @returns The interpolated value
 *
 * @example
 * lerp(0, 100, 0)    // 0
 * lerp(0, 100, 0.5)  // 50
 * lerp(0, 100, 1)    // 100
 *
 * @example
 * // Smooth animation step
 * position = lerp(position, target, 0.1)
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}
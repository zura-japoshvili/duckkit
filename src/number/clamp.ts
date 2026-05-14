/**
 * Clamps a number between a minimum and maximum value.
 *
 * If `value` is below `min`, returns `min`.
 * If `value` is above `max`, returns `max`.
 * Otherwise returns `value` unchanged.
 *
 * @param value - The number to clamp
 * @param min - Lower bound
 * @param max - Upper bound
 * @returns The clamped value
 *
 * @example
 * clamp(150, 0, 100) // 100
 * clamp(-10, 0, 100) // 0
 * clamp(50,  0, 100) // 50
 *
 * @example
 * // Keep opacity between 0 and 1
 * clamp(userInput, 0, 1)
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
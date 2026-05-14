/**
 * Returns `true` if `value` is between `min` and `max`, inclusive.
 *
 * @param value - The number to check
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (inclusive)
 * @returns `true` if `min <= value <= max`
 *
 * @example
 * inRange(5, 1, 10)  // true
 * inRange(0, 1, 10)  // false
 * inRange(10, 1, 10) // true
 *
 * @example
 * // Validate user age input
 * inRange(age, 0, 120)
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}
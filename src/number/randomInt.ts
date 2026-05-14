/**
 * Returns a random integer between `min` and `max`, inclusive on both ends.
 *
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (inclusive)
 * @returns A random integer in the range [min, max]
 *
 * @example
 * randomInt(1, 6)   // dice roll — one of 1, 2, 3, 4, 5, 6
 * randomInt(0, 100) // random percentage
 * randomInt(1, 1)   // always 1
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
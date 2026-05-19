/**
 * Maps a value from one range to another.
 *
 * Useful for sliders, progress bars, game logic, chart scaling —
 * anywhere you need to convert a value between two scales.
 *
 * @param value - The value to normalize
 * @param fromMin - Source range minimum
 * @param fromMax - Source range maximum
 * @param toMin - Target range minimum (default: 0)
 * @param toMax - Target range maximum (default: 1)
 * @returns The value mapped to the target range
 *
 * @example
 * normalize(150, 0, 200)        // 0.75
 * normalize(150, 0, 200, 0, 100) // 75
 * normalize(5, 0, 10, -1, 1)    // 0
 *
 * @example
 * // map mouse X position to rotation degrees
 * normalize(mouseX, 0, windowWidth, -45, 45)
 */
export function normalize(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number = 0,
  toMax: number = 1
): number {
  return toMin + ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin)
}
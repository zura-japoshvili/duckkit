/**
 * Formats a duration in seconds into a human-readable string.
 *
 * @param seconds - Total seconds to format
 * @returns Formatted duration string
 *
 * @example
 * formatDuration(0)     // "0s"
 * formatDuration(45)    // "45s"
 * formatDuration(90)    // "1m 30s"
 * formatDuration(3600)  // "1h"
 * formatDuration(3661)  // "1h 1m 1s"
 * formatDuration(7322)  // "2h 2m 2s"
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0s'

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  const parts: string[] = []
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  if (s > 0) parts.push(`${s}s`)

  return parts.join(' ')
}
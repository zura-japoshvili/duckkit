const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

/**
 * Formats a byte value into a human-readable string (1 KB = 1024 B).
 *
 * Negative values keep their sign, values under 1 stay in bytes, and values
 * past yottabytes stay in YB. `NaN` and `±Infinity` are shown as-is with "B".
 *
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Human-readable size string
 *
 * @example
 * formatBytes(0)              // "0 B"
 * formatBytes(1024)           // "1 KB"
 * formatBytes(1048576)        // "1 MB"
 * formatBytes(1073741824)     // "1 GB"
 * formatBytes(1234567)        // "1.18 MB"
 * formatBytes(1234567, 0)     // "1 MB"
 * formatBytes(-1024)          // "-1 KB"
 * formatBytes(2 ** 60)        // "1 EB"
 * formatBytes(1023.999)       // "1 KB" — not "1024 B"
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B'
  if (!Number.isFinite(bytes)) return `${bytes} B`

  const k = 1024
  const exponent = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k))
  let i = Math.min(Math.max(exponent, 0), UNITS.length - 1)
  let value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))

  // Rounding can reach the next unit (1023.999 B → "1024 B"); show it as that unit instead
  if (Math.abs(value) >= k && i < UNITS.length - 1) {
    i++
    value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))
  }

  return `${value} ${UNITS[i]}`
}

/**
 * Formats a byte value into a human-readable string.
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
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = bytes / Math.pow(k, i)

  return `${parseFloat(value.toFixed(decimals))} ${units[i]}`
}
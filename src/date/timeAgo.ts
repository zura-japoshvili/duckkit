/**
 * Returns a human-readable relative time string from a past date.
 *
 * @param date - The past date to compare against now
 * @returns A string like "just now", "3 minutes ago", "yesterday", "2 weeks ago"
 *
 * @example
 * timeAgo(new Date(Date.now() - 30_000))        // "just now"
 * timeAgo(new Date(Date.now() - 3 * 60_000))    // "3 minutes ago"
 * timeAgo(new Date(Date.now() - 25 * 3600_000)) // "yesterday"
 * timeAgo(new Date(Date.now() - 14 * 86400_000))// "2 weeks ago"
 */
export function timeAgo(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
  return `${years} year${years === 1 ? '' : 's'} ago`
}
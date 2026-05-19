import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  timeAgo, formatDate, daysBetween,
  isToday, isYesterday, isWeekend, isThisWeek, isThisYear
} from '../src/date/index'
import { addDays, subDays, isBefore, isAfter } from '../src/date/index'
import { startOfDay, endOfDay, startOfWeek, startOfMonth, isSameDay, addMonths, addYears } from '../src/date/index'

// Wednesday May 13 2026 12:00:00 — fixed point in time for all tests
const FIXED_NOW = new Date(2026, 4, 13, 12, 0, 0)

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('addDays', () => {
  it('adds days correctly', () => {
    const result = addDays(new Date(2026, 0, 1), 7)
    expect(result.getDate()).toBe(8)
    expect(result.getMonth()).toBe(0)
  })

  it('crosses month boundary', () => {
    const result = addDays(new Date(2026, 0, 28), 7)
    expect(result.getMonth()).toBe(1)
    expect(result.getDate()).toBe(4)
  })

  it('crosses year boundary', () => {
    const result = addDays(new Date(2025, 11, 28), 7)
    expect(result.getFullYear()).toBe(2026)
  })

  it('does not mutate original', () => {
    const original = new Date(2026, 0, 1)
    addDays(original, 7)
    expect(original.getDate()).toBe(1)
  })

  it('adding 0 days returns same date', () => {
    const date = new Date(2026, 0, 1)
    expect(addDays(date, 0).getTime()).toBe(date.getTime())
  })

  it('negative days go backward', () => {
    const result = addDays(new Date(2026, 0, 10), -5)
    expect(result.getDate()).toBe(5)
  })
})

describe('subDays', () => {
  it('subtracts days correctly', () => {
    const result = subDays(new Date(2026, 0, 10), 5)
    expect(result.getDate()).toBe(5)
  })

  it('crosses month boundary', () => {
    const result = subDays(new Date(2026, 1, 3), 7)
    expect(result.getMonth()).toBe(0)
  })

  it('does not mutate original', () => {
    const original = new Date(2026, 0, 10)
    subDays(original, 5)
    expect(original.getDate()).toBe(10)
  })

  it('subtracting 0 returns same date', () => {
    const date = new Date(2026, 0, 1)
    expect(subDays(date, 0).getTime()).toBe(date.getTime())
  })
})

describe('addMonths', () => {
  it('adds months correctly', () => {
    expect(addMonths(new Date(2026, 0, 15), 3).getMonth()).toBe(3)
  })

  it('crosses year boundary', () => {
    const result = addMonths(new Date(2026, 10, 1), 3)
    expect(result.getFullYear()).toBe(2027)
    expect(result.getMonth()).toBe(1)
  })

  it('handles month overflow — Jan 31 + 1 month', () => {
    const result = addMonths(new Date(2026, 0, 31), 1)
    expect(result.getMonth()).toBe(2) // JS overflows to March
  })

  it('does not mutate original', () => {
    const original = new Date(2026, 0, 15)
    addMonths(original, 1)
    expect(original.getMonth()).toBe(0)
  })

  it('negative months go backward', () => {
    expect(addMonths(new Date(2026, 5, 1), -3).getMonth()).toBe(2)
  })
})

describe('addYears', () => {
  it('adds years correctly', () => {
    expect(addYears(new Date(2026, 4, 13), 1).getFullYear()).toBe(2027)
  })

  it('negative years go backward', () => {
    expect(addYears(new Date(2026, 4, 13), -2).getFullYear()).toBe(2024)
  })

  it('does not mutate original', () => {
    const original = new Date(2026, 4, 13)
    addYears(original, 1)
    expect(original.getFullYear()).toBe(2026)
  })

  it('preserves month and day', () => {
    const result = addYears(new Date(2026, 4, 13), 1)
    expect(result.getMonth()).toBe(4)
    expect(result.getDate()).toBe(13)
  })
})

describe('isBefore', () => {
  it('returns true when a is before b', () => {
    expect(isBefore(new Date(2026, 0, 1), new Date(2026, 11, 31))).toBe(true)
  })

  it('returns false when a is after b', () => {
    expect(isBefore(new Date(2026, 11, 31), new Date(2026, 0, 1))).toBe(false)
  })

  it('returns false when dates are equal', () => {
    const d = new Date(2026, 0, 1)
    expect(isBefore(d, d)).toBe(false)
  })
})

describe('isAfter', () => {
  it('returns true when a is after b', () => {
    expect(isAfter(new Date(2026, 11, 31), new Date(2026, 0, 1))).toBe(true)
  })

  it('returns false when a is before b', () => {
    expect(isAfter(new Date(2026, 0, 1), new Date(2026, 11, 31))).toBe(false)
  })

  it('returns false when dates are equal', () => {
    const d = new Date(2026, 0, 1)
    expect(isAfter(d, d)).toBe(false)
  })
})

describe('startOfDay', () => {
  it('sets time to midnight', () => {
    const result = startOfDay(new Date(2026, 4, 13, 14, 30, 0))
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
  })

  it('preserves date', () => {
    const result = startOfDay(new Date(2026, 4, 13, 23, 59, 59))
    expect(result.getDate()).toBe(13)
    expect(result.getMonth()).toBe(4)
    expect(result.getFullYear()).toBe(2026)
  })

  it('does not mutate original', () => {
    const original = new Date(2026, 4, 13, 14, 30, 0)
    startOfDay(original)
    expect(original.getHours()).toBe(14)
  })
})

describe('endOfDay', () => {
  it('sets time to 23:59:59.999', () => {
    const result = endOfDay(new Date(2026, 4, 13, 8, 0, 0))
    expect(result.getHours()).toBe(23)
    expect(result.getMinutes()).toBe(59)
    expect(result.getSeconds()).toBe(59)
    expect(result.getMilliseconds()).toBe(999)
  })

  it('preserves date', () => {
    const result = endOfDay(new Date(2026, 4, 13))
    expect(result.getDate()).toBe(13)
    expect(result.getMonth()).toBe(4)
  })

  it('does not mutate original', () => {
    const original = new Date(2026, 4, 13, 8, 0, 0)
    endOfDay(original)
    expect(original.getHours()).toBe(8)
  })
})

describe('startOfWeek', () => {
  it('returns the Sunday of the current week', () => {
    // May 13 2026 is Wednesday — Sunday is May 10
    const result = startOfWeek(new Date(2026, 4, 13))
    expect(result.getDate()).toBe(10)
    expect(result.getDay()).toBe(0)
  })

  it('Sunday returns itself', () => {
    const result = startOfWeek(new Date(2026, 4, 10))
    expect(result.getDate()).toBe(10)
  })

  it('Saturday returns Sunday', () => {
    const result = startOfWeek(new Date(2026, 4, 16))
    expect(result.getDate()).toBe(10)
  })

  it('does not mutate original', () => {
    const original = new Date(2026, 4, 13)
    startOfWeek(original)
    expect(original.getDate()).toBe(13)
  })
})

describe('startOfMonth', () => {
  it('returns first day of month', () => {
    const result = startOfMonth(new Date(2026, 4, 13))
    expect(result.getDate()).toBe(1)
    expect(result.getMonth()).toBe(4)
  })

  it('time is midnight', () => {
    const result = startOfMonth(new Date(2026, 4, 13, 14, 30))
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
  })

  it('does not mutate original', () => {
    const original = new Date(2026, 4, 13)
    startOfMonth(original)
    expect(original.getDate()).toBe(13)
  })
})

describe('isSameDay', () => {
  it('returns true for same day different time', () => {
    expect(isSameDay(new Date(2026, 4, 13, 8, 0), new Date(2026, 4, 13, 22, 0))).toBe(true)
  })

  it('returns false for different days', () => {
    expect(isSameDay(new Date(2026, 4, 13), new Date(2026, 4, 14))).toBe(false)
  })

  it('returns true for identical dates', () => {
    const d = new Date(2026, 4, 13)
    expect(isSameDay(d, d)).toBe(true)
  })

  it('returns false for same day different month', () => {
    expect(isSameDay(new Date(2026, 4, 13), new Date(2026, 5, 13))).toBe(false)
  })

  it('returns false for same day different year', () => {
    expect(isSameDay(new Date(2026, 4, 13), new Date(2025, 4, 13))).toBe(false)
  })
})

describe('timeAgo', () => {
  const ago = (ms: number) => new Date(Date.now() - ms)

  it('just now', () => expect(timeAgo(ago(30_000))).toBe('just now'))
  it('1 minute ago', () => expect(timeAgo(ago(90_000))).toBe('1 minute ago'))
  it('minutes ago', () => expect(timeAgo(ago(3 * 60_000))).toBe('3 minutes ago'))
  it('1 hour ago', () => expect(timeAgo(ago(90 * 60_000))).toBe('1 hour ago'))
  it('hours ago', () => expect(timeAgo(ago(3 * 3600_000))).toBe('3 hours ago'))
  it('yesterday', () => expect(timeAgo(ago(25 * 3600_000))).toBe('yesterday'))
  it('days ago', () => expect(timeAgo(ago(4 * 86400_000))).toBe('4 days ago'))
  it('1 week ago', () => expect(timeAgo(ago(8 * 86400_000))).toBe('1 week ago'))
  it('weeks ago', () => expect(timeAgo(ago(14 * 86400_000))).toBe('2 weeks ago'))
  it('1 month ago', () => expect(timeAgo(ago(32 * 86400_000))).toBe('1 month ago'))
  it('months ago', () => expect(timeAgo(ago(60 * 86400_000))).toBe('2 months ago'))
  it('years ago', () => expect(timeAgo(ago(400 * 86400_000))).toBe('1 year ago'))
  it('multiple years ago', () => expect(timeAgo(ago(800 * 86400_000))).toBe('2 years ago'))
})

describe('formatDate', () => {
  const date = new Date(2026, 4, 13, 9, 5, 3)

  it('DD/MM/YYYY', () => expect(formatDate(date, 'DD/MM/YYYY')).toBe('13/05/2026'))
  it('MMM D, YYYY', () => expect(formatDate(date, 'MMM D, YYYY')).toBe('May 13, 2026'))
  it('MMMM YYYY', () => expect(formatDate(date, 'MMMM YYYY')).toBe('May 2026'))
  it('YY', () => expect(formatDate(date, 'YY')).toBe('26'))
  it('D without padding', () => expect(formatDate(new Date(2026, 4, 3), 'D')).toBe('3'))
  it('M without padding', () => expect(formatDate(new Date(2026, 0, 1), 'M')).toBe('1'))
  it('MM with padding', () => expect(formatDate(new Date(2026, 0, 1), 'MM')).toBe('01'))
  it('HH:mm:ss zero padded', () => expect(formatDate(date, 'HH:mm:ss')).toBe('09:05:03'))
  it('H without padding', () => expect(formatDate(date, 'H')).toBe('9'))
  it('January full name', () => expect(formatDate(new Date(2026, 0, 1), 'MMMM')).toBe('January'))
  it('December short name', () => expect(formatDate(new Date(2026, 11, 1), 'MMM')).toBe('Dec'))
  it('unknown tokens are preserved', () => expect(formatDate(date, 'YYYY-[Q1]')).toBe('2026-[Q1]'))
})

describe('daysBetween', () => {
  it('returns correct days', () => {
    expect(daysBetween(new Date(2026, 0, 1), new Date(2026, 0, 10))).toBe(9)
  })
  it('is symmetric', () => {
    const a = new Date(2026, 0, 1)
    const b = new Date(2026, 0, 10)
    expect(daysBetween(a, b)).toBe(daysBetween(b, a))
  })
  it('same day is 0', () => {
    expect(daysBetween(new Date(2026, 0, 1), new Date(2026, 0, 1))).toBe(0)
  })
  it('across months', () => {
    expect(daysBetween(new Date(2026, 0, 31), new Date(2026, 1, 1))).toBe(1)
  })
  it('across years', () => {
    expect(daysBetween(new Date(2025, 11, 31), new Date(2026, 0, 1))).toBe(1)
  })
  it('full year', () => {
    expect(daysBetween(new Date(2026, 0, 1), new Date(2026, 11, 31))).toBe(364)
  })
  it('leap year Feb', () => {
    expect(daysBetween(new Date(2024, 1, 28), new Date(2024, 2, 1))).toBe(2)
  })
})

describe('isToday', () => {
  it('returns true for today', () => expect(isToday(new Date(2026, 4, 13))).toBe(true))
  it('returns false for yesterday', () => expect(isToday(new Date(2026, 4, 12))).toBe(false))
  it('returns false for tomorrow', () => expect(isToday(new Date(2026, 4, 14))).toBe(false))
})

describe('isYesterday', () => {
  it('returns true for yesterday', () => expect(isYesterday(new Date(2026, 4, 12))).toBe(true))
  it('returns false for today', () => expect(isYesterday(new Date(2026, 4, 13))).toBe(false))
  it('returns false for 2 days ago', () => expect(isYesterday(new Date(2026, 4, 11))).toBe(false))
})

describe('isWeekend', () => {
  it('Saturday is weekend', () => expect(isWeekend(new Date(2026, 4, 16))).toBe(true))
  it('Sunday is weekend', () => expect(isWeekend(new Date(2026, 4, 17))).toBe(true))
  it('Monday is not weekend', () => expect(isWeekend(new Date(2026, 4, 18))).toBe(false))
  it('Friday is not weekend', () => expect(isWeekend(new Date(2026, 4, 15))).toBe(false))
  it('Wednesday is not weekend', () => expect(isWeekend(new Date(2026, 4, 13))).toBe(false))
})

describe('isThisWeek', () => {
  it('today is this week', () => expect(isThisWeek(new Date(2026, 4, 13))).toBe(true))
  it('start of week (Sunday) is this week', () => expect(isThisWeek(new Date(2026, 4, 10))).toBe(true))
  it('end of week (Saturday) is this week', () => expect(isThisWeek(new Date(2026, 4, 16))).toBe(true))
  it('last Sunday is not this week', () => expect(isThisWeek(new Date(2026, 4, 9))).toBe(false))
  it('next Sunday is not this week', () => expect(isThisWeek(new Date(2026, 4, 17))).toBe(false))
})

describe('isThisYear', () => {
  it('current year is this year', () => expect(isThisYear(new Date(2026, 4, 13))).toBe(true))
  it('last year is not this year', () => expect(isThisYear(new Date(2025, 0, 1))).toBe(false))
  it('next year is not this year', () => expect(isThisYear(new Date(2027, 0, 1))).toBe(false))
  it('far past is not this year', () => expect(isThisYear(new Date(2000, 0, 1))).toBe(false))
})
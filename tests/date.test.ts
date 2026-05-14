import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  timeAgo, formatDate, daysBetween,
  isToday, isYesterday, isWeekend, isThisWeek, isThisYear
} from '../src/date/index'

// Wednesday May 13 2026 12:00:00 — fixed point in time for all tests
const FIXED_NOW = new Date(2026, 4, 13, 12, 0, 0)

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  vi.useRealTimers()
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
  // FIXED_NOW is Wednesday May 13 2026
  // current week: Sunday May 10 → Saturday May 16
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
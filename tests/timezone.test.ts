import { describe, it, expect } from 'vitest'
import { addMonths, addYears } from '../src/date/index'

// The repo has no @types/node; only process.env.TZ is needed here
declare const process: { env: Record<string, string | undefined> }

// Daylight-saving bugs only show up in time zones whose DST gap falls on a local time
// the code passes through. `npm run test:timezones` runs this file under several such zones:
//   TZ=Australia/Sydney npx vitest run tests/timezone.test.ts
// In zones without such gaps (UTC, most of Europe at these hours) the tests still pass.

describe(`addMonths / addYears keep the local time of day (TZ=${process.env.TZ ?? 'system default'})`, () => {
  it('the TZ under test is really applied', () => {
    // Sydney skips 02:00–03:00 on 2023-10-01; if TZ were ignored this would still be 2
    if (process.env.TZ === 'Australia/Sydney') expect(new Date(2023, 9, 1, 2, 30).getHours()).toBe(3)
  })

  it('Sydney example — Sep 20 02:30 + 1 month is Oct 20 02:30 (Oct 1 02:30 does not exist)', () => {
    const r = addMonths(new Date(2023, 8, 20, 2, 30), 1)
    expect([r.getMonth(), r.getDate(), r.getHours(), r.getMinutes()]).toEqual([9, 20, 2, 30])
  })

  it('adding 0 months returns the same instant', () => {
    const d = new Date(2023, 9, 20, 2, 30)
    expect(addMonths(d, 0).getTime()).toBe(d.getTime())
  })

  it('matches building the target date directly, for every month, day and hour around DST', () => {
    const mismatches: string[] = []
    for (const year of [2005, 2022, 2023, 2024]) {
      for (let month = 0; month < 12; month++) {
        for (const day of [1, 15, 28, 29, 30, 31]) {
          for (const hour of [0, 1, 2, 3, 23]) {
            const source = new Date(year, month, day, hour, 30)
            if (source.getMonth() !== month || source.getDate() !== day) continue // day does not exist
            for (const add of [-13, -1, 1, 2, 12]) {
              const lastDay = new Date(year, month + add + 1, 0).getDate()
              const expected = new Date(year, month + add, Math.min(day, lastDay), source.getHours(), 30)
              const actual = addMonths(source, add)
              if (actual.getTime() !== expected.getTime()) {
                mismatches.push(`${source.toString()} + ${add} → ${actual.toString()}, expected ${expected.toString()}`)
              }
            }
          }
        }
      }
    }
    expect(mismatches.slice(0, 5)).toEqual([])
  })

  it('addYears keeps the time too', () => {
    const r = addYears(new Date(2022, 9, 20, 2, 30), 1)
    expect([r.getFullYear(), r.getMonth(), r.getDate(), r.getHours(), r.getMinutes()]).toEqual([2023, 9, 20, 2, 30])
  })

  it('handles years 0–99 (not mapped to 19xx)', () => {
    const r = addYears(new Date(2024, 1, 29), -2024) // year 0 is a leap year
    expect([r.getFullYear(), r.getMonth(), r.getDate()]).toEqual([0, 1, 29])
  })
})

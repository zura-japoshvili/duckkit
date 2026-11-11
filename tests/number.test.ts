import { describe, it, expect } from 'vitest'
import { clamp, lerp, roundTo, randomInt, inRange, truncateTo } from '../src/number/index'
import { average, normalize, toOrdinal, toRoman, formatNumber, formatBytes } from '../src/number/index'

describe('clamp', () => {
  it('returns value when within range', () => expect(clamp(50, 0, 100)).toBe(50))
  it('returns min when below range', () => expect(clamp(-10, 0, 100)).toBe(0))
  it('returns max when above range', () => expect(clamp(150, 0, 100)).toBe(100))
  it('returns min when equal to min', () => expect(clamp(0, 0, 100)).toBe(0))
  it('returns max when equal to max', () => expect(clamp(100, 0, 100)).toBe(100))
  it('works with negative range', () => expect(clamp(-5, -10, -1)).toBe(-5))
  it('works with floats', () => expect(clamp(0.75, 0, 1)).toBe(0.75))
  it('works when min equals max', () => expect(clamp(50, 5, 5)).toBe(5))
})

describe('lerp', () => {
  it('t=0 returns start', () => expect(lerp(0, 100, 0)).toBe(0))
  it('t=1 returns end', () => expect(lerp(0, 100, 1)).toBe(100))
  it('t=0.5 returns midpoint', () => expect(lerp(0, 100, 0.5)).toBe(50))
  it('works with negative values', () => expect(lerp(-100, 100, 0.5)).toBe(0))
  it('works with same start and end', () => expect(lerp(5, 5, 0.5)).toBe(5))
  it('extrapolates beyond 1', () => expect(lerp(0, 100, 1.5)).toBe(150))
  it('extrapolates below 0', () => expect(lerp(0, 100, -0.5)).toBe(-50))
  it('works with floats', () => expect(lerp(0, 1, 0.25)).toBe(0.25))
})

describe('roundTo', () => {
  it('rounds to 2 decimals', () => expect(roundTo(1.2345, 2)).toBe(1.23))
  it('rounds up correctly', () => expect(roundTo(1.235, 2)).toBe(1.24))
  it('rounds to 0 decimals by default', () => expect(roundTo(1.7)).toBe(2))
  it('rounds down to 0 decimals', () => expect(roundTo(1.2)).toBe(1))
  it('works with negative decimals', () => expect(roundTo(1234.5, -2)).toBe(1200))
  it('works with 0', () => expect(roundTo(0, 2)).toBe(0))
  it('works with negative numbers', () => expect(roundTo(-1.567, 2)).toBe(-1.57))
  it('already rounded returns same value', () => expect(roundTo(1.5, 2)).toBe(1.5))
  // Midpoints that binary floating point stores just below .5 (1.005 * 100 = 100.49999…)
  it('rounds the decimal midpoint 1.005 up to 1.01', () => expect(roundTo(1.005, 2)).toBe(1.01))
  it('rounds the decimal midpoint 1.255 up to 1.26', () => expect(roundTo(1.255, 2)).toBe(1.26))
  it('rounds the decimal midpoint 8.345 up to 8.35', () => expect(roundTo(8.345, 2)).toBe(8.35))
  it('float midpoint 1.045 rounds correctly to 1.05', () => expect(roundTo(1.045, 2)).toBe(1.05))
  it('does not round up values just below a midpoint', () => expect(roundTo(1.0049999, 2)).toBe(1))
  it('cleans up float noise like 0.1 + 0.2', () => expect(roundTo(0.1 + 0.2, 2)).toBe(0.3))
  it('negative halves go toward +Infinity like Math.round', () => expect(roundTo(-2.5)).toBe(-2))
  it('handles tiny numbers printed in exponent form', () => expect(roundTo(1e-7, 2)).toBe(0))
  it('handles huge numbers printed in exponent form', () => expect(roundTo(1.23456e21, -19)).toBe(1.23e21))
  it('returns NaN and ±Infinity unchanged', () => {
    expect(roundTo(NaN, 2)).toBeNaN()
    expect(roundTo(Infinity, 2)).toBe(Infinity)
    expect(roundTo(-Infinity, 2)).toBe(-Infinity)
  })
  it('throws for fractional decimals', () => expect(() => roundTo(1.5, 1.5)).toThrow('roundTo: decimals must be an integer'))
  it('returns huge values unchanged when the shift overflows', () => {
    expect(roundTo(1e300, 10)).toBe(1e300)
    expect(roundTo(Number.MAX_VALUE, 1)).toBe(Number.MAX_VALUE)
  })
  it('keeps negative zero like Math.round', () => {
    expect(roundTo(-0.4)).toBe(-0)
    expect(roundTo(-0)).toBe(-0)
  })
})

describe('truncateTo', () => {
  it('truncates to 2 decimals without rounding up', () => expect(truncateTo(5.059, 2)).toBe(5.05))
  it('never rounds up unlike roundTo', () => expect(truncateTo(5.999, 2)).toBe(5.99))
  it('handles 1.005 without rounding up', () => expect(truncateTo(1.005, 2)).toBe(1.0))
  it('keeps exact decimals that floats store just below (0.29)', () => expect(truncateTo(0.29, 2)).toBe(0.29))
  it('never rounds up values just below the next step', () => expect(truncateTo(1.999999999999, 2)).toBe(1.99))
  it('works with negative decimals', () => expect(truncateTo(1299, -2)).toBe(1200))
  it('returns NaN and ±Infinity unchanged', () => {
    expect(truncateTo(NaN, 2)).toBeNaN()
    expect(truncateTo(Infinity, 2)).toBe(Infinity)
    expect(truncateTo(-Infinity, 2)).toBe(-Infinity)
  })
  it('throws for fractional decimals', () => expect(() => truncateTo(1.5, 0.5)).toThrow('truncateTo: decimals must be an integer'))
  it('returns huge values unchanged when the shift overflows', () => expect(truncateTo(1e300, 10)).toBe(1e300))
  it('truncates to 0 decimals by default', () => expect(truncateTo(9.9)).toBe(9))
  it('works with 0', () => expect(truncateTo(0, 2)).toBe(0))
  it('works with exact value', () => expect(truncateTo(5.05, 2)).toBe(5.05))
  it('works with large decimals', () => expect(truncateTo(1.99999, 3)).toBe(1.999))
  it('difference from roundTo is clear', () => {
    expect(truncateTo(5.059, 2)).toBe(5.05)
    expect(roundTo(5.059, 2)).toBe(5.06)
  })
  // Documented: Math.floor floors toward -Infinity, so negatives go more negative
  it('negative floors toward -Infinity (documented)', () => expect(truncateTo(-5.999, 2)).toBe(-6))
  it('negative -5.059 → -5.06 (documented)', () => expect(truncateTo(-5.059, 2)).toBe(-5.06))
})

describe('randomInt', () => {
  it('returns a number within range', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(1, 6)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
    }
  })

  it('returns an integer', () => {
    for (let i = 0; i < 50; i++) {
      expect(Number.isInteger(randomInt(0, 100))).toBe(true)
    }
  })

  it('min equals max always returns that value', () => {
    expect(randomInt(5, 5)).toBe(5)
  })

  it('includes both bounds', () => {
    const results = new Set<number>()
    for (let i = 0; i < 1000; i++) results.add(randomInt(1, 2))
    expect(results.has(1)).toBe(true)
    expect(results.has(2)).toBe(true)
  })

  it('works with negative range', () => {
    for (let i = 0; i < 50; i++) {
      const result = randomInt(-10, -1)
      expect(result).toBeGreaterThanOrEqual(-10)
      expect(result).toBeLessThanOrEqual(-1)
    }
  })
})

describe('inRange', () => {
  it('returns true when value is within range', () => expect(inRange(5, 1, 10)).toBe(true))
  it('returns false when value is below range', () => expect(inRange(0, 1, 10)).toBe(false))
  it('returns false when value is above range', () => expect(inRange(11, 1, 10)).toBe(false))
  it('returns true when value equals min', () => expect(inRange(1, 1, 10)).toBe(true))
  it('returns true when value equals max', () => expect(inRange(10, 1, 10)).toBe(true))
  it('works with floats', () => expect(inRange(0.5, 0, 1)).toBe(true))
  it('works with negative range', () => expect(inRange(-5, -10, -1)).toBe(true))
  it('works when min equals max', () => expect(inRange(5, 5, 5)).toBe(true))
  it('returns false when min equals max and value differs', () => expect(inRange(6, 5, 5)).toBe(false))
})

describe('average', () => {
  it('returns average of numbers', () => expect(average([1, 2, 3, 4, 5])).toBe(3))
  it('returns 0 for empty array', () => expect(average([])).toBe(0))
  it('handles single item', () => expect(average([42])).toBe(42))
  it('works with floats', () => expect(average([1.5, 2.5])).toBe(2))
  it('works with negative numbers', () => expect(average([-10, 10])).toBe(0))
  it('handles two items', () => expect(average([10, 20])).toBe(15))
})

describe('normalize', () => {
  it('maps value to 0-1 range', () => expect(normalize(150, 0, 200)).toBe(0.75))
  it('maps value to custom range', () => expect(normalize(150, 0, 200, 0, 100)).toBe(75))
  it('t=0 returns toMin', () => expect(normalize(0, 0, 100)).toBe(0))
  it('t=1 returns toMax', () => expect(normalize(100, 0, 100)).toBe(1))
  it('maps to negative range', () => expect(normalize(5, 0, 10, -1, 1)).toBe(0))
  it('works with non-zero fromMin', () => expect(normalize(15, 10, 20)).toBe(0.5))
  // Documented: a single-point source range divides by zero → NaN
  it('fromMin === fromMax produces NaN (documented)', () => expect(Number.isNaN(normalize(5, 5, 5))).toBe(true))
})

describe('toOrdinal', () => {
  it('1st', () => expect(toOrdinal(1)).toBe('1st'))
  it('2nd', () => expect(toOrdinal(2)).toBe('2nd'))
  it('3rd', () => expect(toOrdinal(3)).toBe('3rd'))
  it('4th', () => expect(toOrdinal(4)).toBe('4th'))
  it('11th — not 11st', () => expect(toOrdinal(11)).toBe('11th'))
  it('12th — not 12nd', () => expect(toOrdinal(12)).toBe('12th'))
  it('13th — not 13rd', () => expect(toOrdinal(13)).toBe('13th'))
  it('21st', () => expect(toOrdinal(21)).toBe('21st'))
  it('22nd', () => expect(toOrdinal(22)).toBe('22nd'))
  it('101st', () => expect(toOrdinal(101)).toBe('101st'))
  it('111th', () => expect(toOrdinal(111)).toBe('111th'))
  it('0th', () => expect(toOrdinal(0)).toBe('0th'))
  // Documented: no validation, floats/NaN fall through to the default suffix
  it('float input produces "1.5th" (documented)', () => expect(toOrdinal(1.5)).toBe('1.5th'))
  it('NaN input produces "NaNth" (documented)', () => expect(toOrdinal(NaN)).toBe('NaNth'))
})

describe('toRoman', () => {
  it('1 → I', () => expect(toRoman(1)).toBe('I'))
  it('4 → IV', () => expect(toRoman(4)).toBe('IV'))
  it('9 → IX', () => expect(toRoman(9)).toBe('IX'))
  it('14 → XIV', () => expect(toRoman(14)).toBe('XIV'))
  it('40 → XL', () => expect(toRoman(40)).toBe('XL'))
  it('90 → XC', () => expect(toRoman(90)).toBe('XC'))
  it('400 → CD', () => expect(toRoman(400)).toBe('CD'))
  it('900 → CM', () => expect(toRoman(900)).toBe('CM'))
  it('1994 → MCMXCIV', () => expect(toRoman(1994)).toBe('MCMXCIV'))
  it('2026 → MMXXVI', () => expect(toRoman(2026)).toBe('MMXXVI'))
  it('3999 → MMMCMXCIX', () => expect(toRoman(3999)).toBe('MMMCMXCIX'))
  it('throws for 0', () => expect(() => toRoman(0)).toThrow(RangeError))
  it('throws for 4000', () => expect(() => toRoman(4000)).toThrow(RangeError))
  it('throws for negative', () => expect(() => toRoman(-1)).toThrow(RangeError))
})

describe('formatNumber', () => {
  it('adds thousand separators', () => expect(formatNumber(1000000)).toBe('1,000,000'))
  it('handles decimals', () => expect(formatNumber(1234567.89)).toBe('1,234,567.89'))
  it('custom separator', () => expect(formatNumber(1000, '.')).toBe('1.000'))
  it('custom decimal separator', () => expect(formatNumber(1000.5, '.', ',')).toBe('1.000,5'))
  it('no separator needed under 1000', () => expect(formatNumber(999)).toBe('999'))
  it('handles 0', () => expect(formatNumber(0)).toBe('0'))
  it('handles negative', () => expect(formatNumber(-1000)).toBe('-1,000'))
})

describe('formatBytes', () => {
  it('0 bytes', () => expect(formatBytes(0)).toBe('0 B'))
  it('1024 → 1 KB', () => expect(formatBytes(1024)).toBe('1 KB'))
  it('1048576 → 1 MB', () => expect(formatBytes(1048576)).toBe('1 MB'))
  it('1073741824 → 1 GB', () => expect(formatBytes(1073741824)).toBe('1 GB'))
  it('handles decimals', () => expect(formatBytes(1234567)).toBe('1.18 MB'))
  it('0 decimal places', () => expect(formatBytes(1234567, 0)).toBe('1 MB'))
  it('handles bytes under 1KB', () => expect(formatBytes(512)).toBe('512 B'))
  it('keeps the sign of negative values', () => expect(formatBytes(-1024)).toBe('-1 KB'))
  it('formats exabytes (2^60)', () => expect(formatBytes(2 ** 60)).toBe('1 EB'))
  it('stays in YB past the largest unit', () => expect(formatBytes(1024 ** 9)).toBe('1024 YB'))
  it('keeps values under 1 in bytes', () => expect(formatBytes(0.5)).toBe('0.5 B'))
  it('moves up a unit when rounding reaches 1024', () => {
    expect(formatBytes(1023.999)).toBe('1 KB')
    expect(formatBytes(1048575)).toBe('1 MB')
    expect(formatBytes(1023.6, 0)).toBe('1 KB')
    expect(formatBytes(-1023.999)).toBe('-1 KB')
  })
  it('stays in the unit when rounding does not reach 1024', () => {
    expect(formatBytes(1023)).toBe('1023 B')
    expect(formatBytes(1023.4, 0)).toBe('1023 B')
  })
  it('shows NaN and Infinity as-is', () => {
    expect(formatBytes(NaN)).toBe('NaN B')
    expect(formatBytes(Infinity)).toBe('Infinity B')
  })
})
import { describe, it, expect } from 'vitest'
import { clamp, lerp, roundTo, randomInt, inRange, truncateTo } from '../src/number/index'

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
})

describe('truncateTo', () => {
  it('truncates to 2 decimals without rounding up', () => expect(truncateTo(5.059, 2)).toBe(5.05))
  it('never rounds up unlike roundTo', () => expect(truncateTo(5.999, 2)).toBe(5.99))
  it('handles floating point correctly with epsilon', () => expect(truncateTo(1.005, 2)).toBe(1.0))
  it('truncates to 0 decimals by default', () => expect(truncateTo(9.9)).toBe(9))
  it('works with 0', () => expect(truncateTo(0, 2)).toBe(0))
  it('works with exact value', () => expect(truncateTo(5.05, 2)).toBe(5.05))
  it('works with large decimals', () => expect(truncateTo(1.99999, 3)).toBe(1.999))
  it('difference from roundTo is clear', () => {
    expect(truncateTo(5.059, 2)).toBe(5.05)
    expect(roundTo(5.059, 2)).toBe(5.06)
  })
  it('works with negative number', () => expect(truncateTo(-5.789, 2)).toBe(-5.79))
  it('works with negative number to 0 decimals', () => expect(truncateTo(-3.9)).toBe(-4))
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
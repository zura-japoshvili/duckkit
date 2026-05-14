import { describe, it, expect } from 'vitest'
import {
  capitalize, truncate, slugify, camelCase, snakeCase,
  kebabCase, pascalCase, titleCase, isEmpty, randomId, countOccurrences
} from '../src/string/index'

describe('capitalize', () => {
  it('capitalizes first letter', () => expect(capitalize('hello world')).toBe('Hello world'))
  it('does not change rest of string', () => expect(capitalize('hELLO')).toBe('HELLO'))
  it('handles already capitalized', () => expect(capitalize('Hello')).toBe('Hello'))
  it('handles empty string', () => expect(capitalize('')).toBe(''))
  it('handles single character', () => expect(capitalize('a')).toBe('A'))
  it('handles uppercase single character', () => expect(capitalize('A')).toBe('A'))
})

describe('truncate', () => {
  it('truncates long string with default suffix', () => expect(truncate('Hello World', 8)).toBe('Hello...'))
  it('returns string unchanged if fits', () => expect(truncate('Hi', 8)).toBe('Hi'))
  it('returns string unchanged if exactly maxLength', () => expect(truncate('Hello', 5)).toBe('Hello'))
  it('uses custom suffix', () => expect(truncate('Hello World', 8, ' →')).toBe('Hello  →'))
  it('handles empty suffix', () => expect(truncate('Hello World', 5, '')).toBe('Hello'))
  it('handles empty string', () => expect(truncate('', 5)).toBe(''))
  it('suffix longer than maxLength still works', () => expect(truncate('Hello World', 3, '...')).toBe('...'))
})

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => expect(slugify('Hello World')).toBe('hello-world'))
  it('removes special characters', () => expect(slugify('Hello World!')).toBe('hello-world'))
  it('handles multiple spaces', () => expect(slugify('  extra   spaces  ')).toBe('extra-spaces'))
  it('handles numbers', () => expect(slugify('My Post #1')).toBe('my-post-1'))
  it('handles already slugified', () => expect(slugify('hello-world')).toBe('hello-world'))
  it('handles empty string', () => expect(slugify('')).toBe(''))
  it('removes leading and trailing hyphens', () => expect(slugify('!hello!')).toBe('hello'))
})

describe('camelCase', () => {
  it('converts snake_case', () => expect(camelCase('foo_bar_baz')).toBe('fooBarBaz'))
  it('converts kebab-case', () => expect(camelCase('foo-bar-baz')).toBe('fooBarBaz'))
  it('converts spaces', () => expect(camelCase('foo bar baz')).toBe('fooBarBaz'))
  it('converts UPPER_SNAKE', () => expect(camelCase('FOO_BAR')).toBe('fooBar'))
  it('handles single word', () => expect(camelCase('hello')).toBe('hello'))
  it('handles empty string', () => expect(camelCase('')).toBe(''))
  it('handles already camelCase', () => expect(camelCase('fooBar')).toBe('foobar'))
})

describe('snakeCase', () => {
  it('converts camelCase', () => expect(snakeCase('fooBarBaz')).toBe('foo_bar_baz'))
  it('converts kebab-case', () => expect(snakeCase('foo-bar-baz')).toBe('foo_bar_baz'))
  it('converts spaces', () => expect(snakeCase('foo bar baz')).toBe('foo_bar_baz'))
  it('converts FOOBar', () => expect(snakeCase('FOOBar')).toBe('foo_bar'))
  it('handles single word', () => expect(snakeCase('hello')).toBe('hello'))
  it('handles empty string', () => expect(snakeCase('')).toBe(''))
  it('handles already snake_case', () => expect(snakeCase('foo_bar')).toBe('foo_bar'))
})

describe('kebabCase', () => {
  it('converts camelCase', () => expect(kebabCase('fooBarBaz')).toBe('foo-bar-baz'))
  it('converts snake_case', () => expect(kebabCase('foo_bar_baz')).toBe('foo-bar-baz'))
  it('converts spaces', () => expect(kebabCase('foo bar baz')).toBe('foo-bar-baz'))
  it('converts FOOBar', () => expect(kebabCase('FOOBar')).toBe('foo-bar'))
  it('handles single word', () => expect(kebabCase('hello')).toBe('hello'))
  it('handles empty string', () => expect(kebabCase('')).toBe(''))
  it('handles already kebab-case', () => expect(kebabCase('foo-bar')).toBe('foo-bar'))
})

describe('pascalCase', () => {
  it('converts snake_case', () => expect(pascalCase('foo_bar_baz')).toBe('FooBarBaz'))
  it('converts kebab-case', () => expect(pascalCase('foo-bar-baz')).toBe('FooBarBaz'))
  it('converts spaces', () => expect(pascalCase('hello world')).toBe('HelloWorld'))
  it('converts camelCase', () => expect(pascalCase('fooBarBaz')).toBe('Foobarbaz'))
  it('handles single word', () => expect(pascalCase('hello')).toBe('Hello'))
  it('handles empty string', () => expect(pascalCase('')).toBe(''))
  it('handles already PascalCase', () => expect(pascalCase('FooBar')).toBe('Foobar'))
})

describe('titleCase', () => {
  it('capitalizes every word', () => expect(titleCase('hello world')).toBe('Hello World'))
  it('handles single word', () => expect(titleCase('hello')).toBe('Hello'))
  it('handles already title case', () => expect(titleCase('Hello World')).toBe('Hello World'))
  it('handles empty string', () => expect(titleCase('')).toBe(''))
  it('handles multiple spaces between words', () => expect(titleCase('hello  world')).toBe('Hello  World'))
  it('does not lowercase existing uppercase', () => expect(titleCase('hELLO wORLD')).toBe('HELLO WORLD'))
})

describe('isEmpty', () => {
  it('returns true for empty string', () => expect(isEmpty('')).toBe(true))
  it('returns true for spaces only', () => expect(isEmpty('   ')).toBe(true))
  it('returns true for newline and tab', () => expect(isEmpty('\n\t')).toBe(true))
  it('returns false for non-empty string', () => expect(isEmpty('hello')).toBe(false))
  it('returns false for string with spaces around content', () => expect(isEmpty(' hi ')).toBe(false))
  it('returns false for single character', () => expect(isEmpty('a')).toBe(false))
})

describe('randomId', () => {
  it('returns default length of 8', () => expect(randomId()).toHaveLength(8))
  it('returns correct custom length', () => expect(randomId(12)).toHaveLength(12))
  it('returns length 1', () => expect(randomId(1)).toHaveLength(1))
  it('returns only alphanumeric characters', () => {
    expect(randomId(100)).toMatch(/^[A-Za-z0-9]+$/)
  })
  it('two calls return different values', () => {
    expect(randomId()).not.toBe(randomId())
  })
  it('returns empty string for length 0', () => expect(randomId(0)).toBe(''))
})

describe('countOccurrences', () => {
  it('counts multiple occurrences', () => expect(countOccurrences('hello world hello', 'hello')).toBe(2))
  it('returns 0 when not found', () => expect(countOccurrences('hello', 'xyz')).toBe(0))
  it('counts non-overlapping only', () => expect(countOccurrences('aaa', 'aa')).toBe(1))
  it('returns 0 for empty substring', () => expect(countOccurrences('hello', '')).toBe(0))
  it('handles empty string', () => expect(countOccurrences('', 'hello')).toBe(0))
  it('is case sensitive', () => expect(countOccurrences('Hello hello', 'hello')).toBe(1))
  it('counts single character', () => expect(countOccurrences('mississippi', 's')).toBe(4))
  it('whole string is the substring', () => expect(countOccurrences('hello', 'hello')).toBe(1))
})
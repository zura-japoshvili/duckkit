import { describe, it, expect } from 'vitest'
import {
  capitalize, truncate, slugify, camelCase, snakeCase,
  kebabCase, pascalCase, titleCase, isEmpty, randomId, countOccurrences
} from '../src/string/index'
import { escapeHtml, unescapeHtml, template, words, mask, stripHtml, excerpt } from '../src/string/index'

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

describe('escapeHtml', () => {
  it('escapes &', () => expect(escapeHtml('Hello & World')).toBe('Hello &amp; World'))
  it('escapes <', () => expect(escapeHtml('<div>')).toBe('&lt;div&gt;'))
  it('escapes "', () => expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;'))
  it("escapes '", () => expect(escapeHtml("it's")).toBe('it&#39;s'))
  it('escapes script tag', () => expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'))
  it('handles empty string', () => expect(escapeHtml('')).toBe(''))
  it('no special chars unchanged', () => expect(escapeHtml('hello world')).toBe('hello world'))
})

describe('unescapeHtml', () => {
  it('unescapes &amp;', () => expect(unescapeHtml('Hello &amp; World')).toBe('Hello & World'))
  it('unescapes &lt; and &gt;', () => expect(unescapeHtml('&lt;div&gt;')).toBe('<div>'))
  it('unescapes &quot;', () => expect(unescapeHtml('&quot;quoted&quot;')).toBe('"quoted"'))
  it('unescapes &#39;', () => expect(unescapeHtml('it&#39;s')).toBe("it's"))
  it('handles empty string', () => expect(unescapeHtml('')).toBe(''))
  it('is inverse of escapeHtml', () => {
    const original = '<script>alert("xss") & more</script>'
    expect(unescapeHtml(escapeHtml(original))).toBe(original)
  })
})

describe('template', () => {
  it('replaces single placeholder', () => {
    expect(template('Hello {name}!', { name: 'Zura' })).toBe('Hello Zura!')
  })

  it('replaces multiple placeholders', () => {
    expect(template('{title} {lastName}', { title: 'Mr', lastName: 'J' })).toBe('Mr J')
  })

  it('leaves missing keys as-is by default', () => {
    expect(template('Hello {name}!', {})).toBe('Hello {name}!')
  })

  it('uses fallback for missing keys', () => {
    expect(template('Hello {name}!', {}, 'stranger')).toBe('Hello stranger!')
  })

  it('handles number values', () => {
    expect(template('Score: {score}', { score: 42 })).toBe('Score: 42')
  })

  it('handles empty string', () => {
    expect(template('', { name: 'Zura' })).toBe('')
  })

  it('no placeholders returns string unchanged', () => {
    expect(template('Hello World', { name: 'Zura' })).toBe('Hello World')
  })
})

describe('words', () => {
  it('splits camelCase', () => expect(words('fooBarBaz')).toEqual(['foo', 'bar', 'baz']))
  it('splits snake_case', () => expect(words('foo_bar_baz')).toEqual(['foo', 'bar', 'baz']))
  it('splits kebab-case', () => expect(words('foo-bar-baz')).toEqual(['foo', 'bar', 'baz']))
  it('splits spaces', () => expect(words('hello world')).toEqual(['hello', 'world']))
  it('handles FOOBar', () => expect(words('FOOBar')).toEqual(['foo', 'bar']))
  it('handles empty string', () => expect(words('')).toEqual([]))
  it('handles single word', () => expect(words('hello')).toEqual(['hello']))
})

describe('mask', () => {
  it('masks all but last 4 by default', () => expect(mask('4242424242424242')).toBe('************4242'))
  it('custom visible count', () => expect(mask('hello world', 5)).toBe('******world'))
  it('visible count 0 masks all', () => expect(mask('hello', 0)).toBe('*****'))
  it('visible count >= length returns full string', () => expect(mask('hi', 10)).toBe('hi'))
  it('custom mask char', () => expect(mask('hello', 2, '•')).toBe('•••lo'))
  it('handles empty string', () => expect(mask('', 4)).toBe(''))
  it('exact visible count', () => expect(mask('hello', 5)).toBe('hello'))
})

describe('stripHtml', () => {
  it('removes tags', () => expect(stripHtml('<p>Hello</p>')).toBe('Hello'))
  it('removes nested tags', () => expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World'))
  it('removes anchor tags keeping text', () => expect(stripHtml('<a href="/about">About</a>')).toBe('About'))
  it('handles string with no tags', () => expect(stripHtml('Hello World')).toBe('Hello World'))
  it('handles empty string', () => expect(stripHtml('')).toBe(''))
  it('handles self-closing tags', () => expect(stripHtml('Hello<br/>World')).toBe('HelloWorld'))
})

describe('excerpt', () => {
  it('truncates at word boundary', () => {
    expect(excerpt('Hello World foo bar', 15)).toBe('Hello World...')
  })

  it('returns unchanged if fits', () => {
    expect(excerpt('Short', 20)).toBe('Short')
  })

  it('returns unchanged if exactly maxLength', () => {
    expect(excerpt('Hello', 5)).toBe('Hello')
  })

it('uses custom suffix', () => {
  expect(excerpt('Hello World foo', 14, ' →')).toBe('Hello World →')
})

  it('handles no space — cuts at limit', () => {
    expect(excerpt('Superlongword', 8)).toBe('Super...')
  })

  it('handles empty string', () => {
    expect(excerpt('', 10)).toBe('')
  })
})
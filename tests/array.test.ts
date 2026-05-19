import { describe, it, expect } from 'vitest'
import { groupBy, flatGroupBy, chunk, unique, topBy, zip } from '../src/array/index'
import { sortBy, minBy, maxBy, partition } from '../src/array/index'
import { compact, sum, sumBy, countBy, intersection, difference, shuffle, flatten, range, sample, keyBy, without, union } from '../src/array/index'


describe('sortBy', () => {
  it('sorts by number ascending by default', () => {
    const arr = [{ v: 3 }, { v: 1 }, { v: 2 }]
    expect(sortBy(arr, x => x.v)).toEqual([{ v: 1 }, { v: 2 }, { v: 3 }])
  })

  it('sorts by number descending', () => {
    const arr = [{ v: 3 }, { v: 1 }, { v: 2 }]
    expect(sortBy(arr, x => x.v, 'desc')).toEqual([{ v: 3 }, { v: 2 }, { v: 1 }])
  })

  it('sorts by string ascending', () => {
    const arr = [{ name: 'Zura' }, { name: 'Alice' }, { name: 'Mike' }]
    expect(sortBy(arr, x => x.name)[0]?.name).toBe('Alice')
  })

  it('sorts by string descending', () => {
    const arr = [{ name: 'Zura' }, { name: 'Alice' }, { name: 'Mike' }]
    expect(sortBy(arr, x => x.name, 'desc')[0]?.name).toBe('Zura')
  })

  it('does not mutate original array', () => {
    const arr = [{ v: 3 }, { v: 1 }, { v: 2 }]
    const original = [...arr]
    sortBy(arr, x => x.v)
    expect(arr).toEqual(original)
  })

  it('handles empty array', () => {
    expect(sortBy([], x => x)).toEqual([])
  })

  it('handles single item', () => {
    expect(sortBy([{ v: 1 }], x => x.v)).toEqual([{ v: 1 }])
  })
})

describe('minBy', () => {
  it('returns item with lowest value', () => {
    const arr = [{ v: 3 }, { v: 1 }, { v: 2 }]
    expect(minBy(arr, x => x.v)).toEqual({ v: 1 })
  })

  it('returns undefined for empty array', () => {
    expect(minBy([], x => x)).toBeUndefined()
  })

  it('handles single item', () => {
    expect(minBy([{ v: 5 }], x => x.v)).toEqual({ v: 5 })
  })

  it('handles negative values', () => {
    const arr = [{ v: -1 }, { v: -5 }, { v: -2 }]
    expect(minBy(arr, x => x.v)).toEqual({ v: -5 })
  })

  it('returns first item on tie', () => {
    const arr = [{ v: 1, name: 'a' }, { v: 1, name: 'b' }]
    expect(minBy(arr, x => x.v)?.name).toBe('a')
  })
})

describe('maxBy', () => {
  it('returns item with highest value', () => {
    const arr = [{ v: 3 }, { v: 1 }, { v: 2 }]
    expect(maxBy(arr, x => x.v)).toEqual({ v: 3 })
  })

  it('returns undefined for empty array', () => {
    expect(maxBy([], x => x)).toBeUndefined()
  })

  it('handles single item', () => {
    expect(maxBy([{ v: 5 }], x => x.v)).toEqual({ v: 5 })
  })

  it('handles negative values', () => {
    const arr = [{ v: -1 }, { v: -5 }, { v: -2 }]
    expect(maxBy(arr, x => x.v)).toEqual({ v: -1 })
  })

  it('returns first item on tie', () => {
    const arr = [{ v: 5, name: 'a' }, { v: 5, name: 'b' }]
    expect(maxBy(arr, x => x.v)?.name).toBe('a')
  })
})

describe('partition', () => {
  it('splits into matches and non-matches', () => {
    const [evens, odds] = partition([1, 2, 3, 4, 5], n => n % 2 === 0)
    expect(evens).toEqual([2, 4])
    expect(odds).toEqual([1, 3, 5])
  })

  it('all match — second array empty', () => {
    const [matches, rest] = partition([2, 4, 6], n => n % 2 === 0)
    expect(matches).toEqual([2, 4, 6])
    expect(rest).toEqual([])
  })

  it('none match — first array empty', () => {
    const [matches, rest] = partition([1, 3, 5], n => n % 2 === 0)
    expect(matches).toEqual([])
    expect(rest).toEqual([1, 3, 5])
  })

  it('handles empty array', () => {
    const [a, b] = partition([], () => true)
    expect(a).toEqual([])
    expect(b).toEqual([])
  })

  it('works with objects', () => {
    const users = [
      { name: 'Zura', admin: true },
      { name: 'Alice', admin: false },
      { name: 'Giorgi', admin: true },
    ]
    const [admins, regular] = partition(users, x => x.admin)
    expect(admins).toHaveLength(2)
    expect(regular).toHaveLength(1)
    expect(regular[0]?.name).toBe('Alice')
  })

  it('preserves order within each group', () => {
    const [a] = partition([3, 1, 4, 1, 5], n => n > 2)
    expect(a).toEqual([3, 4, 5])
  })
})

describe('groupBy', () => {
  it('groups by string key', () => {
    const users = [
      { name: 'Zura', country: 'GE' },
      { name: 'Alice', country: 'US' },
      { name: 'Giorgi', country: 'GE' },
    ]
    const result = groupBy(users, x => x.country)
    expect(result['GE']).toHaveLength(2)
    expect(result['US']).toHaveLength(1)
    expect(result['GE']?.[0]?.name).toBe('Zura')
  })

  it('handles empty array', () => {
    expect(groupBy([], x => x)).toEqual({})
  })

  it('all items share the same key', () => {
    const items = [{ v: 1 }, { v: 2 }, { v: 3 }]
    const result = groupBy(items, () => 'all')
    expect(result['all']).toHaveLength(3)
  })

  it('each item has a unique key', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const result = groupBy(items, x => x.id)
    expect(Object.keys(result)).toHaveLength(3)
    expect(result['a']).toHaveLength(1)
  })

  it('single item array', () => {
    const result = groupBy([{ role: 'admin' }], x => x.role)
    expect(result['admin']).toHaveLength(1)
  })
})

describe('flatGroupBy', () => {
  it('maps items to multiple keys', () => {
    const artists = [
      { name: 'Gorillaz', genres: ['alternative', 'electronic'] },
      { name: 'Arctic Monkeys', genres: ['rock', 'alternative'] },
    ]
    const result = flatGroupBy(artists, a => a.genres)
    expect(result['alternative']).toHaveLength(2)
    expect(result['electronic']).toHaveLength(1)
    expect(result['rock']).toHaveLength(1)
  })

  it('handles empty array', () => {
    expect(flatGroupBy([], x => [])).toEqual({})
  })

  it('item with no keys is excluded from all groups', () => {
    const items = [{ tags: [] as string[] }, { tags: ['a'] }]
    const result = flatGroupBy(items, x => x.tags)
    expect(result['a']).toHaveLength(1)
    expect(Object.keys(result)).toHaveLength(1)
  })

  it('item with a single key appears once', () => {
    const items = [{ tags: ['only'] }]
    const result = flatGroupBy(items, x => x.tags)
    expect(result['only']).toHaveLength(1)
  })

  it('duplicate keys returned by fn count item once per key', () => {
    const items = [{ tags: ['x', 'x'] }]
    const result = flatGroupBy(items, x => x.tags)
    expect(result['x']).toHaveLength(2)
  })
})

describe('chunk', () => {
  it('splits array into chunks', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('handles exact divisions', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]])
  })

  it('throws on size <= 0', () => {
    expect(() => chunk([1, 2], 0)).toThrow()
  })

  it('handles empty array', () => {
    expect(chunk([], 3)).toEqual([])
  })
})

describe('unique', () => {
  it('deduplicates primitives', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3])
  })

  it('deduplicates by key function', () => {
    const users = [{ id: 1 }, { id: 2 }, { id: 1 }]
    expect(unique(users, x => x.id)).toHaveLength(2)
  })

  it('preserves order', () => {
    expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2])
  })

  it('handles empty array', () => {
    expect(unique([])).toEqual([])
  })

  it('all elements are duplicates', () => {
    expect(unique([5, 5, 5, 5])).toEqual([5])
  })

  it('no duplicates — returns same values', () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('keeps first occurrence when using key fn', () => {
    const users = [{ id: 1, name: 'Zura' }, { id: 1, name: 'Other' }]
    expect(unique(users, x => x.id)[0]?.name).toBe('Zura')
  })
})

describe('topBy', () => {
  it('returns top N by numeric criteria', () => {
    const songs = [
      { title: 'A', plays: 100 },
      { title: 'B', plays: 500 },
      { title: 'C', plays: 200 },
      { title: 'D', plays: 50 },
    ]
    const top2 = topBy(songs, x => x.plays, 2)
    expect(top2).toHaveLength(2)
    expect(top2[0]?.title).toBe('B')
    expect(top2[1]?.title).toBe('C')
  })

  it('does not mutate the original array', () => {
    const arr = [3, 1, 2].map(plays => ({ plays }))
    const original = [...arr]
    topBy(arr, x => x.plays, 2)
    expect(arr).toEqual(original)
  })

  it('n greater than array length returns all items sorted', () => {
    const arr = [{ v: 1 }, { v: 3 }, { v: 2 }]
    expect(topBy(arr, x => x.v, 100)).toEqual([{ v: 3 }, { v: 2 }, { v: 1 }])
  })

  it('n = 0 returns empty array', () => {
    expect(topBy([{ v: 1 }, { v: 2 }], x => x.v, 0)).toEqual([])
  })

  it('handles empty array', () => {
    expect(topBy([], x => x, 3)).toEqual([])
  })

  it('handles ties in sort key', () => {
    const arr = [{ v: 5, name: 'a' }, { v: 5, name: 'b' }, { v: 3, name: 'c' }]
    const result = topBy(arr, x => x.v, 2)
    expect(result).toHaveLength(2)
    expect(result.every(x => x.v === 5)).toBe(true)
  })
})

describe('zip', () => {
  it('zips two arrays into pairs', () => {
    expect(zip(['a', 'b'], [1, 2])).toEqual([['a', 1], ['b', 2]])
  })

  it('stops at the shorter array', () => {
    expect(zip([1, 2, 3], ['a', 'b'])).toEqual([[1, 'a'], [2, 'b']])
  })

  it('handles empty arrays', () => {
    expect(zip([], [])).toEqual([])
  })

  it('first array empty, second non-empty returns empty', () => {
    expect(zip([], [1, 2, 3])).toEqual([])
  })

  it('second array empty, first non-empty returns empty', () => {
    expect(zip([1, 2, 3], [])).toEqual([])
  })

  it('single element arrays', () => {
    expect(zip(['x'], [99])).toEqual([['x', 99]])
  })
})

describe('compact', () => {
  it('removes null and undefined', () => {
    expect(compact([1, null, 2, undefined, 3])).toEqual([1, 2, 3])
  })

  it('removes false, 0, empty string', () => {
    expect(compact([1, false, 2, 0, 3, ''])).toEqual([1, 2, 3])
  })

  it('returns same array when nothing to remove', () => {
    expect(compact([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('handles empty array', () => {
    expect(compact([])).toEqual([])
  })

  it('all falsy returns empty array', () => {
    expect(compact([null, undefined, false, 0, ''])).toEqual([])
  })

  it('preserves order', () => {
    expect(compact([3, null, 1, undefined, 2])).toEqual([3, 1, 2])
  })
})

describe('sum', () => {
  it('sums numbers', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15)
  })

  it('returns 0 for empty array', () => {
    expect(sum([])).toBe(0)
  })

  it('handles negative numbers', () => {
    expect(sum([-1, -2, 3])).toBe(0)
  })

  it('handles single item', () => {
    expect(sum([42])).toBe(42)
  })

  it('handles floats', () => {
    expect(sum([0.1, 0.2])).toBeCloseTo(0.3)
  })
})

describe('sumBy', () => {
  it('sums by numeric field', () => {
    const orders = [{ total: 10 }, { total: 20 }, { total: 30 }]
    expect(sumBy(orders, x => x.total)).toBe(60)
  })

  it('returns 0 for empty array', () => {
    expect(sumBy([], x => x)).toBe(0)
  })

  it('works with computed values', () => {
    const cart = [{ price: 10, qty: 2 }, { price: 5, qty: 3 }]
    expect(sumBy(cart, x => x.price * x.qty)).toBe(35)
  })

  it('handles negative values', () => {
    const items = [{ v: 10 }, { v: -3 }]
    expect(sumBy(items, x => x.v)).toBe(7)
  })
})

describe('countBy', () => {
  it('counts by string key', () => {
    const users = [
      { country: 'GE' },
      { country: 'US' },
      { country: 'GE' },
      { country: 'GE' },
    ]
    expect(countBy(users, x => x.country)).toEqual({ GE: 3, US: 1 })
  })

  it('handles empty array', () => {
    expect(countBy([], x => x)).toEqual({})
  })

  it('all items same key', () => {
    expect(countBy([1, 2, 3], () => 'all')).toEqual({ all: 3 })
  })

  it('each item unique key', () => {
    const result = countBy(['a', 'b', 'c'], x => x)
    expect(result).toEqual({ a: 1, b: 1, c: 1 })
  })
})

describe('intersection', () => {
  it('returns common primitives', () => {
    expect(intersection([1, 2, 3, 4], [2, 4, 6])).toEqual([2, 4])
  })

  it('returns empty when no common items', () => {
    expect(intersection([1, 2, 3], [4, 5, 6])).toEqual([])
  })

  it('handles empty first array', () => {
    expect(intersection([], [1, 2, 3])).toEqual([])
  })

  it('handles empty second array', () => {
    expect(intersection([1, 2, 3], [])).toEqual([])
  })

  it('works with key function for objects', () => {
    const a = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const b = [{ id: 2 }, { id: 4 }]
    expect(intersection(a, b, x => x.id)).toEqual([{ id: 2 }])
  })

  it('preserves order of first array', () => {
    expect(intersection([3, 1, 2], [2, 3])).toEqual([3, 2])
  })
})

describe('difference', () => {
  it('returns items in a not in b', () => {
    expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3])
  })

  it('returns all items when b is empty', () => {
    expect(difference([1, 2, 3], [])).toEqual([1, 2, 3])
  })

  it('returns empty when all items are in b', () => {
    expect(difference([1, 2], [1, 2, 3])).toEqual([])
  })

  it('handles empty first array', () => {
    expect(difference([], [1, 2, 3])).toEqual([])
  })

  it('works with key function for objects', () => {
    const all = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const active = [{ id: 1 }, { id: 3 }]
    expect(difference(all, active, x => x.id)).toEqual([{ id: 2 }])
  })

  it('preserves order', () => {
    expect(difference([3, 1, 2, 4], [2, 3])).toEqual([1, 4])
  })
})

describe('shuffle', () => {
  it('returns same length', () => {
    expect(shuffle([1, 2, 3, 4, 5])).toHaveLength(5)
  })

  it('contains same items', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle(arr).sort()).toEqual([...arr].sort())
  })

  it('does not mutate original', () => {
    const arr = [1, 2, 3, 4, 5]
    const original = [...arr]
    shuffle(arr)
    expect(arr).toEqual(original)
  })

  it('handles empty array', () => {
    expect(shuffle([])).toEqual([])
  })

  it('handles single item', () => {
    expect(shuffle([42])).toEqual([42])
  })
})

describe('flatten', () => {
  it('flattens one level', () => {
    expect(flatten([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5])
  })

  it('handles empty array', () => {
    expect(flatten([])).toEqual([])
  })

  it('handles empty inner arrays', () => {
    expect(flatten([[], [1], [], [2, 3]])).toEqual([1, 2, 3])
  })

  it('handles single inner array', () => {
    expect(flatten([[1, 2, 3]])).toEqual([1, 2, 3])
  })

})

describe('range', () => {
  it('generates basic range', () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4])
  })

  it('generates range with step', () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
  })

  it('generates descending range', () => {
    expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1])
  })

  it('returns empty when start equals end', () => {
    expect(range(5, 5)).toEqual([])
  })

  it('returns empty when direction conflicts with step', () => {
    expect(range(0, 5, -1)).toEqual([])
  })

  it('throws on step 0', () => {
    expect(() => range(0, 5, 0)).toThrow()
  })

  it('handles negative start', () => {
    expect(range(-3, 0)).toEqual([-3, -2, -1])
  })
})

describe('sample', () => {
  it('returns an item from the array', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = sample(arr)
    expect(arr).toContain(result)
  })

  it('returns undefined for empty array', () => {
    expect(sample([])).toBeUndefined()
  })

  it('returns the only item for single element array', () => {
    expect(sample([42])).toBe(42)
  })

  it('returns different items over multiple calls', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const results = new Set(Array.from({ length: 100 }, () => sample(arr)))
    expect(results.size).toBeGreaterThan(1)
  })
})

describe('keyBy', () => {
  it('keys by string field', () => {
    const users = [{ id: '1', name: 'Zura' }, { id: '2', name: 'Alice' }]
    const result = keyBy(users, x => x.id)
    expect(result['1']?.name).toBe('Zura')
    expect(result['2']?.name).toBe('Alice')
  })

  it('handles empty array', () => {
    expect(keyBy([], x => x)).toEqual({})
  })

  it('last item wins on duplicate keys', () => {
    const users = [{ id: '1', name: 'Zura' }, { id: '1', name: 'Other' }]
    expect(keyBy(users, x => x.id)['1']?.name).toBe('Other')
  })

  it('result has correct number of keys', () => {
    const items = [{ k: 'a' }, { k: 'b' }, { k: 'c' }]
    expect(Object.keys(keyBy(items, x => x.k))).toHaveLength(3)
  })
})

describe('without', () => {
  it('removes specified values', () => {
    expect(without([1, 2, 3, 4, 5], 2, 4)).toEqual([1, 3, 5])
  })

  it('returns same array when values not present', () => {
    expect(without([1, 2, 3], 4, 5)).toEqual([1, 2, 3])
  })

  it('handles empty array', () => {
    expect(without([], 1, 2)).toEqual([])
  })

  it('removes all occurrences', () => {
    expect(without([1, 2, 1, 2, 1], 1)).toEqual([2, 2])
  })

  it('no values to remove returns original', () => {
    expect(without([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('works with strings', () => {
    expect(without(['a', 'b', 'c', 'a'], 'a')).toEqual(['b', 'c'])
  })
})

describe('union', () => {
  it('merges two arrays deduped', () => {
    expect(union([1, 2, 3], [2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
  })

  it('handles empty first array', () => {
    expect(union([], [1, 2, 3])).toEqual([1, 2, 3])
  })

  it('handles empty second array', () => {
    expect(union([1, 2, 3], [])).toEqual([1, 2, 3])
  })

  it('handles both empty', () => {
    expect(union([], [])).toEqual([])
  })

  it('no duplicates in either array', () => {
    expect(union([1, 2], [3, 4])).toEqual([1, 2, 3, 4])
  })

  it('works with key function for objects', () => {
    const a = [{ id: 1, name: 'Zura' }]
    const b = [{ id: 1, name: 'Other' }, { id: 2, name: 'Alice' }]
    const result = union(a, b, x => x.id)
    expect(result).toHaveLength(2)
    expect(result[0]?.name).toBe('Zura')
  })

  it('preserves order — a items first', () => {
    expect(union([3, 1], [2, 4])).toEqual([3, 1, 2, 4])
  })
})
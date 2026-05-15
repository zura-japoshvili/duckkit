import { describe, it, expect } from 'vitest'
import { groupBy, flatGroupBy, chunk, unique, topBy, zip } from '../src/array/index'
import { sortBy, minBy, maxBy, partition } from '../src/array/index'


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

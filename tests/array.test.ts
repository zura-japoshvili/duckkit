import { describe, it, expect } from 'vitest'
import { groupBy, flatGroupBy, chunk, unique, topBy, zip } from '../src/array/index'

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

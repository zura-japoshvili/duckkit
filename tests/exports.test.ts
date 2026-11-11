import { describe, it, expect } from 'vitest'
import * as root from '../src/index'
import * as array from '../src/array/index'
import * as async from '../src/async/index'
import * as date from '../src/date/index'
import * as delay from '../src/delay/index'
import * as emitter from '../src/emitter/index'
import * as encode from '../src/encode/index'
import * as fn from '../src/fn/index'
import * as number from '../src/number/index'
import * as object from '../src/object/index'
import * as string from '../src/string/index'
import * as validate from '../src/validate/index'

// 0.1.x shipped without `string` and `validate` in the root export, so
// `import { slugify } from 'duckkit'` failed. This keeps the root complete.
// (scripts/check-package.mjs checks the same thing on the built, packed package.)
const modules = { array, async, date, delay, emitter, encode, fn, number, object, string, validate }

describe('root export', () => {
  for (const [name, mod] of Object.entries(modules)) {
    it(`includes everything from duckkit/${name}`, () => {
      const missing = Object.keys(mod).filter(key => !(key in root))
      expect(missing).toEqual([])
    })
  }

  it('uses the validate isEmpty, which also handles arrays and objects', () => {
    expect(root.isEmpty).toBe(validate.isEmpty)
    expect(root.isEmpty([])).toBe(true)
    expect(root.isEmpty('  ')).toBe(true)
  })
})

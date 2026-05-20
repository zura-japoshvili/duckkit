import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'object/index': 'src/object/index.ts',
    'array/index': 'src/array/index.ts',
    'date/index': 'src/date/index.ts',
    'async/index': 'src/async/index.ts',
    'string/index': 'src/string/index.ts',
    'number/index': 'src/number/index.ts',
    'delay/index': 'src/delay/index.ts',
    'fn/index': 'src/fn/index.ts',
    'emitter/index': 'src/emitter/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  minify: true,
  sourcemap: true,
})

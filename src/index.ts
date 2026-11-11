export * from './object/index'
export * from './array/index'
export * from './date/index'
export * from './async/index'
export * from './number/index'
export * from './string/index'
export * from './delay/index'
export * from './emitter/index'
export * from './fn/index'
export * from './encode/index'
export * from './validate/index'

// `string` and `validate` both export `isEmpty`. The validate one gives the same
// answer for strings and also handles arrays and objects, so the root uses it.
// `duckkit/string` still exports the string-only version.
export { isEmpty } from './validate/index'

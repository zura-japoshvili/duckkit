# Contributing to duckkit

## Reporting bugs
Use the bug report issue template. Include the function name, a code snippet to reproduce, and your TypeScript version.

## Suggesting features
Use the feature request template. New functions should be zero-dependency, TypeScript-first, and solve something developers write from scratch repeatedly.

## Pull requests
1. Fork the repo
2. Create a branch: `git checkout -b feat/my-function`
3. Write the function in `src/<category>/`
4. Add JSDoc with `@example`
5. Add tests in `tests/<category>.test.ts`
6. Make sure `npm test` and `npm run lint` pass
7. Open a PR

## Guidelines
- Zero dependencies
- Every function needs JSDoc and at least 5 tests
- No mutation of input arguments
- TypeScript strict mode — no `any`
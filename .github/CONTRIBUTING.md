# Contributing to duckkit

## Reporting bugs
Use the bug report issue template. Include the function name, a code snippet to reproduce, and your TypeScript version.

## Suggesting features
Use the feature request template. New functions should be zero-dependency, TypeScript-first, and solve something developers write from scratch repeatedly.

## Pull requests
1. Fork the repo
2. Create a branch: `git checkout -b feat/my-function`
3. Write the function in `src/<category>/` and export it from `src/<category>/index.ts`
4. Add JSDoc with `@example`
5. Add tests in `tests/<category>.test.ts` — including edge cases (empty input, `NaN`, Unicode, time zones)
6. Document it in `docs/<category>.md` and add it to the table in `README.md`
7. Make sure the checks pass (see below)
8. Open a PR

## Checks

| Command | What it checks |
|---------|----------------|
| `npm run lint` | types in `src/` and in the tests |
| `npm test` | all unit tests |
| `npm run test:timezones` | date tests in time zones with daylight-saving gaps (run it when you touch dates) |
| `npm run build && npm run check:package` | the packed package: every entry point loads with `import` and `require`, the root exports everything, every function in the README table exists, plus [publint](https://publint.dev) and [Are the Types Wrong](https://arethetypeswrong.github.io) |

CI runs all of them on Node.js 20, 22 and 24.

## Guidelines
- Zero dependencies
- Every function needs JSDoc and at least 5 tests
- No mutation of input arguments
- TypeScript strict mode — no `any`
- Fix edge cases instead of documenting them; document what is a deliberate design choice
- Error messages start with the function name: `roundTo: decimals must be an integer`
---
name: Bug report
about: Something isn't working correctly
title: 'bug: '
labels: bug
assignees: ''
---

**Function affected**
Which function is broken? e.g. `groupBy`, `safe`, `deepMerge`

**Describe the bug**
What happened vs what you expected.

**Code to reproduce**
```typescript
// minimal example that shows the bug
import { groupBy } from 'duckkit'

const result = groupBy(...)
// expected: ...
// got: ...
```

**Environment**
- duckkit version:
- TypeScript version:
- Node.js version:
- Runtime: Browser / Node.js / Bun / Deno
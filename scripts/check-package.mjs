#!/usr/bin/env node
/**
 * Checks the package the way users get it: packs it like `npm publish` would,
 * installs the tarball into a throwaway project, and loads every entry point
 * with both `import` and `require`.
 *
 * Fails when:
 * - a folder in src/ has no entry in package.json "exports"
 * - an entry point fails to load, or `import` and `require` give different names
 * - the root export is missing something a sub-path exports
 * - a function in the README "Available Utilities" table is not exported
 *
 * Unit tests import from src/, so they cannot catch any of this.
 * Run after `npm run build`.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = fileURLToPath(new URL('..', import.meta.url))
const pkg = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8'))
const failures = []

if (!existsSync(join(repo, 'dist', 'index.js'))) {
  console.error('dist/ is missing — run `npm run build` first.')
  process.exit(1)
}

const subpaths = Object.keys(pkg.exports).filter(p => p !== './package.json')
const specifiers = subpaths.map(p => (p === '.' ? pkg.name : `${pkg.name}/${p.slice(2)}`))

// 1. Every src/<module>/index.ts is published
for (const dir of readdirSync(join(repo, 'src'), { withFileTypes: true })) {
  if (!dir.isDirectory() || dir.name.startsWith('_')) continue
  if (!existsSync(join(repo, 'src', dir.name, 'index.ts'))) continue
  if (!subpaths.includes(`./${dir.name}`)) {
    failures.push(`src/${dir.name} has no "./${dir.name}" entry in package.json "exports"`)
  }
}

const work = mkdtempSync(join(tmpdir(), 'duckkit-package-check-'))
let rootNames = new Set()
let documented = new Set()
try {
  // 2. Pack and install, like a user would
  const packed = JSON.parse(
    execFileSync('npm', ['pack', '--json', '--pack-destination', work], { cwd: repo, encoding: 'utf8' })
  )
  writeFileSync(join(work, 'package.json'), JSON.stringify({ name: 'duckkit-package-check', private: true }))
  execFileSync('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts', join(work, packed[0].filename)], {
    cwd: work,
    stdio: 'ignore',
  })

  // 3. Load every entry point with import and with require
  const loader = load => `
const out = {}
for (const s of ${JSON.stringify(specifiers)}) {
  try { out[s] = Object.keys(${load}).sort() } catch (e) { out[s] = 'ERROR: ' + e.message }
}
console.log(JSON.stringify(out))
`
  writeFileSync(join(work, 'load.mjs'), loader('await import(s)'))
  writeFileSync(join(work, 'load.cjs'), loader('require(s)'))
  const run = file => JSON.parse(execFileSync(process.execPath, [file], { cwd: work, encoding: 'utf8' }))
  const esm = run('load.mjs')
  const cjs = run('load.cjs')

  for (const s of specifiers) {
    for (const [how, result] of [['import', esm[s]], ['require', cjs[s]]]) {
      if (typeof result === 'string') failures.push(`${how} '${s}' failed: ${result}`)
      else if (result.length === 0) failures.push(`${how} '${s}' has no exports`)
    }
    if (Array.isArray(esm[s]) && Array.isArray(cjs[s]) && esm[s].join() !== cjs[s].join()) {
      failures.push(`'${s}' exports different names via import and require`)
    }
  }

  // 4. The root export includes every sub-path export
  rootNames = new Set(Array.isArray(esm[pkg.name]) ? esm[pkg.name] : [])
  for (const s of specifiers.slice(1)) {
    if (!Array.isArray(esm[s])) continue
    const missing = esm[s].filter(name => !rootNames.has(name))
    if (missing.length) failures.push(`'${pkg.name}' is missing exports of '${s}': ${missing.join(', ')}`)
  }

  // 5. Every function in the README "Available Utilities" table is exported.
  // Text after " — " in a cell describes methods (e.g. the emitter's on/off), not exports.
  const readme = readFileSync(join(repo, 'README.md'), 'utf8')
  const table = readme.split('## Available Utilities')[1]?.split('\n---')[0] ?? ''
  for (const line of table.split('\n').filter(l => l.startsWith('| **'))) {
    const cell = (line.split('|')[2] ?? '').split(' — ')[0]
    for (const [, name] of cell.matchAll(/`(\w+)\(\)`/g)) documented.add(name)
  }
  if (documented.size === 0) failures.push('could not find the README "Available Utilities" table')
  const notExported = [...documented].filter(name => !rootNames.has(name))
  if (notExported.length) {
    failures.push(`README lists functions that '${pkg.name}' does not export: ${notExported.join(', ')}`)
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}

if (failures.length) {
  console.error(`Package check failed:\n${failures.map(f => `  ✗ ${f}`).join('\n')}`)
  process.exit(1)
}
console.log(
  `Package check passed: ${specifiers.length} entry points load with import and require, ` +
    `the root exports ${rootNames.size} names, and all ${documented.size} README functions are exported.`
)

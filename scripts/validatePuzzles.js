import { PUZZLES } from '../client/src/training/patterns/puzzles/index.js';
import { BASE_PUZZLES } from '../client/src/training/patterns/puzzles/base.js';
import { PATTERNS } from '../client/src/training/patterns/patterns.js';
import { checkPuzzle } from './patterns/checkPuzzle.js';

/*
 * Checks every trainer puzzle with the engine (see patterns/checkPuzzle.js).
 * Usage: node scripts/validatePuzzles.js [--base]  (--base skips the generated variants)
 */
const list = process.argv.includes('--base') ? BASE_PUZZLES : PUZZLES;
const baseIds = new Set(BASE_PUZZLES.map((p) => p.id));
let errors = 0;
const ids = new Set();

for (const p of list) {
  const problems = [];
  if (ids.has(p.id)) problems.push('duplicate id');
  ids.add(p.id);
  if (!PATTERNS[p.pattern]) problems.push(`unknown pattern ${p.pattern}`);
  if (p.base && !baseIds.has(p.base)) problems.push(`variant of unknown puzzle ${p.base}`);
  const { errors: e, notes } = checkPuzzle(p);
  problems.push(...e);
  for (const msg of problems) console.log(`  ✗ [${p.id}] ${msg}`);
  errors += problems.length;
  console.log(`${p.id} (${p.pattern}, ${p.rating}): ${notes.join(' | ')}`);
}

console.log(errors ? `\n${errors} problem(s) found` : `\nAll ${list.length} puzzles valid`);
process.exit(errors ? 1 : 0);

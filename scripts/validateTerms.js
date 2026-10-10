import { Chess } from 'chess.js';
import { TERMS, CATEGORY, LEVEL } from '../client/src/training/terms/index.js';
import { groupTerms } from '../client/src/training/terms/filterTerms.js';
import { LESSONS } from '../client/src/training/lessons/index.js';

/*
 * Verifies the chess terms page: every term has a definition, a known category and level,
 * a unique id, a real lesson link, and a legal move line (checkmate lines must end in mate).
 */
const lessonIds = new Set(LESSONS.map((l) => l.id));
const seen = new Set();
let errors = 0;
const fail = (term, msg) => { errors++; console.log(`  x [${term.name}] ${msg}`); };

for (const term of TERMS) {
  if (seen.has(term.id)) fail(term, `duplicate id ${term.id}`);
  seen.add(term.id);
  if (!term.def) fail(term, 'no definition (and no matching glossary word)');
  if (!CATEGORY[term.category]) fail(term, `unknown category ${term.category}`);
  if (!LEVEL[term.level]) fail(term, `unknown level ${term.level}`);
  if (term.lesson && !lessonIds.has(term.lesson)) fail(term, `unknown lesson ${term.lesson}`);
  if (term.moves) {
    const game = new Chess();
    const sans = term.moves.replace(/\d+\.(\.\.)?/g, ' ').trim().split(/\s+/);
    try {
      for (const san of sans) game.move(san);
      if (term.category === 'checkmates' && !game.isCheckmate()) fail(term, 'line does not end in checkmate');
    } catch {
      fail(term, `illegal line ${term.moves}`);
    }
  }
}

const all = groupTerms(TERMS, { sort: 'az' }).reduce((n, s) => n + s.terms.length, 0);
if (all !== TERMS.length) { errors++; console.log(`  x grouping lost terms: ${all} of ${TERMS.length}`); }

console.log(errors ? `${errors} problem(s) in chess terms` : `All ${TERMS.length} chess terms valid`);
process.exit(errors ? 1 : 0);

import { Chess } from 'chess.js';
import easy from '../../client/src/training/woodpecker/data/easy.js';
import intermediate from '../../client/src/training/woodpecker/data/intermediate.js';
import advanced from '../../client/src/training/woodpecker/data/advanced.js';
import counts from '../../client/src/training/woodpecker/data/counts.js';

/* Fast structural check of the generated Woodpecker sets (no engine): legal lines, goals, counts. */
const SETS = { easy, intermediate, advanced };
const GOALS = new Set(['mate', 'best']);
const FIRST = new Set(['check', 'capture', 'quiet']);
let errors = 0;
const seen = new Set();
const fail = (set, p, msg) => { errors++; console.log(`  ✗ [${set} #${p.n}] ${msg}`); };

for (const [id, list] of Object.entries(SETS)) {
  if (counts[id] !== list.length) { errors++; console.log(`  ✗ counts.js says ${counts[id]} for ${id}, file has ${list.length}`); }
  for (const p of list) {
    if (seen.has(p.n)) fail(id, p, 'duplicate exercise number');
    seen.add(p.n);
    if (!GOALS.has(p.goal)) fail(id, p, `unknown goal ${p.goal}`);
    if (!FIRST.has(p.first)) fail(id, p, `unknown first-move kind ${p.first}`);
    if (!p.moves.length || p.moves.length % 2 === 0) fail(id, p, 'line must end on a solver move');
    let c;
    try { c = new Chess(p.fen); } catch (e) { fail(id, p, `bad fen: ${e.message}`); continue; }
    for (const uci of p.moves) {
      try { c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }); } catch { fail(id, p, `illegal move ${uci}`); break; }
    }
    if (p.goal === 'mate' && !c.isCheckmate()) fail(id, p, 'mate goal but the line does not mate');
  }
  console.log(`${id}: ${list.length} exercises`);
}
console.log(errors ? `\n${errors} problem(s) found` : '\nAll Woodpecker exercises valid');
process.exit(errors ? 1 : 0);

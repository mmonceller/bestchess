import { Chess } from 'chess.js';
import { PUZZLES } from '../client/src/training/patterns/puzzles.js';
import { PATTERNS } from '../client/src/training/patterns/patterns.js';
import { Position } from '../client/src/engine/core/position.js';
import { Searcher } from '../client/src/engine/core/search.js';
import { MATE_BOUND } from '../client/src/engine/core/constants.js';

/*
 * Checks every puzzle: legal moves, the student's moves are the engine's choice
 * (or within a few centipawns), mates really mate, and other puzzles win material.
 */
const MATE_PATTERNS = new Set(['mate1', 'mate2', 'backRank']);
const searcher = new Searcher();
let errors = 0;
const fail = (p, msg) => { errors++; console.log(`  ✗ [${p.id}] ${msg}`); };
const toMove = (uci) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
const ids = new Set();

for (const p of PUZZLES) {
  if (ids.has(p.id)) fail(p, 'duplicate id');
  ids.add(p.id);
  if (!PATTERNS[p.pattern]) fail(p, `unknown pattern ${p.pattern}`);
  let c;
  try { c = new Chess(p.fen); } catch (e) { fail(p, `bad fen: ${e.message}`); continue; }

  const notes = [];
  for (let k = 0; k < p.moves.length; k++) {
    const uci = p.moves[k];
    if (k % 2 === 0) {
      const pos = new Position(c.fen());
      const res = searcher.search(pos, { timeMs: 1500, maxDepth: 8, multi: true });
      const scores = res.rootScores.map((r) => ({ uci: pos.moveToUci(r.move), score: r.score }));
      const mine = scores.find((s) => s.uci === uci);
      if (!mine) { fail(p, `illegal student move ${uci}`); break; }
      const best = scores[0];
      const loss = best.score > MATE_BOUND && mine.score > MATE_BOUND ? 0 : best.score - mine.score;
      const second = scores.find((s) => s.uci !== uci);
      notes.push(`${uci} score=${mine.score} loss=${loss} next=${second ? `${second.uci}:${second.score}` : '-'}`);
      if (loss > 30) fail(p, `${uci} loses ${loss} vs engine ${best.uci}`);
      if (k === 0 && !MATE_PATTERNS.has(p.pattern) && mine.score < 150) fail(p, `first move only scores ${mine.score}`);
    }
    try { c.move(toMove(uci)); } catch { fail(p, `illegal move ${uci}`); break; }
  }
  if (MATE_PATTERNS.has(p.pattern) && !c.isCheckmate()) fail(p, 'line does not end in checkmate');
  console.log(`${p.id} (${p.pattern}, ${p.rating}): ${notes.join(' | ')}`);
}

console.log(errors ? `\n${errors} problem(s) found` : `\nAll ${PUZZLES.length} puzzles valid`);
process.exit(errors ? 1 : 0);

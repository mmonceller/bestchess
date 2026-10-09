import { Chess } from 'chess.js';
import { Position } from '../../client/src/engine/core/position.js';
import { Searcher } from '../../client/src/engine/core/search.js';
import { MATE_BOUND } from '../../client/src/engine/core/constants.js';

/*
 * Checks one trainer puzzle: legal moves, the student's moves are the engine's choice
 * (or within a few centipawns), mates really mate, and other puzzles win material.
 * Returns { errors, notes }.
 */
export const MATE_PATTERNS = new Set(['mate1', 'mate2', 'backRank']);
const MAX_LOSS = 30;
const MIN_GAIN = 150;
const toMove = (uci) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
const searcher = new Searcher();

export function checkPuzzle(p, { timeMs = 1500 } = {}) {
  const errors = [];
  const notes = [];
  let c;
  try { c = new Chess(p.fen); } catch (e) { return { errors: [`bad fen: ${e.message}`], notes }; }
  for (let k = 0; k < p.moves.length; k++) {
    const uci = p.moves[k];
    if (k % 2 === 0) {
      const pos = new Position(c.fen());
      const res = searcher.search(pos, { timeMs, maxDepth: 8, multi: true });
      const scores = res.rootScores.map((r) => ({ uci: pos.moveToUci(r.move), score: r.score }));
      const mine = scores.find((s) => s.uci === uci);
      if (!mine) { errors.push(`illegal student move ${uci}`); break; }
      const best = scores[0];
      const loss = best.score > MATE_BOUND && mine.score > MATE_BOUND ? 0 : best.score - mine.score;
      const second = scores.find((s) => s.uci !== uci);
      notes.push(`${uci} score=${mine.score} loss=${loss} next=${second ? `${second.uci}:${second.score}` : '-'}`);
      if (loss > MAX_LOSS) errors.push(`${uci} loses ${loss} vs engine ${best.uci}`);
      if (k === 0 && !MATE_PATTERNS.has(p.pattern) && mine.score < MIN_GAIN) errors.push(`first move only scores ${mine.score}`);
    }
    try { c.move(toMove(uci)); } catch { errors.push(`illegal move ${uci}`); break; }
  }
  if (!errors.length && MATE_PATTERNS.has(p.pattern) && !c.isCheckmate()) errors.push('line does not end in checkmate');
  return { errors, notes };
}

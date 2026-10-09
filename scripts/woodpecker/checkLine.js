import { Chess } from 'chess.js';
import { Position } from '../../client/src/engine/core/position.js';
import { Searcher } from '../../client/src/engine/core/search.js';
import { MATE_BOUND } from '../../client/src/engine/core/constants.js';

/*
 * Trims the book line to the part we trust. The key move is the book's own (our engine is
 * often too shallow to see deep sacrifices); after it, the engine checks that:
 *  - each later solver move is its choice or close to it (STUDENT_SLACK),
 *  - each reply is a reasonable defence (REPLY_SLACK),
 * which catches places where the parsed text drifted into a side line.
 * The line always ends on a solver move. Goal: 'mate' when it ends in mate, otherwise 'best'.
 */
const STUDENT_SLACK = 60;
const REPLY_SLACK = 250;
const MAX_PLIES = 11;

const searcher = new Searcher();
const toMove = (uci) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });

function lossOf(fen, uci, timeMs) {
  const pos = new Position(fen);
  const res = searcher.search(pos, { timeMs, maxDepth: 10, multi: true });
  const scores = res.rootScores.map((r) => ({ uci: pos.moveToUci(r.move), score: r.score }));
  const mine = scores.find((s) => s.uci === uci);
  if (!mine) return Infinity;
  const best = scores[0].score;
  if (best > MATE_BOUND && mine.score > MATE_BOUND) return 0;
  if (best < -MATE_BOUND && mine.score < -MATE_BOUND) return 0;
  return best - mine.score;
}

export function checkLine(fen, bookMoves, { timeMs = 1200 } = {}) {
  const c = new Chess(fen);
  const kept = [];
  for (let k = 0; k < Math.min(bookMoves.length, MAX_PLIES); k++) {
    const uci = bookMoves[k];
    if (k > 0) {
      const slack = k % 2 === 0 ? STUDENT_SLACK : REPLY_SLACK;
      if (lossOf(c.fen(), uci, timeMs) > slack) break;
    }
    c.move(toMove(uci));
    kept.push(uci);
    if (c.isGameOver()) break;
  }
  if (kept.length % 2 === 0) kept.pop();
  if (!kept.length) return { ok: false, reason: 'line rejected' };

  const end = new Chess(fen);
  for (const uci of kept) end.move(toMove(uci));
  return { ok: true, moves: kept, goal: end.isCheckmate() ? 'mate' : 'best' };
}

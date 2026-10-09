import { Chess } from 'chess.js';
import { kingSquare } from '../../board/pieces.js';
import { START_FEN } from '../../../chess/notation/line.js';

/*
 * Every position of a game given as SAN moves: fens[0] is the start, fens[i + 1] follows
 * move i. moves[i] is { from, to } and checks[i + 1] the king in check after it, if any.
 */
export function replayPositions(sans, startFen = START_FEN) {
  const c = new Chess(startFen);
  const fens = [c.fen()];
  const moves = [];
  const checks = [null];
  for (const san of sans) {
    let m;
    try { m = c.move(san); } catch { break; }
    const fen = c.fen();
    fens.push(fen);
    moves.push({ from: m.from, to: m.to });
    checks.push(c.inCheck() ? kingSquare(fen, c.turn()) : null);
  }
  return { fens, moves, checks };
}

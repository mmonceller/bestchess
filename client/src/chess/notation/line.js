import { Chess } from 'chess.js';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const UCI = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

/*
 * Replays SAN or UCI moves from `fen` so every move knows its side, number and what it captured.
 * Returns [{ san, color, number, ctx }]; after an illegal move the rest come back without context.
 */
export function replayLine(fen = START_FEN, moves = []) {
  let c = null;
  try { c = new Chess(fen); } catch { /* unknown start: no context */ }
  return moves.map((raw) => {
    const mv = String(raw);
    const annotation = /[!?]{1,2}$/.exec(mv)?.[0] || '';
    if (c) {
      const color = c.turn();
      const number = c.moveNumber();
      let res = null;
      try {
        res = UCI.test(mv) ? c.move({ from: mv.slice(0, 2), to: mv.slice(2, 4), promotion: mv[4] }) : c.move(mv.slice(0, mv.length - annotation.length));
      } catch { c = null; }
      if (res) {
        return { san: res.san + annotation, color, number, ctx: { color, from: res.from, captured: res.captured, enPassant: res.flags.includes('e') } };
      }
    }
    return { san: mv, color: null, number: null, ctx: {} };
  });
}

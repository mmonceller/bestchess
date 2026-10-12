import { Chess } from 'chess.js';

export const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
export const PIECE = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

export const toMove = (uci) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });

export function playBook(puzzle) {
  const chess = new Chess(puzzle.fen);
  let last = null;
  for (const uci of puzzle.moves || []) {
    try { last = chess.move(toMove(uci)); } catch { break; }
  }
  return { chess, last, mate: chess.isCheckmate() };
}

/* Knight-for-pawn and similar: we gave at least a minor piece more than we took. */
export function sacrificed(puzzle) {
  if ((puzzle.motifs || []).includes('sacrifice')) return true;
  const chess = new Chess(puzzle.fen);
  const us = chess.turn();
  const moves = puzzle.moves || [];
  for (let i = 0; i < moves.length; i++) {
    let mv;
    try { mv = chess.move(toMove(moves[i])); } catch { break; }
    if (mv.color !== us || !mv.captured) continue;
    if ((VALUE[mv.piece] || 0) - (VALUE[mv.captured] || 0) < 2) continue;
    if (moves[i + 1] && moves[i + 1].slice(2, 4) === mv.to) return true;
    if (chess.moves({ verbose: true }).some((m) => m.to === mv.to && m.captured)) return true;
  }
  return false;
}

export function recaptureOf(chess, last) {
  if (!last?.captured) return null;
  const hits = chess.moves({ verbose: true }).filter((m) => m.to === last.to && m.captured);
  if (!hits.length) return null;
  hits.sort((a, b) => (a.piece === 'p' ? 0 : 1) - (b.piece === 'p' ? 0 : 1));
  return hits[0];
}

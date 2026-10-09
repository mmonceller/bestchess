import { Chess } from 'chess.js';

/* Sets as the book groups them, by exercise number. */
export const SETS = [
  { id: 'easy', last: 222, rating: 1200 },
  { id: 'intermediate', last: 984, rating: 1600 },
  { id: 'advanced', last: 1128, rating: 2000 },
];

export const setFor = (number) => SETS.find((s) => number <= s.last);

/* Our own short hint: what kind of first move it is. */
function firstMoveKind(fen, uci) {
  const c = new Chess(fen);
  const mv = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
  if (mv.san.includes('+') || mv.san.includes('#')) return 'check';
  if (mv.captured) return 'capture';
  return 'quiet';
}

export function describe(number, fen, check, game) {
  const set = setFor(number);
  const studentMoves = Math.ceil(check.moves.length / 2);
  return {
    n: number,
    fen,
    moves: check.moves,
    goal: check.goal,
    first: firstMoveKind(fen, check.moves[0]),
    rating: set.rating + (studentMoves - 1) * 60,
    game: game || null,
  };
}

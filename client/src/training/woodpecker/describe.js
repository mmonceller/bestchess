/* Player-facing wording for a Woodpecker puzzle (our own words, generated from the moves). */
const FIRST_MOVE = {
  check: 'The first move gives check.',
  capture: 'The first move is a capture.',
  quiet: 'The first move is a quiet move — no check, no capture.',
};

export const sideName = (fen) => (fen.split(' ')[1] === 'w' ? 'White' : 'Black');

export function goalText(puzzle) {
  const side = sideName(puzzle.fen);
  if (puzzle.goal === 'mate') return `${side} to play and mate.`;
  return puzzle.moves.length > 1 ? `${side} to play — find the strongest line.` : `${side} to play — find the strongest move.`;
}

export const firstMoveHint = (puzzle) => FIRST_MOVE[puzzle.first] || FIRST_MOVE.quiet;

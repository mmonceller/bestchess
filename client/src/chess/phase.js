/*
 * Rough game stage for each position: 'opening', 'middlegame' or 'endgame', in the spirit of
 * the usual "divider" rules: the opening ends once pieces have been traded or have left the
 * back rank, the endgame starts when six or fewer pieces (not kings or pawns) remain.
 * Stages only move forward, so a game never "returns" to the opening.
 */
export const PHASES = ['opening', 'middlegame', 'endgame'];
export const PHASE_NAMES = { opening: 'Opening', middlegame: 'Middlegame', endgame: 'Endgame' };
export const PHASE_SHORT = { opening: 'Open', middlegame: 'Middle', endgame: 'End' };

const ENDGAME_PIECES = 6;
const MIDDLEGAME_PIECES = 10;
const DEVELOPED_FROM_PLY = 14;
const LONG_OPENING_PLIES = 30;

function stats(fen) {
  const board = fen.split(' ')[0];
  const pieces = (board.match(/[nbrqNBRQ]/g) || []).length;
  const rows = board.split('/');
  const count = (row, re) => (row.match(re) || []).length;
  const backSparse = count(rows[7] || '', /[NBRQK]/g) < 4 || count(rows[0] || '', /[nbrqk]/g) < 4;
  const developed = count(rows[7] || '', /[NB]/g) <= 1 && count(rows[0] || '', /[nb]/g) <= 1;
  return { pieces, backSparse, developed };
}

function phaseOf(fen, ply) {
  const { pieces, backSparse, developed } = stats(fen);
  if (pieces <= ENDGAME_PIECES) return 'endgame';
  if (pieces <= MIDDLEGAME_PIECES || backSparse || ply >= LONG_OPENING_PLIES) return 'middlegame';
  if (developed && ply >= DEVELOPED_FROM_PLY) return 'middlegame';
  return 'opening';
}

/* `fens[i]` is the position after ply i; returns the stage after each ply. */
export function gamePhases(fens) {
  let reached = 0;
  return fens.map((fen, ply) => {
    reached = Math.max(reached, PHASES.indexOf(phaseOf(fen, ply)));
    return PHASES[reached];
  });
}

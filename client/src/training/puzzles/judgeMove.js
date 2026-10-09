import { MATE_BOUND } from '../../engine/core/constants.js';

/*
 * Decides whether a move that isn't the puzzle's main answer still solves it.
 * `grade` comes from engine.grade(); scores are centipawns for the side to move.
 * A move counts if it is about as good as the engine's best, or if it also wins clearly:
 * a decisive advantage that keeps most of what the best move gets. Mate puzzles need a mate.
 */
const CLOSE_LOSS = 40;
const DECISIVE = 250;
const KEEPS_SHARE = 0.6;
const CRUSHING = 800;

export function solvesPuzzle(grade, { mate = false } = {}) {
  if (!grade?.legal) return false;
  if (grade.loss <= CLOSE_LOSS) return true;
  if (grade.moveScore > MATE_BOUND) return true;
  if (mate) return false;
  if (grade.bestScore > MATE_BOUND) return grade.moveScore >= CRUSHING;
  return grade.moveScore >= DECISIVE && grade.moveScore >= grade.bestScore * KEEPS_SHARE;
}

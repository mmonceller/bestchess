import { MATE_BOUND } from '../../../engine/core/constants.js';

/* Where the player stands after the refutation. `score` is centipawns for the opponent (side to move). */
export function outcomeSentence(score) {
  if (score > MATE_BOUND) return 'From there they have a forced mate.';
  if (score < -MATE_BOUND) return '';
  const mine = -score;
  if (mine >= 150) return 'You would still be better, but far less than with the key move.';
  if (mine > 50) return 'You would keep only a small edge.';
  if (mine >= -50) return 'The position ends up about equal.';
  const pawns = Math.round(-mine / 100);
  return pawns <= 1 ? 'You would end up about a pawn down.' : `You would end up about ${pawns} pawns down.`;
}

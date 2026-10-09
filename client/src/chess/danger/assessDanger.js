/*
 * Warnings for a player in trouble, in plain words. Scores are from the player's side:
 * `cp` in centipawns, `mate` in moves (negative = the opponent is mating).
 * Levels, worst first: 'mated' (forced checkmate against you), 'threat' (mate next move
 * unless you stop it), 'losing' (the meter is near the bottom).
 */
export const LOSING_CP = -400;

export function assessDanger({ cp = null, mate = null, threat = false } = {}) {
  if (mate != null && mate < 0) {
    const n = -mate;
    return {
      level: 'mated',
      title: 'Checkmate is coming',
      text: n === 1
        ? 'Your opponent can checkmate you on their next move, whatever you play. Look for a check of your own or a stalemate trick.'
        : `Your opponent has a forced checkmate in ${n} moves. Even perfect defence can't stop it, so make it as hard as you can and hope for a slip.`,
    };
  }
  if (threat) {
    return {
      level: 'threat',
      title: 'Checkmate threat',
      text: 'Your opponent is threatening checkmate on their next move. Stop that first: guard the square, block the line, or give your king room.',
    };
  }
  if (cp != null && cp <= LOSING_CP) {
    return {
      level: 'losing',
      title: "You're almost lost",
      text: 'Your opponent is far ahead. Keep your pieces safe, look for tricks, and make the game messy — a strong opponent can still slip.',
    };
  }
  return null;
}

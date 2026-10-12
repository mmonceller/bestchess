/*
 * Multi-step Woodpecker lines: a wrong move in the first few of the player's
 * turns is taken back instead of failing the exercise. The clock still runs.
 */
export const GRACE_PLAYER_MOVES = 3;

export const playerMoveCount = (moves) => Math.ceil((moves?.length || 0) / 2);

export const isMultiStep = (puzzle) => playerMoveCount(puzzle?.moves) >= 2;

export const inGraceWindow = (puzzle, ply) => isMultiStep(puzzle) && ply < GRACE_PLAYER_MOVES * 2;

export function graceNote(san, ply) {
  const slip = ply === 0
    ? `[[${san}]] isn't the idea.`
    : `[[${san}]] isn't the idea — the advantage slips.`;
  return `${slip} Take it back — try again, or show the solution.`;
}

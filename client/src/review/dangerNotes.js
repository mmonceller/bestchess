import { LOSING_CP } from '../chess/danger/assessDanger.js';

/*
 * Review comments for the moments a game turned dangerous for the player, kept short so a
 * long lost game doesn't repeat itself: "almost lost" and "forced mate" are noted when they
 * start, a mate threat whenever it appears.
 * `r` is the engine review of the move (mover's side), `threat` whether the opponent
 * threatened mate before it, `prev` the danger state after the player's previous move.
 */
export function dangerState(r) {
  if (r.playedMate != null && r.playedMate < 0) return 'mated';
  if (r.playedCp <= LOSING_CP) return 'losing';
  return null;
}

export function dangerNote(r, { threat, prev }) {
  const state = dangerState(r);
  if (state === 'mated' && prev !== 'mated') {
    const n = -r.playedMate;
    const saved = !(r.bestMate != null && r.bestMate < 0);
    return {
      level: 'mated',
      text: `Checkmate can't be stopped now: your opponent has a forced mate in ${n}.${saved ? ' Another move here could still have saved your king.' : ' The real trouble started a move or two earlier.'}`,
    };
  }
  if (threat) {
    return state === 'mated'
      ? { level: 'mated', text: 'Your opponent was threatening checkmate, and nothing could stop it any more.' }
      : { level: 'threat', text: 'Your opponent was threatening checkmate on their next move here, and this move dealt with it.' };
  }
  if (state === 'losing' && prev !== 'losing' && prev !== 'mated') {
    return {
      level: 'losing',
      text: "From here you're almost lost — the winning meter is near the bottom. This is the time to set traps and make the game messy.",
    };
  }
  return null;
}

/*
 * The game a player just finished, kept for this browser tab so it can be reviewed
 * even when it was not saved to an account (guests, or a failed save).
 */
const KEY = 'bc.pendingReview';

export function stashGame(game) {
  try { sessionStorage.setItem(KEY, JSON.stringify(game)); } catch { /* storage full or blocked */ }
}

export function readStashedGame() {
  try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; }
}

import { gamesApi } from '../api/endpoints.js';
import { levelFromLabel } from '../engine/levels.js';
import { clearDurableStash, clearStashedGame, stashGame } from './pendingReview.js';

/* The body POST /games accepts for a finished bot game. */
export function finishedRecord(game) {
  return {
    opponent: game.opponent,
    color: game.color,
    result: game.result,
    reason: game.reason,
    pgn: game.pgn,
    moves: game.moves,
    hintPlies: game.hintPlies,
    level: game.level ?? levelFromLabel(game.opponent),
    mode: 'computer',
  };
}

/*
 * Uploads a finished bot game that is only in this browser. A later call uses the
 * id already stored on the stash, so a retry does not create a second copy.
 */
export async function saveFinishedGame(game) {
  if (!game?.pgn || game.mode === 'online') return null;
  if (game.accountId) return game.accountId;
  const saved = await gamesApi.saveComputerGame(finishedRecord(game));
  const id = saved.game?.id || null;
  if (!id) return null;
  stashGame({ ...game, accountId: id });
  clearDurableStash();
  return id;
}

export function forgetFinishedGame() {
  clearStashedGame();
}

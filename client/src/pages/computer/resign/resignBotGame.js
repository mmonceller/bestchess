import { Chess } from 'chess.js';
import { getLevel } from '../../../engine/levels.js';
import { gamesApi } from '../../../api/endpoints.js';
import { clearSavedGame } from '../savedGame.js';
import { clearStashedGame, stashGame } from '../../../review/pendingReview.js';

/* Ends an unfinished bot game from the list: a loss by resignation, saved when logged in. */
export async function resignBotGame(saved, user, refresh) {
  clearSavedGame(saved.id);
  if (!user) return;
  const chess = new Chess();
  try { chess.loadPgn(saved.pgn || ''); } catch { /* keep the empty game */ }
  chess.setHeader('Result', saved.color === 'w' ? '0-1' : '1-0');
  chess.setHeader('Termination', 'Resignation');
  const lvl = getLevel(saved.level);
  const moves = chess.history().length;
  const record = {
    opponent: `${lvl.name} (Lv ${lvl.id})`,
    color: saved.color,
    result: 'loss',
    reason: 'resignation',
    pgn: chess.pgn(),
    moves,
    hintPlies: (saved.hints || []).filter((p) => p < moves),
    level: saved.level,
    mode: 'computer',
  };
  stashGame(record, { durable: true });
  await gamesApi.saveComputerGame(record);
  clearStashedGame();
  await refresh?.();
}

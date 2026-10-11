import { Chess } from 'chess.js';
import { getLevel } from '../../../engine/levels.js';
import { formatHms } from '../../../utils/format.js';

/* An unfinished bot game with no move for this long is counted as the player resigning. */
export const INACTIVE_DAYS = 3;
export const INACTIVE_MS = INACTIVE_DAYS * 24 * 60 * 60_000;

/* Stored as the game's reason (the server keeps up to 40 characters). */
export const INACTIVE_REASON = 'resignation (expired due to inactivity)';

export const isExpired = (saved, now = Date.now()) => Boolean(saved?.movedAt) && now - saved.movedAt > INACTIVE_MS;

function timeLeft(saved, now = Date.now()) {
  const left = Math.max(0, saved.movedAt + INACTIVE_MS - now);
  const hours = Math.ceil(left / 3_600_000);
  const days = Math.ceil(hours / 24);
  if (hours > 24) return `${days} days`;
  if (left >= 3_600_000) return `${hours} hour${hours === 1 ? '' : 's'}`;
  return `${Math.max(1, Math.ceil(left / 60_000))} min`;
}

/* "Expires in 2 days if you don't move." (hours below a day, minutes below an hour). */
export const expiryText = (saved, now) => `Expires in ${timeLeft(saved, now)} if you don't move.`;
export const expiryShort = (saved, now) => `Expires in ${timeLeft(saved, now)}`;
export const expiryLeft = (saved, now = Date.now()) => Math.max(0, (saved.movedAt || 0) + INACTIVE_MS - now);
export const expiryClock = (saved, now) => formatHms(expiryLeft(saved, now));

/* The game record to save for an expired game: a loss by resignation for the player. */
export function expiredRecord(saved) {
  const chess = new Chess();
  try { chess.loadPgn(saved.pgn || ''); } catch { /* keep the empty game */ }
  chess.setHeader('Result', saved.color === 'w' ? '0-1' : '1-0');
  chess.setHeader('Termination', 'Expired due to inactivity');
  const lvl = getLevel(saved.level);
  const moves = chess.history().length;
  return {
    opponent: `${lvl.name} (Lv ${lvl.id})`,
    color: saved.color,
    result: 'loss',
    reason: INACTIVE_REASON,
    pgn: chess.pgn(),
    moves,
    hintPlies: (saved.hints || []).filter((p) => p < moves),
    level: saved.level,
  };
}

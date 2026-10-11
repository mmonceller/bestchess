import { formatDateTime } from '../../utils/format.js';
import { formatDuration } from './inviteExpiry/inviteExpiry.js';

export const timeControl = (g) => (g.minutes ? `${g.minutes} + ${g.increment}` : 'No clock');

export const opponentLabel = (g) => (g.opponent ? `vs ${g.opponent}` : 'Waiting for your friend');

export function sameOpponentGames(games, g) {
  const name = g.opponent || '';
  return games.filter((other) => (other.opponent || '') === name);
}

export const hasSameOpponent = (games, g) => sameOpponentGames(games, g).length > 1;

/* When two games share an opponent, show when each one started so they can be told apart. */
export function startedLabel(g, games = []) {
  if (!g.startedAt) return '';
  const twins = sameOpponentGames(games, g);
  const sameMinute = twins.some((other) => (
    other !== g && other.startedAt && Math.floor(other.startedAt / 60_000) === Math.floor(g.startedAt / 60_000)
  ));
  return formatDateTime(g.startedAt, { seconds: sameMinute });
}

/* Games worth taking the player back to: unfinished ones, or finished ones with a rematch waiting for their answer. */
export const needsPlayer = (g) => g.status === 'waiting' || g.status === 'playing' || g.rematch === 'incoming';

export function statusLabel(g) {
  if (g.rematch === 'incoming') return `${g.opponent || 'Your opponent'} wants a rematch`;
  if (g.status === 'waiting') {
    const left = g.inviteExpiresIn != null ? ` · expires in ${formatDuration(Math.ceil(g.inviteExpiresIn / 60_000))}` : '';
    return `Code ${g.code} · not started${left}`;
  }
  return `${g.yourTurn ? 'Your move' : 'Their move'} · move ${Math.floor(g.moves / 2) + 1}`;
}

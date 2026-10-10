import { formatDuration } from './inviteExpiry/inviteExpiry.js';

export const timeControl = (g) => (g.minutes ? `${g.minutes} + ${g.increment}` : 'No clock');

export const opponentLabel = (g) => (g.opponent ? `vs ${g.opponent}` : 'Waiting for your friend');

export function statusLabel(g) {
  if (g.status === 'waiting') {
    const left = g.inviteExpiresIn != null ? ` · expires in ${formatDuration(Math.ceil(g.inviteExpiresIn / 60_000))}` : '';
    return `Code ${g.code} · not started${left}`;
  }
  return `${g.yourTurn ? 'Your move' : 'Their move'} · move ${Math.floor(g.moves / 2) + 1}`;
}

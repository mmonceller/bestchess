export const timeControl = (g) => (g.minutes ? `${g.minutes} + ${g.increment}` : 'No clock');

export const opponentLabel = (g) => (g.opponent ? `vs ${g.opponent}` : 'Waiting for your friend');

export function statusLabel(g) {
  if (g.status === 'waiting') return `Code ${g.code} · not started`;
  return `${g.yourTurn ? 'Your move' : 'Their move'} · move ${Math.floor(g.moves / 2) + 1}`;
}

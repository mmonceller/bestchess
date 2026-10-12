import { getLevel } from '../engine/levels.js';
import { isExpired, expiryLeft } from '../pages/computer/expiry/inactivity.js';

function clock(ms) {
  const t = Math.max(0, Math.floor(Number(ms) / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

/* Unfinished bot games and online games, in the shape the inbox shows. */
export function pendingItems(saved, online, now = Date.now()) {
  const bots = (saved || []).filter((g) => g?.id && !isExpired(g, now)).map((g) => ({
    id: `bot-${g.id}`,
    at: g.movedAt || null,
    title: `Unfinished game vs ${getLevel(g.level).name}`,
    detail: `Expires in ${clock(expiryLeft(g, now))}`,
    href: `#/computer?resume=${encodeURIComponent(g.id)}`,
  }));
  const friends = (online || [])
    .filter((g) => g.status === 'waiting' || g.status === 'playing')
    .map((g) => {
      const name = g.opponent || 'your friend';
      const detail = g.status === 'waiting' && g.inviteExpiresIn != null
        ? `Expires in ${clock(g.inviteExpiresIn)}`
        : (g.yourTurn ? 'Your move' : 'Their move');
      return {
        id: `online-${g.code}`,
        at: g.lastActivity || g.startedAt || null,
        title: `Unfinished game vs ${name}`,
        detail,
        href: `#/online/${g.code}`,
      };
    });
  return [...bots, ...friends];
}

import { bearerToken } from '../middleware/auth.js';
import { userFromToken } from '../auth/sessions.js';
import { getRoom } from './roomRegistry.js';

/* The seat a request is acting for: the signed-in account, or a guest key this browser remembered. */
export function seatFor(req) {
  const room = getRoom(req.body?.code);
  if (!room) return { room: null, color: null };
  const user = userFromToken(bearerToken(req));
  if (user?.id) {
    const color = ['w', 'b'].find((c) => room.seats[c]?.userId === user.id);
    if (color) return { room, color };
  }
  const saved = Array.isArray(req.body?.saved) ? req.body.saved : [];
  const key = saved.find((s) => String(s?.code || '').toUpperCase() === room.code)?.key;
  const color = key ? ['w', 'b'].find((c) => room.seats[c]?.playerKey === key) : null;
  return { room, color: color || null };
}

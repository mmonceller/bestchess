import { allRooms, getRoom } from './roomRegistry.js';

const MAX_KEYS = 20;

function summary(room, color) {
  const opp = room.seats[color === 'w' ? 'b' : 'w'];
  return {
    code: room.code,
    status: room.status,
    color,
    opponent: opp?.name || null,
    yourTurn: room.status === 'playing' && room.chess.turn() === color,
    moves: room.chess.history().length,
    minutes: room.options.minutes,
    increment: room.options.increment,
    lastActivity: room.lastActivity,
    startedAt: room.startedAt || room.createdAt || room.inviteExpiresAt - room.options.inviteMinutes * 60_000,
    inviteExpiresIn: room.status === 'waiting' ? Math.max(0, room.inviteExpiresAt - Date.now()) : null,
    rematch: room.rematchFor(color),
    resign: room.resignFor(color),
    resignOfferedAt: room.resignOfferedAt,
  };
}

/*
 * Games a player still holds a seat in: found by their account, or by the {code, key} pairs a
 * guest's browser remembered when it was seated. Finished games are included while the room
 * lives, so a rematch request can reach a player who has moved on to another page.
 */
export function activeGamesFor({ userId = null, saved = [] }) {
  const found = new Map();
  const add = (room, color) => {
    try {
      room?.expireInvite();
      if (room && color && room.status !== 'expired' && !found.has(room.code)) found.set(room.code, summary(room, color));
    } catch {
      /* One broken room should not fail the whole inbox request. */
    }
  };
  if (userId) {
    for (const room of allRooms()) {
      const color = ['w', 'b'].find((c) => room.seats[c]?.userId === userId);
      if (color) add(room, color);
    }
  }
  for (const { code, key } of saved.slice(0, MAX_KEYS)) {
    const room = getRoom(code);
    if (!room || !key) continue;
    add(room, ['w', 'b'].find((c) => room.seats[c]?.playerKey === key));
  }
  return [...found.values()].sort((a, b) => b.lastActivity - a.lastActivity);
}

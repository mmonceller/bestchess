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
    inviteExpiresIn: room.status === 'waiting' ? Math.max(0, room.inviteExpiresAt - Date.now()) : null,
  };
}

/*
 * Unfinished games a player still holds a seat in: found by their account, or by the
 * {code, key} pairs a guest's browser remembered when it was seated.
 */
export function activeGamesFor({ userId = null, saved = [] }) {
  const found = new Map();
  const add = (room, color) => {
    room?.expireInvite();
    if (room && color && (room.status === 'waiting' || room.status === 'playing') && !found.has(room.code)) found.set(room.code, summary(room, color));
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

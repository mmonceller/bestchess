import { allRooms } from './roomRegistry.js';

export const MAX_ONLINE_GAMES = 10;

export const isOngoing = (room) => room.status === 'waiting' || room.status === 'playing';

/* How many unfinished online games this player already holds a seat in. */
export function ongoingCount(player) {
  let n = 0;
  for (const room of allRooms()) {
    if (!isOngoing(room)) continue;
    const seated = ['w', 'b'].some((c) => {
      const s = room.seats[c];
      return s && (
        (player.userId && s.userId === player.userId)
        || (player.playerKey && s.playerKey === player.playerKey)
      );
    });
    if (seated) n++;
  }
  return n;
}

export function atOnlineLimit(player) {
  return ongoingCount(player) >= MAX_ONLINE_GAMES;
}

export const tooManyGamesMessage = `You already have ${MAX_ONLINE_GAMES} games going. Finish or resign one first.`;

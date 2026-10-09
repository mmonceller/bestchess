import crypto from 'node:crypto';
import { Room } from './room.js';
import { config } from '../config.js';
import { recordGame, updateRatings } from '../services/gameRecords.js';

/* No 0/O/1/I to keep codes easy to read aloud. */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const rooms = new Map();

function newCode() {
  for (;;) {
    const bytes = crypto.randomBytes(6);
    const code = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
    if (!rooms.has(code)) return code;
  }
}

function persistResult(room) {
  if (room.recorded) return;
  room.recorded = true;
  const { w, b } = room.seats;
  const winner = room.result.winner;
  const score = winner === 'w' ? 1 : winner === 'b' ? 0 : 0.5;
  const ratings = w?.userId && b?.userId ? updateRatings(w.userId, b.userId, score) : { w: null, b: null };
  const pgn = room.chess.pgn();
  const moves = room.chess.history().length;
  for (const c of ['w', 'b']) {
    const seat = room.seats[c];
    if (!seat?.userId) continue;
    const opp = room.seats[c === 'w' ? 'b' : 'w'];
    room.recordIds[c] = recordGame(seat.userId, {
      mode: 'online',
      opponent: opp?.name || 'Opponent',
      color: c,
      result: winner === null ? 'draw' : winner === c ? 'win' : 'loss',
      reason: room.result.reason,
      pgn,
      moves,
      ratingChange: ratings[c],
    })?.id || null;
  }
}

export function createRoom(options) {
  const room = new Room(newCode(), options);
  room.onFinish = persistResult;
  rooms.set(room.code, room);
  return room;
}

export const getRoom = (code) => rooms.get(String(code || '').toUpperCase());

export function allRooms() {
  return rooms.values();
}

export function sweepRooms() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    const empty = ![room.seats.w, room.seats.b].some((s) => s?.sockets.size) && !room.spectators.size;
    if (now - room.lastActivity > config.roomIdleMs || (empty && now - room.lastActivity > 30 * 60_000)) {
      rooms.delete(code);
    }
  }
}

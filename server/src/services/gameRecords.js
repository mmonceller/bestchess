import crypto from 'node:crypto';
import { db, save, findUserById } from '../db/store.js';
import { sanitizeHintPlies } from './skill/hintUsage.js';

const MAX_GAMES_PER_USER = 300;

/* Stores a finished game for one user and updates their win/loss/draw stats. */
export function recordGame(userId, game) {
  const user = findUserById(userId);
  if (!user) return null;
  const color = game.color === 'b' ? 'b' : 'w';
  const moves = Number(game.moves) || 0;
  const record = {
    id: crypto.randomUUID(),
    userId,
    mode: game.mode,
    opponent: String(game.opponent || 'Unknown').slice(0, 40),
    color,
    result: ['win', 'loss', 'draw'].includes(game.result) ? game.result : 'draw',
    reason: String(game.reason || '').slice(0, 40),
    level: game.level ?? null,
    pgn: String(game.pgn || '').slice(0, 20000),
    moves,
    hintPlies: sanitizeHintPlies(game.hintPlies, moves, color),
    ratingChange: game.ratingChange ?? null,
    opponentRating: Number.isFinite(game.opponentRating) ? game.opponentRating : null,
    date: Date.now(),
  };
  db.games.push(record);
  const key = record.result === 'win' ? 'wins' : record.result === 'loss' ? 'losses' : 'draws';
  user.stats[key]++;

  const mine = db.games.filter((g) => g.userId === userId);
  if (mine.length > MAX_GAMES_PER_USER) {
    const drop = new Set(mine.slice(0, mine.length - MAX_GAMES_PER_USER).map((g) => g.id));
    db.games = db.games.filter((g) => !drop.has(g.id));
  }
  save();
  return record;
}

/* Standard Elo update for an online game between two registered players. score: 1 / 0.5 / 0 for white. */
export function updateRatings(whiteId, blackId, score) {
  const w = findUserById(whiteId);
  const b = findUserById(blackId);
  if (!w || !b || w.id === b.id) return { w: null, b: null };
  const K = 24;
  const expected = 1 / (1 + 10 ** ((b.rating - w.rating) / 400));
  const delta = Math.round(K * (score - expected));
  w.rating += delta;
  b.rating -= delta;
  save();
  return { w: delta, b: -delta };
}

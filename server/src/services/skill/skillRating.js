import { db } from '../../db/store.js';
import { opponentRating } from './levelStrength.js';

export const MIN_GAMES = 5;
const RECENT_GAMES = 20;
const SCORE = { win: 1, draw: 0.5, loss: 0 };

/* Lowest rating of each tier, strongest first. */
export const TIERS = [
  { id: 'diamond', min: 1850 },
  { id: 'platinum', min: 1500 },
  { id: 'gold', min: 1150 },
  { id: 'silver', min: 800 },
  { id: 'bronze', min: 0 },
];

const SPREAD = 400;
const NO_WINS_BASE = 600;

/*
 * Average performance over the given games: a win counts as opponent + 400, a draw as the
 * opponent's rating, a loss as opponent - 400. A loss only shows you're weaker than that
 * opponent, so it never counts higher than your average from wins and draws (or 600 if
 * you have none) — losing to the strongest bot can't raise your level.
 */
export function performanceRating(games) {
  const good = games.filter((g) => g.score > 0).map((g) => g.opp + (g.score === 1 ? SPREAD : 0));
  const base = good.length ? good.reduce((a, b) => a + b, 0) / good.length : NO_WINS_BASE;
  const perf = games.map((g) => (g.score > 0 ? g.opp + (g.score === 1 ? SPREAD : 0) : Math.min(g.opp - SPREAD, base)));
  const avg = perf.reduce((a, b) => a + b, 0) / perf.length;
  return Math.max(100, Math.min(2900, Math.round(avg / 10) * 10));
}

export const tierFor = (rating) => TIERS.find((t) => rating >= t.min).id;

/* Skill summary from a player's most recent finished games (computer and online), at least MIN_GAMES. */
export function skillFor(userId) {
  const rated = db.games
    .filter((g) => g.userId === userId)
    .sort((a, b) => b.date - a.date)
    .map((g) => ({ opp: opponentRating(g), score: SCORE[g.result] }))
    .filter((g) => g.opp != null && g.score != null);
  const recent = rated.slice(0, RECENT_GAMES);
  if (recent.length < MIN_GAMES) return { games: recent.length, needed: MIN_GAMES, rating: null, tier: null };
  const rating = performanceRating(recent);
  return { games: recent.length, needed: MIN_GAMES, rating, tier: tierFor(rating) };
}

import { db } from '../../db/store.js';
import { opponentRating } from './levelStrength.js';
import { HINT_LIMIT_PERCENT, tooManyHints } from './hintUsage.js';

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
 * `gameValues` gives each game's value (`capped` when that rule lowered a loss).
 */
export function gameValues(games) {
  const good = games.filter((g) => g.score > 0).map((g) => g.opp + (g.score === 1 ? SPREAD : 0));
  const base = good.length ? good.reduce((a, b) => a + b, 0) / good.length : NO_WINS_BASE;
  return games.map((g) => {
    if (g.score > 0) return { value: g.opp + (g.score === 1 ? SPREAD : 0), capped: false };
    const raw = g.opp - SPREAD;
    return { value: Math.min(raw, base), capped: raw > base };
  });
}

export function performanceRating(games) {
  const values = gameValues(games);
  const avg = values.reduce((a, v) => a + v.value, 0) / values.length;
  return Math.max(100, Math.min(2900, Math.round(avg / 10) * 10));
}

export const tierFor = (rating) => TIERS.find((t) => rating >= t.min).id;

/*
 * A player's finished games that can count toward skill, newest first: `recent` are the ones
 * that do count (at most RECENT_GAMES), `heavy` the recent ones left out for using too many hints.
 * Each entry keeps the stored game record as `game`.
 */
export function ratedGames(userId) {
  const finished = db.games
    .filter((g) => g.userId === userId)
    .sort((a, b) => b.date - a.date)
    .map((g) => ({ game: g, opp: opponentRating(g), score: SCORE[g.result], heavy: tooManyHints(g) }))
    .filter((g) => g.opp != null && g.score != null);
  return {
    recent: finished.filter((g) => !g.heavy).slice(0, RECENT_GAMES),
    heavy: finished.filter((g) => g.heavy),
  };
}

/*
 * Skill summary from a player's most recent finished games (computer and online), at least
 * MIN_GAMES. Games played mostly on hints show the engine's strength, not the player's, so
 * they are left out (`hintHeavy` counts them).
 */
export function skillFor(userId) {
  const { recent, heavy } = ratedGames(userId);
  const base = { games: recent.length, needed: MIN_GAMES, hintLimit: HINT_LIMIT_PERCENT, hintHeavy: heavy.length };
  if (recent.length < MIN_GAMES) return { ...base, rating: null, tier: null };
  const rating = performanceRating(recent);
  return { ...base, rating, tier: tierFor(rating) };
}

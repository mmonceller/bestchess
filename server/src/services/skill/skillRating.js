import { db } from '../../db/store.js';
import { LEVEL_RATING, levelForRating, opponentRating } from './levelStrength.js';
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
/* A win this many bot levels under the player's level does not raise skill. */
const FAR_BELOW = 3;

const rawScore = (g) => g.opp + (g.score === 1 ? SPREAD : g.score > 0 ? 0 : -SPREAD);

function opponentLevel(g) {
  const stored = g.game || g;
  const level = stored.level ?? g.level;
  if ((stored.mode || g.mode) === 'computer' && LEVEL_RATING[level]) return Number(level);
  return Number.isFinite(g.opp) ? levelForRating(g.opp) : null;
}

/*
 * Average performance over the given games: a win counts as opponent + 400, a draw as the
 * opponent's rating, a loss as opponent - 400.
 * A win three or more bot levels below the level shown by your other wins and draws does
 * not raise skill, and it is held up so it does not lower it either.
 * A closer win counts as opponent + 400, so it can raise or lower the average.
 * A loss never counts higher than that level (or 600 if you have no wins or draws).
 * `gameValues` gives each game's value (`held` when a far-below win was kept up, `capped` when a loss was kept down).
 */
export function gameValues(games) {
  const values = games.map((g) => (g.score > 0 ? rawScore(g) : null));
  const wins = games.map((g, i) => (g.score === 1 ? i : -1)).filter((i) => i >= 0);
  for (let pass = 0; pass < wins.length; pass++) {
    let changed = false;
    for (const i of wins) {
      const others = values.filter((v, j) => j !== i && v != null);
      if (!others.length) continue;
      const floor = others.reduce((a, b) => a + b, 0) / others.length;
      const oppLevel = opponentLevel(games[i]);
      const farBelow = oppLevel != null && levelForRating(floor) - oppLevel >= FAR_BELOW;
      if (farBelow && values[i] < floor) {
        values[i] = Math.round(floor);
        changed = true;
      }
    }
    if (!changed) break;
  }

  const settled = games.map((g, i) => {
    if (g.score <= 0) return null;
    const raw = rawScore(g);
    const held = g.score === 1 && values[i] - raw > 0.5;
    return { value: held ? Math.round(values[i]) : raw, held };
  });
  const positive = settled.filter(Boolean).map((v) => v.value);
  const base = positive.length ? Math.round(positive.reduce((a, b) => a + b, 0) / positive.length) : NO_WINS_BASE;

  return games.map((g, i) => {
    if (g.score > 0) return { value: settled[i].value, held: settled[i].held, capped: false };
    const raw = rawScore(g);
    return { value: Math.min(raw, base), held: false, capped: raw > base };
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
function rateRow(game) {
  return { game, opp: opponentRating(game), score: SCORE[game.result], heavy: tooManyHints(game) };
}

/* Skill rating the new formula gives a set of stored games, or null before five can count. */
export function skillFromRecords(records) {
  const recent = records
    .map(rateRow)
    .filter((g) => g.opp != null && g.score != null && !g.heavy)
    .sort((a, b) => b.game.date - a.game.date)
    .slice(0, RECENT_GAMES);
  if (recent.length < MIN_GAMES) return null;
  return performanceRating(recent);
}

export function ratedGames(userId) {
  const finished = db.games
    .filter((g) => g.userId === userId)
    .sort((a, b) => b.date - a.date)
    .map(rateRow)
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

import { db } from '../../db/store.js';
import { gameValues, performanceRating, ratedGames, skillFor } from './skillRating.js';
import { hintPercent } from './hintUsage.js';

/* Tags that describe the position rather than an idea the player used. */
const SITUATION_TAGS = new Set(['opening', 'endgame', 'loneKing', 'pawnEndgame', 'rookEndgame', 'materialUp', 'materialDown', 'ahead', 'losing']);
const APPLIED_KINDS = new Set(['best', 'excellent']);
const MISSED_KINDS = new Set(['inaccuracy', 'mistake', 'blunder']);
const MAX_REVIEWS = 60;

const summary = (g) => ({ id: g.id, date: g.date, opponent: g.opponent, mode: g.mode, result: g.result, color: g.color });

/* Where the skill rating comes from: each counted game and the value it adds to the average. */
function points(userId) {
  const { recent, heavy } = ratedGames(userId);
  const values = gameValues(recent);
  return {
    games: recent.map((g, i) => ({ ...summary(g.game), opp: g.opp, value: values[i].value, capped: values[i].capped })),
    average: recent.length ? performanceRating(recent) : null,
    excluded: heavy.slice(0, 10).map((g) => ({ ...summary(g.game), hintPercent: hintPercent(g.game) })),
  };
}

/*
 * Ideas from reviewed games. On best/excellent moves the tags describe what the player did
 * (`applied`); on slips they describe the better move the player missed (`missed`).
 */
function patterns(userId) {
  const reviewed = db.games
    .filter((g) => g.userId === userId && g.review?.moves?.length)
    .sort((a, b) => b.date - a.date)
    .slice(0, MAX_REVIEWS);
  const stats = {};
  for (const g of reviewed) {
    const usedHere = new Set();
    for (const m of g.review.moves) {
      if (m.color && m.color !== g.color) continue;
      const kind = APPLIED_KINDS.has(m.kind) ? 'applied' : MISSED_KINDS.has(m.kind) ? 'missed' : null;
      if (!kind) continue;
      for (const tag of m.tags || []) {
        if (SITUATION_TAGS.has(tag)) continue;
        const s = (stats[tag] ||= { tag, applied: 0, missed: 0, games: 0, lastGame: null });
        s[kind]++;
        if (kind === 'applied' && !usedHere.has(tag)) { usedHere.add(tag); s.games++; }
        if (kind === 'missed' && !s.lastGame) s.lastGame = { id: g.id, ply: m.ply };
      }
    }
  }
  return { reviewedGames: reviewed.length, list: Object.values(stats) };
}

export function skillBreakdown(userId) {
  return { skill: skillFor(userId), points: points(userId), patterns: patterns(userId) };
}

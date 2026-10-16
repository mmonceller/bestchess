/* Approximate playing strength of each bot level (keep in sync with client/src/engine/levels.js). */
export const LEVEL_RATING = { 1: 400, 2: 700, 3: 1000, 4: 1300, 5: 1600, 6: 1900, 7: 2100, 8: 2300 };

/* Rating assumed for online opponents in games recorded before opponent ratings were stored. */
export const DEFAULT_OPPONENT_RATING = 1200;

/* Bot level whose strength is closest to a rating. An equal gap keeps the lower level. */
export function levelForRating(rating) {
  let best = 1;
  let bestDiff = Infinity;
  for (const [id, strength] of Object.entries(LEVEL_RATING)) {
    const diff = Math.abs(strength - rating);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = Number(id);
    }
  }
  return best;
}

/* "Casual (Lv 3)" still names the bot when a saved game has no level number. */
export function levelFromLabel(name) {
  const match = String(name || '').match(/\(Lv\s*(\d+)\)/i);
  const level = match ? Number(match[1]) : null;
  return LEVEL_RATING[level] ? level : null;
}

export function computerLevel(game) {
  const level = Number(game?.level);
  if (LEVEL_RATING[level]) return level;
  return levelFromLabel(game?.opponent);
}

export function opponentRating(game) {
  if (game.mode === 'computer') {
    const level = computerLevel(game);
    return level == null ? null : LEVEL_RATING[level];
  }
  return Number.isFinite(game.opponentRating) ? game.opponentRating : DEFAULT_OPPONENT_RATING;
}

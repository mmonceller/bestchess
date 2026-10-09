/* Approximate playing strength of each bot level (keep in sync with client/src/engine/levels.js). */
export const LEVEL_RATING = { 1: 400, 2: 700, 3: 1000, 4: 1300, 5: 1600, 6: 1900, 7: 2100 };

/* Rating assumed for online opponents in games recorded before opponent ratings were stored. */
export const DEFAULT_OPPONENT_RATING = 1200;

export function opponentRating(game) {
  if (game.mode === 'computer') return LEVEL_RATING[game.level] ?? null;
  return Number.isFinite(game.opponentRating) ? game.opponentRating : DEFAULT_OPPONENT_RATING;
}

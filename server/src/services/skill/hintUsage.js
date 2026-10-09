/* Games where the player asked for hints on more than this share of their moves don't count toward skill. */
export const HINT_LIMIT_PERCENT = 50;

/* How many of the game's `moves` (plies) were made by `color`. White moves on even plies. */
export const playerMoveCount = (moves, color) => (color === 'b' ? Math.floor(moves / 2) : Math.ceil(moves / 2));

/* Keeps only real plies of the player's own moves, each counted once. */
export function sanitizeHintPlies(plies, moves, color) {
  if (!Array.isArray(plies)) return [];
  const parity = color === 'b' ? 1 : 0;
  const clean = plies.filter((p) => Number.isInteger(p) && p >= 0 && p < moves && p % 2 === parity);
  return [...new Set(clean)].sort((a, b) => a - b).slice(0, 500);
}

function hintShare(game) {
  const own = playerMoveCount(game.moves || 0, game.color);
  return own ? (game.hintPlies?.length || 0) / own : 0;
}

export const hintPercent = (game) => Math.round(hintShare(game) * 100);

export const tooManyHints = (game) => hintShare(game) * 100 > HINT_LIMIT_PERCENT;

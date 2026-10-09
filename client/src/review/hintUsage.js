/* Matches the server: games with more hints than this share of the player's moves don't count toward skill. */
export const HINT_LIMIT_PERCENT = 50;

/* How many hints a saved game used, out of how many of the player's own moves. */
export function hintSummary(game) {
  const plies = game?.moves ?? 0;
  const own = game?.color === 'b' ? Math.floor(plies / 2) : Math.ceil(plies / 2);
  const used = Math.min(own, game?.hintPlies?.length ?? 0);
  const percent = own ? Math.round((used / own) * 100) : 0;
  return {
    tracked: Array.isArray(game?.hintPlies),
    used,
    own,
    percent,
    countsForSkill: !own || (used / own) * 100 <= HINT_LIMIT_PERCENT,
  };
}

export const hintLabel = (used) => `${used} hint${used === 1 ? '' : 's'}`;

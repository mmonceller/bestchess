import { splitPatterns } from '../../skill/patterns.js';

/*
 * Reviewed games tag the better move a player missed. Rescue and protect mean they
 * left a piece of their own loose — easy to miss in a real game, obvious in a puzzle.
 */
const DRILL_FOR_TAG = {
  mate: 'checkmate',
  fork: 'fork',
  pin: 'pin',
  skewer: 'skewer',
  freePiece: 'hanging',
  winMaterial: 'hanging',
  rescue: 'ownLoose',
  protect: 'ownLoose',
  promotion: 'promotion',
  desperado: 'hanging',
};

const NAMES = {
  checkmate: 'Checkmate',
  fork: 'Forks',
  pin: 'Pins',
  skewer: 'Skewers',
  hanging: 'Taking free pieces',
  ownLoose: 'Saving your own pieces',
  promotion: 'Promotion',
};

/* Engine tags from a review, plus loose-piece counts from games that were never reviewed. */
export function mergeMissLists(reviewed, board) {
  const map = new Map();
  for (const row of [...(reviewed || []), ...(board || [])]) {
    if (!row?.tag) continue;
    const prev = map.get(row.tag);
    if (!prev) {
      map.set(row.tag, { tag: row.tag, applied: row.applied || 0, missed: row.missed || 0, games: row.games || 0 });
      continue;
    }
    prev.applied += row.applied || 0;
    prev.missed += row.missed || 0;
    prev.games += row.games || 0;
  }
  return [...map.values()];
}

/* Ideas they miss in games, one drill each, most-missed first. */
export function gameWeakAreas(list) {
  const { workOn } = splitPatterns(list || []);
  const byDrill = new Map();
  for (const row of workOn) {
    const id = DRILL_FOR_TAG[row.tag];
    if (!id) continue;
    const prev = byDrill.get(id);
    if (prev) {
      prev.missed += row.missed;
      prev.applied += row.applied;
      continue;
    }
    byDrill.set(id, {
      id,
      name: NAMES[id],
      missed: row.missed,
      applied: row.applied,
      source: 'games',
    });
  }
  return [...byDrill.values()];
}

/* Skill-mastery rows that got worse today, mapped onto the same drills as game misses. */
export function areasFromDrops(changes) {
  const byDrill = new Map();
  for (const row of changes || []) {
    if (row.direction !== 'down') continue;
    const id = DRILL_FOR_TAG[row.tag];
    if (!id || byDrill.has(id)) continue;
    byDrill.set(id, { id, name: NAMES[id], missed: 1, applied: 0, source: 'today' });
  }
  return [...byDrill.values()];
}

import { LEVELS } from '../../engine/levels.js';

/*
 * Skill tiers computed on the server from a player's recent games (see server/src/services/skill).
 * `tracks` are the lesson tracks that fit each tier, most relevant first.
 */
export const TIERS = {
  bronze: { name: 'Bronze', color: '#cd7f32', min: 0, range: 'under 800', tracks: ['first', 'beginner'] },
  silver: { name: 'Silver', color: '#c4ccd8', min: 800, range: '800–1149', tracks: ['beginner', 'intermediate', 'tactics'] },
  gold: { name: 'Gold', color: '#ffc845', min: 1150, range: '1150–1499', tracks: ['tactics', 'intermediate', 'advanced'] },
  platinum: { name: 'Platinum', color: '#4fe0c8', min: 1500, range: '1500–1849', tracks: ['advanced', 'strategy', 'endgame'] },
  diamond: { name: 'Diamond', color: '#8fd8ff', min: 1850, range: '1850+', tracks: ['strategy', 'endgame', 'master'] },
};
export const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

export const tierInfo = (skill) => (skill?.tier ? { id: skill.tier, ...TIERS[skill.tier] } : null);

/* The tier above the player's, with how many rating points are still missing, or null at the top. */
export function nextTier(skill) {
  const i = TIER_ORDER.indexOf(skill?.tier);
  if (i < 0 || i === TIER_ORDER.length - 1) return null;
  const id = TIER_ORDER[i + 1];
  return { id, ...TIERS[id], toGo: Math.max(0, TIERS[id].min - (skill.rating ?? 0)) };
}

/* The bot level whose strength is closest to the player's skill rating. */
export function recommendedLevel(skill) {
  if (!skill?.rating) return null;
  return LEVELS.reduce((best, l) => (Math.abs(l.rating - skill.rating) < Math.abs(best.rating - skill.rating) ? l : best)).id;
}

/* Lesson tracks that suit the player, or null when their skill isn't known yet. */
export const tracksForSkill = (skill) => (skill?.tier ? TIERS[skill.tier].tracks : null);

import { LEVELS } from '../../engine/levels.js';

/*
 * Skill tiers computed on the server from a player's recent games (see server/src/services/skill).
 * `tracks` are the lesson tracks that fit each tier, most relevant first.
 */
export const TIERS = {
  bronze: { name: 'Bronze', color: '#cd7f32', range: 'under 800', tracks: ['first', 'beginner'] },
  silver: { name: 'Silver', color: '#c4ccd8', range: '800–1149', tracks: ['beginner', 'intermediate', 'first'] },
  gold: { name: 'Gold', color: '#ffc845', range: '1150–1499', tracks: ['intermediate', 'advanced', 'endgame'] },
  platinum: { name: 'Platinum', color: '#4fe0c8', range: '1500–1849', tracks: ['advanced', 'strategy', 'endgame'] },
  diamond: { name: 'Diamond', color: '#8fd8ff', range: '1850+', tracks: ['strategy', 'endgame', 'master'] },
};
export const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

export const tierInfo = (skill) => (skill?.tier ? { id: skill.tier, ...TIERS[skill.tier] } : null);

/* The bot level whose strength is closest to the player's skill rating. */
export function recommendedLevel(skill) {
  if (!skill?.rating) return null;
  return LEVELS.reduce((best, l) => (Math.abs(l.rating - skill.rating) < Math.abs(best.rating - skill.rating) ? l : best)).id;
}

/* Lesson tracks that suit the player, or null when their skill isn't known yet. */
export const tracksForSkill = (skill) => (skill?.tier ? TIERS[skill.tier].tracks : null);

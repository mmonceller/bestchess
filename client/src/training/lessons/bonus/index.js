import { firstStepsBonus } from './firstStepsBonus.js';
import { beginnerBonus } from './beginnerBonus.js';
import { intermediateBonus } from './intermediateBonus.js';
import { advancedBonus } from './advancedBonus.js';
import { strategyBonus } from './strategyBonus.js';
import { masterBonus } from './masterBonus.js';
import { endgameBonus, ENDGAME_EXTRAS } from './endgameBonus.js';
import { BOOK_EXTRAS } from './bookExtras.js';

const BASE = {
  ...firstStepsBonus,
  ...beginnerBonus,
  ...intermediateBonus,
  ...advancedBonus,
  ...strategyBonus,
  ...endgameBonus,
  ...masterBonus,
};

/* Appended in this order; add new extra sets at the end. */
const EXTRAS = [BOOK_EXTRAS, ENDGAME_EXTRAS];

/*
 * Extra steps shown at the end of a lesson the player has already finished, keyed by lesson id.
 * Saved bonus answers are matched by position, so new steps are only ever appended.
 */
export const BONUS = Object.fromEntries(
  [...new Set([BASE, ...EXTRAS].flatMap(Object.keys))]
    .map((id) => [id, [BASE, ...EXTRAS].flatMap((set) => set[id] || [])]),
);

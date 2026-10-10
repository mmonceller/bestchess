import { GLOSSARY } from '../glossary.js';
import rules from './entries/rules.js';
import tactics from './entries/tactics.js';
import checkmates from './entries/checkmates.js';
import strategy from './entries/strategy.js';
import openings from './entries/openings.js';
import endgames from './entries/endgames.js';
import play from './entries/play.js';

export { CATEGORIES, CATEGORY, LEVELS, LEVEL } from './categories.js';

const BY_CATEGORY = { rules, tactics, checkmates, strategy, openings, endgames, play };

export const slug = (name) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/*
 * Every chess term for the terms page: { id, name, def, category, level, aka, lesson?, moves? }.
 * Words the lessons already explain reuse the lesson glossary's wording, so a term reads the
 * same in a lesson popup and on the terms page.
 */
export const TERMS = Object.entries(BY_CATEGORY).flatMap(([category, list]) => list.map((entry) => ({
  ...entry,
  id: slug(entry.name),
  category,
  aka: entry.aka || [],
  def: entry.def ?? GLOSSARY[entry.gloss ?? entry.name.toLowerCase()],
})));

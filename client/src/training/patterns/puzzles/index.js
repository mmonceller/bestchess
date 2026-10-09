import { BASE_PUZZLES } from './base.js';
import { VARIANTS } from './variants.js';

/* Every trainer puzzle. Variants carry `base`, the id of the puzzle they were made from. */
export const PUZZLES = [...BASE_PUZZLES, ...VARIANTS];

/* The original puzzle id for any puzzle, so all versions of one idea count as "seen" together. */
const BASE_OF = new Map(PUZZLES.map((p) => [p.id, p.base || p.id]));
export const baseOf = (id) => BASE_OF.get(id) || id;

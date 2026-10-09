import { publicUser } from '../db/store.js';
import { skillFor } from './skill/skillRating.js';

/* What a logged-in player sees about themselves: public profile plus their skill tier. */
export const userView = (user) => (user ? { ...publicUser(user), skill: skillFor(user.id) } : null);

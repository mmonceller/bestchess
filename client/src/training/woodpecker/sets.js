import counts from './data/counts.js';

/*
 * The three Woodpecker sets. Positions come from the exercises in The Woodpecker Method
 * (Axel Smith and Hans Tikkanen); the data files hold only positions, moves and game names.
 */
export const WOODPECKER_SETS = [
  {
    id: 'easy',
    name: 'Easy',
    icon: 'seedling',
    color: '#4caf7a',
    blurb: 'Short, clear tactics: one to three moves. Start here unless tactics already feel easy.',
    recommendedBelow: 1500,
    load: () => import('./data/easy.js'),
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    icon: 'mountain',
    color: '#e0a83a',
    blurb: 'The biggest set. Longer lines and more hidden ideas from master games.',
    recommendedBelow: 1900,
    load: () => import('./data/intermediate.js'),
  },
  {
    id: 'advanced',
    name: 'Advanced',
    icon: 'crown',
    color: '#d0574f',
    blurb: 'Deep combinations where you must see several moves ahead before starting.',
    recommendedBelow: Infinity,
    load: () => import('./data/advanced.js'),
  },
].map((s) => ({ ...s, count: counts[s.id] || 0 }));

export const setById = (id) => WOODPECKER_SETS.find((s) => s.id === id) || null;

export const recommendedSet = (rating) => WOODPECKER_SETS.find((s) => rating < s.recommendedBelow) || WOODPECKER_SETS[0];

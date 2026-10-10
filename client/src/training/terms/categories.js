/* How the chess terms page groups words. Order here is the order of the filter chips. */
export const CATEGORIES = [
  { id: 'rules', label: 'Board & rules', icon: 'grid', color: '#5b8cff' },
  { id: 'tactics', label: 'Tactics', icon: 'bolt', color: '#ff7a45' },
  { id: 'checkmates', label: 'Checkmates', icon: 'crown', color: '#ff5d73' },
  { id: 'strategy', label: 'Strategy', icon: 'mind', color: '#7c5cff' },
  { id: 'openings', label: 'Openings', icon: 'book', color: '#ffb547' },
  { id: 'endgames', label: 'Endgames', icon: 'king', color: '#4fd1c5' },
  { id: 'play', label: 'Playing & review', icon: 'clock', color: '#9aa3b5' },
];

export const CATEGORY = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

/* Rough difficulty: when a player usually meets the word. */
export const LEVELS = [
  { id: 'beginner', label: 'Beginner', icon: 'seedling' },
  { id: 'intermediate', label: 'Intermediate', icon: 'mountain' },
  { id: 'advanced', label: 'Advanced', icon: 'trophy' },
];

export const LEVEL = Object.fromEntries(LEVELS.map((l, rank) => [l.id, { ...l, rank }]));

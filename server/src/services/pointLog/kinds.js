/* Numbers the history table follows. Labels are the words used in the log sentences. */
export const POINT_KINDS = [
  { id: 'skill', label: 'Skill points' },
  { id: 'online', label: 'Online rating' },
  { id: 'stars', label: 'Training stars' },
  { id: 'goal', label: 'Goal points' },
  { id: 'puzzles', label: 'Puzzles solved' },
  { id: 'lessons', label: 'Lessons done' },
  { id: 'progress', label: 'Progress points' },
  { id: 'training', label: 'Training points' },
  { id: 'puzzleRating', label: 'Puzzle rating' },
];

export const POINT_LABELS = Object.fromEntries(POINT_KINDS.map((kind) => [kind.id, kind.label]));

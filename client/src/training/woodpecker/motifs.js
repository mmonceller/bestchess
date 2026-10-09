/*
 * Tactical themes tagged on each Woodpecker puzzle (scripts/woodpecker/motifs.js) and the
 * lessons that teach them, most specific first. Earlier entries win when a puzzle has many tags.
 */
export const MOTIFS = {
  smothered: { name: 'Smothered mate', icon: 'knight', lessons: ['t-mating-patterns'], tip: 'The king is boxed in by its own pieces — look for a knight check.' },
  backRank: { name: 'Back-rank mate', icon: 'rook', lessons: ['t-mating-patterns', 'b-blunder-filter'], tip: 'The king is stuck behind its own pawns. Can a rook or queen reach its back row?' },
  doubleCheck: { name: 'Double check', icon: 'eye', lessons: ['t-discovered'], tip: 'Two pieces check at once, so the king has to move.' },
  discovered: { name: 'Discovered attack', icon: 'eye', lessons: ['t-discovered'], tip: 'Move one piece out of the way so the piece behind it attacks too.' },
  decoy: { name: 'Decoy', icon: 'target', lessons: ['t-decoy-deflection'], tip: 'Sacrifice to drag the king or another piece onto a bad square.' },
  deflection: { name: 'Deflection', icon: 'target', lessons: ['t-decoy-deflection'], tip: 'Pull a defender away from the job it is doing.' },
  removeDefender: { name: 'Remove the defender', icon: 'xCircle', lessons: ['t-remove-defender'], tip: 'Capture the piece that holds the position together.' },
  skewer: { name: 'Skewer', icon: 'arrowRight', lessons: ['t-skewers'], tip: 'Attack the big piece; when it moves, take the one behind it.' },
  fork: { name: 'Fork', icon: 'knight', lessons: ['b-forks'], tip: 'One move attacks two things at once.' },
  pin: { name: 'Pin', icon: 'lock', lessons: ['i-pin-pile'], tip: 'A piece can\'t move without exposing something bigger behind it.' },
  promotion: { name: 'Promotion', icon: 'queen', lessons: ['f-pawns', 's-passed-pawns'], tip: 'A pawn is close to becoming a queen.' },
  mate: { name: 'Checkmate', icon: 'crown', lessons: ['f-check', 't-mating-patterns'], tip: 'Look at every check first — one of them may end the game.' },
  sacrifice: { name: 'Sacrifice', icon: 'fire', lessons: ['t-decoy-deflection'], tip: 'Giving material away can be the start of something bigger.' },
  quiet: { name: 'Quiet key move', icon: 'mind', lessons: ['t-woodpecker-way'], tip: 'The first move is no check and no capture — it makes a threat that can\'t be stopped.' },
};

const ORDER = Object.keys(MOTIFS);

/* The puzzle's themes, most telling first. */
export function puzzleMotifs(puzzle, max = 2) {
  return (puzzle.motifs || []).filter((m) => MOTIFS[m]).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).slice(0, max);
}

/* The lesson for a puzzle's main theme, falling back to the general solving lesson. */
export function puzzleLesson(puzzle) {
  const [main] = puzzleMotifs(puzzle, 1);
  return main ? MOTIFS[main].lessons[0] : 't-woodpecker-way';
}

/* How often each theme appears in a set, most common first, with its lessons. */
export function setMotifs(puzzles) {
  const counts = {};
  for (const p of puzzles) for (const m of p.motifs || []) if (MOTIFS[m]) counts[m] = (counts[m] || 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, ...MOTIFS[id], count, share: count / (puzzles.length || 1) }));
}

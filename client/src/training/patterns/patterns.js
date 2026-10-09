/*
 * Tactical patterns the trainer teaches. `unlock` is the trainer rating at which
 * a pattern starts appearing, so beginners meet simple ideas first. `mate` patterns
 * must end in checkmate, and any mating move counts as solving them.
 */
export const PATTERNS = {
  hanging: {
    name: 'Free Piece',
    icon: 'gem',
    color: '#3ccf7a',
    unlock: 0,
    clue: 'Look for an enemy piece that nobody protects.',
    lesson: 'A piece with no protector is "hanging". Capturing it is free material — always check for these first.',
  },
  mate1: {
    name: 'Checkmate in 1',
    icon: 'crown',
    color: '#e5534b',
    unlock: 0,
    mate: true,
    clue: 'There is a check that leaves the king nowhere to go.',
    lesson: 'Before anything else, look at every check you can give. Sometimes one of them ends the game.',
  },
  promotion: {
    name: 'Promotion',
    icon: 'queen',
    color: '#ffb547',
    unlock: 0,
    clue: 'A pawn is close to the last row.',
    lesson: 'A pawn that reaches the far side becomes a queen. Getting one there safely usually wins the game.',
  },
  fork: {
    name: 'Fork',
    icon: 'knight',
    color: '#4fd1c5',
    unlock: 550,
    clue: 'Find a move that attacks two things at once.',
    lesson: 'A fork attacks two pieces with one move. Your opponent can only save one of them.',
  },
  backRank: {
    name: 'Back-Rank Mate',
    icon: 'rook',
    color: '#f08a3e',
    unlock: 550,
    mate: true,
    clue: 'The enemy king is stuck behind its own pawns on the back row.',
    lesson: 'A king trapped on its back row by its own pawns can be checkmated by a single rook or queen.',
  },
  pin: {
    name: 'Pin',
    icon: 'target',
    color: '#9b6ce6',
    unlock: 750,
    clue: 'One enemy piece can\'t move without exposing something more valuable behind it.',
    lesson: 'A pinned piece is stuck. Attack it again — especially with a pawn — and it often falls.',
  },
  skewer: {
    name: 'Skewer',
    icon: 'arrowRight',
    color: '#3d8bd9',
    unlock: 800,
    clue: 'Attack a valuable piece that has another piece standing behind it in a line.',
    lesson: 'A skewer attacks a big piece; when it moves away, you capture the piece behind it.',
  },
  mate2: {
    name: 'Checkmate in 2',
    icon: 'crown',
    color: '#ff5d6c',
    unlock: 850,
    mate: true,
    clue: 'The first move doesn\'t have to be a check — it can just take away escape squares.',
    lesson: 'Mates in two often start with a quiet move that traps the king, followed by the final blow.',
  },
  discovered: {
    name: 'Discovered Attack',
    icon: 'eye',
    color: '#7c5cff',
    unlock: 950,
    clue: 'Move one piece out of the way so the piece behind it can attack.',
    lesson: 'When a piece steps aside and reveals an attack, you get two threats in one move.',
  },
  smothered: {
    name: 'Smothered Mate',
    icon: 'king',
    color: '#56cc9d',
    unlock: 900,
    mate: true,
    clue: 'The enemy king is boxed in by its own pieces. Which piece can jump over them?',
    lesson: 'A king surrounded by its own pieces can be mated by a lone knight — sometimes after a sacrifice that fills its last free square.',
  },
  removeDefender: {
    name: 'Remove the Defender',
    icon: 'swords',
    color: '#e07a5f',
    unlock: 1000,
    clue: 'Something is protected by just one piece. What if that protector disappears?',
    lesson: 'Capture the piece that guards something. Once the guard is gone, what it was guarding is yours.',
  },
  doubleCheck: {
    name: 'Double Check',
    icon: 'bolt',
    color: '#f2c94c',
    unlock: 1050,
    clue: 'Move a piece so it gives check AND uncovers a second check behind it.',
    lesson: 'Against double check the only defence is a king move — no blocking, no capturing. Often it wins whatever you like, or mates.',
  },
};

export const PATTERN_IDS = Object.keys(PATTERNS);
export const getPattern = (id) => PATTERNS[id];
export const isMatePattern = (id) => Boolean(PATTERNS[id]?.mate);

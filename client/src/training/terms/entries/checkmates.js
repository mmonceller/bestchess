/* Named checkmate patterns. `moves` is a legal line from the start position that ends in the mate. */
export default [
  {
    name: 'Back-rank mate',
    aka: ['back rank'],
    level: 'beginner',
    lesson: 't-mating-patterns',
    def: 'A rook or queen gives checkmate along the back row, because the king is trapped behind its own pawns.',
  },
  {
    name: 'Luft',
    aka: ['escape square'],
    level: 'intermediate',
    lesson: 't-mating-patterns',
    def: 'German for "air": a pawn move in front of your castled king that gives it an escape square, so back-rank mates don\'t work.',
  },
  { name: 'Smothered mate', level: 'intermediate', lesson: 't-mating-patterns' },
  {
    name: 'Box method',
    aka: ['queen checkmate', 'king and queen mate'],
    level: 'beginner',
    lesson: 'b-queen-box',
    def: 'How to checkmate with a king and queen against a lone king: use the queen to shrink the box the king lives in, then bring your own king to help.',
  },
  {
    name: 'Ladder mate',
    aka: ['rook roller', 'lawnmower mate'],
    level: 'beginner',
    def: 'Two rooks (or a rook and a queen) take turns checking, pushing the king back one row at a time until it hits the edge.',
  },
  {
    name: "Scholar's Mate",
    level: 'beginner',
    moves: '1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6 4.Qxf7#',
    def: 'A four-move checkmate: the queen and bishop team up on f7, the weakest square at the start of the game. Easy to stop once you know it.',
  },
  {
    name: "Fool's Mate",
    level: 'beginner',
    moves: '1.f3 e5 2.g4 Qh4#',
    def: 'The fastest possible checkmate, in just two moves. It only happens when White opens the king\'s diagonal by pushing the f- and g-pawns.',
  },
  {
    name: "Légal's Mate",
    aka: ['Legal trap'],
    level: 'intermediate',
    moves: '1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6 5.Nxe5 Bxd1 6.Bxf7+ Ke7 7.Nd5#',
    def: 'An opening trap: a knight ignores a pin and gives up its own queen, then the minor pieces checkmate the king.',
  },
  {
    name: 'Arabian mate',
    level: 'intermediate',
    def: 'A rook and a knight team up to checkmate a king in the corner. One of the oldest checkmate patterns known.',
  },
  {
    name: "Anastasia's mate",
    level: 'advanced',
    def: 'A knight and a rook (or queen) trap the king on the side of the board, behind one of its own pawns.',
  },
  {
    name: "Boden's mate",
    level: 'advanced',
    def: 'Two bishops on crossing diagonals checkmate a king, usually one that castled queenside, often after a queen sacrifice.',
  },
  {
    name: 'Epaulette mate',
    level: 'advanced',
    def: 'The king is boxed in by its own pieces on both sides, like shoulder pads, and the queen checks it from the front.',
  },
];

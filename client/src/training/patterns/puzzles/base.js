/*
 * Hand-made puzzles for the pattern trainer. `moves` alternates the student's moves
 * (even indexes) and the scripted replies (odd indexes), in UCI notation.
 * Every puzzle is checked by scripts/validatePuzzles.js; variants.js holds engine-checked
 * mirrored, colour-swapped and shifted versions of these, built by scripts/patterns/buildVariants.js.
 */
export const BASE_PUZZLES = [
  // Free pieces
  { id: 'h-rook-queen', pattern: 'hanging', rating: 400, fen: '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1', moves: ['d2d5'] },
  { id: 'h-pawn-bishop', pattern: 'hanging', rating: 400, fen: '4k3/pp5p/8/3b4/4P3/4K3/PP5P/8 w - - 0 1', moves: ['e4d5'] },
  { id: 'h-bishop-knight', pattern: 'hanging', rating: 450, fen: '4k3/7p/8/6n1/8/8/7P/2B1K3 w - - 0 1', moves: ['c1g5'] },
  { id: 'h-knight-rook', pattern: 'hanging', rating: 450, fen: 'r3k3/7p/1N6/8/8/8/7P/4K3 w - - 0 1', moves: ['b6a8'] },
  { id: 'h-queen-queen', pattern: 'hanging', rating: 600, fen: 'rnb1kbnr/pppp1ppp/8/4p3/4P1q1/3P4/PPP2PPP/RNBQKBNR w KQkq - 1 3', moves: ['d1g4'] },
  { id: 'h-queen-rook', pattern: 'hanging', rating: 650, fen: '1r4k1/5pp1/7p/8/8/8/1Q3PPP/6K1 w - - 0 1', moves: ['b2b8'] },
  { id: 'h-knight-queen', pattern: 'hanging', rating: 450, fen: '4k3/7p/8/2q5/8/1N6/7P/4K3 w - - 0 1', moves: ['b3c5'] },
  { id: 'h-pawn-queen', pattern: 'hanging', rating: 400, fen: 'r3k3/p5pp/8/8/3q4/4P3/P5PP/R3K1N1 w - - 0 1', moves: ['e3d4'] },
  { id: 'h-queen-bishop', pattern: 'hanging', rating: 500, fen: '4k3/8/8/8/8/2b5/8/Q4K2 w - - 0 1', moves: ['a1c3'] },
  { id: 'h-pick-free', pattern: 'hanging', rating: 650, fen: '4k3/8/2p5/1n3b2/8/8/8/1R2KR2 w - - 0 1', moves: ['f1f5'] },
  { id: 'h-bishop-rook', pattern: 'hanging', rating: 550, fen: '6k1/5ppp/8/8/3r4/8/1B3PPP/6K1 w - - 0 1', moves: ['b2d4'] },

  // Checkmate in one
  { id: 'm1-back', pattern: 'mate1', rating: 450, fen: '6k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1', moves: ['b1b8'] },
  { id: 'm1-box', pattern: 'mate1', rating: 500, fen: 'k7/7Q/1K6/8/8/8/8/8 w - - 0 1', moves: ['h7b7'] },
  { id: 'm1-scholar', pattern: 'mate1', rating: 550, fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4', moves: ['f3f7'] },
  { id: 'm1-edge', pattern: 'mate1', rating: 600, fen: '4k3/8/4K3/8/8/8/8/7Q w - - 0 1', moves: ['h1h8'] },
  { id: 'm1-ladder', pattern: 'mate1', rating: 600, fen: '7k/R7/8/8/8/8/8/1R4K1 w - - 0 1', moves: ['b1b8'] },
  { id: 'm1-knight', pattern: 'mate1', rating: 750, fen: '7k/7p/5N2/8/8/8/8/6RK w - - 0 1', moves: ['g1g8'] },
  { id: 'm1-pawn', pattern: 'mate1', rating: 800, fen: '6k1/5ppp/5P2/8/8/8/8/6QK w - - 0 1', moves: ['g1g7'] },
  { id: 'm1-rook-corner', pattern: 'mate1', rating: 500, fen: 'k7/8/1K6/8/8/8/8/7R w - - 0 1', moves: ['h1h8'] },
  { id: 'm1-queen-rank', pattern: 'mate1', rating: 550, fen: '6k1/8/6K1/8/8/8/8/Q7 w - - 0 1', moves: ['a1a8'] },
  { id: 'm1-smother', pattern: 'mate1', rating: 700, fen: '6rk/6pp/8/6N1/8/8/6PP/6K1 w - - 0 1', moves: ['g5f7'] },
  { id: 'm1-bishop-queen', pattern: 'mate1', rating: 700, fen: '6k1/5p1p/6pB/8/8/8/5PPP/3Q2K1 w - - 0 1', moves: ['d1d8'] },

  // Promotion
  { id: 'pr-simple', pattern: 'promotion', rating: 450, fen: '8/1P6/8/8/8/5k2/8/6K1 w - - 0 1', moves: ['b7b8q'] },
  { id: 'pr-capture', pattern: 'promotion', rating: 650, fen: '1r6/2P3k1/8/8/8/8/8/6K1 w - - 0 1', moves: ['c7b8q'] },
  { id: 'pr-deflect', pattern: 'promotion', rating: 750, fen: '2r3k1/1P6/8/8/8/8/8/2R3K1 w - - 0 1', moves: ['b7c8q'] },
  { id: 'pr-corner-king', pattern: 'promotion', rating: 450, fen: '8/k1P5/8/8/8/8/8/6K1 w - - 0 1', moves: ['c7c8q'] },
  { id: 'pr-race', pattern: 'promotion', rating: 600, fen: '4k3/6P1/8/8/8/8/p7/4K3 w - - 0 1', moves: ['g7g8q'] },

  // Forks
  { id: 'f-knight-rook', pattern: 'fork', rating: 650, fen: 'r3k3/6pp/8/1N6/8/8/5PPP/4K3 w - - 0 1', moves: ['b5c7', 'e8e7', 'c7a8'] },
  { id: 'f-pawn', pattern: 'fork', rating: 700, fen: '4k3/p7/2n1b3/8/2PP4/8/8/4K2R w K - 0 1', moves: ['d4d5'] },
  { id: 'f-queen', pattern: 'fork', rating: 750, fen: 'r3k3/7p/8/8/8/8/2Q4P/4K3 w - - 0 1', moves: ['c2e4', 'e8d8', 'e4a8'] },
  { id: 'f-pawn2', pattern: 'fork', rating: 800, fen: '4k3/8/8/2r1n3/8/3P4/6PP/R6K w - - 0 1', moves: ['d3d4'] },
  { id: 'f-knight-queen', pattern: 'fork', rating: 900, fen: '4k3/5ppp/q7/3N4/8/8/5PPP/6K1 w - - 0 1', moves: ['d5c7', 'e8e7', 'c7a6'] },
  // Back-rank mates
  { id: 'b-rook', pattern: 'backRank', rating: 600, fen: '6k1/5ppp/8/8/8/8/1q3PPP/2R3K1 w - - 0 1', moves: ['c1c8'] },
  { id: 'b-rook2', pattern: 'backRank', rating: 650, fen: '2r3k1/5ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1', moves: ['c1c8'] },
  { id: 'b-queen', pattern: 'backRank', rating: 800, fen: '3r2k1/5ppp/8/8/8/8/3Q1PPP/3R2K1 w - - 0 1', moves: ['d2d8'] },

  // Pins
  { id: 'p-pawn-knight', pattern: 'pin', rating: 850, fen: '4k3/4n3/8/5P2/8/8/8/4RK2 w - - 0 1', moves: ['f5f6'] },
  { id: 'p-rook-queen', pattern: 'pin', rating: 900, fen: '4k3/6pp/8/4q3/8/8/2B3PP/R4K2 w - - 0 1', moves: ['a1e1'] },
  { id: 'p-bishop-queen', pattern: 'pin', rating: 1000, fen: '6k1/6pp/4q3/8/8/1P6/6PP/R4BK1 w - - 0 1', moves: ['f1c4', 'e6c4', 'b3c4'] },

  // Skewers
  { id: 's-bishop', pattern: 'skewer', rating: 900, fen: '8/1r5p/8/3k3B/8/8/7P/7K w - - 0 1', moves: ['h5f3', 'd5c5', 'f3b7'] },
  { id: 's-rook', pattern: 'skewer', rating: 950, fen: 'R7/8/8/8/3k3r/8/8/6K1 w - - 0 1', moves: ['a8a4', 'd4e3', 'a4h4'] },
  { id: 's-queen', pattern: 'skewer', rating: 1000, fen: '8/8/8/q3k3/8/8/2K5/7Q w - - 0 1', moves: ['h1h5', 'e5d6', 'h5a5'] },

  // Checkmate in two
  { id: 'm2-ladder', pattern: 'mate2', rating: 900, fen: '4k3/8/8/8/8/8/8/RR4K1 w - - 0 1', moves: ['b1b7', 'e8f8', 'a1a8'] },
  { id: 'm2-queen', pattern: 'mate2', rating: 1000, fen: 'k7/8/8/2K5/8/8/8/1Q6 w - - 0 1', moves: ['c5c6', 'a8a7', 'b1b7'] },

  // Discovered attacks
  { id: 'd-knight', pattern: 'discovered', rating: 1000, fen: '4k3/8/8/3q4/8/8/4N3/4R1K1 w - - 0 1', moves: ['e2c3', 'e8d7', 'c3d5'] },
  { id: 'd-bishop-check', pattern: 'discovered', rating: 1050, fen: '4k3/8/2q5/8/8/8/4B3/4R1K1 w - - 0 1', moves: ['e2b5'] },
  { id: 'd-bishop-queen', pattern: 'discovered', rating: 1000, fen: 'q3k3/8/8/8/8/8/4BPPP/4R1K1 w - - 0 1', moves: ['e2f3', 'e8d8', 'f3a8'] },
  { id: 'd-bishop', pattern: 'discovered', rating: 1200, fen: '3q2k1/5ppp/8/8/8/3B4/5PPP/3R2K1 w - - 0 1', moves: ['d3h7', 'g8h7', 'd1d8'] },
];

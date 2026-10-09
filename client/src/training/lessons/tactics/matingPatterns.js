export const matingPatterns = {
  id: 't-mating-patterns',
  track: 'tactics',
  title: 'Mating Patterns: Back Rank & Smothered',
  coach: 'mira',
  summary: 'Two checkmates that show up again and again — learn to spot them instantly.',
  minutes: 5,
  steps: [
    {
      type: 'talk',
      fen: '6k1/5ppp/8/8/8/8/r4PPP/3R2K1 w - - 0 1',
      highlights: ['f7', 'g7', 'h7'],
      text: 'A king hiding behind three pawns feels safe — until a rook or queen reaches its back row. The pawns that protect it also trap it. This is the back-rank mate, and it decides a lot of games.',
    },
    {
      type: 'move',
      fen: '6k1/5ppp/8/8/8/8/r4PPP/3R2K1 w - - 0 1',
      prompt: 'Black\'s king has no escape square. Mate in one.',
      line: ['d1d8'],
      hint: 'Go to the 8th row with your rook.',
      success: 'Back-rank mate! Your own king has the same problem, so give it an escape square when you get the chance.',
    },
    {
      type: 'talk',
      text: 'The smothered mate is the knight\'s favourite trick. The king is boxed in by its OWN pieces, and a knight — which can\'t be blocked — delivers the check.',
    },
    {
      type: 'move',
      fen: '6rk/6pp/8/6N1/8/8/6PP/6K1 w - - 0 1',
      prompt: 'The king is surrounded by its own rook and pawns. Smother it.',
      line: ['g5f7'],
      hint: 'Which knight square checks h8?',
      success: 'Smothered! None of Black\'s pieces could get out of their own king\'s way.',
    },
    {
      type: 'move',
      fen: '4r2k/6pp/7N/3Q4/8/8/5PPP/6K1 w - - 0 1',
      prompt: 'Mate in two: first fill the last empty square next to the king with a sacrifice.',
      line: ['d5g8', 'e8g8', 'h6f7'],
      hint: 'Put your queen on g8. The king can\'t take it, because your knight guards it.',
      success: 'The queen sacrifice forced the rook onto g8 — then the knight smothered the king.',
    },
    {
      type: 'quiz',
      question: 'How do you protect your own king from a back-rank mate?',
      options: [
        { text: 'Make an escape square, for example by pushing the h-pawn one step', correct: true, why: 'A little "window" for the king means a check on the back row is no longer mate.' },
        { text: 'Keep all three pawns in front of the king forever', why: 'Those pawns are exactly what trap the king on the back row.' },
        { text: 'Put your queen in the corner', why: 'Your queen is needed in the game. One pawn move solves the problem.' },
      ],
    },
  ],
};

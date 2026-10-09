export const decoyDeflection = {
  id: 't-decoy-deflection',
  track: 'tactics',
  title: 'Decoy & Deflection: Give to Get',
  coach: 'lin',
  summary: 'Sacrifice material to drag a piece onto a bad square, or pull a defender away from its job.',
  minutes: 6,
  steps: [
    {
      type: 'talk',
      text: 'Four in ten Woodpecker puzzles contain a sacrifice: you give something away on purpose. There are two main reasons. A DECOY pulls an enemy piece (often the king) onto a square where it gets hit. A DEFLECTION pulls a defender away from the job it was doing. Either way, you get back more than you gave.',
    },
    {
      type: 'move',
      fen: '3q1bk1/pp3pp1/8/4N3/8/8/PPP5/2K4R w - - 0 1',
      prompt: 'Knight takes f7 would only hit the queen — the king could capture it. First bring the king to a better square for you.',
      line: ['h1h8', 'g8h8', 'e5f7', 'h8g8', 'f7d8'],
      hint: 'Sacrifice your rook on the h-file so the king has to take it.',
      wrong: { e5f7: 'The king just captures your knight. Lure it into the corner first.' },
      success: 'A decoy! The king was dragged to h8, right into the knight fork.',
    },
    {
      type: 'talk',
      fen: '3r2k1/p4ppp/8/8/3q4/8/P4QPP/4R1K1 w - - 0 1',
      arrows: [['e1', 'e8'], ['d8', 'e8']],
      text: 'Here Black\'s rook has two jobs: it protects the queen on d4 AND guards the back rank against your rook. A piece with two jobs is overloaded — give it a reason to do one of them, and it can\'t do the other.',
    },
    {
      type: 'move',
      fen: '3r2k1/p4ppp/8/8/3q4/8/P4QPP/4R1K1 w - - 0 1',
      prompt: 'Deflect the rook away from the back rank.',
      line: ['f2d4', 'd8d4', 'e1e8'],
      hint: 'Trade queens in a way that makes the rook leave the 8th row.',
      wrong: { e1e8: 'The rook simply takes yours. Make it busy somewhere else first.' },
      success: 'The rook was deflected to d4, and the back rank collapsed.',
    },
    {
      type: 'quiz',
      question: 'When is a sacrifice a good idea?',
      options: [
        { text: 'When you can see that the forced moves afterwards win back more', correct: true, why: 'A sacrifice is an investment. Check the replies — especially checks and captures — before you give anything away.' },
        { text: 'Whenever the position looks boring', why: 'A sacrifice without a concrete follow-up just loses material.' },
        { text: 'Only when you are already winning', why: 'Sacrifices can win from any position — if the calculation works.' },
      ],
    },
  ],
};

export const removeDefender = {
  id: 't-remove-defender',
  track: 'tactics',
  title: 'Remove the Defender',
  coach: 'elena',
  summary: 'If one piece holds the position together, take it away first.',
  minutes: 4,
  steps: [
    {
      type: 'talk',
      fen: 'r2q1r1k/pp3ppp/5n2/6B1/8/3Q4/5PPP/1B4K1 w - - 0 1',
      arrows: [['d3', 'h7'], ['f6', 'h7']],
      text: 'White\'s queen and bishop both aim at h7. Queen takes h7 would be checkmate… if the knight on f6 weren\'t guarding that square. When a single piece is doing an important job, ask: "Can I capture it, even if it costs me something?"',
    },
    {
      type: 'move',
      fen: 'r2q1r1k/pp3ppp/5n2/6B1/8/3Q4/5PPP/1B4K1 w - - 0 1',
      prompt: 'Remove the guard of h7, then finish the job.',
      line: ['g5f6', 'd8f6', 'd3h7'],
      hint: 'Your bishop on g5 can capture the defender.',
      wrong: { d3h7: 'Too early — the knight on f6 simply takes your queen.' },
      success: 'The guard is gone, so h7 fell with checkmate.',
    },
    {
      type: 'quiz',
      question: 'You want to win a piece, but it has exactly one defender. What should you look for first?',
      options: [
        { text: 'A way to capture, chase away or distract that defender', correct: true, why: 'Once the defender is gone or busy, the piece it was protecting is loose.' },
        { text: 'Attack the piece with as many pieces as possible, no matter how long it takes', why: 'That can work, but it\'s slow. Removing the only defender usually wins right away.' },
        { text: 'Give up — defended pieces can\'t be won', why: 'Defended doesn\'t mean safe. Defenders can be captured or lured away.' },
      ],
    },
  ],
};

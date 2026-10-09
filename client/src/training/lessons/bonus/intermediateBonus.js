/* Bonus rounds for Club Player. */
export const intermediateBonus = {
  'i-worst-piece': [
    {
      type: 'talk',
      text: 'Going deeper: a "bad bishop" is one blocked by its own pawns standing on its colour. Fix it by trading it, getting it outside the pawns, or moving the pawns. Knights, on the other hand, love "outposts" — squares in enemy territory that no enemy pawn can ever attack.',
    },
    {
      type: 'quiz',
      question: 'Your pawns stand on d4 and e5 — both dark squares. Which of your bishops is likely to be the "bad" one?',
      options: [
        { text: 'The dark-squared bishop', correct: true, why: 'Its diagonals are blocked by your own pawns on dark squares.' },
        { text: 'The light-squared bishop', why: 'That one has free light-squared diagonals — it\'s the good bishop here.' },
        { text: 'Neither — bishops can\'t be bad', why: 'A bishop staring at its own pawns does very little.' },
      ],
    },
    {
      type: 'quiz',
      question: 'What makes a square a perfect outpost for your knight?',
      options: [
        { text: 'No enemy pawn can ever attack it, and one of your pawns protects it', correct: true, why: 'A knight there can only be removed by trading a piece for it.' },
        { text: 'It\'s on the edge of the board', why: 'Edge squares are usually poor for knights — "a knight on the rim is dim".' },
        { text: 'It\'s next to your own king', why: 'Outposts are in enemy territory, where the knight is most annoying.' },
      ],
    },
  ],

  'i-pin-pile': [
    {
      type: 'talk',
      text: 'Going deeper: a pin against the king is an "absolute pin" — the pinned piece is not allowed to move at all. A pin against a queen or rook is a "relative pin" — the piece may move, but something valuable falls. Absolute pins are the best targets: pile up, because the piece can never escape.',
    },
    {
      type: 'move',
      fen: '4k3/4n3/8/5P2/8/8/8/4RK2 w - - 0 1',
      prompt: 'The knight on e7 is pinned to its king. Hit it with your cheapest attacker.',
      line: ['f5f6'],
      hint: 'A pawn move that attacks e7.',
      success: 'The knight can\'t run, so the pawn wins it.',
    },
    {
      type: 'quiz',
      question: 'A knight is pinned to its own king by a rook. Can it legally move?',
      options: [
        { text: 'No — moving it would expose the king to check', correct: true, why: 'That\'s an absolute pin. Moving the knight is illegal.' },
        { text: 'Yes, if it captures something', why: 'Even a capture would leave the king in check, so it\'s still illegal.' },
        { text: 'Yes, but it loses the rook', why: 'That describes a relative pin. Against the king, the move isn\'t allowed at all.' },
      ],
    },
  ],

  'i-what-they-want': [
    {
      type: 'talk',
      text: 'Going deeper: this habit has a name — prophylaxis. Before choosing your move, imagine it\'s your opponent\'s turn. What would they love to play? If it\'s dangerous, prevent it first. Great defenders stop plans before the threats even appear.',
    },
    {
      type: 'quiz',
      question: 'Your opponent\'s knight keeps eyeing a strong square in your camp. Which move is prophylaxis?',
      options: [
        { text: 'A pawn move that takes that square away from the knight', correct: true, why: 'You deal with the plan before it happens, at the cost of one quiet move.' },
        { text: 'Starting your own attack on the other side', why: 'Sometimes fine, but it ignores what your opponent wants.' },
        { text: 'Waiting until the knight lands there', why: 'By then it may be too late to dislodge it.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Your opponent has just moved a rook to the open e-file. What\'s the best first question?',
      options: [
        { text: 'What does the rook want to do there next?', correct: true, why: 'Maybe it wants to invade e7 or double with the other rook. Knowing the plan tells you what to stop.' },
        { text: 'Which of my pawns can I push?', why: 'That\'s about your plans. Ask about theirs first.' },
        { text: 'Can I trade queens?', why: 'Maybe later — first understand their idea.' },
      ],
    },
  ],

  'i-trade-logic': [
    {
      type: 'talk',
      text: 'Going deeper: when you\'re ahead, trade pieces but keep pawns. With only pawns left, an extra pawn often wins — but every pawn swap gives the defender drawing chances. Watch out for bishops on opposite colours: those endgames often end in a draw even two pawns down.',
    },
    {
      type: 'quiz',
      question: 'You\'re a pawn up in the middlegame. Which trade helps you most?',
      options: [
        { text: 'Trading queens', correct: true, why: 'Fewer pieces means less counterplay, and your extra pawn matters more.' },
        { text: 'Trading pawns', why: 'Every pawn trade brings the defender closer to a drawn endgame.' },
        { text: 'Avoiding all trades', why: 'When ahead, simplifying usually helps you.' },
      ],
    },
    {
      type: 'quiz',
      question: 'You\'re a whole piece down. What should you try to avoid?',
      options: [
        { text: 'Trading queens', correct: true, why: 'Without queens, there\'s little chance to create threats and confuse your opponent.' },
        { text: 'Keeping pieces on the board', why: 'Keeping pieces is what you want — it creates chances.' },
        { text: 'Creating threats', why: 'Threats are your best hope when behind.' },
      ],
    },
  ],

  'i-key-squares': [
    {
      type: 'talk',
      fen: '8/8/8/8/4P3/8/8/4K3 w - - 0 1',
      highlights: ['d6', 'e6', 'f6'],
      text: 'Going deeper: for a pawn on e4, the key squares are d6, e6 and f6 — two rows in front of it. If your king reaches any of them, the pawn promotes no matter who is to move. (Pawns on the a- or h-column are the exception — they\'re much harder to win with.)',
    },
    {
      type: 'quiz',
      fen: '4k3/8/4K3/4P3/8/8/8/8 b - - 0 1',
      question: 'White\'s king stands on e6, right in front of its pawn. Who wins?',
      options: [
        { text: 'White — no matter whose turn it is', correct: true, why: 'With the king on the 6th row in front of its pawn, White always wins (except with an edge pawn).' },
        { text: 'It\'s a draw if Black has the move', why: 'With White\'s king this far forward, the opposition no longer matters.' },
        { text: 'Black, by capturing the pawn', why: 'The black king can\'t get near the pawn — White\'s king protects it.' },
      ],
    },
    {
      type: 'quiz',
      fen: '8/8/4k3/8/4K3/8/8/8 b - - 0 1',
      question: 'The kings face each other with one square between them, and it\'s Black\'s turn. Who has the opposition?',
      options: [
        { text: 'White — the side NOT to move has the opposition', correct: true, why: 'Black must step aside, letting White\'s king move forward.' },
        { text: 'Black — the side to move', why: 'It\'s the other way around: having to move is the problem.' },
        { text: 'Nobody', why: 'Kings facing off with one square between them always means someone has the opposition.' },
      ],
    },
  ],
};

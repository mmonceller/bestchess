/* Bonus rounds for Foundations. */
export const beginnerBonus = {
  'b-loose-pieces': [
    {
      type: 'talk',
      text: 'Going deeper: strong players have a saying — "loose pieces drop off". A piece doesn\'t need to be attacked to be in danger. If nothing protects it, a single fork or check later can win it. Before each move, count your unprotected pieces.',
    },
    {
      type: 'move',
      fen: '1r4k1/5pp1/7p/8/8/8/1Q3PPP/6K1 w - - 0 1',
      prompt: 'Black left something loose. Find it and take it.',
      line: ['b2b8'],
      hint: 'Look along the b-column. Is that black piece protected by anything?',
      success: 'The rook had no defender, so it dropped off. Free material!',
    },
    {
      type: 'quiz',
      question: 'Which of these is a "loose" piece?',
      options: [
        { text: 'A knight that nothing protects, even though nothing attacks it yet', correct: true, why: 'Loose means unprotected. It may not be in danger now, but one double attack can win it.' },
        { text: 'A rook protected by a pawn', why: 'That rook is defended, so it isn\'t loose.' },
        { text: 'A pawn on its starting square', why: 'Pawns at the start are protected by pieces behind them.' },
      ],
    },
  ],

  'b-queen-box': [
    {
      type: 'talk',
      fen: 'k7/8/1Q6/8/8/8/8/K7 b - - 0 1',
      highlights: ['a7', 'b7', 'b8'],
      text: 'Going deeper: the real danger in the queen checkmate is stalemate. Here Black\'s king has no legal move, but it is NOT in check — so the game is a draw! Each time you shrink the box, make sure the king still has a square to go to.',
    },
    {
      type: 'quiz',
      fen: 'k7/8/1Q6/8/8/8/8/K7 b - - 0 1',
      question: 'It\'s Black\'s turn in this position. What happens?',
      options: [
        { text: 'Stalemate — the game is a draw', correct: true, why: 'Black isn\'t in check but has no legal move. White threw away a won game.' },
        { text: 'Checkmate — White wins', why: 'Checkmate needs the king to be in check. The queen on b6 isn\'t attacking a8.' },
        { text: 'Black must pass', why: 'There\'s no passing in chess. With no legal moves and no check, it\'s stalemate.' },
      ],
    },
    {
      type: 'move',
      fen: 'k7/7Q/1K6/8/8/8/8/8 w - - 0 1',
      prompt: 'Finish the job properly this time: checkmate in one.',
      line: ['h7b7'],
      accept: { 0: ['h7b7', 'h7a7', 'h7h8', 'h7g8'] },
      hint: 'Your king on b6 can protect the queen if she gets close.',
      success: 'Checkmate! The king and queen worked as a team.',
    },
  ],

  'b-forks': [
    {
      type: 'talk',
      text: 'Going deeper: the strongest forks come with check. The king must move, so the other piece is lost. A fork of king and queen is called a "royal fork" and usually decides the game. Before you fork, make sure the forking piece can\'t simply be captured.',
    },
    {
      type: 'move',
      fen: '4k3/5ppp/q7/3N4/8/8/5PPP/6K1 w - - 0 1',
      prompt: 'Find the fork with check, then collect your prize.',
      line: ['d5c7', 'e8e7', 'c7a6'],
      hint: 'Which square lets the knight attack the king and the queen at the same time?',
      success: 'Check first, then the queen. That\'s a royal fork!',
    },
    {
      type: 'quiz',
      question: 'Which pieces can make a fork?',
      options: [
        { text: 'Every piece — even pawns and the king', correct: true, why: 'Any piece that attacks two things at once is forking. Pawn forks are especially painful.' },
        { text: 'Only knights', why: 'Knights are famous for it, but queens, bishops, rooks, pawns and kings fork too.' },
        { text: 'Only the queen', why: 'The queen forks a lot, but every piece can do it.' },
      ],
    },
  ],

  'b-blunder-filter': [
    {
      type: 'talk',
      text: 'Going deeper: use the filter on your opponent\'s moves too. After every move they make, ask: what does it attack? Is there a check or a capture coming? Most blunders don\'t come from a bad idea — they come from missing what the opponent\'s last move threatened.',
    },
    {
      type: 'move',
      fen: '2r3k1/5ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1',
      prompt: 'Run the filter — checks, captures, threats. What wins on the spot?',
      line: ['c1c8'],
      hint: 'A capture that is also a check. Can the black king escape?',
      success: 'Capture with check, and the king is trapped behind its own pawns. Checkmate!',
    },
    {
      type: 'quiz',
      question: 'Your opponent just moved their queen next to your king, and nothing seems to protect it. What do you check first?',
      options: [
        { text: 'Can I capture it — and is it really unprotected?', correct: true, why: 'Captures come first. Double-check for hidden defenders like a bishop far away.' },
        { text: 'Whether I can castle', why: 'There\'s a queen next to your king. Deal with it first.' },
        { text: 'Which pawn to push', why: 'Pushing a pawn ignores a direct threat and a possible free queen.' },
      ],
    },
  ],

  'b-opening-race': [
    {
      type: 'talk',
      text: 'Going deeper: players measure opening time in "tempi" — a tempo is one move. Moving the same piece twice or chasing pawns with your queen costs tempi. Some openings, called gambits, even give away a pawn to gain a few tempi, because faster development can be worth real material.',
    },
    {
      type: 'quiz',
      question: 'After 1.e4 e5 2.Qh5, why is White\'s early queen move risky?',
      options: [
        { text: 'Black can develop pieces while attacking the queen, gaining time', correct: true, why: 'Moves like ...Nc6, ...g6 and ...Nf6 come with tempo while the queen keeps running.' },
        { text: 'The queen can be captured immediately', why: 'Not right away — but it will be chased around.' },
        { text: 'It\'s against the rules', why: 'It\'s legal. It\'s just a poor use of time.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Which opening move usually wastes time?',
      options: [
        { text: 'Pushing an edge pawn like a3 or h3 for no reason', correct: true, why: 'Edge pawns don\'t help control the centre or develop pieces.' },
        { text: 'Developing a knight toward the centre', why: 'That\'s exactly what you want to do.' },
        { text: 'Castling', why: 'Castling keeps the king safe and brings a rook toward the centre — a great use of a move.' },
      ],
    },
  ],

  'b-tactics-sprint': [
    {
      type: 'talk',
      text: 'Going deeper: speed comes from patterns, not rushing. Strong players see a position in "chunks" — weak back row, knight fork, loose bishop — instead of checking every move. The Pattern Trainer builds exactly this. Two more puzzles against the clock.',
    },
    {
      type: 'move',
      fen: '4k3/8/8/2r1n3/8/3P4/6PP/R6K w - - 0 1',
      timeLimit: 30,
      prompt: '30 seconds: fork two pieces with a humble pawn.',
      line: ['d3d4'],
      hint: 'A pawn attacks the two squares diagonally in front of it.',
      success: 'A pawn fork! One of those pieces is lost.',
    },
    {
      type: 'move',
      fen: '6k1/5ppp/5P2/8/8/8/8/6QK w - - 0 1',
      timeLimit: 20,
      prompt: '20 seconds: checkmate in one.',
      line: ['g1g7'],
      hint: 'Your pawn on f6 can protect your queen.',
      success: 'Checkmate! The pawn on f6 defends the queen on g7.',
    },
  ],
};
